from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db import connection
from django.conf import settings
import time
from .models import PortfolioConfig

import re
import os
import cloudinary.uploader
import cloudinary.api

@api_view(['GET'])
def health_status(request):
    db_status = "Disconnected"
    db_details = ""
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1;")
            row = cursor.fetchone()
            if row and row[0] == 1:
                db_status = "Connected"
                db_details = f"Host: {settings.DATABASES['default']['HOST']} | DB: {settings.DATABASES['default']['NAME']}"
    except Exception as e:
        db_status = "Error"
        db_details = str(e)

    cloudinary_status = "Configured" if settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET else "Missing Credentials"

    return Response({
        "status": "online",
        "service": "Django REST Backend",
        "timestamp": int(time.time()),
        "database": {
            "engine": "NeonDB PostgreSQL",
            "status": db_status,
            "details": db_details
        },
        "cloudinary": {
            "status": cloudinary_status,
            "cloud_name": settings.CLOUDINARY_CLOUD_NAME,
            "api_key_masked": f"***{settings.CLOUDINARY_API_KEY[-4:]}" if settings.CLOUDINARY_API_KEY else "N/A"
        },
        "vercel_ready": True
    })

@api_view(['POST'])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    env_username = os.getenv('ADMIN_USERNAME', 'admin')
    env_password = os.getenv('ADMIN_PASSWORD', 'admin')

    # 1. Validate against environment variables (.env)
    if username == env_username and password == env_password:
        return Response({
            "success": True,
            "message": "Superadmin authentication successful via environment variables",
            "user": {
                "username": env_username,
                "email": f"{env_username}@portfolio.com",
                "is_superuser": True
            }
        })

    # 2. Fallback to Django DB superuser if created
    user = authenticate(request, username=username, password=password)
    if user is not None and user.is_staff:
        return Response({
            "success": True,
            "message": "Authentication successful",
            "user": {
                "username": user.username,
                "email": user.email,
                "is_superuser": user.is_superuser
            }
        })
    else:
        return Response({
            "success": False,
            "error": "Invalid superadmin credentials"
        }, status=401)


@api_view(['GET', 'POST'])
def portfolio_data_view(request):
    if request.method == 'GET':
        try:
            config, _ = PortfolioConfig.objects.get_or_create(key='main')
            data = config.data or {}
            return Response({"success": True, "data": data})
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=500)
    elif request.method == 'POST':
        try:
            new_data = request.data.get('data')
            if not new_data:
                return Response({"success": False, "error": "No data provided"}, status=400)
            config, _ = PortfolioConfig.objects.get_or_create(key='main')
            config.data = new_data
            config.save()
            return Response({"success": True, "message": "Portfolio data persisted successfully"})
        except Exception as e:
            return Response({"success": False, "error": str(e)}, status=500)

