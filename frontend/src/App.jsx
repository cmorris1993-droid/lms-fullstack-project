import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = () => {
    axios.get('http://127.0.0.1:8000/api/courses/')
      .then(res => setCourses(res.data))
      .catch(err => console.log(err))
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

      <div className="course-grid">
        {courses.map(course => (
          <div key={course.id} className="course-card">
            <div className="course-badge">Course</div>
            <h2>{course.title}</h2>
            <p className="course-description">{course.description}</p>
            <div className="card-actions">
              <button className="view-button">View Content</button>
              {}
              <button 
                className="delete-button" 
                onClick={() => deleteCourse(course.id)}
              >
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