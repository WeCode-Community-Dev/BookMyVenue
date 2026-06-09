from django.urls import path

from .views import StateCreateView


urlpatterns = [
    path('states/', StateCreateView.as_view())
]
