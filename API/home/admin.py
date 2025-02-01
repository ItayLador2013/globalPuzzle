from django.contrib import admin
from .models import Profile, Country, Hobbie, Request, Chat, Message, PushToken, Call, Searching, HackerIP, PastCall, PastMatchCall, Group, Reaction, News, Report, Colab, Media, Comment, AdminToken

# Register your models here.

admin.site.register(Profile)
admin.site.register(Country)
admin.site.register(Hobbie)
admin.site.register(Request)
admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(PushToken)
admin.site.register(Call)
admin.site.register(Searching)
admin.site.register(HackerIP)
admin.site.register(PastCall)
admin.site.register(PastMatchCall)
admin.site.register(Group)
admin.site.register(Reaction)
admin.site.register(News)
admin.site.register(Report)
admin.site.register(Media)
admin.site.register(Colab)
admin.site.register(Comment)
admin.site.register(AdminToken)