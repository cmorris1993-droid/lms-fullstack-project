from rest_framework import generics
from .models import Course, Lesson, Enrollment
from .serializers import CourseSerializer, LessonSerializer, EnrollmentSerializer

class CourseListCreate(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseDelete(generics.DestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class LessonListCreate(generics.ListCreateAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

class LessonDelete(generics.DestroyAPIView):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer    

class EnrollmentCreate(generics.ListCreateAPIView):
    queryset = Enrollment.objects.all()
    serializer_class = EnrollmentSerializer

class StudentEnrollmentList(generics.ListAPIView):
    serializer_class = EnrollmentSerializer

    def get_queryset(self):
        student_id = self.kwargs['student_id']
        return Enrollment.objects.filter(student_id=student_id)