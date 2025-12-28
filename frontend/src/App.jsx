import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [newCourseDescription, setNewCourseDescription] = useState('')
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [newLessonTitle, setNewLessonTitle] = useState('')
  const [newLessonContent, setNewLessonContent] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = () => {
    axios.get('http://127.0.0.1:8000/api/courses/')
      .then(res => setCourses(res.data))
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

  return (
    <div className="lms-container">
      <header className="lms-header">
        <h1>Learning Management System</h1>
        <p>Welcome back, Instructor!</p>
      </header>

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

      <hr />

      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-badge">Course</div>
            <h2>{course.title}</h2>
            <p className="course-description">{course.description}</p>
            <div className="card-actions">
              <button 
                className="view-button" 
                onClick={() => setSelectedCourse(course)}
              >
                View Content
              </button>
              <button 
                className="delete-button" 
                onClick={() => deleteCourse(course.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{selectedCourse.title} - Lessons</h2>
              <button className="close-btn" onClick={() => setSelectedCourse(null)}>×</button>
            </div>
            
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