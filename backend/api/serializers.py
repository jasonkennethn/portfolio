from rest_framework import serializers
from .models import (
    Profile, Skill, Project, Experience, Education,
    Certification, Achievement, SiteConfig, SectionConfig, QuickStat
)


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'


class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Experience
        fields = '__all__'


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class CertificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certification
        fields = '__all__'


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = '__all__'


class SiteConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteConfig
        fields = '__all__'


class SectionConfigSerializer(serializers.ModelSerializer):
    class Meta:
        model = SectionConfig
        fields = '__all__'


class QuickStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuickStat
        fields = '__all__'
