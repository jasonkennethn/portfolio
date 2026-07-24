from django.db import models

class PortfolioConfig(models.Model):
    key = models.CharField(max_length=50, unique=True, default='main')
    data = models.JSONField(default=dict)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"PortfolioConfig ({self.key})"
