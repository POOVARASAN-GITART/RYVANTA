import csv
import json
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Count, Q
from rest_framework import status, views
from rest_framework.response import Response

from .models import Registration
from .serializers import RegistrationSerializer

@csrf_exempt
def api_register_endpoint(request):
    """
    Direct csrf-exempt endpoint for registering squads via POST /api/register/
    """
    if request.method == 'POST':
        try:
            data = json.loads(request.body.decode('utf-8'))
        except json.JSONDecodeError:
            return JsonResponse({"error": "Invalid JSON body payload."}, status=400)

        serializer = RegistrationSerializer(data=data)
        if serializer.is_valid():
            registration = serializer.save()
            return JsonResponse(RegistrationSerializer(registration).data, status=201)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == 'GET':
        registrations = Registration.objects.all()
        return JsonResponse(RegistrationSerializer(registrations, many=True).data, safe=False)
    return JsonResponse({"error": "Method not allowed"}, status=405)


@method_decorator(csrf_exempt, name='dispatch')
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
                Q(team_name__icontains=search) |
                Q(participation_id__icontains=search) |
                Q(email__icontains=search) |
                Q(mobile_number__icontains=search) |
                Q(institution__icontains=search)
            )

        serializer = RegistrationSerializer(registrations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            registration = serializer.save()
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
        response['Content-Disposition'] = 'attachment; filename="jec_ryvanta_26_registrations.csv"'

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


@method_decorator(csrf_exempt, name='dispatch')
class PaymentGatewayVerifyAPIView(views.APIView):
    """
    Automated webhook & callback endpoint to verify payment status and programmatically issue Student ID.
    """
    def post(self, request):
        payload = request.data
        transaction_id = payload.get('transaction_id') or payload.get('razorpay_payment_id') or f"PG_TXN_{request.data.get('upi_ref', 'AUTO')}"
        gateway_order_id = payload.get('gateway_order_id') or payload.get('razorpay_order_id', '')
        payment_method = payload.get('payment_method', 'GATEWAY_AUTO_VERIFIED')

        # If registration ID provided, update existing record
        participation_id = payload.get('participation_id') or payload.get('id')
        if participation_id:
            try:
                reg = Registration.objects.get(participation_id=participation_id)
                reg.payment_status = 'verified'
                reg.transaction_id = transaction_id
                reg.gateway_order_id = gateway_order_id
                reg.payment_method = payment_method
                reg.save()
                return Response(RegistrationSerializer(reg).data, status=status.HTTP_200_OK)
            except Registration.DoesNotExist:
                pass

        # Otherwise create verified registration directly
        serializer = RegistrationSerializer(data=payload)
        if serializer.is_valid():
            reg = serializer.save()
            reg.payment_status = 'verified'
            reg.transaction_id = transaction_id
            reg.gateway_order_id = gateway_order_id
            reg.payment_method = payment_method
            reg.save()
            return Response(RegistrationSerializer(reg).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

