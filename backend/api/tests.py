from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.storage import default_storage
from rest_framework import status
from rest_framework.test import APIClient
from api.models import Project

@override_settings(DEFAULT_FILE_STORAGE='django.core.files.storage.FileSystemStorage')
class ImageCleanupTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.test_files = []

    def tearDown(self):
        # Delete any files we created in storage
        for file_name in self.test_files:
            if default_storage.exists(file_name):
                default_storage.delete(file_name)

    def test_delete_project_removes_image(self):
        # Create a project with a mock image file
        image_content = b'fake image data'
        image_file = SimpleUploadedFile("test_project_image.jpg", image_content, content_type="image/jpeg")
        
        project = Project.objects.create(
            title="Test Project",
            description="Testing deletion",
            category="backend",
            image=image_file
        )
        
        image_path = project.image.name
        self.test_files.append(image_path)
        self.assertTrue(default_storage.exists(image_path))

        # Perform deletion via API
        response = self.client.delete(f'/api/projects/{project.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

        # Verify project is deleted and image is removed from storage
        self.assertFalse(Project.objects.filter(id=project.id).exists())
        self.assertFalse(default_storage.exists(image_path))

    def test_update_project_replaces_image(self):
        # Create project with initial image
        image_file_1 = SimpleUploadedFile("initial.jpg", b"initial content", content_type="image/jpeg")
        project = Project.objects.create(
            title="Update Test",
            description="Testing update",
            category="backend",
            image=image_file_1
        )
        path_1 = project.image.name
        self.test_files.append(path_1)
        self.assertTrue(default_storage.exists(path_1))

        # Upload a new image to replace the old one
        image_file_2 = SimpleUploadedFile("new.jpg", b"new content", content_type="image/jpeg")
        response = self.client.patch(
            f'/api/projects/{project.id}/',
            {'image': image_file_2},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh project
        project.refresh_from_db()
        path_2 = project.image.name
        self.test_files.append(path_2)

        # Verify old image is deleted and new image exists
        self.assertFalse(default_storage.exists(path_1))
        self.assertTrue(default_storage.exists(path_2))

    def test_clear_project_image(self):
        # Create project with image
        image_file = SimpleUploadedFile("to_clear.jpg", b"content to clear", content_type="image/jpeg")
        project = Project.objects.create(
            title="Clear Test",
            description="Testing clear",
            category="backend",
            image=image_file
        )
        image_path = project.image.name
        self.test_files.append(image_path)
        self.assertTrue(default_storage.exists(image_path))

        # Send request with image set to empty string to clear it
        response = self.client.patch(
            f'/api/projects/{project.id}/',
            {'image': ''},
            format='multipart'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Refresh project
        project.refresh_from_db()
        self.assertFalse(project.image)
        self.assertFalse(default_storage.exists(image_path))
