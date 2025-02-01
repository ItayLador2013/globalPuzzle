from django.db import models

# Create your models here.
class Contact(models.Model):
    name = models.CharField(max_length=300)
    text = models.TextField(blank=True)
    date = models.DateField(blank=True)
    addressed = models.BooleanField(default=False)