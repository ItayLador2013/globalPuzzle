# Generated by Django 4.0.4 on 2023-10-13 14:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0023_profile_banned_profile_reported_report'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='university',
            field=models.CharField(blank=True, max_length=300),
        ),
    ]
