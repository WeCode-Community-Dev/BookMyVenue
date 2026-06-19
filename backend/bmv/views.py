from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .supabase_client import supabase
from .decorators import supabase_login_required
from .forms import VenueForm
from .models import Venues
from django.shortcuts import get_object_or_404

def user_signup(request):
    if request.method == 'POST':
        email    = request.POST['email']
        password = request.POST['password']
        phNo     = request.POST['phNo']

        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "role": "user",      # ✅ store role in metadata
                    "phNo": phNo
                }
            }
        })

        if response.user:
            return redirect('login')
        else:
            return render(request, 'bmv/user_signup.html', {'error': 'Signup failed'})

    return render(request, 'bmv/user_signup.html')


def owner_signup(request):
    if request.method == 'POST':
        email    = request.POST['email']
        password = request.POST['password']
        phNo     = request.POST['phNo']

        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {
                    "role": "owner",
                    "phNo": phNo
                }
            }
        })

        if response.user:
            return redirect('login')
        else:
            return render(request, 'bmv/owner_signup.html', {'error': 'Signup failed'})

    return render(request, 'bmv/owner_signup.html')
def user_login(request):
    if request.method == 'POST':
        email    = request.POST['email']
        password = request.POST['password']

        try:
            response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

            
            request.session['access_token'] = response.session.access_token
            request.session['user_id']      = response.user.id
            request.session['role']         = response.user.user_metadata.get('role')

            if request.session['role'] == 'owner':
                return redirect('owner_home')
            else:
                return redirect('user_home')

        except Exception as e:
            return render(request, 'bmv/login.html', {'error': 'Invalid email or password'})

    return render(request, 'bmv/login.html')
def user_logout(request):
    supabase.auth.sign_out()
    request.session.flush()   # clears Django session
    return redirect('login')



@supabase_login_required
def book_venue(request):
    return render(request, 'bmv/book_venue.html')
@supabase_login_required
def user_home(request):
    user_id = request.session.get('user_id')
    role    = request.session.get('role')
    return render(request, 'bmv/user_home.html', {'role': role})
@supabase_login_required
def owner_home(request):
    return render(request, 'bmv/owner_home.html')

@supabase_login_required
def add_venue(request):
    if request.method == 'POST':
        form = VenueForm(request.POST)
        if form.is_valid():
            venue = form.save(commit=False)
            venue.owner_uid = request.session.get('user_id')
            venue.save()
            return redirect('my_venues')
    else:
        form = VenueForm()
    return render(request,'bmv/add_venue.html',{'form': form})
    

@supabase_login_required
def my_venues(request):
    owner_id = request.session.get('user_id')
    venues = Venues.objects.filter(owner_uid=owner_id)
    return render(request,'bmv/my_venues.html',{'venues': venues})

@supabase_login_required
def edit_venue(request,venue_id):
    owner_id = request.session.get("user_id")
    venue = get_object_or_404(Venues,venueID=venue_id,owner_uid=owner_id)
    if request.method == 'POST':
        form = VenueForm(request.POST, instance=venue)
        if form.is_valid():
            form.save()
            return redirect('my_venues')
    else:
        form = VenueForm(instance=venue)
    return render(request, 'bmv/edit_venue.html', {'form': form, 'venue': venue})

@supabase_login_required
def delete_venue(request,venue_id):
    owner_id = request.session.get('user_id')
    venue = get_object_or_404(Venues,venueID=venue_id,owner_uid=owner_id)

    if request.method == 'POST':
        venue.delete()
        return redirect('my_venues')
    return render(request,'bmv/delete_venue.html',{'venue':venue})