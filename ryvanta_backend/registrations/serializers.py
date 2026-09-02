from rest_framework import serializers
from .models import Registration

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Registration
        fields = [
            'id',
            'participation_id',
            'team_name',
            'event_code',
            'event_name',
            'department',
            'domain',
            'members',
            'mobile_number',
            'email',
            'institution',
            'payment_status',
            'upi_ref',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'participation_id', 'created_at', 'updated_at']

    def validate_team_name(self, value):
        if not value or len(value.strip()) < 3:
            raise serializers.ValidationError("Team name must have at least 3 characters.")
        return value.strip()

    def validate_members(self, value):
        if not isinstance(value, list) or len(value) < 2:
            raise serializers.ValidationError("At least 2 team members are required.")
        for name in value:
            if not isinstance(name, str) or len(name.strip()) < 2:
                raise serializers.ValidationError("Every team member must have a valid full name.")
        return [name.strip() for name in value]

    def validate_mobile_number(self, value):
        cleaned = ''.join(filter(str.isdigit, value))
        if len(cleaned) != 10 or not cleaned.startswith(('6', '7', '8', '9')):
            raise serializers.ValidationError("Enter a valid 10-digit primary mobile number.")
        return cleaned

    def validate_email(self, value):
        cleaned = value.strip().lower()
        # Prevent duplicate email across existing registrations
        existing = Registration.objects.filter(email__iexact=cleaned)
        if self.instance:
            existing = existing.exclude(pk=self.instance.pk)
        if existing.exists():
            raise serializers.ValidationError(
                f"Email '{cleaned}' has already been registered. Only one registration per email."
            )
        return cleaned

    def validate(self, data):
        event_code = data.get('event_code')
        members = data.get('members', [])
        department = data.get('department')

        # Hackathon team size: 3-4 members & department required
        if event_code == 'CH':
            if len(members) < 3 or len(members) > 4:
                raise serializers.ValidationError({
                    "members": "Hackathon '26 requires between 3 and 4 team members."
                })
            if not department:
                raise serializers.ValidationError({
                    "department": "Engineering Department selection is required for Hackathon '26."
                })

        # 2D Games & CTF team size: 2-3 members
        elif event_code in ('D', 'C'):
            if len(members) < 2 or len(members) > 3:
                raise serializers.ValidationError({
                    "members": f"Event requires between 2 and 3 team members."
                })

        return data