@api_view(['POST'])
def upload_media(request):
    file_obj = request.FILES.get('file')
    asset_type = request.data.get('asset_type')
    custom_public_id = request.data.get('public_id')

    if not file_obj:
        return Response({"success": False, "error": "No file provided"}, status=400)

    try:
        is_doc_or_pdf = asset_type == 'resume' or file_obj.name.lower().endswith(('.pdf', '.doc', '.docx'))

        if is_doc_or_pdf:
            root_pdf_path = os.path.join(settings.BASE_DIR, '..', 'Jason_Kenneth_N_ATS.pdf')
            if os.path.exists(root_pdf_path):
                try: os.remove(root_pdf_path)
                except Exception: pass

            legacy_pdf_path = os.path.join(settings.BASE_DIR, 'Jason_Kenneth_N_ATS.pdf')
            if os.path.exists(legacy_pdf_path):
                try: os.remove(legacy_pdf_path)
                except Exception: pass

            backend_pdf_path = os.path.join(settings.BASE_DIR, 'uploaded_resume.pdf')
            if os.path.exists(backend_pdf_path):
                try: os.remove(backend_pdf_path)
                except Exception: pass

            with open(backend_pdf_path, 'wb+') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)

            return Response({
                "success": True,
                "url": "http://127.0.0.1:8000/api/download-resume/",
                "original_filename": file_obj.name,
                "message": "Resume uploaded successfully"
            })

        old_url = request.data.get('old_url') or request.data.get('old_public_id')
        if old_url and not str(old_url).startswith('blob:'):
            match = re.search(r'/upload/(?:v\d+/)?(portfolio_assets/[^.]+)', str(old_url))
            old_public_id = match.group(1) if match else str(old_url)
            if old_public_id:
                try:
                    del_res = cloudinary.uploader.destroy(old_public_id, invalidate=True)
                    print(f"[Cloudinary] Deleted old/replaced asset ({old_public_id}): {del_res}")
                except Exception as del_err:
                    print(f"[Cloudinary] Error deleting old asset: {del_err}")

        # Single-pass fast Cloudinary upload with edge overwrite & CDN invalidation
        upload_kwargs = {
            'resource_type': 'image',
            'overwrite': True,
            'invalidate': True
        }

        if custom_public_id:
            upload_kwargs['public_id'] = f"portfolio_assets/{custom_public_id}"
        else:
            upload_kwargs['folder'] = 'portfolio_assets'

        result = cloudinary.uploader.upload(file_obj, **upload_kwargs)

        return Response({
            "success": True,
            "url": result.get('secure_url'),
            "public_id": result.get('public_id'),
            "resource_type": result.get('resource_type'),
            "format": result.get('format', ''),
            "original_filename": file_obj.name
        })
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)

@api_view(['POST'])
def delete_media(request):
    public_id = request.data.get('public_id')
    url = request.data.get('url')

    if not public_id and url:
        match = re.search(r'/upload/(?:v\d+/)?(portfolio_assets/[^.]+)', url)
        public_id = match.group(1) if match else url

    if not public_id:
        return Response({"success": False, "error": "No public_id or url provided"}, status=400)

    try:
        full_pid = public_id if public_id.startswith('portfolio_assets/') else f"portfolio_assets/{public_id}"
        result = cloudinary.uploader.destroy(full_pid, invalidate=True)
        return Response({"success": True, "result": result, "message": f"Asset {full_pid} deleted from Cloudinary"})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)


import os
from django.http import FileResponse

@api_view(['GET'])
def download_resume(request):
    backend_pdf_path = os.path.join(settings.BASE_DIR, 'uploaded_resume.pdf')
    if not os.path.exists(backend_pdf_path):
        backend_pdf_path = os.path.join(settings.BASE_DIR, 'Jason_Kenneth_N_ATS.pdf')

    if os.path.exists(backend_pdf_path):
        response = FileResponse(
            open(backend_pdf_path, 'rb'),
            content_type='application/pdf',
            as_attachment=True,
            filename='Jason_Kenneth_N_Resume.pdf'
        )
        return response
    else:
        return Response({"error": "Resume file not found"}, status=404)

import threading
from django.core.mail import EmailMessage

def send_email_async(email):
    try:
        email.send(fail_silently=False)
        print("[SMTP] Contact email dispatched successfully in background thread.")
    except Exception as err:
        print(f"[SMTP Error] Failed to send email in background thread: {err}")

@api_view(['POST'])
def send_contact_email(request):
    name = request.data.get('name', '').strip()
    sender_email = request.data.get('email', '').strip()
    message = request.data.get('message', '').strip()

    if not name or not sender_email or not message:
        return Response({"success": False, "error": "Name, email, and message are required fields."}, status=400)

    email_subject = f"{name} from Portfolio"

    try:
        email_body = f"""Name: {name}
Email: {sender_email}
Message: {message}"""
        email = EmailMessage(
            subject=email_subject,
            body=email_body,
            from_email="celarox.mail@gmail.com",
            to=["jasonkennethn@gmail.com"],
            reply_to=[sender_email]
        )
        
        # Launch background email thread so HTTP response is instant (<10ms)
        threading.Thread(target=send_email_async, args=(email,)).start()

        return Response({
            "success": True,
            "message": "Message sent successfully! Thank you for reaching out."
        })
    except Exception as e:
        return Response({"success": False, "error": f"Failed to process message: {str(e)}"}, status=500)
