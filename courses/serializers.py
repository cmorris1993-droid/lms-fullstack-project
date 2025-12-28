from rest_framework import serializers
from .models import Course, Lesson, Enrollment

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'content']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'lessons']

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_details', 'enrolled_at']