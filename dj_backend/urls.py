"""
URL configuration for dj_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from signup.views import *
from doctors.views import *
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', mental_health_view, name="home"),
    path('home/', mental_health_view, name="mindbloom"),
    path('sehatsaarthi/', sehatsaarthi_view, name="sehatsaarthi"),
    path('login/', login_view, name="login"),
    path('signup/', signup_view, name="signup"),
    path('logout/', logout_view, name="logout"),
    path('admin_dashboard/', admin_dashboard_view, name="admin_dashboard"),
    path('superuser_dashboard/', superuser_dashboard_view, name='superuser_dashboard'),
    path('unauthorized/', unauthorized_view, name='unauthorized'),
    # path('other_services', other_services_view, name="other_services"),
    # path('admin-dashboard/', admin_dashboard, name='admin_dashboard'),
    # path('api/hospitals/add/', add_hospital_api, name='add_hospital_api'),
    # path('api/hospitals/', get_hospitals_api, name='get_hospitals_api'),
    # path('hospitals/', hospital_list_view, name='hospital_list_view'),
    # path('admin_dashboard/', admin_dashboard, name='admin_dashboard'),
    path('api/save-doctor/', save_doctor, name='save_doctor'),
    path('api/doctors/<str:specialist>/', get_doctors_by_specialist, name='get_doctors_by_specialist'),
]
