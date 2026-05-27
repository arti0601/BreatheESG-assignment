from django.urls import path

from .views import (
    get_records,
    upload_sap_csv,
    approve_record
)

urlpatterns = [
    path('records/', get_records),
    path('upload/sap/', upload_sap_csv),
    path('approve/<int:pk>/', approve_record),
]