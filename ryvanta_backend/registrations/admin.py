import csv
from django.contrib import admin
from django.http import HttpResponse
from .models import Registration

@admin.action(description="Export Selected Registrations to CSV")
def export_as_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv; charset=utf-8')
    response['Content-Disposition'] = 'attachment; filename="selected_registrations.csv"'
    writer = csv.writer(response)

    writer.writerow([
        'Participation ID',
        'Event Code',
        'Event Name',
        'Team Name',
        'Department',
        'Domain / Problem Statement',
        'Team Members',
        'Primary Mobile',
        'Email Address',
        'College / Institution',
        'Payment Status',
        'UPI / UTR Ref',
        'Registered At'
    ])

    for obj in queryset:
        members_str = "; ".join(obj.members) if isinstance(obj.members, list) else str(obj.members)
        writer.writerow([
            obj.participation_id,
            obj.event_code,
            obj.event_name,
            obj.team_name,
            obj.department or 'N/A',
            obj.domain,
            members_str,
            obj.mobile_number,
            obj.email,
            obj.institution,
            obj.payment_status,
            obj.upi_ref or '',
            obj.created_at.strftime("%Y-%m-%d %H:%M:%S")
        ])

    return response


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = [
        'participation_id',
        'team_name',
        'event_name',
        'department',
        'mobile_number',
        'email',
        'payment_status',
        'created_at',
    ]

    list_filter = [
        'event_code',
        'department',
        'payment_status',
        'created_at',
    ]

    search_fields = [
        'team_name',
        'participation_id',
        'mobile_number',
        'email',
        'institution',
        'domain',
    ]

    readonly_fields = [
        'participation_id',
        'created_at',
        'updated_at',
    ]

    actions = [export_as_csv]

    ordering = ['-created_at']

    fieldsets = (
        ('Event Information', {
            'fields': ('participation_id', 'event_code', 'event_name', 'department', 'domain')
        }),
        ('Team & Contact Details', {
            'fields': ('team_name', 'members', 'mobile_number', 'email', 'institution')
        }),
        ('Payment & Verification', {
            'fields': ('payment_status', 'upi_ref')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
