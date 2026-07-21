from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


User = get_user_model()

class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        username = input("Username: ")
        email = input("Email: ")
        password = input("Password: ")
        confirm_password = input("Confirm Password: ")

        if password != confirm_password:
            self.stdout.write(self.style.ERROR("Passwords do not match"))
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write("User already exists")
            return

        User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role="ADMIN"
        )

        self.stdout.write("Admin created successfully")