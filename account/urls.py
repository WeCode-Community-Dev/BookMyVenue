from django.urls import path

from .views import RegisterCreateView

urlpatterns = [
    path('register/',RegisterCreateView.as_view())
]