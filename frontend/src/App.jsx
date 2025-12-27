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
    <div style={{ padding: '20px' }}>
      <h1>LMS Course List</h1>
      <ul>
        {courses.map(course => (
          <li key={course.id}>
            {course.title} - {course.description}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App