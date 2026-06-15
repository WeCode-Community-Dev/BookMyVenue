from django.shortcuts import render,redirect
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from .forms import UserSignupForm,OwnerSignupForm,LoginForm

def user_signup(request):
    if request.method == 'POST':
        form =UserSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('user_home')
    
    else:
        form=UserSignupForm()
    return render(request,'bmv/user_signup.html',{'form': form})

def owner_signup(request):
    if request.method == 'POST':
        form = OwnerSignupForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request,user)
            return redirect('owner_home')
    else:
        form=OwnerSignupForm()
    return render(request,'bmv/owner_signup.html',{'form':form})

def user_login(request):
    if request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user     = authenticate(request,username=username,password=password)
            
            if user is not None:
                login(request,user)

                if user.role == 'owner':
                    return redirect('owner_home')
                else:
                    return redirect('user_home')
            
            else:
                return render(request,'bmv/login.html',{
                    'form' :form,
                    'error' : 'Invalid credentials'
                })
        
    else:
        form =LoginForm()
    return render(request,'bmv/login.html',{'forms': form})
    
def user_logout(request):
    logout(request)
    return redirect('login')


def user_home(request):
    return render(request, 'bmv/user_home.html')

def owner_home(request):
    return render(request, 'bmv/owner_home.html')