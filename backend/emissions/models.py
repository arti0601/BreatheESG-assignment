from django.db import models


class Organization(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class DataSource(models.Model):
    SOURCE_TYPES = [
        ('sap', 'SAP'),
        ('utility', 'Utility'),
        ('travel', 'Travel'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.source_type


class RawRecord(models.Model):
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE)
    raw_data = models.JSONField()
    status = models.CharField(max_length=50, default='pending')
    error_message = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"RawRecord {self.id}"


class NormalizedRecord(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('locked', 'Locked'),
    ]

    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)

    source_type = models.CharField(max_length=50)

    category = models.CharField(max_length=100)

    quantity = models.FloatField()

    unit = models.CharField(max_length=50)

    co2e = models.FloatField()

    suspicious = models.BooleanField(default=False)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.category


class AuditLog(models.Model):
    record = models.ForeignKey(NormalizedRecord, on_delete=models.CASCADE)

    action = models.CharField(max_length=100)

    timestamp = models.DateTimeField(auto_now_add=True)

    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.action