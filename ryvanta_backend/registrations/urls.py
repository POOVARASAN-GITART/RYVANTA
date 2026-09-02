from django.urls import path
from .views import (
    api_register_endpoint,
    RegistrationListCreateAPIView,
    RegistrationStatsAPIView,
    ExportRegistrationsCsvAPIView,
)

urlpatterns = [
    path('register/', api_register_endpoint, name='api-register-direct'),
    path('registrations/', RegistrationListCreateAPIView.as_view(), name='registration-list-create'),
    path('registrations/stats/', RegistrationStatsAPIView.as_view(), name='registration-stats'),
    path('registrations/export/', ExportRegistrationsCsvAPIView.as_view(), name='registration-export-csv'),
]
