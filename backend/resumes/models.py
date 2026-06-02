import os
import uuid

from django.conf import settings
from django.db import models

from accounts.models import User


def resume_upload_path(instance, filename):
    """Store resumes per user: resumes/{user_id}/{uuid}.pdf"""
    ext = os.path.splitext(filename)[1].lower()
    safe_name = f'{uuid.uuid4().hex}{ext}'
    return f'resumes/{instance.user_id}/{safe_name}'


class Resume(models.Model):
    """
    User resume storage.
    Future: ATS score, parsed skills, analysis JSON, version history.
    """

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to=resume_upload_path)
    original_filename = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    # AI processing (Phase 2)
    extracted_text = models.TextField(blank=True)
    parsed_data = models.JSONField(null=True, blank=True)
    analysis_data = models.JSONField(null=True, blank=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f'{self.original_filename} ({self.user.email})'

    def save(self, *args, **kwargs):
        if self.file and not self.file_size:
            self.file_size = self.file.size
        if self.file and not self.original_filename:
            self.original_filename = os.path.basename(self.file.name)
        super().save(*args, **kwargs)

    @property
    def file_size_display(self):
        size = self.file_size
        for unit in ('B', 'KB', 'MB'):
            if size < 1024:
                return f'{size:.1f} {unit}' if unit != 'B' else f'{size} {unit}'
            size /= 1024
        return f'{size:.1f} GB'
