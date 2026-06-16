"""
Management command to seed the database with Jason Kenneth N's resume data.
"""
from django.core.management.base import BaseCommand
from api.models import (
    Profile, Skill, Project, Experience, Education,
    Certification, Achievement, SiteConfig, SectionConfig, QuickStat
)


class Command(BaseCommand):
    help = 'Seed database with portfolio data from resume'

    def handle(self, *args, **options):
        self.stdout.write('Seeding database...')

        # Clear existing data
        Profile.objects.all().delete()
        Skill.objects.all().delete()
        Project.objects.all().delete()
        Experience.objects.all().delete()
        Education.objects.all().delete()
        Certification.objects.all().delete()
        Achievement.objects.all().delete()
        SiteConfig.objects.all().delete()
        SectionConfig.objects.all().delete()
        QuickStat.objects.all().delete()

        # Profile
        Profile.objects.create(
            name='Jason Kenneth N',
            title='Software Development Engineer',
            subtitle='Software Development Engineer specialized in clean, scalable backend architectures and API-driven systems.',
            email='jasonkennethn@gmail.com',
            phone='+91 6361975397',
            location='Bengaluru, Karnataka',
            portfolio_url='https://jasonkennethn.vercel.app',
            linkedin_url='https://linkedin.com/in/jason-kenneth-n',
            github_url='https://github.com/jasonkennethn',
            show_profile_picture=False,
            availability_status='Available',
        )

        # Skills - Languages
        languages = ['Python', 'Java', 'C', 'JavaScript', 'Kotlin', 'SQL']
        for i, lang in enumerate(languages):
            Skill.objects.create(name=lang, category='language', proficiency=85, order=i)

        # Skills - Frameworks
        frameworks = [
            ('Django', 90), ('FastAPI', 70), ('React', 75),
        ]
        for i, (name, prof) in enumerate(frameworks):
            Skill.objects.create(name=name, category='framework', proficiency=prof, order=i + 10)

        # Skills - Databases
        databases = ['MySQL', 'Oracle SQL', 'SQLite', 'PostgreSQL', 'MongoDB']
        for i, db in enumerate(databases):
            Skill.objects.create(name=db, category='database', proficiency=80, order=i + 20)

        # Skills - Tools
        tools = ['Git', 'GitHub', 'Linux', 'AWS', 'ServiceNow', 'PowerBI', 'Cursor', 'Google Antigravity']
        for i, tool in enumerate(tools):
            Skill.objects.create(name=tool, category='tool', proficiency=75, order=i + 30)

        # Skills - Concepts
        concepts = ['Data Structures & Algorithms', 'OOP', 'DBMS', 'Computer Networks', 'Software Engineering']
        for i, concept in enumerate(concepts):
            Skill.objects.create(name=concept, category='concept', proficiency=85, order=i + 40)

        # Projects
        Project.objects.create(
            title='RailTrace',
            description='Developed a real-time railway operations and analytics platform with automated tracking and data-driven monitoring, while troubleshooting complex system bottlenecks to improve operational efficiency.',
            category='fullstack',
            technologies=['Python', 'Django', 'SQL', 'REST API', 'Analytics'],
            github_url='https://github.com/jasonkennethn/RailTrace',
            featured=True,
            order=0,
        )
        Project.objects.create(
            title='MedFlare',
            description='Built an AI-powered healthcare management platform with intelligent workflow automation, patient record management, and clinical productivity features for doctors and hospitals.',
            category='fullstack',
            technologies=['Python', 'Django', 'AI/ML', 'REST API', 'PostgreSQL'],
            github_url='https://github.com/jasonkennethn/MediChain',
            featured=True,
            order=1,
        )
        Project.objects.create(
            title='CSFlow',
            description='Developed a corporate governance and compliance management platform for company secretarial operations, statutory filings, board management, compliance tracking, document management, and AI-assisted workflow automation.',
            category='fullstack',
            technologies=['Python', 'Django', 'AI', 'PostgreSQL', 'REST API'],
            github_url='https://github.com/jasonkennethn/CSFlow',
            featured=True,
            order=2,
        )

        # Experience
        Experience.objects.create(
            company='Raylog Industries Pvt Ltd',
            role='Software Development Intern',
            department='Engineering',
            start_date='Oct 2025',
            end_date='Present',
            description='Supporting deployment and maintenance of Django applications in production environments while developing optimized SQL queries.',
            highlights=[
                'Supported deployment and maintenance of Django applications in production environments.',
                'Developed and optimized SQL queries to improve data integrity and application performance.',
                'Engaged in collaborative development using Git and Agile practices while maintaining comprehensive technical documentation for backend service integration.',
                'Conducted thorough code reviews for team members to enforce engineering best practices, improve code reliability, and ensure adherence to scalable system design principles.',
            ],
            technologies=['Python', 'Django', 'SQL', 'Git', 'Agile'],
            is_current=True,
            order=0,
        )
        Experience.objects.create(
            company='Frookoon Pvt Ltd',
            role='Tech Intern',
            department='R&D',
            start_date='Dec 2025',
            end_date='Feb 2026',
            description='Contributed to website and mobile app R&D, UI/UX planning, and system architecture discussions.',
            highlights=[
                'Contributed to website and mobile app R&D, UI/UX planning, and system architecture discussions.',
                'Assisted in designing practical software workflows by analyzing product requirements, improving feature structure, and supporting technical decision-making.',
                'Demonstrated strong initiative and technical ownership by contributing across research, design, and architecture.',
            ],
            technologies=['UI/UX', 'System Architecture', 'R&D', 'Mobile App'],
            is_current=False,
            order=1,
        )

        # Education
        Education.objects.create(
            institution='Kishkinda University',
            degree='B.Tech',
            field='Computer Science and Engineering',
            start_year='2023',
            end_year='2027',
            grade='8.8',
            grade_type='CGPA',
            order=0,
        )
        Education.objects.create(
            institution='Nandi PU College',
            degree='Pre-University Course',
            field='Science',
            start_year='2021',
            end_year='2023',
            grade='73.8%',
            grade_type='Percentage',
            order=1,
        )

        # Certifications
        Certification.objects.create(
            name='Certified System Administrator (CSA)',
            issuer='ServiceNow',
            icon='workspace_premium',
            order=0,
        )
        Certification.objects.create(
            name='Certified Application Developer (CAD)',
            issuer='ServiceNow',
            icon='workspace_premium',
            order=1,
        )
        Certification.objects.create(
            name='IBM Data Engineering Professional Certificate',
            issuer='IBM, Coursera',
            icon='workspace_premium',
            order=2,
        )

        # Achievements
        Achievement.objects.create(
            title='SIH Internal Hackathon Winner',
            description='Developed a Railway Track Management System (RailTrace)',
            event='BITM, Ballari',
            icon='emoji_events',
            order=0,
        )
        Achievement.objects.create(
            title='E Summit 2025 – IIT Bombay',
            description='Participated in startup innovation workshops and networking sessions',
            event='IIT Bombay',
            icon='groups',
            order=1,
        )
        Achievement.objects.create(
            title='Top 15 – Google Developer Group',
            description='Top 15 at GDG Hubli (KLE) and GDG Bengaluru (Cambridge Institute)',
            event='Google Developer Group',
            icon='star',
            order=2,
        )

        # Site Config
        SiteConfig.objects.create(
            theme='light',
            primary_color='#494BD6',
            enable_glassmorphism=True,
            enable_animated_bg=False,
            code_theme='obsidian_light',
            section_order=[
                'hero', 'projects', 'experience', 'education',
                'certifications', 'achievements'
            ],
            section_visibility={
                'hero': True, 'projects': True, 'experience': True,
                'education': True, 'certifications': True,
                'achievements': True,
            },
        )

        # Section Configs
        sections = [
            ('hero', 'Hero Header', 'Primary intro, headline, and CTA buttons.', True, 'person'),
            ('projects', 'Featured Projects', 'Showcase of engineering projects.', False, 'folder'),
            ('experience', 'Work Timeline', 'Professional experience with timeline.', False, 'work'),
            ('education', 'Education', 'Academic background and qualifications.', False, 'school'),
            ('certifications', 'Certifications', 'Professional certifications and credentials.', False, 'verified'),
            ('achievements', 'Achievements', 'Awards, hackathons, and recognition.', False, 'emoji_events'),
        ]
        for i, (key, label, desc, mandatory, icon) in enumerate(sections):
            SectionConfig.objects.create(
                key=key, label=label, description=desc,
                is_mandatory=mandatory, order=i, icon=icon
            )

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
