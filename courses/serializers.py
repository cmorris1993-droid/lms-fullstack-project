from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Course, Lesson, Enrollment

class UserSerializer(serializers.ModelSerializer):
    role = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_staff', 'is_superuser', 'role']
        extra_kwargs = {
            'password': {'write_only': True, 'required': False}
        }

    def get_role(self, obj):
        if obj.is_superuser:
            return "Admin"
        if obj.is_staff:
            return "Teacher"
        return "Student"

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'course', 'title', 'content']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    teacher_name = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher', 'teacher_name', 'lessons']

    def get_teacher_name(self, obj):
        if obj.teacher:
            return obj.teacher.username
        return "Unassigned"

class EnrollmentSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'course', 'course_details', 'enrolled_at']
        read_only_fields = ['student']