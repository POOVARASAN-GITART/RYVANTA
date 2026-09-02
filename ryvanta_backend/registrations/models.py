from django.db import models, transaction
from django.core.validators import RegexValidator

class Registration(models.Model):
    EVENT_CHOICES = [
        ('CH', "Hackathon '26 (Multi-Department Flagship)"),
        ('D', "2D Games (SOZO '26)"),
        ('C', "Capture The Flag (NEXVORA '26)"),
        ('E', "E-Games (E-Sports Showdown - Free Fire)"),
        ('P', "Photography and video '26"),
    ]

    DEPARTMENT_CHOICES = [
        ('CSE', 'Computer Science & Engineering'),
        ('IT', 'Information Technology'),
        ('ECE', 'Electronics & Communication Engineering'),
        ('EEE', 'Electrical & Electronics Engineering'),
        ('Mechanical Engineering', 'Mechanical Engineering'),
        ('Aeronautical Engineering', 'Aeronautical Engineering'),
        ('Interdisciplinary / Open Domain', 'Interdisciplinary / Open Domain'),
    ]

    team_name = models.CharField(
        max_length=120,
        verbose_name="Team Name",
        help_text="Official registered team/squad name"
    )

    event_code = models.CharField(
        max_length=10,
        choices=EVENT_CHOICES,
        verbose_name="Event Code",
        help_text="Event code (CH for Hackathon, D for 2D Games, C for CTF, E for E-Games, P for Photography)"
    )

    event_name = models.CharField(
        max_length=150,
        verbose_name="Event Name",
        help_text="Full title of the technical competition"
    )

    department = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        choices=DEPARTMENT_CHOICES,
        verbose_name="Engineering Department",
        help_text="Required for Hackathon; Optional/Blank for others"
    )

    domain = models.CharField(
        max_length=200,
        verbose_name="Selected Problem Domain / Track",
        help_text="Chosen domain or problem statement track"
    )

    members = models.JSONField(
        default=list,
        verbose_name="Team Member Names",
        help_text="List of participant names in team"
    )

    mobile_regex = RegexValidator(
        regex=r'^[6-9]\d{9}$',
        message="Primary mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9."
    )
    mobile_number = models.CharField(
        validators=[mobile_regex],
        max_length=15,
        verbose_name="Primary Mobile Number",
        help_text="10-digit primary contact mobile number"
    )

    email = models.EmailField(
        verbose_name="Email Address",
        help_text="Primary team leader email address (One registration per email)"
    )

    participation_id = models.CharField(
        max_length=30,
        unique=True,
        blank=True,
        verbose_name="Participation ID",
        help_text="Unique formatted ID (e.g., TICH1001, TID1001, TIC1001, TIE1001, TIP1001)"
    )

    institution = models.CharField(
        max_length=150,
        default="Jaya Engineering College",
        blank=True,
        verbose_name="College / University"
    )

    payment_status = models.CharField(
        max_length=20,
        default="verified",
        choices=[
            ('pending', 'Pending Verification'),
            ('verified', 'Verified / Paid'),
            ('rejected', 'Rejected'),
        ],
        verbose_name="Payment Status"
    )

    payment_method = models.CharField(
        max_length=50,
        default="GATEWAY_AUTO_VERIFIED",
        blank=True,
        verbose_name="Payment Method"
    )

    transaction_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Gateway Transaction ID",
        help_text="Automated gateway transaction identifier (e.g. pay_xxx or PG_TXN_xxx)"
    )

    gateway_order_id = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        verbose_name="Gateway Order ID"
    )

    upi_ref = models.CharField(
        max_length=80,
        blank=True,
        null=True,
        verbose_name="UPI / Transaction Reference"
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Registration Timestamp"
    )

    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name="Last Updated"
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Event Registration"
        verbose_name_plural = "Event Registrations"

    def save(self, *args, **kwargs):
        if not self.participation_id:
            code = self.event_code.upper()
            if code == 'H':
                code = 'CH'
            
            with transaction.atomic():
                count = Registration.objects.filter(event_code__in=[code, 'H' if code == 'CH' else code]).count()
                start_num = 1001
                seq_num = start_num + count
                pid = f"TI{code}{seq_num}"

                while Registration.objects.filter(participation_id=pid).exists():
                    seq_num += 1
                    pid = f"TI{code}{seq_num}"

                self.participation_id = pid

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.participation_id} - {self.team_name} ({self.event_name})"
