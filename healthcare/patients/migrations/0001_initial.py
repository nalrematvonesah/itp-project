# Generated by Django 5.0.7 on 2025-02-07 09:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Hospital',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('location', models.TextField()),
                ('contact_number', models.CharField(max_length=15)),
                ('capacity', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('age', models.IntegerField()),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=10)),
                ('contact_number', models.CharField(max_length=15)),
                ('address', models.TextField()),
                ('illness', models.CharField(max_length=50)),
                ('medical_history', models.TextField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='MedicalProfessional',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=100)),
                ('last_name', models.CharField(max_length=100)),
                ('specialization', models.CharField(max_length=100)),
                ('contact_number', models.CharField(max_length=15)),
                ('hospital', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medical_professionals', to='patients.hospital')),
            ],
        ),
    ]
