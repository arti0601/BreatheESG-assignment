import pandas as pd

from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import (
    Organization,
    DataSource,
    RawRecord,
    NormalizedRecord
)

from .serializers import NormalizedRecordSerializer


@api_view(['GET'])
def get_records(request):

    records = NormalizedRecord.objects.all().order_by('-created_at')

    serializer = NormalizedRecordSerializer(records, many=True)

    return Response(serializer.data)


@api_view(['POST'])
def upload_sap_csv(request):

    file = request.FILES['file']

    df = pd.read_csv(file)

    org, _ = Organization.objects.get_or_create(
        name='Demo Company'
    )

    source = DataSource.objects.create(
        organization=org,
        source_type='sap'
    )

    for _, row in df.iterrows():

        raw = row.to_dict()

        RawRecord.objects.create(
            data_source=source,
            raw_data=raw
        )

        quantity = float(row['Quantity'])

        suspicious = quantity > 1000

        co2e = quantity * 2.68

        NormalizedRecord.objects.create(
            organization=org,
            source_type='sap',
            category=row['FuelType'],
            quantity=quantity,
            unit=row['Unit'],
            co2e=co2e,
            suspicious=suspicious
        )

    return Response({
        'message': 'SAP CSV uploaded successfully'
    })


@api_view(['POST'])
def approve_record(request, pk):

    record = NormalizedRecord.objects.get(id=pk)

    if record.status == 'approved':
        record.status = 'pending'
    else:
        record.status = 'approved'

    record.save()

    return Response({
        'message': 'Status updated'
    })