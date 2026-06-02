from django.contrib import admin

from .models import SkillGapAnalysis


@admin.register(SkillGapAnalysis)
class SkillGapAnalysisAdmin(admin.ModelAdmin):
    list_display = ('target_role', 'user', 'resume', 'created_at')
    list_filter = ('target_role',)
