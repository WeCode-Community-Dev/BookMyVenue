from django.urls import path

from .views import RegisterCreateView,LoginUserView

urlpatterns = [
    path('register/',RegisterCreateView.as_view()),
    path('login/', LoginUserView.as_view())
    
]