from django.urls import path
from . import views

urlpatterns = [
    path('', views.mental_health_view, name="home"),
    path('home/', views.mental_health_view, name="mindbloom"),
    path('sehatsaarthi/', views.sehatsaarthi_view, name="sehatsaarthi"),
    path('login/', views.login_view, name="login"),
    path('signup/', views.signup_view, name="signup"),
    path('logout/', views.logout_view, name="logout"),
    path('admin_dashboard/', views.admin_dashboard_view, name="admin_dashboard"),
    path('superuser_dashboard/', views.superuser_dashboard_view, name='superuser_dashboard'),
    path('unauthorized/', views.unauthorized_view, name='unauthorized'),
]
