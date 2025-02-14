from rest_framework import serializers
from .models import Patient, MedicalProfessional, Hospital

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'  

class MedicalProfessionalSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source="hospital.name", read_only=True)
                                          
    class Meta:
        model = MedicalProfessional
        fields = '__all__'

class HospitalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hospital
        fields = '__all__'
