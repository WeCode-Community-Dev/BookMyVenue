from django.contrib.auth.forms import UserCreationForm
from django import forms
from .models import CustomUser


class UserSignupForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phNo = forms.CharField(max_length=15,required=True)
    first_name = forms.CharField(max_length=100,required=True)
    last_name = forms.CharField(max_length=100,required=True)

    class Meta:
        model = CustomUser
        fields = ['username','first_name','last_name','email','phNo','password1','password2']

    def save(self, commit = True):
        user    =super().save(commit=False)
        user.role='user'
        user.email=self.cleaned_data['email']
        user.phNo = self.cleaned_data['phNo']

        if commit:
            user.save()
        return user
    
class OwnerSignupForm(UserCreationForm):
    email = forms.EmailField(required=True)
    phNo = forms.CharField(max_length=15,required=True)
    first_name = forms.CharField(max_length=100,required=True)
    last_name = forms.CharField(max_length=100,required=True)

    class Meta:
        model = CustomUser
        fields = ['username','first_name','last_name','email','phNo','password1','password2']

    def save(self, commit =True):
        user = super().save(commit=False)
        user.role = 'owner'
        user.email = self.cleaned_data['email']
        user.phNo = self.cleaned_data['phNo']
        if commit:
            user.save()
        return user

class LoginForm(forms.Form):
    username = forms.CharField(max_length=100)
    password = forms.CharField(widget=forms.PasswordInput)