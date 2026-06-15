from django.urls import path
from . import views

urlpatterns = [
    path('',views.user_login,name ='login'),
    path('login/', views.user_login,name='login'),
    path('logout/',views.user_logout,name='logout'),
    path('signup/user/',views.user_signup,name='user_signup'),
    path('signup/owner/',views.owner_signup,name='owner_signup'),
    path('home/user/',views.user_home,name='user_home'),
    path('home/owner/',views.owner_home,name='owner_home'),
]