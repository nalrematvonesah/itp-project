from django.db import models


class Patient(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    age = models.IntegerField()
    gender = models.CharField(max_length=10, choices=[('Male', 'Male'), ('Female', 'Female')])
    contact_number = models.CharField(max_length=15)
    address = models.TextField()
    medical_history = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

class MedicalProfessional(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100)
    contact_number = models.CharField(max_length=15)
    hospital = models.ForeignKey('Hospital', on_delete=models.CASCADE, related_name='medical_professionals')

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name} - {self.specialization}"


class Hospital(models.Model):
    name = models.CharField(max_length=255)
    location = models.TextField()
    contact_number = models.CharField(max_length=15)
    capacity = models.IntegerField()

    def __str__(self):
        return self.name
