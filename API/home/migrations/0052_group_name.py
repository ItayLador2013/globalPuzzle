# Generated by Django 4.0.4 on 2024-01-07 19:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('home', '0051_alter_report_reported_alter_report_reporting_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='group',
            name='name',
            field=models.CharField(blank=True, max_length=300),
        ),
    ]
