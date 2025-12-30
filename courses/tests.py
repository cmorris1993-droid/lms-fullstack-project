from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Course

class CourseModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testteacher', password='password123')
        self.course = Course.objects.create(
            title="Introduction to Django",
            description="A beginner's guide to backend development.",
            teacher=self.user
        )

    def test_course_content(self):
        self.assertEqual(self.course.title, "Introduction to Django")
        self.assertEqual(self.course.description, "A beginner's guide to backend development.")

    def test_course_string_representation(self):
        self.assertEqual(str(self.course), "Introduction to Django")

class CourseAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='api_user', password='password123')
        self.client.force_authenticate(user=self.user)
        self.course = Course.objects.create(
            title="API Test Course",
            description="Testing the REST endpoint",
            teacher=self.user
        )
        self.url = reverse('course-list')

    def test_get_courses_list(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['title'], "API Test Course")