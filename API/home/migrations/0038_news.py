# Generated by Django 4.0.4 on 2023-11-17 23:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0037_comment_colab_profile_colabs'),
    ]

    operations = [
        migrations.CreateModel(
            name='News',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(blank=True)),
                ('description', models.TextField(blank=True)),
                ('image', models.TextField(blank=True)),
                ('link', models.TextField(blank=True)),
                ('publisher', models.TextField(blank=True)),
                ('countries', models.TextField(blank=True)),
                ('hobbies', models.TextField(blank=True)),
            ],
        ),
    ]
