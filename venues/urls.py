from django.urls import path

from .views import VenueListCreateView

urlpatterns = [
    path('venue/', VenueListCreateView.as_view()),
    # path('venue/media/')
]