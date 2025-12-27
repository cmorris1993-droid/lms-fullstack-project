import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [courses, setCourses] = useState([])

  useEffect(() => {
    // This calls your Django API
    axios.get('http://127.0.0.1:8000/api/courses/')
      .then(res => {
        setCourses(res.data)
      })
      .catch(err => console.log(err))
  }, [])

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
          <p>{course.description}</p>
          <button className="view-button">View Content</button>
        </div>
      ))}
    </div>
  </div>
);
}

export default App