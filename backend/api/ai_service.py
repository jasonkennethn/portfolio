"""
Gemini AI Service for portfolio recommendations and content enhancement.
"""

from google import genai
from django.conf import settings
import json
import logging

logger = logging.getLogger(__name__)


class AIService:
    """Service for AI-powered portfolio features using Google Gemini."""

    def __init__(self):
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
        self.model = 'gemini-2.5-flash'

    def get_portfolio_recommendations(self, profile_data):
        """Generate recommendations to improve the portfolio."""
        prompt = f"""
        You are a senior technical recruiter at a top MNC (Google, Microsoft, Amazon).
        Analyze this portfolio and provide 5 specific, actionable recommendations to make it
        more impressive and recruiter-friendly.

        Portfolio Data:
        {json.dumps(profile_data, indent=2, default=str)}

        Respond in JSON format with this structure:
        {{
            "recommendations": [
                {{
                    "title": "Short title",
                    "description": "Detailed recommendation",
                    "priority": "high/medium/low",
                    "category": "content/design/skills/projects"
                }}
            ],
            "overall_score": 85,
            "strengths": ["strength1", "strength2"],
            "areas_to_improve": ["area1", "area2"]
        }}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            logger.error(f"AI recommendation error: {e}")
            return {
                "recommendations": [],
                "overall_score": 0,
                "strengths": [],
                "areas_to_improve": [],
                "error": str(e)
            }

    def enhance_description(self, text, context='project'):
        """Enhance a description to be more impactful."""
        prompt = f"""
        You are an expert technical writer for top SDE portfolios.
        Rewrite this {context} description to be more impactful, quantifiable, and
        recruiter-friendly. Keep it concise (2-3 sentences max).

        Original: {text}

        Respond with ONLY the enhanced text, no quotes or explanations.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"AI enhance error: {e}")
            return text

    def generate_skills_analysis(self, skills, target_role='Software Development Engineer'):
        """Analyze skills and suggest improvements."""
        prompt = f"""
        You are a career advisor specializing in software engineering careers at top MNCs.
        
        Current Skills: {json.dumps(skills)}
        Target Role: {target_role}

        Analyze the skills and provide recommendations in JSON:
        {{
            "missing_skills": ["skill1", "skill2"],
            "trending_skills": ["skill1", "skill2"],
            "skill_score": 75,
            "advice": "Brief career advice paragraph"
        }}
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
            text = response.text.strip()
            if text.startswith('```json'):
                text = text[7:]
            if text.startswith('```'):
                text = text[3:]
            if text.endswith('```'):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            logger.error(f"AI skills analysis error: {e}")
            return {"error": str(e)}

    def generate_project_description(self, project_name, technologies, bullet_points):
        """Generate a compelling project description from bullet points."""
        prompt = f"""
        You are a senior SDE writing about their project for a top-tier portfolio.
        Generate a compelling, professional project description.

        Project: {project_name}
        Technologies: {', '.join(technologies)}
        Key Points: {', '.join(bullet_points)}

        Write a 2-3 sentence professional description that highlights technical depth
        and impact. Respond with ONLY the description text.
        """
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
            )
            return response.text.strip()
        except Exception as e:
            logger.error(f"AI project description error: {e}")
            return ""
