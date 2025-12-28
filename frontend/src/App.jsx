import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])
  const [newCourseTitle, setNewCourseTitle] = useState('')
  const [newCourseDescription, setNewCourseDescription] = useState('')

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
              <button className="view-button">View Content</button>
              <button 
                className="delete-button" 
                onClick={() => deleteCourse(course.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App