from django.urls import path
from .views import health_status, admin_login, upload_media, delete_media, download_resume, send_contact_email, portfolio_data_view

urlpatterns = [
    path('status/', health_status, name='health_status'),
    path('admin-login/', admin_login, name='admin_login'),
    path('upload/', upload_media, name='upload_media'),
    path('delete-media/', delete_media, name='delete_media'),
    path('download-resume/', download_resume, name='download_resume'),
    path('contact/', send_contact_email, name='send_contact_email'),
    path('portfolio-data/', portfolio_data_view, name='portfolio_data_view'),
]
