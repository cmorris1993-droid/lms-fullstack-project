import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [user, setUser] = useState({ id: 2, username: 'TestStudent', isStaff: false }); 
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [newCourseDescription, setNewCourseDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonContent, setNewLessonContent] = useState('')

  useEffect(() => {
    fetchCourses()
    if (!user.isStaff) {
      fetchEnrolledCourses()
    }
  }, [user.id, user.isStaff])

  const fetchCourses = () => {
    axios.get('http://127.0.0.1:8000/api/courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.log(err))
  }

  const fetchEnrolledCourses = () => {
    axios.get(`http://127.0.0.1:8000/api/student/${user.id}/enrollments/`)
      .then(res => {
        setEnrolledCourses(res.data.map(enrollment => enrollment.course_details))
      })
      .catch(err => console.log(err))
  }

  const addCourse = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/courses/', {
      title: newCourseTitle,
      description: newCourseDescription
    })
    .then(() => {
      fetchCourses();
      setNewCourseTitle('');
      setNewCourseDescription('');
    })
    .catch(err => console.error(err));
  }

  const deleteCourse = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      axios.delete(`http://127.0.0.1:8000/api/courses/${id}/`)
        .then(() => {
          fetchCourses()
          if (!user.isStaff) fetchEnrolledCourses();
        })
        .catch(err => console.log(err))
    }
  }

  const addLesson = (e) => {
    e.preventDefault();
    axios.post('http://127.0.0.1:8000/api/lessons/', {
      course: selectedCourse.id,
      title: newLessonTitle,
      content: newLessonContent
    })
    .then(() => {
      fetchCourses();
      setNewLessonTitle('');
      setNewLessonContent('');
      setSelectedCourse(null);
    })
    .catch(err => console.error(err));
  }

  const enrollCourse = (courseId) => {
    axios.post('http://127.0.0.1:8000/api/enrollments/', {
      student: user.id,
      course: courseId
    })
    .then(() => {
      alert("Successfully enrolled!");
      fetchEnrolledCourses();
    })
    .catch(err => {
      console.error(err);
      alert("Enrollment failed or you are already enrolled.");
    });
  }

  return (
    <div className="lms-container">
      <header className="lms-header">
        <h1>Learning Management System</h1>
        <p>Welcome back, {user.isStaff ? 'Instructor' : 'Student'} {user.username}!</p>
      </header>

      {user.isStaff && (
        <section className="admin-section">
          <form onSubmit={addCourse} className="add-course-form">
            <h2>Create New Course</h2>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Course Title" 
                value={newCourseTitle}
                onChange={(e) => setNewCourseTitle(e.target.value)}
                required 
              />
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Course Description" 
                value={newCourseDescription}
                onChange={(e) => setNewCourseDescription(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="create-button">Add Course to LMS</button>
          </form>
        </section>
      )}

      {!user.isStaff && enrolledCourses.length > 0 && (
        <section className="enrolled-section">
          <h2>My Learning</h2>
          <div className="course-grid">
            {enrolledCourses.map(course => (
              <div key={course.id} className="course-card enrolled-card">
                <div className="course-badge">Enrolled</div>
                <h2>{course.title}</h2>
                <button 
                  className="view-button" 
                  onClick={() => setSelectedCourse(course)}
                >
                  Continue Learning
                </button>
              </div>
            ))}
          </div>
          <hr />
        </section>
      )}

      <h2>Course Catalog</h2>
      <div className="course-grid">
        {courses.length > 0 ? (
          courses.map(course => {
            const isEnrolled = enrolledCourses.some(e => e.id === course.id);
            return (
              <div key={course.id} className="course-card">
                <div className="course-badge">Course</div>
                <h2>{course.title}</h2>
                <p className="course-description">{course.description}</p>
                <div className="card-actions">
                  <button className="view-button" onClick={() => setSelectedCourse(course)}>
                    View Content
                  </button>
                  
                  {user.isStaff && (
                    <button className="delete-button" onClick={() => deleteCourse(course.id)}>
                      Delete
                    </button>
                  )}

                  {!user.isStaff && (
                    <button 
                      className={isEnrolled ? "enrolled-btn-disabled" : "enroll-button"}
                      onClick={() => !isEnrolled && enrollCourse(course.id)}
                      disabled={isEnrolled}
                    >
                      {isEnrolled ? "Already Enrolled" : "Enroll Now"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="no-data-container">
            <p className="no-data">No courses available. Please check back later!</p>
          </div>
        )}
      </div>

      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCourse.title} - Lessons</h2>
              <button className="close-btn" onClick={() => setSelectedCourse(null)}>×</button>
            </div>
            
            {user.isStaff && (
              <form onSubmit={addLesson} className="add-lesson-form">
                <h3>Add New Lesson</h3>
                <input 
                  type="text" 
                  placeholder="Lesson Title" 
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  required 
                />
                <textarea 
                  placeholder="Lesson Content" 
                  value={newLessonContent}
                  onChange={(e) => setNewLessonContent(e.target.value)}
                  required
                />
                <button type="submit" className="create-button">Add Lesson</button>
              </form>
            )}

            <hr />

            <div className="lesson-container">
              {selectedCourse.lessons && selectedCourse.lessons.length > 0 ? (
                selectedCourse.lessons.map(lesson => (
                  <div key={lesson.id} className="lesson-card">
                    <h3>{lesson.title}</h3>
                    <p>{lesson.content}</p>
                  </div>
                ))
              ) : (
                <p className="no-data">No lessons added for this course yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App