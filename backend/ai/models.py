from django.db import models

from accounts.models import User
from resumes.models import Resume


class SkillGapAnalysis(models.Model):
    """Stored skill gap analysis for a resume + target role."""

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skill_gap_analyses')
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='skill_gap_analyses')
    target_role = models.CharField(max_length=128)
    result = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = [['resume', 'target_role']]

    def __str__(self):
        return f'{self.target_role} — {self.resume.original_filename}'
