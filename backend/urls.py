from django.contrib import admin
from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token
from courses.views import UserList, UserDetail

urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', UserList.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('', include('courses.urls')),
    path('api-token-auth/', obtain_auth_token, name='api_token_auth'),
]