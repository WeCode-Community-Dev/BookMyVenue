from django.urls import path
from . import views

urlpatterns = [
    path('',              views.user_login,   name='login'),
    path('login/',        views.user_login,   name='login'),
    path('logout/',       views.user_logout,  name='logout'),
    path('signup/user/',  views.user_signup,  name='user_signup'),
    path('signup/owner/', views.owner_signup, name='owner_signup'),
    path('home/user/',    views.user_home,    name='user_home'),
    path('home/owner/',   views.owner_home,   name='owner_home'),
    path('venues/add/', views.add_venue,name ='add_venue'),
    path('venues/my/',                  views.my_venues,    name='my_venues'),
    path('venues/edit/<int:venue_id>/', views.edit_venue,   name='edit_venue'),
    path('venues/delete/<int:venue_id>/', views.delete_venue, name='delete_venue'),
]
