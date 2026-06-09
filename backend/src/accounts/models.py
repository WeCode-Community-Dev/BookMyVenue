from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin, AbstractUser
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _
from django.db import models



class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("customer", "Customer"),
        ("venue_owner", "Venue Owner"),
    )
    phone_regex = RegexValidator(
        regex=r'^\+?1?\d{9,15}$',
        message="Phone number must be in format: '+999999999'. Up to 15 digits."
    )

    email         = models.EmailField(unique=True)
    full_name     = models.CharField(max_length=150)
    phone_number  = models.CharField(max_length=15, validators=[phone_regex])
    profile_photo = models.ImageField(upload_to="profiles/", null=True, blank=True)
    role          = models.CharField(max_length=20, choices=ROLE_CHOICES)

    city          = models.CharField(max_length=100)
    state         = models.CharField(max_length=100)

    is_active     = models.BooleanField(default=True)
    is_staff      = models.BooleanField(default=False)
    date_joined   = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD  = "email"
    REQUIRED_FIELDS = ["full_name", "phone_number"]

    objects = UserManager()

    class Meta:
        verbose_name = _("user")
        verbose_name_plural = _("users")

    def __str__(self):
        return f"{self.full_name} ({self.role})"


class VenueOwnerProfile(models.Model):
    user              = models.OneToOneField(User, on_delete=models.CASCADE, related_name="owner_profile")
    business_name     = models.CharField(max_length=200)
    business_address  = models.TextField()
    gst_number        = models.CharField(max_length=20, blank=True, null=True) 
    id_proof_document = models.FileField(upload_to="id_proofs/", null=True, blank=True)
    is_verified       = models.BooleanField(default=False) 

    class Meta:
        verbose_name = _("venu_owner_profile")
        verbose_name_plural = _("venu_owner_profiles")

    def __str__(self):
        return self.business_name