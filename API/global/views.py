from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse
import datetime
from django import forms
from django.http.response import FileResponse
from django.http import HttpResponseForbidden
import os
from .models import Contact



# Create your views here.

def index(request):
    ismobile = request.META['HTTP_USER_AGENT']
    m = []
    for x in ismobile.split():
        m.append(x)
        if x == "iPhone":
            ismobile = False
        if x == "Android":
            ismobile = False
    
  
    return render(request, "global/index.html", {
        'ismobile': ismobile,
        
    })

def end_user_license_agreement(request):
    ismobile = request.META['HTTP_USER_AGENT']
    m = []
    
    for x in ismobile.split():
        m.append(x)
        if x == "iPhone":
            ismobile = False
        if x == "Android":
            ismobile = False
    return render(request, "global/end.html", {
         'Ismobile': ismobile,
    })

def privacy_policy(request):
    ismobile = request.META['HTTP_USER_AGENT']
    m = []
    for x in ismobile.split():
        m.append(x)
        if x == "iPhone":
            ismobile = False
        if x == "Android":
            ismobile = False
    return render(request, "global/privacy.html", {
        'Ismobile': ismobile,
    })

def terms_and_conditions(request):
    ismobile = request.META['HTTP_USER_AGENT']
    m = []
    for x in ismobile.split():
        m.append(x)
        if x == "iPhone":
            ismobile = False
        if x == "Android":
            ismobile = False
    return render(request, "global/terms.html", {
        'Ismobile': ismobile,
    })

def page_not_found_view(request, exception):
    return HttpResponseRedirect("/")

def view_500(request):
    return HttpResponseRedirect("/")

def faq(request):
    ismobile = request.META['HTTP_USER_AGENT']
    m = []
    for x in ismobile.split():
        m.append(x)
        if x == "iPhone":
            ismobile = False
        if x == "Android":
            ismobile = False
    return render(request, "global/faq.html", {
        "ismobile": ismobile,
    })

def about(request):
    ismobile = request.META['HTTP_USER_AGENT']
    m = []
    for x in ismobile.split():
        m.append(x)
        if x == "iPhone":
            ismobile = False
        if x == "Android":
            ismobile = False
    return render(request, "global/about.html", {
        "ismobile": ismobile,
    })

def creator(request):
    return render(request, "global/creator.html")

def contact(request):
    if request.method == "GET":
        return render(request, "global/contact.html")
    elif request.method == "POST":
        name = request.POST["name"]
        text = request.POST["text"]
        Contact.objects.create(name=name, text=text)
        return render(request, "global/contact.html")



