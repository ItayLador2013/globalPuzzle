# Generated by Django 4.0.4 on 2023-11-02 20:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0035_groupmatch_alter_profile_groupcall'),
    ]

    operations = [
        migrations.RenameField(
            model_name='profile',
            old_name='groupCall',
            new_name='GroupMatch',
        ),
    ]
