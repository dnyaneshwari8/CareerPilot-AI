from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ai.models import SkillGapAnalysis
from ai.prompts import ROLE_REQUIRED_SKILLS
from ai.serializers import SkillGapAnalysisSerializer, SkillGapRequestSerializer
from ai.services.llm_client import LLMError
from ai.services.pipeline import analyze_resume, analyze_skill_gap, parse_resume
from resumes.models import Resume
from resumes.serializers import ResumeListSerializer


def _get_user_resume(request, pk):
    try:
        return Resume.objects.get(pk=pk, user=request.user)
    except Resume.DoesNotExist:
        return None


class ResumeParseView(APIView):
    """POST /api/ai/resumes/<id>/parse/ — Extract structured data from resume."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        resume = _get_user_resume(request, pk)
        if not resume:
            return Response({'detail': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            data = parse_resume(resume)
            return Response({'parsed_data': data, 'resume': ResumeListSerializer(resume, context={'request': request}).data})
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except LLMError as e:
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class ResumeAnalyzeView(APIView):
    """POST /api/ai/resumes/<id>/analyze/ — ATS score and career feedback."""

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        resume = _get_user_resume(request, pk)
        if not resume:
            return Response({'detail': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)
        try:
            data = analyze_resume(resume)
            return Response({'analysis': data, 'resume': ResumeListSerializer(resume, context={'request': request}).data})
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except LLMError as e:
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class ResumeAIStatusView(APIView):
    """GET /api/ai/resumes/<id>/ — Cached parse + analysis results."""

    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        resume = _get_user_resume(request, pk)
        if not resume:
            return Response({'detail': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)
        gaps = SkillGapAnalysis.objects.filter(resume=resume, user=request.user)
        return Response({
            'resume': ResumeListSerializer(resume, context={'request': request}).data,
            'parsed_data': resume.parsed_data,
            'analysis': resume.analysis_data,
            'skill_gaps': SkillGapAnalysisSerializer(gaps, many=True).data,
        })


class SkillGapView(APIView):
    """POST /api/ai/skill-gap/ — Compare skills vs target role."""

    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SkillGapRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        resume = _get_user_resume(request, serializer.validated_data['resume_id'])
        if not resume:
            return Response({'detail': 'Resume not found.'}, status=status.HTTP_404_NOT_FOUND)

        target_role = serializer.validated_data['target_role']
        try:
            result = analyze_skill_gap(resume, target_role)
            obj, _ = SkillGapAnalysis.objects.update_or_create(
                resume=resume,
                target_role=target_role,
                defaults={'user': request.user, 'result': result},
            )
            return Response(SkillGapAnalysisSerializer(obj).data, status=status.HTTP_200_OK)
        except ValueError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except LLMError as e:
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)


class CareerRolesView(APIView):
    """GET /api/ai/roles/ — Available target roles for skill gap."""

    permission_classes = [IsAuthenticated]

    def get(self, request):
        roles = [
            {'id': role, 'required_skills': skills}
            for role, skills in ROLE_REQUIRED_SKILLS.items()
        ]
        return Response({'roles': roles})
