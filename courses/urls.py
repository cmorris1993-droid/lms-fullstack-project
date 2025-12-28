from django.urls import path
from .views import CourseListCreate, CourseDelete, LessonListCreate, LessonDelete, EnrollmentCreate, StudentEnrollmentList

urlpatterns = [
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDelete.as_view(), name='course-delete'),
    path('lessons/', LessonListCreate.as_view(), name='lesson-list-create'),
    path('lessons/<int:pk>/', LessonDelete.as_view(), name='lesson-delete'),
    path('enrollments/', EnrollmentCreate.as_view(), name='enrollment-create'),
    path('student/<int:student_id>/enrollments/', StudentEnrollmentList.as_view(), name='student-enrollment-list'),
]