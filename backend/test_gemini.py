import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'portfolio_api.settings')
django.setup()

from django.conf import settings
settings.GEMINI_API_KEY = "dummy_api_key"

from api.ai_service import AIService

print("Initializing AIService...")
service = AIService()
print("AIService initialized successfully!")

# Let's test the client setup with dummy proxy to make sure it validates
print("\nTesting initialization with a mock proxy settings...")
settings.GEMINI_API_PROXY = 'http://proxy.server:3128'

service_with_proxy = AIService()
print("AIService with proxy initialized successfully!")
print("Client configuration verified successfully!")
