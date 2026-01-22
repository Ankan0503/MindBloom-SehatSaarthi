from django.urls import path
from . import views

urlpatterns = [
    path('api/generate-question/', views.generate_question, name='generate_question'),
    path('api/grade-response/', views.grade_response, name='grade_response'),
    path('api/test-gemini/', views.test_gemini_connection, name='test_gemini'),
]