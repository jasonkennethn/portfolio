from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'profiles', views.ProfileViewSet)
router.register(r'skills', views.SkillViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'experiences', views.ExperienceViewSet)
router.register(r'education', views.EducationViewSet)
router.register(r'certifications', views.CertificationViewSet)
router.register(r'achievements', views.AchievementViewSet)
router.register(r'config', views.SiteConfigViewSet)
router.register(r'sections', views.SectionConfigViewSet)
router.register(r'stats', views.QuickStatViewSet)

urlpatterns = [
    path('sections/reorder/', views.update_section_order, name='section-reorder'),
    path('', include(router.urls)),
    path('portfolio/', views.portfolio_data, name='portfolio-data'),
    path('ai/recommendations/', views.ai_recommendations, name='ai-recommendations'),
    path('ai/enhance/', views.ai_enhance_text, name='ai-enhance'),
    path('ai/skills-analysis/', views.ai_skills_analysis, name='ai-skills-analysis'),
    path('ai/project-description/', views.ai_project_description, name='ai-project-description'),
    path('media/upload/', views.upload_media, name='media-upload'),
]
