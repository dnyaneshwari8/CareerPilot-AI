"""Gemini LLM client with JSON parsing and mock fallback."""

import json
import re
from typing import Any

from django.conf import settings


class LLMError(Exception):
    pass


def _extract_json(raw: str) -> dict[str, Any]:
    """Parse JSON from LLM response, handling markdown fences."""
    text = raw.strip()
    fence = re.search(r'```(?:json)?\s*([\s\S]*?)```', text)
    if fence:
        text = fence.group(1).strip()
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        start = text.find('{')
        end = text.rfind('}')
        if start != -1 and end != -1:
            return json.loads(text[start : end + 1])
        raise LLMError('LLM did not return valid JSON') from None


def call_llm(prompt: str, system: str = 'You are a helpful assistant that returns only valid JSON.') -> dict[str, Any]:
    """
    Call the configured LLM and return parsed JSON.
    Falls back to mock data when AI_MOCK_MODE=True or no API key.
    """
    if getattr(settings, 'AI_MOCK_MODE', False) or not getattr(settings, 'GEMINI_API_KEY', ''):
        return _mock_response(prompt)

    try:
        import google.generativeai as genai
    except ImportError as exc:
        raise LLMError('Install Gemini SDK: pip install google-generativeai') from exc

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name=getattr(settings, 'GEMINI_MODEL', 'gemini-1.5-flash'),
        system_instruction=system,
    )
    response = model.generate_content(
        prompt,
        generation_config={
            'temperature': 0.2,
            'response_mime_type': 'application/json',
        },
    )
    content = response.text or '{}'
    return _extract_json(content)


def _mock_response(prompt: str) -> dict[str, Any]:
    """Deterministic demo data when no API key is configured."""
    if 'hr resume parser' in prompt.lower():
        return {
            'name': 'Demo User',
            'email': 'demo@example.com',
            'phone': None,
            'skills': ['JavaScript', 'React', 'Python', 'Django', 'REST API'],
            'education': [{'degree': 'B.Tech Computer Science', 'institution': 'Demo University', 'year': '2024'}],
            'experience': [{'title': 'Software Developer Intern', 'company': 'Tech Corp', 'duration': '6 months'}],
            'projects': [{'name': 'CareerPilot AI', 'description': 'Full-stack resume platform'}],
        }
    if 'ats_score' in prompt.lower() or 'ats resume evaluator' in prompt.lower():
        return {
            'ats_score': 72,
            'strengths': ['Good React knowledge', 'Basic backend understanding'],
            'weaknesses': ['No DevOps knowledge', 'Limited system design exposure'],
            'missing_skills': ['Docker', 'AWS', 'CI/CD'],
            'recommendations': [
                'Build full-stack project with deployment',
                'Learn cloud basics',
                'Improve backend architecture knowledge',
            ],
            'job_role_suitability': ['Frontend Developer', 'Junior Full Stack Developer'],
        }
    return {
        'target_role': 'Full Stack Developer',
        'current_skills': ['JavaScript', 'React', 'Python', 'Django'],
        'required_skills': ['React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'CI/CD'],
        'missing_skills': ['Docker', 'CI/CD', 'System Design'],
        'skill_gap_percentage': 35,
        'learning_path': [
            'Learn Docker basics',
            'Build REST API project',
            'Deploy project on cloud',
            'Learn CI/CD pipelines',
        ],
    }
