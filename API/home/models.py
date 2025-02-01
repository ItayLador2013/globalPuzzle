from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MaxValueValidator, MinValueValidator
from datetime import date
import datetime
import geonamescache
from geonamescache.mappers import country
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
from . import set_manager
from collections import Counter
import os
from django.conf import settings
from cloudinary.models import CloudinaryField
import pickle


def load_model(user):
    models_folder = 'models/friends/'
    # Create the directory if it does not exist
    os.makedirs(models_folder, exist_ok=True)
    # Define the filename (including the folder path)
    filename = os.path.join(models_folder, str(user.id) + ".pkl")

    with open(filename, 'rb') as f:
        model = pickle.load(f)

    return model 

def load_data(profile, profiles):
    evidence = []
    labels = []
    resProfiles = []

    for otherProfile in profiles:
        if otherProfile == profile or not otherProfile.setup:
            continue
        evidence.append(profileAIObjects(otherProfile))
        label = 0
        if otherProfile.user in profile.friends.all():
            label = 1
        labels.append(label)
        resProfiles.append(otherProfile)

    return evidence, labels, resProfiles

def getSchoolObject(email):
    school = SCHOOLS[email.split("@")[1]] if "@" in email else None
    return school
                
def profileAIObjects(profile):
    res = []
    catScores = CATS.copy()
    for hobbie in profile.hobbies.all():
        for catagory in HOBBIES[hobbie.hobbie]:
            catScores[catagory] += HOBBIES[hobbie.hobbie][catagory]

    fieldsScores = {key: 0 for key in FIELDS.keys()}
    if profile.field != None and profile.field != "":
        fieldsScores[profile.field] += 1
        for field in FIELDS[profile.field]["related"]:
            fieldsScores[field] += FIELDS[profile.field]["related"][field]

    res.append(int(profile.age()))
    res.append(int(len(profile.friends.all())))
    if profile.schoolType == "university" and getSchoolObject(profile.email) is not None:
        res.append(int(getSchoolObject(profile.email)["rank"]))
    else:
        res.append(int(100))
    for catagory in catScores:
        res.append(float(catScores[catagory]))
    for field in fieldsScores:
        res.append(float(fieldsScores[field]))
    
    return res

def percentage_match(float1, float2):
    # Calculate the absolute difference between the two floats
    difference = abs(float1 - float2)
    # Calculate the average of the two floats
    average = (float1 + float2) / 2
    # Calculate the percentage match
    if average > 0:
        percentage_match = (difference / average)
    else:
        percentage_match = 0

    return percentage_match

class Country(models.Model):
    country = models.CharField(max_length=250, primary_key=True)

class Reaction(models.Model):
    user = models.ForeignKey(User, blank=True, unique=False, on_delete=models.CASCADE)
    reaction = models.CharField(max_length=250)

class Message(models.Model):
    sender = models.ForeignKey(User, blank=True, unique=False, on_delete=models.CASCADE)
    content = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, default=None, null=True)
    image = 
    

    def hasImage(self):
       
        if self.image != None:
            if self.image.url != None:
                return True
        return False
    reaction = models.ManyToManyField(Reaction, blank=True, related_name="+")
    num = models.IntegerField(blank=True, default=0)

class Chat(models.Model):
    users = models.ManyToManyField(User, related_name="+", blank=True)
    messages = models.ManyToManyField(Message, related_name="+", blank=True)

class Hobbie(models.Model):
    hobbie = models.CharField(max_length=250)

class Request(models.Model):
    requesting = models.ForeignKey(User, blank=True, unique=False, on_delete=models.CASCADE, related_name="ing+")
    requested = models.ForeignKey(User, blank=True, unique=False, on_delete=models.CASCADE, related_name="ed+")

class PushToken(models.Model):
    token = models.TextField(blank=True)

class Call(models.Model):
    calling = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="+", blank=True)
    called = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="ed+", default=None, blank=True)
    status = models.CharField(max_length=250)
    channel = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, null=True, default=None)

class GroupCall(models.Model):
    members = models.ManyToManyField(User, related_name="+", blank=True)
    status = models.CharField(max_length=250)
    channel = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, null=True, default=None)

class GroupMatch(models.Model):
    members = models.ManyToManyField(User, related_name="+", blank=True)
    status = models.CharField(max_length=250)
    channel = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, null=True, default=None)

