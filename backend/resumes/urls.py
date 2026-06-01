from django.urls import path

from .views import (
    ResumeDetailView,
    ResumeDownloadView,
    ResumeListView,
    ResumeStatsView,
    ResumeUploadView,
)

urlpatterns = [
    path('', ResumeListView.as_view(), name='resume-list'),
    path('upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('stats/', ResumeStatsView.as_view(), name='resume-stats'),
    path('<int:pk>/', ResumeDetailView.as_view(), name='resume-detail'),
    path('<int:pk>/download/', ResumeDownloadView.as_view(), name='resume-download'),
]
