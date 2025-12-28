from django.urls import path
from .views import CourseListCreate, CourseDelete, LessonListCreate

urlpatterns = [
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDelete.as_view(), name='course-delete'),
    path('lessons/', LessonListCreate.as_view(), name='lesson-list-create'),
]