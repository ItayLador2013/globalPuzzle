# Generated by Django 4.0.4 on 2024-01-17 00:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0054_alter_comment_comments'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='fields',
            field=models.TextField(blank=True),
        ),
    ]
