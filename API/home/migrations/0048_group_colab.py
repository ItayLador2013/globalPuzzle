# Generated by Django 4.0.4 on 2023-12-24 14:53

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0047_media_index'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='colab',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='home.colab'),
        ),
    ]
