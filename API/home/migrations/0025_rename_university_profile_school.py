# Generated by Django 4.0.4 on 2023-10-13 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0024_profile_university'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='university',
            new_name='school',
        ),
    ]
