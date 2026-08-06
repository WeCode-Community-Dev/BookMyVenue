from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bookings", "0002_soft_lock_booking_system"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bookingsession",
            name="status",
            field=models.CharField(
                choices=[
                    ("ACTIVE", "Active"),
                    ("EXPIRED", "Expired"),
                    ("FAILED", "Failed"),
                    ("COMPLETED", "Completed"),
                ],
                default="ACTIVE",
                max_length=20,
                verbose_name="status",
            ),
        ),
    ]
