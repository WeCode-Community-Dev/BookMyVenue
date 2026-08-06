from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_remove_user_phone_unique"),
    ]

    operations = [
        migrations.DeleteModel(
            name="OtpRequest",
        ),
        migrations.DeleteModel(
            name="SignupRequest",
        ),
    ]
