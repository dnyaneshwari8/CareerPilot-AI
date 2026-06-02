from rest_framework import serializers

from ai.models import SkillGapAnalysis
from ai.prompts import ROLE_REQUIRED_SKILLS


class SkillGapRequestSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField()
    target_role = serializers.ChoiceField(choices=list(ROLE_REQUIRED_SKILLS.keys()))


class SkillGapAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillGapAnalysis
        fields = ('id', 'resume', 'target_role', 'result', 'created_at')
        read_only_fields = fields
