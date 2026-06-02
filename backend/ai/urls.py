from django.urls import path

from .views import CareerRolesView, ResumeAIStatusView, ResumeAnalyzeView, ResumeParseView, SkillGapView

urlpatterns = [
    path('roles/', CareerRolesView.as_view(), name='career-roles'),
    path('skill-gap/', SkillGapView.as_view(), name='skill-gap'),
    path('resumes/<int:pk>/', ResumeAIStatusView.as_view(), name='resume-ai-status'),
    path('resumes/<int:pk>/parse/', ResumeParseView.as_view(), name='resume-parse'),
    path('resumes/<int:pk>/analyze/', ResumeAnalyzeView.as_view(), name='resume-analyze'),
]
