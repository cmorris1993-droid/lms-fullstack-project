from django.urls import path
from .views import (
    CourseListCreate, 
    CourseDelete, 
    LessonListCreate, 
    LessonDelete, 
    EnrollmentCreate, 
    StudentEnrollmentList,
    UserList,
    UserProfileView
)

urlpatterns = [
    path('courses/', CourseListCreate.as_view(), name='course-list-create'),
    path('courses/<int:pk>/', CourseDelete.as_view(), name='course-delete'),
    path('lessons/', LessonListCreate.as_view(), name='lesson-list-create'),
    path('lessons/<int:pk>/', LessonDelete.as_view(), name='lesson-delete'),
    path('enroll/', EnrollmentCreate.as_view(), name='enrollment-create'),
    path('enrolled-courses/<int:student_id>/', StudentEnrollmentList.as_view(), name='student-enrollment-list'),
    path('users/', UserList.as_view(), name='user-list'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]