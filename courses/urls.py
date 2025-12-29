from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserList, 
    UserProfileView, 
    CourseViewSet, 
    LessonViewSet, 
    EnrollmentViewSet
)

router = DefaultRouter()
router.register(r'courses', CourseViewSet, basename='course')
router.register(r'lessons', LessonViewSet, basename='lesson')
router.register(r'enrollments', EnrollmentViewSet, basename='enrollment')

urlpatterns = [
    path('', include(router.urls)),
    path('users/', UserList.as_view(), name='user-list'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('enrolled-courses/', EnrollmentViewSet.as_view({'get': 'list'}), name='enrolled-courses'),
]