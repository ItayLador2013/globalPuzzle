from __future__ import print_function
from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Country, Profile, Hobbie, Request, Chat, Message, PushToken, Call, Searching, HackerIP, PastCall, PastMatchCall, Report, Group, GroupCall, GroupMatch, Reaction, News, Colab, Comment, Media, AdminToken
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from rest_framework.authentication import TokenAuthentication 
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.permissions import IsAuthenticatedOrReadOnly, BasePermission
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import requests as r
import datetime
from datetime import date
import string
import random
import os
from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
import geonamescache
from geonamescache.mappers import country
from django.core.files import File
import re
from . import set_manager
import os.path

from google.auth.transport.requests import Request as googleRequest
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from .countries import COUNTRIES
from .hobbiesRe import HOBBIESRE
from .hobbies import HOBBIES
from .hobbies import CATS
from .reliable import RELIABLE
from .reliable import PRIME
from .notwords import NOTWORDS
from .fieldsRe import FIELDSRE
import pytz
from .schools import SCHOOLS
from django.core.mail import send_mail
from .fields import FIELDS
from collections import Counter
from django.utils import timezone
import cloudinary
import cloudinary.uploader
import cloudinary.api
utc=pytz.UTC
from sklearn.model_selection import train_test_split
from sklearn.neighbors import KNeighborsClassifier
from newsapi import NewsApiClient

from celery import Celery
from celery.schedules import crontab
import math

import pickle

from .models import load_model, load_data, getSchoolObject, profileAIObjects

# Create your views here.
def printHash(num, res, left, hand):
	sp = 75
	for x in range(20+left):
		if not hand:
			res += "#"
		else:
			res += " "
	for x in range(num):
		res += ' '
	
	for x in range(sp-20-num-left):
		res += "#"
		
	res += "\n"
	return res

def hackedPrint():
	res = "\033[32m"
	
	for x in range(3):
		res += "\n"
		
	for x in range(3):
		res = printHash(0, res, 0, False)
	
	for x in range(1):
		res = printHash(37 + (x-3), res, 3-x, False)
	res = printHash(40, res, 0, 1)
	res = printHash(39, res, 0, True)
	res = printHash(41, res, 0, True)
	res = printHash(42, res, 0, True)
	res = printHash(41, res, 0, True)
	res = printHash(42, res, 0, True)
	res = printHash(43, res, 0, True)
	res = printHash(43, res, 0, True)
	res = printHash(42, res, 0, True)
	res = printHash(40, res, 0, True)
	res = printHash(41, res, 0, True)
	
	res = printHash(40, res, 0, False)
	res = printHash(37, res, 1, False)
	for x in range(9):
		res = printHash(10, res, x+1, False)
	
	res = printHash(8, res, x + 1, False)
	res = printHash(5, res, x + 3, False)
	
	for x in range(3):
		res = printHash(0, res, 0, False)
		
	for x in range(3):
		res += " \n "
	
	rlist = list(res)
	seed = 576 + 76 + 3
	
	for x in range(6):
		rlist[seed + x] = "\033[31mX"
		rlist[seed + x + (76 * 2)] = "X"
	
	
	for i in range(5):
		rlist[seed + (76 * i)] = "X"
	
	res = ''.join(rlist)	
	return res

@csrf_exempt
def hacked(request):
    ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('HTTP_X_REAL_IP') or request.META.get('REMOTE_ADDR')
    newRes = HackerIP.objects.create(ip=ip)
    return ""
    
@csrf_exempt
def checkIP(request):
    ip = request.META.get('HTTP_X_FORWARDED_FOR') or request.META.get('HTTP_X_REAL_IP') or request.META.get('REMOTE_ADDR')
    try:
        ips = HackerIP.objects.filter(ip=ip)
        if len(ips) > 0:
            return True
        else:
            return False
    except HackerIP.DoesNotExist:
        return False

def generateToken():
    special_chars = "123456789!@#$%^&*()_+=-/?><,.}{[]קראטוןםפשדגכעיחלךףזסבהנמצתץ"
    all_chars = string.ascii_letters + string.digits + special_chars
    random_string = ''.join(random.choice(all_chars) for _ in range(300))
    return random_string

def generateConfirm():
    all_chars = string.digits
    random_string = ''.join(random.choice(all_chars) for _ in range(5))
    return random_string

def getData(request):
    data = json.loads(request.body)
    user = int(data.get("user"))
    token = data.get("token")
    user = User.objects.get(id=user)
    profile = Profile.objects.get(user=user)
    return user, token, profile

def information(profile, other, request, predicted=False):
    isFriend = other.user in profile.friends.all()
    meRequesting = other.user in profile.meRequesting.all()
    requestingMe = profile.user in other.requestingMe.all()
    return {"user":other.user.username, "name": other.first + " " + other.last, "image": str(other.image.url),
                    "iso": other.isoO(), "age": other.age(), "country": other.country,
                     "id":other.user.id, "isFriend": isFriend, "meRequesting": meRequesting, "requestingMe": requestingMe}

def sendNotification(tokens, title, content, data):
    for token in tokens:
        token = token.token if token.token else token
        try:
            if token != "":
                r.post('https://exp.host/--/api/v2/push/send', json = {
                    'to': token,
                    'title': title,
                    'body': content,
                    'ios': {
                        'sound': True
                        },
                    'android': {
                        'channelId': 'default',
                        'vibrate': [200, 100, 200]
                    },
                    'data': data,
            })
        except AttributeError as e:
            print(e)

@csrf_exempt
def login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user = data.get("user")
        password = data.get("password")
        res = {"valid":False, "setup":False, "token":None}
        try:
            user = User.objects.get(username=user, password=password) 
            profile = Profile.objects.get(user=user)
            res["token"] = profile.token
            res["setup"] = profile.setup 
            res["valid"] = True
            res["id"] = str(user.id)
           
        except User.DoesNotExist:
            res["valid"] = False
        
        return JsonResponse(res, safe=False)

@csrf_exempt
def signup(request):
    if request.method == "POST":
        data = json.loads(request.body)
        username = data.get("user")
        password = data.get("password")
        res = {"valid":False, "token":None}
        try:
            user = User.objects.get(username=username)
            res["valid"] = False
        except User.DoesNotExist:
            user = User.objects.create(username=username, password=password)
            profile = Profile.objects.create(user=user)
            profile.token = generateToken()
            profile.save()
            res["valid"] = True
            res["token"] = profile.token
            res["id"] = str(user.id)
        return JsonResponse(res, safe=False)

def getGroups(profile):
    res = []
    for group in profile.groups.all():
        members = []
        for u in group.users.all():
            if u != profile.user:
                oprof = Profile.objects.get(user=u)
                members.append({"user": u.username, "image": str(oprof.image.url), "country": oprof.country})
        
        res.append({"groupID": group.id, "users":members, "name": group.name if group.hasName else group.groupName() })

    return res

