from django.urls import path

from accounts.views import (
    MeView,
    RefreshView,
    UserGoogleLoginView,
    UserLoginView,
    UserRegisterView,
    UserResendSignupOtpView,
    UserVerifySignupOtpView,
    VenueGoogleLoginView,
    VenueLoginView,
    VenueRegisterView,
    VenueResendSignupOtpView,
    VenueVerifySignupOtpView,
)

urlpatterns = [
    path("register", UserRegisterView.as_view(), name="user-register"),
    path(
        "register/resend-otp",
        UserResendSignupOtpView.as_view(),
        name="user-resend-signup-otp",
    ),
    path(
        "register/verify-otp",
        UserVerifySignupOtpView.as_view(),
        name="user-verify-signup-otp",
    ),
    path("login", UserLoginView.as_view(), name="user-login"),
    path("refresh", RefreshView.as_view(), name="user-refresh"),
    path("google", UserGoogleLoginView.as_view(), name="user-google-login"),
    path("me", MeView.as_view(), name="user-me"),
    path("venue/register", VenueRegisterView.as_view(), name="venue-register"),
    path(
        "venue/register/resend-otp",
        VenueResendSignupOtpView.as_view(),
        name="venue-resend-signup-otp",
    ),
    path(
        "venue/register/verify-otp",
        VenueVerifySignupOtpView.as_view(),
        name="venue-verify-signup-otp",
    ),
    path("venue/login", VenueLoginView.as_view(), name="venue-login"),
    path("venue/google", VenueGoogleLoginView.as_view(), name="venue-google-login"),
]
