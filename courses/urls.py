from django.urls import path
from .views import CourseListCreate

urlpatterns = [
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
]

