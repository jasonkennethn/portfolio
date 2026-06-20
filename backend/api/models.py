from django.db import models
import json


class Profile(models.Model):
    """Main profile/personal information."""
    name = models.CharField(max_length=200)
    title = models.CharField(max_length=300, default='Software Development Engineer')
    subtitle = models.TextField(blank=True)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=200, blank=True)
    portfolio_url = models.URLField(blank=True)
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    twitter_url = models.URLField(blank=True)
    profile_picture = models.ImageField(upload_to='profile/', blank=True, null=True)
    show_profile_picture = models.BooleanField(default=False)
    availability_status = models.CharField(max_length=200, default='Available for Opportunities')
    resume_file = models.FileField(upload_to='resume/', blank=True, null=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    """Technical skills."""
    CATEGORY_CHOICES = [
        ('language', 'Programming Languages'),
        ('framework', 'Frameworks'),
        ('database', 'Databases'),
        ('tool', 'Tools'),
        ('concept', 'Concepts'),
    ]
    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    proficiency = models.IntegerField(default=80)  # 0-100
    icon = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', 'category', 'name']

    def __str__(self):
        return f"{self.name} ({self.category})"


class Project(models.Model):
    """Portfolio projects."""
    CATEGORY_CHOICES = [
        ('frontend', 'Frontend'),
        ('backend', 'Backend'),
        ('fullstack', 'Full Stack'),
        ('system_design', 'System Design'),
        ('ai_ml', 'AI/ML'),
    ]
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    technologies = models.JSONField(default=list)  # ["Python", "Django", ...]
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    image = models.ImageField(upload_to='projects/', blank=True, null=True)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class Experience(models.Model):
    """Work experience entries."""
    company = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    department = models.CharField(max_length=200, blank=True)
    start_date = models.CharField(max_length=50)
    end_date = models.CharField(max_length=50, default='Present')
    description = models.TextField()
    highlights = models.JSONField(default=list)  # ["bullet1", "bullet2", ...]
    technologies = models.JSONField(default=list)
    company_logo = models.ImageField(upload_to='companies/', blank=True, null=True)
    is_current = models.BooleanField(default=False)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order', '-is_current']

    def __str__(self):
        return f"{self.role} at {self.company}"


class Education(models.Model):
    """Education entries."""
    institution = models.CharField(max_length=200)
    degree = models.CharField(max_length=200)
    field = models.CharField(max_length=200, blank=True)
    start_year = models.CharField(max_length=10)
    end_year = models.CharField(max_length=10)
    grade = models.CharField(max_length=50, blank=True)
    grade_type = models.CharField(max_length=20, default='CGPA')  # CGPA or Percentage
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.degree} - {self.institution}"


class Certification(models.Model):
    """Professional certifications."""
    name = models.CharField(max_length=200)
    issuer = models.CharField(max_length=200)
    issued_date = models.CharField(max_length=100, blank=True)
    credential_url = models.URLField(blank=True)
    icon = models.CharField(max_length=50, default='verified')
    image = models.ImageField(upload_to='certifications/', blank=True, null=True)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.name


class Achievement(models.Model):
    """Achievements and awards."""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    event = models.CharField(max_length=200, blank=True)
    icon = models.CharField(max_length=50, default='emoji_events')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class SiteConfig(models.Model):
    """Portfolio site configuration for customizer."""
    theme = models.CharField(max_length=20, default='light')  # light or dark
    primary_color = models.CharField(max_length=10, default='#494BD6')
    enable_glassmorphism = models.BooleanField(default=True)
    enable_animated_bg = models.BooleanField(default=False)
    code_theme = models.CharField(max_length=50, default='obsidian_light')
    section_order = models.JSONField(default=list)
    section_visibility = models.JSONField(default=dict)

    def __str__(self):
        return f"Site Config ({self.theme})"


class SectionConfig(models.Model):
    """Individual section configuration."""
    key = models.CharField(max_length=50, unique=True)
    label = models.CharField(max_length=100)
    description = models.CharField(max_length=300, blank=True)
    is_visible = models.BooleanField(default=True)
    is_mandatory = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    icon = models.CharField(max_length=50, default='layers')
    content = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.label


class QuickStat(models.Model):
    """Stats bar entries."""
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=50)
    icon = models.CharField(max_length=50, blank=True)
    color = models.CharField(max_length=20, default='primary')
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.label}: {self.value}"
