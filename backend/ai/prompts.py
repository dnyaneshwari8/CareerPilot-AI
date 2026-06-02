"""LLM prompt templates for CareerPilot AI."""

RESUME_PARSE_PROMPT = """You are an expert HR resume parser.

Extract structured information from the resume text below.

Return ONLY valid JSON.

Rules:
- Do not add explanations
- If a field is missing, use null
- Keep skills as an array of strings
- Normalize skills (e.g., "JS" → "JavaScript")

Extract the following:

{{
  "name": "",
  "email": "",
  "phone": "",
  "skills": [],
  "education": [],
  "experience": [],
  "projects": []
}}

Resume Text:
----------------
{resume_text}
----------------"""

RESUME_ANALYSIS_PROMPT = """You are an expert AI career coach and ATS resume evaluator.

Analyze the resume below and provide structured feedback.

Return response in STRICT JSON format only.

OUTPUT FORMAT:

{{
  "ats_score": number (0-100),
  "strengths": [],
  "weaknesses": [],
  "missing_skills": [],
  "recommendations": [],
  "job_role_suitability": []
}}

RULES:
- Be strict like a real ATS system
- Compare resume with industry standards
- Focus on modern tech skills
- Do NOT include explanations outside JSON

SCORING RULE:
- 90-100: Excellent (FAANG level ready)
- 70-89: Good
- 50-69: Average
- below 50: Weak

Resume Text:
----------------
{resume_text}
----------------"""

SKILL_GAP_PROMPT = """You are an expert career advisor and software industry mentor.

Your task is to compare a candidate's current skills with the required skills for a target job role.

Return ONLY JSON.

OUTPUT FORMAT:

{{
  "target_role": "",
  "current_skills": [],
  "required_skills": [],
  "missing_skills": [],
  "skill_gap_percentage": number,
  "learning_path": []
}}

RULES:
- Keep learning path step-by-step (beginner → advanced)
- Focus on real industry requirements (2025 standards)
- Be realistic and practical

TARGET ROLE:
{target_role}

CANDIDATE SKILLS:
{skills}

REQUIRED SKILLS FOR ROLE:
- Backend Developer: Python, Django, REST API, Docker, AWS, Redis, SQL
- Full Stack Developer: React, Node.js, Express, MongoDB, Docker, CI/CD
- ML Engineer: Python, ML, Deep Learning, Pandas, NumPy, TensorFlow, PyTorch, Statistics
- Frontend Developer: React, TypeScript, CSS, HTML, JavaScript, Redux, Testing, Performance
- DevOps Engineer: Docker, Kubernetes, AWS, CI/CD, Terraform, Linux, Monitoring

Analyze and respond."""

ROLE_REQUIRED_SKILLS = {
    'Backend Developer': [
        'Python', 'Django', 'REST API', 'Docker', 'AWS', 'Redis', 'SQL',
    ],
    'Full Stack Developer': [
        'React', 'Node.js', 'Express', 'MongoDB', 'Docker', 'CI/CD',
    ],
    'ML Engineer': [
        'Python', 'Machine Learning', 'Deep Learning', 'Pandas', 'NumPy',
        'TensorFlow', 'PyTorch', 'Statistics',
    ],
    'Frontend Developer': [
        'React', 'TypeScript', 'CSS', 'HTML', 'JavaScript', 'Redux', 'Testing',
    ],
    'DevOps Engineer': [
        'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux', 'Monitoring',
    ],
}
