from django.contrib import admin

from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('original_filename', 'user', 'file_size', 'uploaded_at')
    list_filter = ('uploaded_at',)
    search_fields = ('original_filename', 'user__email')
