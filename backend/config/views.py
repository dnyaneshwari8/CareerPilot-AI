from django.http import JsonResponse


def api_root(request):
    """Root endpoint — confirms the API is running and lists main routes."""
    return JsonResponse({
        'name': 'CareerPilot AI API',
        'version': '1.0',
        'status': 'running',
        'endpoints': {
            'admin': '/admin/',
            'auth': '/api/auth/',
            'resumes': '/api/resumes/',
            'ai': '/api/ai/',
        },
        'frontend': 'http://localhost:5173',
        'docs': 'See README.md for full API reference.',
    })
