# Generated by Django 4.0.4 on 2023-08-17 01:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0006_hobbie_profile_bio_profile_country_profile_friends_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='hobbies',
            field=models.ManyToManyField(blank=True, related_name='+', to='home.hobbie'),
        ),
    ]
