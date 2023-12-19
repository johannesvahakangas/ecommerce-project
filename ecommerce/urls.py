from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static



urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('store.urls')),
]

# detta gör gör att Django under utveckling kan visa bilder och andra användaruppladdade filer direkt i webbläsaren 
# genom att koppla ihop en webbadress (URL) med den fysiska platsen på din dator där filerna lagras (MEDIA_URL och MEDIA_ROOT).
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

