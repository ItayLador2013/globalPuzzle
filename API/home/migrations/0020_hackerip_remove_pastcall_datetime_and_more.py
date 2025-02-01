# Generated by Django 4.0.4 on 2023-08-30 17:06

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0019_profile_searching_profile_videomatch_searching_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='HackerIP',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ip', models.TextField()),
            ],
        ),
        migrations.RemoveField(
            model_name='pastcall',
            name='datetime',
        ),
        migrations.RemoveField(
            model_name='pastcall',
            name='user',
        ),
        migrations.AddField(
            model_name='pastcall',
            name='called',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='ed+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='pastcall',
            name='calling',
            field=models.ForeignKey(blank=True, default=None, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='pastcall',
            name='channel',
            field=models.TextField(blank=True),
        ),
        migrations.AddField(
            model_name='pastcall',
            name='status',
            field=models.CharField(blank=True, max_length=250),
        ),
        migrations.CreateModel(
            name='PastMatchCall',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='profile',
            name='pastMatchCalls',
            field=models.ManyToManyField(blank=True, related_name='+', to='home.pastmatchcall'),
        ),
    ]
