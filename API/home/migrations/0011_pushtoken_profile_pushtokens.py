# Generated by Django 4.0.4 on 2023-08-24 21:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0010_profile_city'),
    ]

    operations = [
        migrations.CreateModel(
            name='PushToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.TextField(blank=True)),
            ],
        ),
        migrations.AddField(
            model_name='profile',
            name='pushTokens',
            field=models.ManyToManyField(blank=True, related_name='+', to='home.pushtoken'),
        ),
    ]
