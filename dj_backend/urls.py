from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include('signup.urls')),
    path('',include('hospital.urls')),
    path('', include('doctors.urls')),
    path('', include('assessment.urls')),
    path('',include('stressmap.urls')),
    path('',include('AssessQues.urls')),
    path('googled40d208fd0e71300.html', 
         TemplateView.as_view(
             template_name='googled40d208fd0e71300.html', 
             content_type='text/html')),
]
