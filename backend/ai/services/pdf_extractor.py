"""Extract plain text from PDF resume files."""

from pypdf import PdfReader


def extract_text_from_pdf(file_path: str) -> str:
    """Read a PDF file and return concatenated page text."""
    reader = PdfReader(file_path)
    parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            parts.append(text.strip())
    return '\n\n'.join(parts).strip()
