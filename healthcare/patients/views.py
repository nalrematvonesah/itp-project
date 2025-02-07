from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Patient, MedicalProfessional, Hospital
from .serializers import PatientSerializer, MedicalProfessionalSerializer, HospitalSerializer


class PatientListCreateAPIView(APIView):
    def get(self, request):
        patients = Patient.objects.all()
        serializer = PatientSerializer(patients, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = PatientSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientDetailAPIView(APIView):
    def get(self, request, pk):
        patient = get_object_or_404(Patient, pk=pk)
        serializer = PatientSerializer(patient)
        return Response(serializer.data)

    def put(self, request, pk):
        patient = get_object_or_404(Patient, pk=pk)
        serializer = PatientSerializer(patient, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        patient = get_object_or_404(Patient, pk=pk)
        patient.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class MedicalProfessionalListCreateAPIView(APIView):
    def get(self, request):
        professionals = MedicalProfessional.objects.all()
        serializer = MedicalProfessionalSerializer(professionals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MedicalProfessionalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MedicalProfessionalDetailAPIView(APIView):
    def get(self, request, pk):
        professional = get_object_or_404(MedicalProfessional, pk=pk)
        serializer = MedicalProfessionalSerializer(professional)
        return Response(serializer.data)

    def put(self, request, pk):
        professional = get_object_or_404(MedicalProfessional, pk=pk)
        serializer = MedicalProfessionalSerializer(professional, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        professional = get_object_or_404(MedicalProfessional, pk=pk)
        professional.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)



class HospitalListCreateAPIView(APIView):
    def get(self, request):
        hospitals = Hospital.objects.all()
        serializer = HospitalSerializer(hospitals, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = HospitalSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HospitalDetailAPIView(APIView):
    def get(self, request, pk):
        hospital = get_object_or_404(Hospital, pk=pk)
        serializer = HospitalSerializer(hospital)
        return Response(serializer.data)

    def put(self, request, pk):
        hospital = get_object_or_404(Hospital, pk=pk)
        serializer = HospitalSerializer(hospital, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        hospital = get_object_or_404(Hospital, pk=pk)
        hospital.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
