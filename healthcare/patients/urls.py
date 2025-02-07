from django.urls import path
from .views import (
    PatientListCreateAPIView, PatientDetailAPIView,
    MedicalProfessionalListCreateAPIView, MedicalProfessionalDetailAPIView,
    HospitalListCreateAPIView, HospitalDetailAPIView
)

urlpatterns = [
    path('patients/', PatientListCreateAPIView.as_view(), name='patient-list'),
    path('patients/<int:pk>/', PatientDetailAPIView.as_view(), name='patient-detail'),

    path('medical-professionals/', MedicalProfessionalListCreateAPIView.as_view(), name='medical-professional-list'),
    path('medical-professionals/<int:pk>/', MedicalProfessionalDetailAPIView.as_view(), name='medical-professional-detail'),

    path('hospitals/', HospitalListCreateAPIView.as_view(), name='hospital-list'),
    path('hospitals/<int:pk>/', HospitalDetailAPIView.as_view(), name='hospital-detail'),
]
