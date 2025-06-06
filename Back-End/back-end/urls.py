from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import redirect
from django.contrib.auth import views as auth_views
from api import views as api_views

urlpatterns = [
    # Всі маршрути, що стосуються API, login, register, logout тощо
    path('admin/', admin.site.urls),
    path('', include('api.urls')),
    # path('logout/', LogoutView.as_view(next_page='login'), name='logout'),
    # path('logout/', auth_views.LogoutView.as_view(next_page='/'), name='logout'),
    # path('logout/', views.custom_logout, name='logout'),
    path('logout/', api_views.custom_logout, name='logout'),
]

# Додаємо обробку медіа-файлів у режимі DEBUG
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

