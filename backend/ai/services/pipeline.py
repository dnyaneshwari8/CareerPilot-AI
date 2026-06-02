"""Orchestrate PDF extraction → LLM prompts → structured results."""

from ai.prompts import (
    RESUME_ANALYSIS_PROMPT,
    RESUME_PARSE_PROMPT,
    ROLE_REQUIRED_SKILLS,
    SKILL_GAP_PROMPT,
)
from ai.services.llm_client import LLMError, call_llm
from ai.services.pdf_extractor import extract_text_from_pdf


def get_resume_text(resume) -> str:
    """Return cached extracted text or extract from PDF."""
    if resume.extracted_text:
        return resume.extracted_text
    if not resume.file:
        raise ValueError('Resume file not found')
    text = extract_text_from_pdf(resume.file.path)
    if not text or len(text) < 50:
        raise ValueError('Could not extract enough text from PDF. Ensure the PDF is text-based, not scanned images.')
    resume.extracted_text = text
    resume.save(update_fields=['extracted_text'])
    return text


def parse_resume(resume) -> dict:
    text = get_resume_text(resume)
    prompt = RESUME_PARSE_PROMPT.format(resume_text=text[:12000])
    result = call_llm(prompt)
    resume.parsed_data = result
    resume.save(update_fields=['parsed_data', 'extracted_text'])
    return result


def analyze_resume(resume) -> dict:
    text = get_resume_text(resume)
    prompt = RESUME_ANALYSIS_PROMPT.format(resume_text=text[:12000])
    result = call_llm(prompt)
    resume.analysis_data = result
    resume.save(update_fields=['analysis_data', 'extracted_text'])
    return result


def analyze_skill_gap(resume, target_role: str) -> dict:
    skills = []
    if resume.parsed_data and resume.parsed_data.get('skills'):
        skills = resume.parsed_data['skills']
    elif resume.extracted_text:
        parse_resume(resume)
        skills = resume.parsed_data.get('skills', []) if resume.parsed_data else []

    skills_str = ', '.join(skills) if skills else 'Not available — parse resume first'
    prompt = SKILL_GAP_PROMPT.format(
        target_role=target_role,
        skills=skills_str,
    )
    result = call_llm(prompt)
    result['target_role'] = target_role

    required = ROLE_REQUIRED_SKILLS.get(target_role, [])
    if required and not result.get('required_skills'):
        result['required_skills'] = required

    return result
