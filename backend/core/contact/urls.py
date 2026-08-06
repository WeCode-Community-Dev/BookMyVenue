from django.urls import path

from contact.views import ContactView

urlpatterns = [
    path("", ContactView.as_view(), name="contact-submit"),
]
