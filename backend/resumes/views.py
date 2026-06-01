from django.http import FileResponse
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Resume
from .serializers import ResumeListSerializer, ResumeSerializer


class ResumeUploadView(generics.CreateAPIView):
    """POST /api/resumes/upload/ — Upload a PDF resume."""

    serializer_class = ResumeSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume = serializer.save()
        return Response(
            ResumeListSerializer(resume, context={'request': request}).data,
            status=status.HTTP_201_CREATED,
        )


class ResumeListView(generics.ListAPIView):
    """GET /api/resumes/ — List user's resumes."""

    serializer_class = ResumeListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


class ResumeDetailView(generics.RetrieveDestroyAPIView):
    """GET/DELETE /api/resumes/<id>/ — View or delete a resume."""

    serializer_class = ResumeListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Resume.objects.filter(user=self.request.user)


class ResumeDownloadView(APIView):
    """GET /api/resumes/<id>/download/ — Download resume file."""

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            resume = Resume.objects.get(pk=pk, user=request.user)
        except Resume.DoesNotExist:
            return Response({'detail': 'Not found.'}, status=status.HTTP_404_NOT_FOUND)

        response = FileResponse(
            resume.file.open('rb'),
            as_attachment=True,
            filename=resume.original_filename,
        )
        response['Content-Type'] = 'application/pdf'
        return response


class ResumeStatsView(APIView):
    """GET /api/resumes/stats/ — Dashboard statistics."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        resumes = Resume.objects.filter(user=request.user)
        latest = resumes.first()
        return Response({
            'total_uploads': resumes.count(),
            'latest_resume': ResumeListSerializer(latest, context={'request': request}).data if latest else None,
            'account_status': 'active' if request.user.is_active else 'inactive',
        })
