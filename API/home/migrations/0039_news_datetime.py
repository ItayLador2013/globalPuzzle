# Generated by Django 4.0.4 on 2023-11-17 23:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0038_news'),
    ]

    operations = [
        migrations.AddField(
            model_name='news',
            name='datetime',
            field=models.DateTimeField(blank=True, default=None, null=True),
        ),
    ]
