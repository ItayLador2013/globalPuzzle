# Generated by Django 4.0.4 on 2024-01-01 06:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('home', '0050_alter_group_icon_alter_message_image_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='report',
            name='reported',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='report',
            name='reporting',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='request',
            name='requested',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='ed+', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='request',
            name='requesting',
            field=models.ForeignKey(blank=True, on_delete=django.db.models.deletion.CASCADE, related_name='ing+', to=settings.AUTH_USER_MODEL),
        ),
    ]