class Searching(models.Model):
    user = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="+")
    country = models.CharField(max_length=300)
    city = models.CharField(max_length=300)
    number = models.IntegerField(blank=True, default=1)

class PastMatchCall(models.Model):
    user = models.ForeignKey(User, unique=False, on_delete=models.CASCADE)
    datetime = models.DateTimeField(blank=False)
    
class PastCall(models.Model):
    calling = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="+", blank=True, default=None,)
    called = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="ed+", default=None, null=True, blank=True)
    status = models.CharField(max_length=250, blank=True)
    channel = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, null=True, default=None)

class HackerIP(models.Model):
    ip = models.TextField()

class Comment(models.Model):
    user = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="+", blank=True)
    comment = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, null=True, default=None)
    comments = models.ManyToManyField('self', default=None, blank=True)

class Media(models.Model):
    media = CloudinaryField('image', blank=True)
    mediaType = models.CharField(max_length=200, blank=True)
    duration = models.DecimalField(max_digits=10, decimal_places=1, default=0)
    index = models.IntegerField(default=0)

class Colab(models.Model):
    user = models.ForeignKey(User, unique=False, on_delete=models.CASCADE, related_name="+", blank=True)
    title = models.CharField(max_length=300, blank=True)
    text = models.TextField(blank=True)
    media = models.ManyToManyField(Media, related_name="+", blank=True)
    comments = models.ManyToManyField(Comment, blank=True, related_name="+")
    colabs = models.ManyToManyField(User, blank=True, )
    datetime = models.DateTimeField(blank=True, null=True, default=None)

