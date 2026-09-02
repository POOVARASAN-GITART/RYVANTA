import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Registration',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('team_name', models.CharField(help_text='Official registered team/squad name', max_length=120, verbose_name='Team Name')),
                ('event_code', models.CharField(choices=[('CH', "Hackathon '26 (Multi-Department Flagship)"), ('D', "2D Games (SOZO '26)"), ('C', "Capture The Flag (NEXVORA '26)")], help_text='Single or two-letter event code (CH, D, C)', max_length=10, verbose_name='Event Code')),
                ('event_name', models.CharField(help_text='Full title of the technical competition', max_length=150, verbose_name='Event Name')),
                ('department', models.CharField(blank=True, choices=[('CSE', 'Computer Science & Engineering'), ('IT', 'Information Technology'), ('ECE', 'Electronics & Communication Engineering'), ('EEE', 'Electrical & Electronics Engineering'), ('Mechanical Engineering', 'Mechanical Engineering'), ('Aeronautical Engineering', 'Aeronautical Engineering'), ('Interdisciplinary / Open Domain', 'Interdisciplinary / Open Domain')], help_text='Required for Hackathon; Optional/Blank for 2D Games & CTF', max_length=100, null=True, verbose_name='Engineering Department')),
                ('domain', models.CharField(help_text='Chosen domain or problem statement track', max_length=200, verbose_name='Selected Problem Domain / Game Theme')),
                ('members', models.JSONField(default=list, help_text='List of participant names in team', verbose_name='Team Member Names')),
                ('mobile_number', models.CharField(help_text='10-digit primary contact mobile number', max_length=15, validators=[django.core.validators.RegexValidator(message='Primary mobile number must be a valid 10-digit Indian phone number starting with 6, 7, 8, or 9.', regex='^[6-9]\\d{9}$')], verbose_name='Primary Mobile Number')),
                ('email', models.EmailField(help_text='Primary team leader email address (One registration per email)', max_length=254, verbose_name='Email Address')),
                ('participation_id', models.CharField(help_text='Unique formatted ID (e.g., TICH1001, TID1001, TIC1001)', max_length=30, unique=True, verbose_name='Participation ID')),
                ('institution', models.CharField(blank=True, default='College / Institution', max_length=150, verbose_name='College / University')),
                ('payment_status', models.CharField(choices=[('pending', 'Pending Verification'), ('verified', 'Verified / Paid'), ('rejected', 'Rejected')], default='verified', max_length=20, verbose_name='Payment Status')),
                ('upi_ref', models.CharField(blank=True, max_length=80, null=True, verbose_name='UPI / UTR Reference')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='Registration Timestamp')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='Last Updated')),
            ],
            options={
                'verbose_name': 'Event Registration',
                'verbose_name_plural': 'Event Registrations',
                'ordering': ['-created_at'],
            },
        ),
    ]
