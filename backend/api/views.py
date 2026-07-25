from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db import connection
from django.conf import settings
import time
from .models import PortfolioConfig, ContactMessage

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

    env_username = os.getenv('ADMIN_USERNAME')
    env_password = os.getenv('ADMIN_PASSWORD')

    if not env_username or not env_password:
        return Response({
            "success": False,
            "error": "Superadmin environment credentials not set."
        }, status=500)

    # Validate strictly against environment variables (.env) ONLY - NO DB FALLBACK
    if username == env_username and password == env_password:
        return Response({
            "success": True,
            "message": "Superadmin authentication successful",
            "user": {
                "username": env_username,
                "email": f"{env_username}@portfolio.com",
                "is_superuser": True
            }
        })

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

from django.core.mail import EmailMultiAlternatives
from django.utils.html import escape

@api_view(['POST'])
def send_contact_email(request):
    name = request.data.get('name', '').strip()
    sender_email = request.data.get('email', '').strip()
    message = request.data.get('message', '').strip()

    if not name or not sender_email or not message:
        return Response({"success": False, "error": "Name, email, and message are required fields."}, status=400)

    # Required default subject format: "<Full Name> From Portfolio"
    email_subject = f"{name} From Portfolio"

    # 1. Save message to PostgreSQL Database immediately so it's never lost
    msg_obj = ContactMessage.objects.create(
        name=name,
        email=sender_email,
        subject=email_subject,
        message=message,
        status='pending'
    )

    # Plain text version for email client fallback
    plain_text_body = f"""New Message From Portfolio Contact Form:

Name: {name}
Email: {sender_email}

Message:
{message}
"""

    # HTML formatted version for rich, executive email layout
    safe_name = escape(name)
    safe_email = escape(sender_email)
    safe_message = escape(message).replace('\n', '<br>')

    html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{safe_name} From Portfolio</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #3730a3 0%, #494bd6 50%, #6366f1 100%); padding: 32px 32px 28px 32px; text-align: left;">
              <div style="display: inline-block; padding: 4px 12px; background-color: rgba(255, 255, 255, 0.2); border-radius: 9999px; color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 12px;">
                New Portfolio Message
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2;">
                {safe_name}
              </h1>
              <p style="margin: 6px 0 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500;">
                <a href="mailto:{safe_email}" style="color: #ffffff; text-decoration: underline;">{safe_email}</a>
              </p>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td style="padding: 32px;">
              
              <!-- Sender Details Grid -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; padding: 16px 20px; border: 1px solid #f1f5f9; margin-bottom: 24px;">
                <tr>
                  <td>
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Sender Name</span>
                          <span style="font-size: 14px; font-weight: 700; color: #0f172a;">{safe_name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; display: block;">Email Address</span>
                          <a href="mailto:{safe_email}" style="font-size: 14px; font-weight: 600; color: #494bd6; text-decoration: none;">{safe_email}</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Message Text -->
              <div style="margin-bottom: 8px;">
                <span style="font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;">Message Body</span>
              </div>
              <div style="background-color: #ffffff; border-left: 4px solid #494bd6; padding: 18px 20px; border-radius: 0 12px 12px 0; border-top: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; border-bottom: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 15px; line-height: 1.65; color: #334155; font-weight: 400;">
                  {safe_message}
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; border-top: 1px solid #e2e8f0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 500;">
                Reply directly to this email to respond to <strong>{safe_name}</strong>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
"""

    from_email = getattr(settings, 'EMAIL_HOST_USER', 'celarox.mail@gmail.com') or 'celarox.mail@gmail.com'

    smtp_success = False
    try:
        email = EmailMultiAlternatives(
            subject=email_subject,
            body=plain_text_body,
            from_email=from_email,
            to=["jasonkennethn@gmail.com"],
            reply_to=[sender_email]
        )
        email.attach_alternative(html_content, "text/html")
        email.send(fail_silently=False)
        smtp_success = True
        msg_obj.status = 'sent'
        msg_obj.save()
    except Exception as e:
        print(f"[SMTP Error] {e}")
        msg_obj.status = 'failed'
        msg_obj.save()

    return Response({
        "success": True,
        "message": "Message received! Thank you for reaching out.",
        "smtp_sent": smtp_success,
        "id": msg_obj.id
    })


@api_view(['GET'])
def get_contact_messages(request):
    try:
        messages = ContactMessage.objects.all().values('id', 'name', 'email', 'subject', 'message', 'status', 'is_read', 'created_at')
        data = list(messages)
        for item in data:
            if item.get('created_at'):
                item['created_at'] = item['created_at'].isoformat()
        return Response({"success": True, "messages": data})
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)


@api_view(['DELETE', 'POST'])
def delete_contact_message(request, pk):
    try:
        msg = ContactMessage.objects.get(pk=pk)
        msg.delete()
        return Response({"success": True, "message": f"Message #{pk} deleted."})
    except ContactMessage.DoesNotExist:
        return Response({"success": False, "error": "Message not found"}, status=404)
    except Exception as e:
        return Response({"success": False, "error": str(e)}, status=500)