@csrf_exempt
def getProfile(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        data = json.loads(request.body)
        try:
            User.objects.get(id=int(data.get("user")))
        except User.DoesNotExist:
            return JsonResponse(None, safe=False)

        user, token, profile = getData(request)
        pushToken = data.get("pushToken", None)

        if token == profile.token:

            if pushToken != "" and pushToken != None:
                try:
                    pt = PushToken.objects.get(token=pushToken)
                except PushToken.DoesNotExist:
                    pt = PushToken.objects.create(token=pushToken)

                if pt not in profile.pushTokens.all():
                    profile.pushTokens.add(pt)
            profile.save()
            hobbies = []
            for h in profile.hobbies.all():
                hobbies.append(h.hobbie)

            if profile.setup:
                latitude, longitude = profile.get_city_coordinates()
                ll = {"latitude": latitude, "longitude": longitude}
                net = profile.networks()
            else:
                ll = ""
                net = ""

            call = {"isCall": False}
            if profile.call != None:
                call["called"] = profile.call.called.username
                call["calling"] = profile.call.calling.username 
                call["isCall"] = True
                call["image"] = str(Profile.objects.get(user=profile.call.calling).image.url)  
                call["status"] = profile.call.status

            reported = []
            for report in profile.reported.all():
                reported.append(report.username)

            res = {"setup":profile.setup, "image":str(profile.image.url), "name":profile.first + " " + profile.last,
            "hobbies": hobbies, "bio":profile.bio, "num_friends": profile.num_friends(), "iso": profile.isoO(),
            "occupation": profile.occupation, "countries": profile.countries(), "cord": ll, "networks": net,
             "first": profile.first, "last": profile.last, "friends":profile.friend(), "call": call, "country": profile.country, "city": profile.city,
             "banned": profile.banned, "email": profile.email, "field": profile.field, "school": profile.school, "schoolType": profile.schoolType,
             "groups": getGroups(profile), "user": user.username, "reported": reported, "userid": user.id,
           }
   
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getLines(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = []
            res = profile.networkLines()

            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getProfileOf(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, myProfile = getData(request)
        of = User.objects.get(username=data.get("of"))
        
        if token == myProfile.token:
            profile = Profile.objects.get(user=of)
            hobbies = []
            for h in profile.hobbies.all():
                hobbies.append(h.hobbie)
            
            if profile.setup:
                latitude, longitude = profile.get_city_coordinates()
                ll = {"latitude": latitude, "longitude": longitude}
            else:
                ll = ""

            chatID = 0
            for chat in profile.chats.all():
                if user in chat.users.all() and len(chat.users.all()) < 3:
                    chatID = chat.id
                    break
            
            res = {"setup":profile.setup, "image":str(profile.image.url), "name":profile.first + " " + profile.last,
            "hobbies": hobbies,  "num_friends": profile.num_friends(), "iso": profile.isoO(),
            "countries": profile.countries(),
             "friends": profile.friend(), "country": profile.country, "cord": ll, "friend": user in profile.friends.all(), 
             "city": profile.city, "school": profile.school, "field": profile.field, "schoolType": profile.schoolType,
              "email": profile.email, "groups": getGroups(profile), "user": profile.user.username, "chatID": chatID,
              "requesting": user in profile.requesting(), "beingRequested": user in profile.beingRequested(), "isFriend": user in profile.friends.all()
             }
   
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def match(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = []
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def search(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)
        term = data.get("term")

        if token == profile.token:
            res = []
            users = Profile.objects.filter(setup=True)
            
            for user in users:
                if profile.user != user.user and term != "" and (term in user.first or term in user.last or term in user.user.username ):
                    info = information(profile, user, False)
                    info["match"] = False
                    res.append(info) 

            
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def request(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)
        other = data.get("other")

        if token == profile.token:
            otherProfile = Profile.objects.get(user=User.objects.get(username=other))
            re = Request.objects.create(requesting=user, requested=User.objects.get(username=other))
            profile.requests.add(re)
            profile.meRequesting.add(User.objects.get(username=other))
            otherProfile.requests.add(re)
            otherProfile.requestingMe.add(user)
            profile.save()
            otherProfile.save()
            
            tokens = set(otherProfile.pushTokens.all())
            sendNotification(tokens, user.username, user.username + " has requested to connect with you", {})

            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def unrequest(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)
        other = data.get("other")

        if token == profile.token:
            otherProfile = Profile.objects.get(user=User.objects.get(username=other))
            r = Request.objects.get(requesting=user, requested=User.objects.get(username=other))
            profile.meRequesting.remove(User.objects.get(username=other))
            otherProfile.requestingMe.remove(user)
            
            profile.save()
            otherProfile.save()
            r.delete()

            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getRequesting(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = []
            for re in profile.requests.all():     
                if re.requested == user: 
                    res.append(re.requesting.username)                                  

            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getRequests(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = []
            
            for request in profile.requests.all():     
                if request.requested == user: 
                    res.append(information(profile, Profile.objects.get(user=request.requesting), True))                                 

            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getFriends(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)
        if data.get("first"):
            of = User.objects.get(id=data.get("of"))
        else:
            of = User.objects.get(username=data.get("of"))
        profileOf = Profile.objects.get(user=user)
        if token == profile.token:
            res = []
            
            for friend in profileOf.friends.all():  
                friend = Profile.objects.get(user=friend)   
                res.append(information(profile, friend, False))                               
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getRequested(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = []

            for request in profile.requests.all():     
                if request.requested != user: 
                    res.append(request.requested.username)                                  
            

            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getMatches(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)
        size = 20
        predictedSize = math.ceil(size * .7)
        notPredictedSize = math.floor(size * .3)

        if token == profile.token:
            predictedRes = []
            notPredictedRes = []

            predicted, notPredicted = profile.getClosestMatches()
            for person in predicted:
                if len(predicted) > predictedSize and random.random() < .1:
                    continue
                info = information(profile, person, False)
                info["precent"] = person.getPrecent(profile, True)
                info["match"] = True
                info["predicted"] = True
                predictedRes.append(info) 
            
            predictedRes.sort(key=lambda x: x["precent"], reverse=True)

            for person in notPredicted:
                if len(notPredicted) > notPredictedSize and random.random() < .5:
                    continue
                info = information(profile, person, False)
                info["precent"] = person.getPrecent(profile, False)
                info["match"] = True
                info["predicted"] = False
                notPredictedRes.append(info) 
            
            notPredictedRes.sort(key=lambda x: x["precent"], reverse=True)

            predictedRes = predictedRes[:predictedSize]
            notPredictedRes = notPredictedRes[:notPredictedSize]

            res = predictedRes + notPredictedRes

            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getChats(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = []
            notUsed = []
            chats = []
            for chat in profile.chats.all():
                chats.append(chat)
            for group in profile.groups.all():
                chats.append(group)

            for chat in chats:
                others = []
                valid = True
                for u in chat.users.all():
                    if u.username != user.username:
                        others.append({"user": u.username, "image": str(Profile.objects.get(user=u).image.url),})
                if valid:
                    if len(chat.messages.all()) > 0:
                        if len(chat.messages.all()) > 1:
                            message = chat.messages.all()[len(chat.messages.all())-1]
                        else:
                            message = chat.messages.all()[0]

                        lastMessage = { "content":message.content, "datetime":message.datetime.replace(tzinfo=utc), "sender": message.sender.username}

                    else:
                        lastMessage = {"content":"Get the conversation started", "datetime":None}

                    if len(others) > 1:
                        name = chat.name if chat.hasName else chat.groupName()
                    else:
                        name = others[0]["user"]
                    data = {"others":others, "lastMessage": lastMessage, "id": chats.index(chat) + 1, "lastDate": lastMessage["datetime"], "name": name, "actualID": chat.id, "size": len(chat.users.all())}
                    if len(chat.messages.all()) > 0:
                        res.append(data)
                    else:
                        notUsed.append(data)
            
            
            res.sort(key=lambda x: x["lastDate"], reverse=True)
            
            res = res + notUsed
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getM(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
            
        data = json.loads(request.body)
        user = int(data.get("user"))
        isGroup = data.get("isGroup")
        chatID = data.get("chatID")
        other = data.get("other")
        token = data.get("token")
        final = data.get("num")

        userid = User.objects.get(id=user)
        uprof = Profile.objects.get(user=userid)
        
        if token == uprof.token:
            
            if isGroup:
                chat = Group.objects.get(id=chatID)
            else:
                otherid = User.objects.get(username=other)
                oprof = Profile.objects.get(user=otherid)
                chat = Chat.objects.get(id=chatID)

            messages = []
            num = 0
            total = len(chat.messages.all())
            for m in chat.messages.all():
                sender = m.sender
                senderProfile = Profile.objects.get(user=m.sender)
                senderImage = str(senderProfile.image.url)
                content = m.content

                reactions = {"user": "", "other": [], "has": False}
                for react in m.reaction.all():
                    if react.user == userid:
                        reactions["user"] = react.reaction
                    else:
                        reactions["other"].append(react.reaction)
                    reactions["has"] = True
                if reactions["has"]:
                    None
                messages.append({"sender": sender.username, "senderID": sender.id, "content": content, "num": num, 
                "datetime":m.datetime, "id": m.id, "reactions": reactions, "hasImage": m.hasImage(),
                "image": None if not m.hasImage() else str(m.image.url), "total": total, "senderImage": senderImage})

                num += 1
                
            return JsonResponse(messages, safe=False)
        else:
          return JsonResponse(hacked(request), safe=False)

def getChatTokens(chat, profile):
    pushtokens = set()
    for other in chat.users.all():
        if other != profile.user:
            op = Profile.objects.get(user=other)
            for t in op.pushTokens.all():
                pushtokens.add(t)
    print(pushtokens)
    return pushtokens
        
    

@csrf_exempt
def sendM(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
            
        data = json.loads(request.body)
        user = int(data.get("user"))
        other = data.get("other")
        chatID = data.get("chatID")
        isGroup = data.get("isGroup")
        content = data.get("content")
        token = data.get("token")

        userid = User.objects.get(id=user)
        uprof = Profile.objects.get(user=userid)

        if token == uprof.token:
            
            if isGroup:
                chat = Group.objects.get(id=chatID)
            else:
                otherid = User.objects.get(username=other)
                oprof = Profile.objects.get(user=otherid)
                chat = Chat.objects.get(id=chatID)

            mes = Message.objects.create(sender=userid, content=content, datetime=datetime.datetime.now())
            mesid = mes.id

            if len(chat.messages.all()) > 0:
                mes.num = len(chat.messages.all()) + 1
            else:
                mes.num = 0

            chat.messages.add(mes)
            chat.save()

            pushtokens = getChatTokens(chat, uprof)

            if isGroup:
                title = "You and" + (len(chat.members.all()) - 1) + "others"
                body = userid.username + ": "
            else:
                title = userid.username
                body = ""
               
            body += content
            data = {"chatID": chatID}
            sendNotification(pushtokens, title, body, data)
            
            return JsonResponse(True, safe=False)
        else:
          return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def sendMImage(request):
    if request.method == "POST":  
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
       
        image = request.FILES.get("image", False)
        user = int(request.POST.get('name', False))
        content = request.POST.get("content", False)
        token = request.POST.get('token', False)
        chatID = request.POST.get("chatID", False)
        isGroup = request.POST.get("isGroup", False)
        userid = User.objects.get(id=user)
        uprof = Profile.objects.get(user=userid)

        if token == uprof.token:
            
            if isGroup:
                chat = Group.objects.get(id=chatID)
            else:
                chat = Chat.objects.get(id=chatID)
            

            mes = Message.objects.create(sender=userid, content=content, datetime=datetime.datetime.now())
            mes.image = image
            mes.save()

            chat.messages.add(mes)
            chat.save()


            pushtokens = getChatTokens(chat, uprof)
            
            if isGroup:
                title = "You and" + (len(chat.members.all()) - 1) + "others"
                body = userid.username + ": "
            else:
                title = userid.username
                body = ""
            
            if len(content) > 0:
                body += "📷" + content
            else:
                body += "📷photo"
            
            data = {"chatID": chatID}
            sendNotification(pushtokens, title, body, data)

            return JsonResponse(True, safe=False)
        else:
          return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def postNewColab(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        if profile.token == token:
            newColabTitle = data.get("newColabTitle")
            newColabText = data.get("newColabText")
            colab = Colab.objects.create(user=user, title=newColabTitle, text=newColabText, datetime=datetime.datetime.now())
            profile.colabs.add(colab)
            return JsonResponse(colab.id, safe=False)

@csrf_exempt
def newColabMedia(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        media = request.FILES.get("media", False)
        username = int(request.POST.get("user", False))
        user = User.objects.get(id=username)
        profile = Profile.objects.get(user=user)
        colabID = request.POST.get("colab", False)
        token = request.POST.get("token", False)
        mediaType = request.POST.get("type", False)
        duration = request.POST.get("duration", None)
        index = request.POST.get("index", 0)

        if token == profile.token:
            colab = Colab.objects.get(id=colabID)
            filename = username + "/colabMedia/" + colabID
            if mediaType == "video":
                media = cloudinary.uploader.upload_large(media, 
                    resource_type = "video",
                    public_id =  filename,
                    chunk_size = 6000000,
                    eager_async = True,
                    )
                media = media["url"]

            media = Media.objects.create(media=media, duration=duration, mediaType=mediaType, index=index)
            colab.media.add(media)
            colab.save()
            return JsonResponse(True, safe=False)

@csrf_exempt
def endCall(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user = User.objects.get(id=int(data.get("user")))
        other = User.objects.get(username=data.get("other"))
        token = data.get("token")

        profile = Profile.objects.get(user=user)
        oprof = Profile.objects.get(user=other)
        call = profile.call

        if token == profile.token: 
            if profile.call == oprof.call:
                oprof.call == None
            profile.call = None
            oprof.save()

            try:
                pastCall = PastCall.objects.get(channel=call.channel)
            except PastCall.DoesNotExist:
                if call.status == "ongoing":
                    stat = "recieved"
                else:
                    stat = "missed"
                pastCall = PastCall.objects.create(calling=call.calling, called=call.called, status=stat, channel=call.channel, datetime=call.datetime)

            profile.pastCalls.add(pastCall)
            call.status = "over"
            call.save()
            profile.save()
    
            return JsonResponse(True, safe=False)
        else: 
          return

@csrf_exempt
def call(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user = User.objects.get(username=int(data.get("user")))
        other = User.objects.get(username=data.get("other"))
        token = data.get("token")

        profile = Profile.objects.get(user=user)
        oprof = Profile.objects.get(user=other)

        
        if token == profile.token: 
            tokens = []
            call = Call.objects.create(calling=user,called=other, status="pending", channel=user.username + other.username + str(datetime.datetime.now()), datetime=datetime.datetime.now())
        
            profile.call = call
            oprof.call = call
            profile.save()
            oprof.save()

            for n in oprof.pushTokens.all():
                
                try:
                    token = n.token
                    body = ""
                    if token not in tokens:
                        if token != "":
                            r.post('https://exp.host/--/api/v2/push/send', json = {
                                'to': token,
                                'title': "📹Video call from " + user.username,
                                'ios': {
                                    'sound': True
                                    },
                                'android': {
                                    'channelId': 'default',
                                    'vibrate': [200, 100, 200]
                                },
                                'data': {
                                    "user": user.username,
                                    "type": "videoCall",
                                    "image": str(profile.image.url),
                                    "other": oprof.user.username,
                                }
                        })
                        tokens.append(token)
                        
                except AttributeError:
                    print("damn")
            return JsonResponse(True, safe=False)
        else: 
          return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getCall(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user = User.objects.get(id=int(data.get("user")))
        other = User.objects.get(username=data.get("other"))
        token = data.get("token")

        profile = Profile.objects.get(user=user)
        oprof = Profile.objects.get(user=other)
        call = profile.call
        
        if token == profile.token:

            friend = False
            if other in profile.friends.all():
                friend = True
            
            if profile.call != None:
                return JsonResponse({"channel":call.channel, "status":call.status, "friend":friend, "country":oprof.country}, safe=False)
            else:
                return JsonResponse({"channel":"", "status":""}, safe=False)

        else:
          return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def acceptCall(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user = User.objects.get(id=int(data.get("user")))
        other = User.objects.get(username=data.get("other"))
        token = data.get("token")

        profile = Profile.objects.get(user=user)
        oprof = Profile.objects.get(user=other)
        call = profile.call

        call.status = "ongoing"
        call.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def logout(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint())
        
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            pushToken = data.get("pushToken")
            
            for t in profile.pushTokens.all():
                if t.token == pushToken:
                    t.delete()
            
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def startSearch(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint())
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        number = int(data.get("number")) 

        if token == profile.token:

            try:
                s = Searching.objects.get(user=user, city=profile.city, country=profile.country, number=number)
            except Searching.DoesNotExist:
                s = Searching.objects.create(user=user, city=profile.city, country=profile.country, number=number)
            
            if number == 1:
                res = None
            elif number == 2:
                res = []
            profile.searching = True
            profile.videoMatch = None
            profile.groupMatch = None
            profile.save()
            
            while True:
                possible = []
                count = 0
                profile = Profile.objects.get(user=user)
                if not profile.searching:
                    if profile.videoMatch != None:
                        res = profile.videoMatch
                    break
                
                try:
                    Searching.objects.get(user=user)

                except Searching.DoesNotExist:
                    profile.searching = False
                    profile.save()
                    break

                for search in Searching.objects.filter(number=number):
                    if search.user != user and not (Profile.objects.get(user=user).school != profile.school):
                        count += 1

                        searchProf = Profile.objects.get(user=search.user)
                        precent = searchProf.getPrecent(profile)
                        if precent > .20:
                            if number == 2:
                                if search.user in res:
                                    continue
                            possible.append({"user":search.user, "precent":precent})

                        if len(possible) > 20:
                            break

                possible.sort(key=lambda x: x["precent"], reverse=True)

                for p in possible:
                    try:
                        if number == 1:
                            res = p["user"]
                            break
                        elif number == 2:
                            res.append(p["user"])
                            if len(res) > 1:
                                break
                    except Searching.DoesNotExist:
                        continue

                if number == 1:
                    if res != None:
                        profile = Profile.objects.get(user=user)
                        otherProfile = Profile.objects.get(user=res)

                        if profile.searching and otherProfile.searching:
                            try:
                                Searching.objects.get(user=user).delete()
                                Searching.objects.get(user=res).delete()
                                otherProfile.videoMatch = user
                                profile.videoMatch = res
                                profile.searching = False
                                otherProfile.searching = False
                                otherProfile.save()
                                profile.save()
                                break
                            except Searching.DoesNotExist:
                                continue
                elif number == 2:
                    if len(res) > 1:
                        profile = Profile.objects.get(user=user)
                        otherProfile = Profile.objects.get(user=res[0])
                        otherProfile1 = Profile.objects.get(user=res[1])

                        if profile.searching and otherProfile.searching and otherProfile1.searching:
                            
                            try:
                                Searching.objects.get(user=user).delete()
                            except Searching.DoesNotExist:
                                None

                            try:
                                Searching.objects.get(user=res[0]).delete()
                            except Searching.DoesNotExist:
                                None
                                
                            try:
                                Searching.objects.get(user=res[1]).delete()
                            except Searching.DoesNotExist:
                                None
                                
                            l = [user.username, res[0].username, res[1].username]
                            l = sorted(l)
                            channel = ""
                            for c in l:
                                channel += c
                            try:
                                videoCall = GroupMatch.objects.get(channel=channel)
                            except GroupMatch.DoesNotExist:
                                videoCall = GroupCall.objects.create()
                                videoCall.members.add(user)
                                videoCall.members.add(res[0])
                                videoCall.members.add(res[1])
                                videoCall.channel = channel
                                videoCall.datetime = datetime.datetime.now()
                            
                            profile.groupMatch = videoCall
                            otherProfile.groupMatch = videoCall
                            otherProfile1.groupMatch = videoCall
                            profile.searching = False
                            otherProfile.searching = False
                            otherProfile1.searching = False
                            otherProfile.save()
                            profile.save()
                            break

            if number == 1:     
                if res != None:
                    res = res.username
                return JsonResponse(res, safe=False)
            elif number == 2:
                if len(res) > 1:
                    r = []
                    for x in res:
                        r.append(x.username)
                    return JsonResponse(r, safe=False)
                else:
                    return JsonResponse(None, safe=False)

        else:
            return JsonResponse(hacked(request), safe=False)


@csrf_exempt
def cancelSearch(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            profile.searching = False
            profile.videoMatch = None
            Searching.objects.get(user=user).delete()
            profile.save()

            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def cancelMatch(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        other = User.objects.get(username=data.get("other"))

        if token == profile.token:
            profile.videoMatch = None
            profile.save()
            otherProf = Profile.objects.get(user=other)
            if otherProf.videoMatch == user:
                otherProf.videoMatch = None
                otherProf.save()
                tokens = []
                for n in otherProf.pushTokens.all():
                    try:
                        token = n.token
                        body = ""
                        if token not in tokens:
                            if token != "":
                                r.post('https://exp.host/--/api/v2/push/send', json = {
                                    'to': token,
                                    'title': "" + user.username + " has canceled the match",
                                    'ios': {
                                        'sound': True
                                        },
                                    'android': {
                                        'channelId': 'default',
                                        'vibrate': [200, 100, 200]
                                    },
                                    'data': {
                                        "user": user.username,
                                        "type": "matchEnd",
                                    }
                            })
                            tokens.append(token)
                        
                    except AttributeError:
                        print("damn")

            return JsonResponse(True, safe=False)
            
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def endMatch(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        data = json.loads(request.body)
        user, token, profile = getData(request)
        other = data.get("other")
        if token == profile.token:
            
            oprof = Profile.objects.get(user=User.objects.get(username=other))
            call = profile.videoMatch
            response = False

            if profile.videoMatch != None:
                profile.videoMatch = None
                oprof.videoMatch = None
            else:
                response = True
        
            pastCall = PastMatchCall.objects.create(user=oprof.user, datetime=datetime.datetime.now())

            profile.pastMatchCalls.add(pastCall)
            
            oprof.save()
            profile.save()

            if not response:
                if token == profile.token: 
                    tokens = []
                    for n in oprof.pushTokens.all():

                        try:
                            token = n.token
                            body = ""
                            if token not in tokens:

                                if token != "":
                                    response = r.post('https://exp.host/--/api/v2/push/send', json = {
                                        'to': token,
                                        'title': user.username + " has ended the call",
                                        'ios': {
                                            'sound': False
                                            },
                                        'android': {
                                            'channelId': 'default',
                                            'vibrate': [200, 100, 200]
                                        },
                                        'data': {
                                            "user": user.username,
                                            "type": "endcall",
                                            "image": str(profile.image.url),
                                        }
                                })

                                    if response.status_code == 200:
                                        None
                                    else:
                                        None

                                tokens.append(token)

                        except AttributeError:
                            print("damn")
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def profileImage(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
            
        image = request.FILES.get("image", False)
        user = int(request.POST.get('name', False))
        token = request.POST.get('token', False)

        userid = User.objects.get(id=user)
        profile = Profile.objects.get(user=userid)
        
        if token == profile.token:
            if image == False:
                with open('./media/images/profileImages/emptyProfile.png', 'rb') as img_file:
                    profile.image.save(user + 'profileImage.jpg', File(img_file))
                profile.save()
                profile = Profile.objects.get(user=userid)
                
                return JsonResponse(True, safe=False)

            profile.image = image
            profile.save()
            profile = Profile.objects.get(user=userid)

            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def verifyCity(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        city = data.get("city")
        iso = data.get("country")

        gc = geonamescache.GeonamesCache()
        mapper = country(from_key='name', to_key='iso')

        city = city.strip()
        cities = gc.get_cities_by_name(city)
        alt = False

        if cities == []:
            cities = gc.search_cities(city, case_sensitive=False)
            alt = True

        if cities:
            work = []
            if alt:
                for c in cities:
                    if c["countrycode"] == iso:
                        return JsonResponse(c["name"], safe=False)
            else:
                for c in cities:
                    for ci in c:
                        num = str(ci)
                        x = c[num]
                        if x["countrycode"] == iso:
                            return JsonResponse(x["name"], safe=False)

        else:
            return JsonResponse(None, safe=False)
        
        return JsonResponse(None, safe=False)

@csrf_exempt
def setUser(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        
        if token == profile.token:
            user.username = data.get("newUser")
            user.save()
            return JsonResponse(True, safe=False)

@csrf_exempt
def setName(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        profile.first = data.get("first")
        profile.last = data.get("last")
        profile.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def setBio(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        profile.bio = data.get("bio")
        profile.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def setCountry(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        profile.country = data.get("country")
        profile.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def setCity(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        profile.city = data.get("city")
        profile.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def setHobbies(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        hobbies = data.get("hobbies")

        for h in profile.hobbies.all():
            profile.hobbies.remove(h)

        for h in hobbies:
            try:
                ho = Hobbie.objects.filter(hobbie=h)
                if len(ho) > 0:
                    ho = ho[0]
                else:
                    ho = Hobbie.objects.create(hobbie=h)

            except Hobbie.DoesNotExist:
                ho = Hobbie.objects.create(hobbie=h)

            profile.hobbies.add(ho)
        profile.save()

        return JsonResponse(True, safe=False)

@csrf_exempt
def setOccupation(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        profile.occupation = data.get("occupation")
        profile.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def setDob(request):
     if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        profile.dob = data.get("dob")
        profile.save()
        return JsonResponse(True, safe=False)

@csrf_exempt
def setProfile(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)

        profile.first = data.get("first")
        profile.last = data.get("last")

        profile.country = data.get("country")
        profile.city = data.get("city")

        profile.dob = data.get("dob")
        
        profile.email = data.get("email")
        profile.school = data.get("school")
        profile.schoolType = data.get("type")
        profile.field = data.get("field")

        hobbies = data.get("hobbies")


        for h in profile.hobbies.all():
            profile.hobbies.remove(h)

        for h in hobbies:
            try:
                ho = Hobbie.objects.filter(hobbie=h)
                if len(ho) > 0:
                    ho = ho[0]
                else:
                    ho = Hobbie.objects.create(hobbie=h)

            except Hobbie.DoesNotExist:
                ho = Hobbie.objects.create(hobbie=h)

            profile.hobbies.add(ho)
        
        profile.setup = True
        profile.save()

        return JsonResponse(True, safe=False)

@csrf_exempt
def acceptRe(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
            
        data = json.loads(request.body)
        user = int(data.get("user"))
        person = data.get("person")
        token = data.get("token")
        personid = User.objects.get(username=person)
        userid = User.objects.get(username=user)
        pprofile = Profile.objects.get(user=personid)
        uprofile = Profile.objects.get(user=userid)

        if token == uprofile.token: 
            pprofile.friends.add(userid)

            chat = Chat.objects.create()
            nid = chat.id

            chat = Chat.objects.get(id=nid)
            chat.users.add(userid)
            chat.users.add(personid)
            chat.save()

            pprofile.chats.add(nid)
            uprofile.chats.add(nid)

            pprofile.save()

            uprofile.friends.add(personid)

            uprofile.save()

            requestss = Request.objects.get(requesting=personid, requested=userid)
            requestss.delete()
            
            tokens = []
            for p in pprofile.pushTokens.all():
                try:
                    token = PushToken.objects.get(id=p.id).token
                    if token not in tokens:
                        body = userid.username + " has accepted your friend request"
                        if token != "":
                            r.post('https://exp.host/--/api/v2/push/send', json = {
                                'to': token,
                                'title': "GlobalPuzzle",
                                'body': body,
                        })
                        tokens.append(token)
                except AttributeError:
                    print("")

            return JsonResponse(chat.id, safe=False)
        else:

            hacked(request)

@csrf_exempt
def denyRe(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
            
        data = json.loads(request.body)
        user = int(data.get("user"))
        person = data.get("person")
        token = data.get("token")
        personid = User.objects.get(username=person)
        userid = User.objects.get(id=user)
        pprofile = Profile.objects.get(user=personid)
        uprofile = Profile.objects.get(user=userid)
        
        if token == uprofile.token: 
            uprofile.save()
            pprofile.save()
            requestss = Request.objects.get(requesting=personid, requested=userid)
            requestss.delete()
            return JsonResponse(True, safe=False)
        else:
            hacked(request)

@csrf_exempt
def unfriend(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if profile.token == token:
            other = User.objects.get(username=data.get("other"))
            profile.friends.remove(other)
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def getPastCalls(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if profile.token == token:
            calls = profile.pastCalls.all()
            res = []

            for call in calls:
                res.append({"calling":call.calling.username, "called":call.called.username, "status":call.status, "datetime":call.datetime, "match": False})

            for call in profile.pastMatchCalls.all():
                res.append({"calling":call.user.username, "called":call.user.username, "datetime":call.datetime, "match": True})

            res.sort(key=lambda x: x["datetime"], reverse=True)
            return JsonResponse(res, safe=False)

        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def report(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(".|.", safe=False)
            
        data = json.loads(request.body)
        reporting = User.objects.get(id=int(data.get("user")))
        reported = User.objects.get(username=data.get("reported"))
        reason = data.get("reason")
        token = data.get("token")
        profile = Profile.objects.get(user=reporting)

        if token == profile.token:
            reports = Report.objects.filter(reporting=reporting, reported=reported, reason=reason)
            
            if len(reports.all()) <= 0:
                report = Report.objects.create(reporting=reporting, reported=reported, reason=reason)
                report.save()
                if reported not in profile.reported.all():
                    profile.reported.add(reported)
                    profile.save()

            return JsonResponse(True, safe=False)
        else:
            hacked(request)

@csrf_exempt
def unreport(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(".|.", safe=False)
            
        data = json.loads(request.body)
        reporting = User.objects.get(id=int(data.get("user")))
        reported = User.objects.get(username=data.get("reported"))
        token = data.get("token")

        profile = Profile.objects.get(user=reporting)

        if token == profile.token:
            reports = Report.objects.filter(reporting=reporting, reported=reported)
            for report in reports.all():
                report.delete()
            profile.reported.remove(reported)
            profile.save()
            return JsonResponse(True, safe=False)
        else:
            hacked(request)

@csrf_exempt
def unfriend(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(".|.", safe=False)
            
        data = json.loads(request.body)
        person = data.get("person")
        user = int(data.get("user"))
        token = data.get("token")
        pid = User.objects.get(username=person)
        pprofile = Profile.objects.get(user=User.objects.get(username=person))
        uprofile = Profile.objects.get(user=User.objects.get(id=user))
        

        if token == uprofile.token:
            pprofile.friends.remove(uprofile.user)
            uprofile.friends.remove(pprofile.user)

            for c in uprofile.chats.all():
                
                if pid in c.including.all():
                    c.delete()

            uprofile.save()
            pprofile.save()

            tokens = []
            for p in pprofile.pushTokens.all():
                try:
                    token = Notification.objects.get(id=p.id).token
                    if token not in tokens:
                        body = pid.username + " has unfriended you"
                        if token != "":
                            r.post('https://exp.host/--/api/v2/push/send', json = {
                                'to': token,
                                'title': "GlobalPuzzle",
                                'body': body,

                        })
                        tokens.append(token)
                except AttributeError:
                    print("damn")
            return JsonResponse(True, safe=False)
        else:
            hacked(request)

def setAllCord(request):
    if request.method == "GET":
        for profile in Profile.objects.all():
            if profile.setup:
                latitude, longitude = profile.get_city_coordinates()
                profile.latitude = latitude
                profile.longitude = longitude
                profile.save()
        return

def makeDict(data):
    final = dict()
    first = data.split(";")
    total = 0
    for f in first:
        if f != "" and ":" in f:
            second = f.split(":")
            if float(second[1]) > 0:
                final[second[0]] = float(second[1])
                total += float(second[1])
    return final

# If modifying these scopes, delete the file token.json.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly']

# The ID and range of a sample spreadsheet.
SAMPLE_SPREADSHEET_ID = '1OGt4j2NxpEs3_l5Yh6HLkISKjPXJoJV4nMP8L72vMPI'
SAMPLE_RANGE_NAME = 'Data!A2:G'
#res.append({"title": row[0], "author": row[1], "publisher": row[2], "link": row[3], "image":row[4], "description": row[5], "iso": row[6], "precent": pm})

def getNewsArticles(profile):
    allNews = News.objects.filter(over=False)
    res = dict()
    myCountries = profile.countryFriend()
    myCountries.append(profile.isoO())
    myHobbies = [hobbie.hobbie.lower() for hobbie in profile.hobbies.all() ]
    
    for new in allNews:
        pm = 0
        countries = makeDict(new.countries) 
        totalC = 0
        for c in countries:
            if c in myCountries:
                totalC += 1
        overlapC = float(0)
        overlapC = sum(countries[value] for value in countries if value in myCountries)
        overlapC = overlapC/totalC if totalC > 0 else 0.0

        hobbies = makeDict(new.hobbies)
        totalH = 0
        for h in hobbies:
            if h in myHobbies:
                totalH += 1
        overlapH = float(0)
        overlapH = sum(hobbies[value] for value in hobbies if value in myHobbies)
        overlapH = overlapH/totalH if totalH > 0 else 0.0

        fields = makeDict(new.fields)
        overlapF = float(0)
        overlapF = fields[profile.field] if profile.field in fields else 0.0
        
        isPrime = new.publisher in PRIME

        pm = float(.25 * overlapC) + float(.50 * overlapH) 
        pm = (pm * .1) + float(overlapF* .9) 
        pm = (pm * .95) + (.05 if isPrime else 0.0)
        if "mint" in new.publisher.lower():
            pm *= .20

        newsItem = {"title": new.title + " - " + new.publisher, "publisher": new.publisher, "link": new.link, "image": new.image, "description": new.description,  "precent": pm, "id": new.id, "datetime": new.datetime}
        if pm != None:
            res[new.title] = newsItem

    res = list(res.values())
    res.sort(key=lambda x: x["precent"], reverse=True)
    res = res[:30]
    res.sort(key=lambda x: x["datetime"], reverse=True)
    return res

@csrf_exempt
def getNews(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            res = getNewsArticles(profile)
            return JsonResponse(res, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def checkEmail(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            email = data.get("email")
            inst = email.split("@")
            inst = inst[1].lower()
            if inst in SCHOOLS:
                res = {"school": SCHOOLS[inst]["school"], "type": SCHOOLS[inst]["type"]}
                return JsonResponse(res, safe=False)
            else:
                return JsonResponse(None, safe=False)

@csrf_exempt
def confirmEmail(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        
        if token == profile.token:
            conf = generateConfirm()
            return JsonResponse(conf, safe=False)
            mailto = data.get("email")
            subject = 'Email Verification - Verification Code:' + conf
            message = "Thank you for signing up for globalPuzzle! To verify your email, please enter the verification code: " + conf
            from_email = 'itaylador@gmail.com'
            recipient_list = [mailto]
            send_mail(subject, message, from_email, recipient_list)

            return JsonResponse(conf, safe=False)

@csrf_exempt
def createGroup(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            groupName = ""
            added = data.get("added")
            added.append({"user": user.username})

            group = Group.objects.create()
            users = []
            for add in added:
                group.users.add(User.objects.get(username=add["user"]))
                up = Profile.objects.get(user=User.objects.get(username=add["user"]))
                up.groups.add(group)
                up.save()
                if add["user"] == added[-1]["user"]:
                    groupName += "& " + add["user"]
                else:
                    groupName += add["user"] + ", "
            group.name = groupName
            group.save()

            return JsonResponse(group.id, safe=False)


@csrf_exempt
def react(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
            
        data = json.loads(request.body)
        username = int(data.get("user"))
        mID = data.get("id")
        chatID = data.get("chatID")
        reaction = data.get("reaction")
        token = data.get("token")
        isGroup = data.get("isGroup")
        message = Message.objects.get(id=mID)
        user = User.objects.get(id=username)
        
        profile = Profile.objects.get(user=user)
        userIn = False
        val = True

        if token == profile.token:

            if isGroup:
                chat = Group.objects.get(id=chatID)
            else:
                chat = Chat.objects.get(id=chatID)

            for react in message.reaction.all():
                if react.user == user:
                    userIn = True

            if not userIn:
                react = Reaction.objects.create(user=user, reaction=reaction)
                react.save()
                message.reaction.add(react)
            else:
                for react in message.reaction.all():
                    if react.user == user:
                        if react.reaction == reaction:
                            react.reaction = ""
                            val = False
                            react.delete()
                        else:     
                            react.reaction = reaction
                            react.save()

            if val:
                content = ''
                if reaction == "laugh":
                    content = user.username + ' laughed at "' + message.content + '"'
                elif reaction != "question":
                    content = user.username + ' ' + reaction + 'd "' + message.content + '"'
                else:
                    content =  user.username + ' ' + reaction + 'ed "' + message.content + '"'

            
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

def colabUserInfo(user):
    profile = Profile.objects.get(user=user)
    return {"user": user.username, "image": str(profile.image.url), "country": profile.country , "school": profile.school, "schoolType": profile.schoolType, "field": profile.field}

def colabInfo(colab):
    comments = []
    replies = []
    for c in colab.comments.all():
        commentReplies = []
        for cc in c.comments.all():
            commentReplies.append({"user":colabUserInfo(cc.user), "comment":cc.comment, "datetime":cc.datetime, "isReply": True, "id": cc.id})
        replies.append(commentReplies)
        comments.append({"user":colabUserInfo(c.user), "comment":c.comment, "datetime":c.datetime, "isReply": False, "id": c.id})
    comments.sort(key=lambda x: x["datetime"], reverse=True)  
    replies.reverse()  

    colabs = []
    for c in colab.colabs.all():
        colabs.append(c.username)
    media = []
    for m in colab.media.all():
        media.append({"uri":str(m.media.url), "mediaType":m.mediaType, "duration":m.duration, "index": m.index})
    media.sort(key=lambda x: x["index"], reverse=False)
    return {"user":colabUserInfo(colab.user), "title":colab.title, "text":colab.text, "colabs":colabs, "comments":comments, "datetime":colab.datetime, "media":media, "profileImage": str(Profile.objects.get(user=colab.user).image.url), "id": colab.id, "replies": replies}

@csrf_exempt
def getColabs(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
       
        data = json.loads(request.body)
        user, token, profile = getData(request)

        if token == profile.token:
            round1 = []
            users = [user, *profile.friends.all()]
            for u in users:
                otherProfile = Profile.objects.get(user=u)
                round1.append({"colabs": set(otherProfile.colabs.all()[::-1][:5]),})
            
            round2 = []
            
            for r in round1:
                for colab in r["colabs"]:
                    round2.append(colabInfo(colab))
            
            res = round2[:40]
            res.sort(key=lambda x: x["datetime"], reverse=True)
            
            return JsonResponse(res, safe=False)

@csrf_exempt
def getGroup(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        groupID = data.get("groupID")

        if token == profile.token:
            group = Group.objects.get(id=groupID)
            users = []
            for u in group.users.all():
                uprof = Profile.objects.get(user=u) 
                users.append({"user": u.username, "image": str(Profile.objects.get(user=u).image.url), "me":u==user, "requestingMe": u.username in profile.beingRequested(), "iAmRequesting":  u.username in profile.requesting(), "country":uprof.country, "name": uprof.first + " " + uprof.last, "age": uprof.age()})

            res = {"users":users, "channel": group.channel(), "colab": colabInfo(group.colab) if group.colab != None else None,
            "name": group.name if group.hasName else group.groupName()
            }
            return JsonResponse(res, safe=False)

@csrf_exempt
def addToGroup(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        groupID = data.get("groupID")
        added = data.get("added")
        if token == profile.token:
            group = Group.objects.get(id=groupID)
            
            if user in group.users.all():
                for add in added:
                    addUser = User.objects.get(username=add["user"])
                    group.users.add(addUser)
                    addProfile = Profile.objects.get(user=addUser)
                    addProfile.groups.add(group)
                    addProfile.save()
                group.save()
            return JsonResponse(True, safe=False)

@csrf_exempt
def setGroupName(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        groupID = data.get("groupID")
        name = data.get("name")
        if token == profile.token:
            group = Group.objects.get(id=groupID)
            group.name = name
            if not group.hasName and len(name) > 0 and name[0] != " ":
                group.hasName = True
            elif len(name) < 1 or name[0] == " ":
                group.hasName = False
            group.save()
            return JsonResponse(True, safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def postNewComment(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)

        data = json.loads(request.body)
        user, token, profile = getData(request)
        comment = data.get("comment")
        colabID = data.get("colabID")

        if token == profile.token:
            colab = Colab.objects.get(id=colabID)
            newComment = Comment.objects.create(user=user, comment=comment, datetime=datetime.datetime.now())
            colab.comments.add(newComment)
            colab.save()
            return JsonResponse(colabInfo(colab)["comments"], safe=False)
        else:
            return JsonResponse(hacked(request), safe=False)

@csrf_exempt
def postCommentReply(request):
    if request.method == "POST":
        if checkIP(request):
            return JsonResponse(hackedPrint(), safe=False)
        
        data = json.loads(request.body)
        user, token, profile = getData(request)
        reply = data.get("comment")
        commentID = data.get("commentID")
        colabID = data.get("colabID")

        if token == profile.token:
            comment = Comment.objects.get(id=commentID)
            colab = Colab.objects.get(id=colabID)
            newReply = Comment.objects.create(user=user, comment=reply, datetime=datetime.datetime.now())
            comment.comments.add(newReply)
            comment.save()
            return JsonResponse(colabInfo(colab)["replies"], safe=False)

@csrf_exempt
def newsClicked(request):
    if request.method == "POST":
        user, token, profile = getData(request)
        data = json.loads(request.body)
        
        if token == profile.token:
            newsID = data.get("newsID")
            news = News.objects.get(id=newsID)

@csrf_exempt
def getColabsOf(request):
    if request.method == "POST":
        user, token, profile = getData(request)
        data = json.loads(request.body)
        of = User.objects.get(username=data.get("of"))
        profileOf = Profile.objects.get(user=of)
        if token == profile.token:
            res = []
            for colab in profileOf.colabs.all():
                res.append(colabInfo(colab))

            return JsonResponse(res, safe=False)            


def updatePrev(request):
    if request.method == "GET":

        for profile in Profile.objects.all():
            if profile.email != None and profile.setup and profile.email != "":
                try:

                    SCHOOLS[profile.email.split("@")[1]]
                except KeyError:
                    school = random.choice(list(SCHOOLS.keys()))

                    profile.email = profile.first + profile.last + "@" + school
                    profile.school = SCHOOLS[school]["school"]
                    profile.schoolType = SCHOOLS[school]["type"]
                    profile.save()
        return
    
def percent_match(str1, str2):
    len_str1 = len(str1)
    len_str2 = len(str2)

    # Find the length of the longer string
    max_len = max(len_str1, len_str2)

    # Calculate the number of matching characters
    matching_chars = sum(c1 == c2 for c1, c2 in zip(str1, str2))

    # Calculate the percentage match
    percentage_match = (matching_chars / max_len)

    return percentage_match

apiKey = 'e85762b249364ab69d0aba29dac7f047'
@csrf_exempt
def writeNews(request):

    
    
    sources = ["cnn", "the-washington-post", "abc-news", "ars-technica", "cbs-news", "politico", "bbc-news"]
        
    yesterday = datetime.datetime.now() - datetime.timedelta(days=7)  
    newsapi = NewsApiClient(api_key=apiKey)

    values = []

    for source in sources:
        all_articles = newsapi.get_everything(sources=source,
                                      language='en',
                                      sort_by='relevancy',
                                      page=1,
                                      page_size= 50 if source in PRIME else 10,
                                      )
        values += all_articles["articles"]
    
    res = []
    notValid = set()
    currentNews = News.objects.all()
    links = set()
    titles = set()
    for new in currentNews:
        links.add(new.link)
        titles.add(new.title)
        diff = abs(timezone.now() - new.datetime)

        if diff.days > 7:
            new.over = True
            new.save()

    terms = {}
    for row in values:
        row["description"] = row["description"] if row["description"] != None else ""
        pm = float(0)
        countries = {}
        for country in COUNTRIES:
            countries[country] = 0

        hobbies = {}
        for hobbie in HOBBIESRE:
            hobbies[hobbie] = 0
        
        fields = {}
        for field in FIELDSRE:
            fields[field] = 0

        if len(row) > 0:
            if row["source"]["name"] not in RELIABLE:
                continue
            if row["url"] in links or row["title"] in titles:
                continue

            sentances = re.split(r'[.-]', row["title"].lower())
            if row["description"] is not None:
                sentances += re.split(r'[.-]', row["description"].lower())
            sentances.pop()

            for sentance in sentances:
                for field in FIELDSRE:
                    for f in FIELDSRE[field]:
                        f = f.lower()
                        if f in sentance:
                            fields[field] += 1
                            break
            
            def iterateThrough(sentances, related, field):
                for sentance in sentances:
                    if related in sentance:
                            fields[field] += 1


            for field in FIELDSRE:
                for f in FIELDSRE[field]:
                    f = f.lower()
                    seperated = False
                    if "(" in f:
                        seperated = True
                        f = f.replace(")", "")
                        f = f.split('(')
                        
                        for related in f:
                            iterateThrough(sentances, related, field)
                    


            words = re.findall(r'\b\w+\b', row["title"].lower())
            if row["description"] is not None:
                words += re.findall(r'r\b\w+\b', row["description"].lower())
            words = set(words)
            for word in words:
                if word.lower() in NOTWORDS or len(word) < 4:
                    continue
                for iso in COUNTRIES:
                    cs = []
                    for i in COUNTRIES[iso]:
                        cs.append(i.lower())
                    
                    for c in cs:
                        if word.lower() == c:
                            countries[iso] += 1
                        
                        try:
                            check = terms[word]
                            terms[word][0].add(c) if countries[iso] > 0 else None
                        except KeyError:
                            terms[word] = [{c}, countries[iso]]
                    terms[word][1] += countries[iso]

                for hobbie in HOBBIESRE:
                    hl = []
                    for h in HOBBIESRE[hobbie]:
                        h = h.lower()
                        h = h.replace("(", "")
                        h = h.replace(")", "")
                        h = h.split(" ")
                        for p in h:
                            if p not in NOTWORDS:
                                hl.append(p)
                    
                    if word.lower() in hl:
                        hobbies[hobbie] += 1
                    

                for field in FIELDSRE:
                    fl = []
                    for f in FIELDSRE[field]:
                        f = f.lower()
                        f = f.replace("(", "")
                        f = f.replace(")", "")
                        f = f.split(" ")
                        for p in f:
                            if p not in NOTWORDS:
                                fl.append(p)
                    
                    if word.lower() in fl:
                        fields[field] += 1
            
            def getRelatedScore(relatedFields, score, factor):
                for f in relatedFields:
                    if f not in fieldsUsed:
                        score += (factor * relatedFields[f] * fields[f])
                        
                for f in relatedFields:
                    if f not in fieldsUsed:
                        fieldsUsed.add(f)
                        addition = getRelatedScore(FIELDS[f]['related'], score, relatedFields[f])
                        score = addition
                return score
            
            relatedScores = {}
            for field in FIELDSRE:
                fieldsUsed = {field}
                relatedFields = FIELDS[field]['related']
                relatedScore = getRelatedScore(relatedFields, 0.0, 1.0)
                relatedScores[field] = relatedScore
            
            def normalize(s):
                by = sum(s.values())
                result_set = {}
                by = max(s.values())
                if by == 0:
                    return s
                for x in s:
                    result_set[x] = s[x] / by
                return result_set
            
            fields = normalize(fields)
            scores = {}
            relatedScores = normalize(relatedScores)
    

            for field in fields:
                scores[field] = fields[field] + (relatedScores[field])

            scores = normalize(scores)

            countries = normalize(countries)
            hobbies = normalize(hobbies)

            cstr = ""
            for country in countries:
                cstr += str(country) + ":" + str(countries[country]) + ";"

            hstr = ""
            for hobbie in hobbies:
                hstr += str(hobbie) + ":" +str(hobbies[hobbie]) + ";"
            
            fstr = ""
            for field in scores:
                fstr += str(field) + ":" + str(scores[field]) + ";"
                            

            res.append({"title": row["title"], "author": row["author"], "publisher": row["source"]["name"], "link": row["url"], "image":row["urlToImage"], "description": row["description"], "hobbies":hstr, "countries":cstr, "fields":fstr, "datetime": row["publishedAt"] })
    
    for term in terms:
        None
    titles = set()
    fres = []
    for r in res:
        if r["title"] not in titles:
            r["id"] = len(fres)
            fres.append(r)
            titles.add(r["title"])

    for r in fres:
        new = News.objects.create(title=r["title"], publisher=r["publisher"], link=r["link"], image=r["image"], description=r["description"], hobbies=r["hobbies"], countries=r["countries"], fields=r["fields"], datetime=r["datetime"])
    
    return None

@csrf_exempt
def trainKModel(request):
    for profile in Profile.objects.all():
        if not profile.setup:
            continue
        TEST_SIZE = .4
        evidence, labels = load_data(profile)
        X_train, X_test, y_train, y_test = train_test_split(
            evidence, labels, test_size=TEST_SIZE
        )

        # Train model and make predictions
        model = train_model(X_train, y_train)
        predictions = model.predict(X_test)


        models_folder = 'models/friends/'

        # Create the directory if it does not exist
        os.makedirs(models_folder, exist_ok=True)

        # Define the filename (including the folder path)
        filename = os.path.join(models_folder, str(profile.user.id) + ".pkl")
        save_model(model, filename)

        return True
            
def save_model(model, filename):
    """
    Save the trained model to a file using pickle.
    """
    with open(filename, 'wb') as file:
        pickle.dump(model, file)

def load_model(user):
    return load_model(user) 

def train_model(evidence, labels):
    n = 5
    if len(labels) < n:
        n = math.ceil(len(labels) * .2) 
    model = KNeighborsClassifier(n_neighbors=n)
    
    model.fit(evidence, labels)
    return model

    raise NotImplementedError

def load_data(profile):
    return load_data(profile)

def getSchoolObject(email):
    return getSchoolObject(email)
                
def profileAIObjects(profile):
    return profileAIObjects(profile)

def evaluate(labels, predictions):
    sensitivity = 0.00
    totalSensitivity = 0.00

    specificity = 0.00
    totalSpecificity = 0.00

    for actual, predicted in zip(labels, predictions):
        if actual == 1:
            totalSensitivity += 1.00
            if actual == predicted:
                sensitivity += 1.00
        else:
            totalSpecificity += 1.00
            if actual == predicted:
                specificity += 1.00
    
    return float(sensitivity/totalSensitivity) if totalSensitivity > 0 else 0, float(specificity/totalSpecificity) if totalSpecificity > 0 else 0


@csrf_exempt
def update(request):
    if request.method == "GET":
        AdminToken.objects.create(token=generateToken())
        return JsonResponse(None, safe=False)