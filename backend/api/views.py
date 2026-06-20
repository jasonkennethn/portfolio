from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.conf import settings
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from .models import (
    Profile, Skill, Project, Experience, Education,
    Certification, Achievement, SiteConfig, SectionConfig, QuickStat
)
from .serializers import (
    ProfileSerializer, SkillSerializer, ProjectSerializer,
    ExperienceSerializer, EducationSerializer, CertificationSerializer,
    AchievementSerializer, SiteConfigSerializer, SectionConfigSerializer,
    QuickStatSerializer
)
from .ai_service import AIService


class CloudinaryCleanupMixin:
    """Mixin to delete old Cloudinary files when images are replaced, cleared, or instances deleted."""
    # Subclasses should set this to the list of ImageField/FileField names on their model
    file_fields = []

    def perform_update(self, serializer):
        instance = self.get_object()
        for field_name in self.file_fields:
            old_file = getattr(instance, field_name, None)
            new_file = self.request.FILES.get(field_name)
            # Case 1: A new file is uploaded to replace the old one
            if new_file and old_file and hasattr(old_file, 'name') and old_file.name:
                try:
                    old_file.delete(save=False)
                except Exception:
                    pass  # Silently continue if deletion fails
            # Case 2: The field is explicitly cleared
            elif field_name in self.request.data:
                val = self.request.data.get(field_name)
                if val in (None, '', 'null', 'None') and old_file and hasattr(old_file, 'name') and old_file.name:
                    try:
                        old_file.delete(save=False)
                    except Exception:
                        pass
        serializer.save()

    def perform_destroy(self, instance):
        for field_name in self.file_fields:
            old_file = getattr(instance, field_name, None)
            if old_file and hasattr(old_file, 'name') and old_file.name:
                try:
                    old_file.delete(save=False)
                except Exception:
                    pass
        instance.delete()


class ProfileViewSet(CloudinaryCleanupMixin, viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    file_fields = ['profile_picture', 'resume_file']


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer


class ProjectViewSet(CloudinaryCleanupMixin, viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    file_fields = ['image']


class ExperienceViewSet(CloudinaryCleanupMixin, viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    file_fields = ['company_logo']


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer


class CertificationViewSet(CloudinaryCleanupMixin, viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    file_fields = ['image']


class AchievementViewSet(viewsets.ModelViewSet):
    queryset = Achievement.objects.all()
    serializer_class = AchievementSerializer


class SiteConfigViewSet(viewsets.ModelViewSet):
    queryset = SiteConfig.objects.all()
    serializer_class = SiteConfigSerializer

    def list(self, request):
        config, created = SiteConfig.objects.get_or_create(pk=1)
        serializer = self.get_serializer(config)
        return Response(serializer.data)


class SectionConfigViewSet(viewsets.ModelViewSet):
    queryset = SectionConfig.objects.all()
    serializer_class = SectionConfigSerializer


class QuickStatViewSet(viewsets.ModelViewSet):
    queryset = QuickStat.objects.all()
    serializer_class = QuickStatSerializer


@api_view(['GET'])
def portfolio_data(request):
    """Get all portfolio data in a single request for the frontend."""
    profile = Profile.objects.first()
    config, _ = SiteConfig.objects.get_or_create(pk=1)
    context = {'request': request}

    data = {
        'profile': ProfileSerializer(profile, context=context).data if profile else {},
        'skills': SkillSerializer(Skill.objects.all(), many=True, context=context).data,
        'projects': ProjectSerializer(Project.objects.all(), many=True, context=context).data,
        'experiences': ExperienceSerializer(Experience.objects.all(), many=True, context=context).data,
        'education': EducationSerializer(Education.objects.all(), many=True, context=context).data,
        'certifications': CertificationSerializer(Certification.objects.all(), many=True, context=context).data,
        'achievements': AchievementSerializer(Achievement.objects.all(), many=True, context=context).data,
        'config': SiteConfigSerializer(config, context=context).data,
        'sections': SectionConfigSerializer(SectionConfig.objects.all(), many=True, context=context).data,
        'stats': QuickStatSerializer(QuickStat.objects.all(), many=True, context=context).data,
    }
    return Response(data)


@api_view(['POST'])
def ai_recommendations(request):
    """Get AI-powered portfolio recommendations."""
    try:
        ai = AIService()
        profile = Profile.objects.first()
        context = {'request': request}
        profile_data = {
            'profile': ProfileSerializer(profile, context=context).data if profile else {},
            'skills': SkillSerializer(Skill.objects.all(), many=True, context=context).data,
            'projects': ProjectSerializer(Project.objects.all(), many=True, context=context).data,
            'experiences': ExperienceSerializer(Experience.objects.all(), many=True, context=context).data,
            'certifications': CertificationSerializer(Certification.objects.all(), many=True, context=context).data,
        }
        result = ai.get_portfolio_recommendations(profile_data)
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def ai_enhance_text(request):
    """Enhance a text description using AI."""
    text = request.data.get('text', '')
    context = request.data.get('context', 'project')
    if not text:
        return Response({'error': 'No text provided'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        ai = AIService()
        enhanced = ai.enhance_description(text, context)
        return Response({'original': text, 'enhanced': enhanced})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def ai_skills_analysis(request):
    """Analyze skills and suggest improvements."""
    target_role = request.data.get('target_role', 'Software Development Engineer')
    try:
        ai = AIService()
        skills = list(Skill.objects.values_list('name', flat=True))
        result = ai.generate_skills_analysis(skills, target_role)
        return Response(result)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def ai_project_description(request):
    """Generate a project description from bullet points."""
    project_name = request.data.get('project_name', '')
    technologies = request.data.get('technologies', [])
    bullet_points = request.data.get('bullet_points', [])
    try:
        ai = AIService()
        description = ai.generate_project_description(project_name, technologies, bullet_points)
        return Response({'description': description})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def update_section_order(request):
    """Update the order of sections."""
    sections = request.data.get('sections', [])
    for idx, section_data in enumerate(sections):
        try:
            section = SectionConfig.objects.get(key=section_data['key'])
            section.order = idx
            section.is_visible = section_data.get('is_visible', True)
            section.save()
        except SectionConfig.DoesNotExist:
            pass
    return Response({'status': 'success'})


@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def upload_media(request):
    """Save an uploaded file and return its absolute URL."""
    file_obj = request.FILES.get('file')
    if not file_obj:
        return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
    
    path = default_storage.save(f'custom/{file_obj.name}', ContentFile(file_obj.read()))
    media_url = request.build_absolute_uri(settings.MEDIA_URL + path)
    return Response({'url': media_url})