class Group(models.Model):
    name = models.CharField(max_length=300, blank=True)
    hasName = models.BooleanField(default=False)
    users = models.ManyToManyField(User, related_name="+", blank=True,)
    messages = models.ManyToManyField(Message, related_name="+", blank=True)
    icon = CloudinaryField('image', blank=True)
    colab = models.ForeignKey(Colab, blank=True, null=True, on_delete=models.DO_NOTHING)
    
    def channel(self):
        res = []
        for user in self.users.all():
            res.append(user.username)
        res.sort()
        return ''.join(res) + str(self.id)
    
    def groupName(self):
        groupName = ""
        for user in self.users.all():
                if user == self.users.all()[len(self.users.all())-1]:
                    groupName += "& " + user.username
                else:
                    groupName += user.username + ", "
        return groupName


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first = models.CharField(max_length=250, blank=True)
    last = models.CharField(max_length=250, blank=True)
    network = models.ManyToManyField(Country, related_name="+", blank=True)
    def countries(self):
        res = []
        for friend in self.friends.all():
            c = Profile.objects.get(user=friend).country
            if c not in res:
                res.append(c)
        return res
    
    def countryFriend(self):
        res = []
        for friend in self.friends.all():
            fp = Profile.objects.get(user=friend)
            if fp.isoO().lower() not in res:
                res.append(fp.isoO().lower())
        return res
        
    token = models.CharField(max_length=350, blank=True)
    image = CloudinaryField('image', blank=True)
    setup = models.BooleanField(default=False)
    dob = models.DateField(blank=True, default=None, null=True)
    def age(self):
        today = date.today()
        if self.dob:
            age = today.year - self.dob.year - ((today.month, today.day) < (self.dob.month, self.dob.day))
            return age
        else:
            return None

    bio = models.CharField(max_length=250, blank=True)
    friends = models.ManyToManyField(User, blank=True, related_name="+")
    def num_friends(self):
        return len(self.friends.all())
    
    def friend(self):
        res = []
        for f in self.friends.all():
            res.append(f.username)
        return res


    country = models.CharField(max_length=250, blank=True)
    city = models.CharField(max_length=300, blank=True)
    def isoO(self):
        if self.country:
            gc = geonamescache.GeonamesCache()
            mapper = country(from_key='name', to_key='iso')
            iso = mapper(self.country)
            return iso
        else:
            return None

    hobbies = models.ManyToManyField(Hobbie, blank=True, related_name="+")
    occupation = models.CharField(blank=True, max_length=300)

    requests = models.ManyToManyField(Request, related_name="+", blank=True)
    def requesting(self):
        res = []
        for r in self.requests.all():
            if r.requesting == self.user:
                res.append(r.requested) 
        return res
    
    def beingRequested(self):
        res = []
        for r in self.requests.all():
            if r.requesting != self.user:
                res.append(r.requesting)
        return res
    
    def preparePeopleData(self):
        current_datetime = datetime.datetime.now().date()
        age = self.age()
        topAge = 99
        bottomAge = 11

        if age < 18:
            topAge = 19
        
        if age + 4 < topAge:
            topAge = age + 4
        
        if age - 4 > bottomAge:
            bottomAge = age - 4

        bottomDob = current_datetime - datetime.timedelta(days=bottomAge*365)
        bottomDob = bottomDob.replace(month=12, day=31)

        topDob = current_datetime - datetime.timedelta(days=topAge*365)
        topDob = topDob.replace(month=1, day=1)
        
        possibleMatches = Profile.objects.filter(dob__range=(topDob, bottomDob), setup=True).exclude(user=self.user)
        pm = []
        for p in possibleMatches:
            if p.user not in self.friends.all():
                pm.append(p)
        
        return load_data(self, pm)
    
    def getClosestMatches(self):
        predicted = []
        notPredicted = []
        evidence, labels, profiles = self.preparePeopleData()
        model = load_model(self.user)
        predictions = model.predict(evidence)
        for index, profile in enumerate(profiles): 
            if predictions[index] == 1:
                predicted.append(profile)
            else:
                notPredicted.append(profile)
        
        return predicted, notPredicted
    
    def getPrecent(self, other, predicted):
        precent = float(0)
        hSum = float(0)
        hTotal = float(0)
        catRelated = float(0)
        fieldRelated = float(0)
        schoolRelated = float(0)
        predicted = 1.0 if predicted else 0.0
        
        rank = 1.00 - float(abs(float(getSchoolObject(self.email)["rank"]) - float(getSchoolObject(other.email)["rank"]))/100)

        catScores = CATS.copy()
        for hobbie in self.hobbies.all():
            for catagory in HOBBIES[hobbie.hobbie]:
                catScores[catagory] += HOBBIES[hobbie.hobbie][catagory]

        catScoresOther = CATS.copy()
        for hobbie in other.hobbies.all():
            for catagory in HOBBIES[hobbie.hobbie]:
                catScoresOther[catagory] += HOBBIES[hobbie.hobbie][catagory]

        doneCats = set()
        for myCat in catScores:
            for otherCat in catScoresOther:
                if myCat == otherCat and myCat not in doneCats:
                    catRelated += percentage_match(catScores[myCat], catScoresOther[otherCat])
                    doneCats.add(myCat)

        catRelated = catRelated/float(len(doneCats))

        fieldsScores = {key: 0 for key in FIELDS.keys()}
        if self.field != None and self.field != "":
            fieldsScores[self.field] += 1
            for field in FIELDS[self.field]["related"]:
                fieldsScores[field] += FIELDS[self.field]["related"][field]
        
        fieldsScoresOther = {key: 0 for key in FIELDS.keys()}
        if other.field != None and other.field != "":
            fieldsScoresOther[other.field] += 1
            for field in FIELDS[other.field]["related"]:
                fieldsScoresOther[field] += FIELDS[other.field]["related"][field]

        doneFields = set()
        for myField in fieldsScores:
            for otherField in fieldsScoresOther:
                if myField == otherField and myField not in doneFields:
                    fieldRelated += percentage_match(fieldsScores[myField], fieldsScoresOther[otherField])
                    doneFields.add(myField)

        fieldRelated = fieldRelated/float(len(doneFields))

        precent = (.20 * fieldRelated) + (.40 * catRelated) + (.40 * rank)
        precent = (.5 * predicted) + (precent * .5)
        return float(float(precent) * 100)
    
    def ageOK(self, other):
        myAge = self.age()
        otherAge = other.age()
        def ageDifference(age1, age2):
            return abs(age1-age2)
        if myAge >= 21 and otherAge >= 21:
            return True

        if myAge >= 18 and otherAge >= 18:
            return True
        
        if (myAge >= 18 and otherAge < 18) or (myAge < 18 and otherAge >= 18) :
            if ageDifference(myAge, otherAge) <= 1:
                return True
 
        if ageDifference(myAge, otherAge) <= 3:
            return True

        return False
    
    def matchOK(self, other):
        precent = self.getPrecent(other)

        for request in other.requests.all():
            if request.requesting == self.user or request.requested == self.user:
                return False

        for request in self.requests.all():
            if request.requesting == other.user or request.requested == other.user:
                return False


        if other.country == self.country:
            if self.getPrecent(other) >= .50:
                return True
        else:
            if self.getPrecent(other) >= .20:
                return True

        return False
    
    latitude = models.CharField(max_length=300, blank=True, default="0")
    longitude = models.CharField(max_length=300, blank=True, default="0") 
    
    def get_city_coordinates(self):
        # Initialize the geonamescache object
        gc = geonamescache.GeonamesCache()

        # Search for the city by name
        cities = gc.search_cities(self.city, case_sensitive=False,)

        city = None

        for c in cities:
            if c['countrycode'] == self.isoO():
                city = c
                break

        if city:
            # Extract the coordinates (latitude and longitude) from the city data
            latitude = city['latitude']
            longitude = city['longitude']
            
            return latitude, longitude
        else:
            return None
    
    pushTokens = models.ManyToManyField(PushToken, blank=True, related_name="+")
    chats = models.ManyToManyField(Chat, blank=True, related_name="+")
    groups = models.ManyToManyField(Group, blank=True, related_name="+")
    meRequesting = models.ManyToManyField(User, blank=True, related_name="+")
    requestingMe = models.ManyToManyField(User, blank=True, related_name="+")

    def networks(self):
        res = []
        myLatitude, myLongitude = self.get_city_coordinates()
        res.append({"user":self.user.username, "latitude":myLatitude, "longitude": myLongitude, "image":str(self.image.url), "name": self.first + " " + self.last})
        for friend in self.friends.all():
            friendProf = Profile.objects.get(user=friend)
            network = {}
            network["latitude"], network["longitude"] = friendProf.get_city_coordinates()
            network["image"] = str(friendProf.image.url)  
            network["user"] = friend.username
            network["name"] =  friendProf.first + " " + friendProf.last
            res.append(network)

        return res
    
    def networkLines(self):
        res = []
        tempFriends = [self.user]
        for friend in self.friends.all():
            tempFriends.append(friend)
        
        for friend in tempFriends:
            friendProf = Profile.objects.get(user=friend)
            lat, long = friendProf.get_city_coordinates()
            for otherFriend in tempFriends:
             
                otherProf = Profile.objects.get(user=otherFriend)
                network = {}
                network["key"] = friend.username + otherFriend.username 
                network["latitude"] = lat
                network["longitude"] = long
                network["otherLatitude"], network["otherLongitude"] = otherProf.get_city_coordinates()
                res.append(network)

        return res 

    call = models.ForeignKey(Call, blank=True, on_delete=models.DO_NOTHING, null=True, default=None)
    pastCalls = models.ManyToManyField(PastCall, blank=True, related_name="+")
    pastMatchCalls = models.ManyToManyField(PastMatchCall, blank=True, related_name="+")
    videoMatch = models.ForeignKey(User, default=None, blank=True, related_name="+", on_delete=models.DO_NOTHING, null=True)
    GroupMatch = models.ForeignKey(GroupMatch, default=None, blank=True, related_name="+", on_delete=models.DO_NOTHING, null=True)
    searching = models.BooleanField(default=False)
    reported = models.ManyToManyField(User, related_name="-+", blank=True)
    banned = models.BooleanField(default=False)
    school = models.CharField(blank=True, max_length=300)
    schoolType = models.CharField(blank=True, max_length=300)
    field = models.CharField(blank=True, max_length=300)
    email = models.CharField(blank=True, max_length=300)
    colabs = models.ManyToManyField(Colab, blank=True, related_name="+", )
    
class Report(models.Model):
    reporting = models.ForeignKey(User, on_delete=models.CASCADE, unique=False, blank=True)
    reported = models.ForeignKey(User, on_delete=models.CASCADE, unique=False, related_name="+", blank=True)
    reason = models.CharField(max_length=500, blank=True)
    dealt = models.BooleanField(default=False)
    actionTaken = models.CharField(blank=True, max_length=500)

class News(models.Model):
    title = models.TextField(blank=True)
    description = models.TextField(blank=True, null=True)
    image = models.TextField(blank=True, null=True)
    link = models.TextField(blank=True) 
    publisher = models.TextField(blank=True)
    countries = models.TextField(blank=True)
    hobbies = models.TextField(blank=True)
    fields = models.TextField(blank=True)
    datetime = models.DateTimeField(blank=True, null=True, default=None)
    over = models.BooleanField(default=False)
    users = models.ManyToManyField(User, blank=True, related_name="+")

class AdminToken(models.Model):
    token = models.TextField(blank=True)




                            
                            




