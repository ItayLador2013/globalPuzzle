from django.contrib import admin
from django.urls import path
from rest_framework import routers
from django.conf.urls import include
from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("end_user_license_agreement", views.end_user_license_agreement),
    path("privacy_policy", views.privacy_policy),
    path("terms_and_conditions", views.terms_and_conditions),
    path("frequently_asked_questions", views.faq),
    path("about", views.about),
    path("about_the_founders", views.creator),
    path("contact", views.contact),
]


