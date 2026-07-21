from django.urls import path

from .views import (
    StateListCreateView,
    StateDetailView,
    DistrictListCreateView,
    DistrictDetailView
)


urlpatterns = [
    path('states/', StateListCreateView.as_view()),
    path('states/<int:pk>/', StateDetailView.as_view()),

    path("districts/", DistrictListCreateView.as_view()),
    path("districts/<int:pk>/", DistrictDetailView.as_view()),

 
    ]