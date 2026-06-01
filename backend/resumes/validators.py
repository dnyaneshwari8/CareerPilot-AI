import os

from django.conf import settings
from django.core.exceptions import ValidationError


def validate_resume_file(file):
    """Ensure uploaded file is PDF and within size limit."""
    ext = os.path.splitext(file.name)[1].lower()
    allowed = getattr(settings, 'ALLOWED_RESUME_EXTENSIONS', ['.pdf'])
    if ext not in allowed:
        raise ValidationError('Only PDF files are allowed.')

    max_mb = getattr(settings, 'MAX_RESUME_SIZE_MB', 10)
    max_bytes = max_mb * 1024 * 1024
    if file.size > max_bytes:
        raise ValidationError(f'File size must not exceed {max_mb} MB.')

    # Basic PDF magic bytes check
    file.seek(0)
    header = file.read(5)
    file.seek(0)
    if not header.startswith(b'%PDF'):
        raise ValidationError('Invalid PDF file.')
