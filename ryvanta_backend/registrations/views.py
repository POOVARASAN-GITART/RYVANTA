import csv
from django.http import HttpResponse
from django.db import transaction
from django.db.models import Count
from rest_framework import status, views
from rest_framework.response import Response

from .models import Registration
from .serializers import RegistrationSerializer

def generate_participation_id(event_code: str) -> str:
    """
    Computes the next unique sequential participation ID starting from 1001:
    Format: TI[EventLetter][SequentialNumber]
    e.g. TICH1001, TID1001, TIC1001
    """
    # Normalize event code
    code = event_code.upper()
    if code == 'H':
        code = 'CH'

    with transaction.atomic():
        # Count existing registrations for this specific event code
        count = Registration.objects.filter(event_code__in=[code, 'H' if code == 'CH' else code]).count()
        start_number = 1001
        seq_num = start_number + count
        participation_id = f"TI{code}{seq_num}"

        # Guarantee uniqueness in case of race conditions
        while Registration.objects.filter(participation_id=participation_id).exists():
            seq_num += 1
            participation_id = f"TI{code}{seq_num}"

        return participation_id


class RegistrationListCreateAPIView(views.APIView):
    """
    List all registrations or create a new registration with unique sequential participation ID.
    """
    def get(self, request):
        registrations = Registration.objects.all()

        # Optional query filter by event_code
        event_code = request.query_params.get('event_code')
        if event_code:
            registrations = registrations.filter(event_code__iexact=event_code)

        # Optional search query
        search = request.query_params.get('search')
        if search:
            registrations = registrations.filter(
                models.Q(team_name__icontains=search) |
                models.Q(participation_id__icontains=search) |
                models.Q(email__icontains=search) |
                models.Q(mobile_number__icontains=search) |
                models.Q(institution__icontains=search)
            )

        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            event_code = serializer.validated_data.get('event_code', 'CH')
            unique_pid = generate_participation_id(event_code)

            # Save with computed unique Participation ID
            registration = serializer.save(participation_id=unique_pid)
            return Response(
                RegistrationSerializer(registration).data,
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RegistrationStatsAPIView(views.APIView):
    """
    Returns analytics summary: total registrations, per-event counts, and fee collections.
    """
    def get(self, request):
        total_count = Registration.objects.count()
        verified_count = Registration.objects.filter(payment_status='verified').count()
        event_breakdown = Registration.objects.values('event_code', 'event_name').annotate(total=Count('id'))

        total_revenue = verified_count * 300  # Flat ₹300 per team

        return Response({
            "total_teams": total_count,
            "verified_teams": verified_count,
            "total_revenue_inr": total_revenue,
            "event_breakdown": list(event_breakdown),
        }, status=status.HTTP_200_OK)


class ExportRegistrationsCsvAPIView(views.APIView):
    """
    Exports all registrations as a clean CSV spreadsheet.
    """
    def get(self, request):
        response = HttpResponse(content_type='text/csv; charset=utf-8')
        response['Content-Disposition'] = 'attachment; filename="ryvanta_26_registrations_master.csv"'

        writer = csv.writer(response)
        writer.writerow([
            'Participation ID',
            'Event Code',
            'Event Name',
            'Team Name',
            'Engineering Department',
            'Selected Domain / Track',
            'Team Members',
            'Primary Mobile',
            'Email Address',
            'College / Institution',
            'Payment Status',
            'UPI Reference',
            'Registration Date'
        ])

        for r in Registration.objects.all().order_by('-created_at'):
            writer.writerow([
                r.participation_id,
                r.event_code,
                r.event_name,
                r.team_name,
                r.department or 'N/A',
                r.domain,
                "; ".join(r.members) if isinstance(r.members, list) else str(r.members),
                r.mobile_number,
                r.email,
                r.institution,
                r.payment_status,
                r.upi_ref or '',
                r.created_at.strftime("%Y-%m-%d %H:%M:%S")
            ])

        return response
