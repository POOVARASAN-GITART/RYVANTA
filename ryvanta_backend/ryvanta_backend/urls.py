from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "status": "online",
        "service": "RYVANTA '26 National Technical Symposium API",
        "version": "1.0.0",
        "endpoints": {
            "registrations": "/api/registrations/",
            "stats": "/api/registrations/stats/",
            "export_csv": "/api/registrations/export/",
            "admin": "/admin/"
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('registrations.urls')),
]
