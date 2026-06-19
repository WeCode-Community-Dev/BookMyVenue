from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .supabase_client import supabase
from .decorators import supabase_login_required

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

            # ✅ Save session info in Django session (NOT Django auth, just storage)
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
def user_home(request):
    user_id = request.session.get('user_id')
    role    = request.session.get('role')
    return render(request, 'bmv/user_home.html', {'role': role})

def owner_home(request):
    return render(request, 'bmv/owner_home.html')