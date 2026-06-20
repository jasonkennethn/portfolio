import os
import django
import sys
from django.core.files.uploadedfile import SimpleUploadedFile

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_api.settings')
django.setup()

from api.models import Project

# Create a dummy image
dummy_image = SimpleUploadedFile(
    name='test_image.jpg',
    content=b'\x47\x49\x46\x38\x39\x61\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00\x21\xf9\x04\x01\x00\x00\x00\x00\x2c\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02\x4c\x01\x00\x3b',
    content_type='image/jpeg'
)

print("Starting Cloudinary upload test...")
p = None
try:
    p = Project.objects.create(
        title='Cloudinary Test',
        description='Testing cloudinary upload from PythonAnywhere',
        category='backend',
        technologies=[],
        image=dummy_image
    )
    print("---------------------------------")
    print("SUCCESS!")
    print("Uploaded Image URL:", p.image.url)
    print("---------------------------------")
except Exception as e:
    import traceback
    print("---------------------------------")
    print("UPLOAD FAILED!")
    traceback.print_exc()
    print("---------------------------------")
finally:
    if p and p.id:
        p.delete()
        print("Test project deleted from database.")
