import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showLessonForm, setShowLessonForm] = useState(false);
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [lessonTitle, setLessonTitle] = useState('');
    const [lessonContent, setLessonContent] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchLessons(selectedCourse.id);
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setCourses(response.data);
        } catch (err) {
            console.error("Error fetching courses", err);
        }
    };

    const fetchLessons = async (courseId) => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/lessons/', {
                headers: { Authorization: `Token ${token}` }
            });
            const filtered = response.data.filter(lesson => lesson.course === courseId);
            setLessons(filtered);
        } catch (err) {
            console.error("Error fetching lessons", err);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/courses/', 
                { title, description },
                { headers: { Authorization: `Token ${token}` } }
            );
            setTitle('');
            setDescription('');
            setShowForm(false);
            fetchCourses(); 
        } catch (err) {
            console.error("Error creating course", err);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/lessons/', {
                course: selectedCourse.id,
                title: lessonTitle,
                content: lessonContent
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            setLessonTitle('');
            setLessonContent('');
            setShowLessonForm(false);
            fetchLessons(selectedCourse.id);
        } catch (err) {
            console.error("Error adding lesson", err);
        }
    };

    const deleteCourse = async (courseId) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/courses/${courseId}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setCourses(courses.filter(course => course.id !== courseId));
            } catch (err) {
                console.error("Error deleting course", err);
            }
        }
    };

    const deleteLesson = async (lessonId) => {
        if (window.confirm("Are you sure you want to delete this lesson?")) {
            try {
                await axios.delete(`http://127.0.0.1:8000/lessons/${lessonId}/`, {
                    headers: { Authorization: `Token ${token}` }
                });
                setLessons(lessons.filter(lesson => lesson.id !== lessonId));
            } catch (err) {
                console.error("Error deleting lesson", err);
            }
        }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif' };
    const cardStyle = { 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    };
    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginRight: '10px'
    };
    const inputStyle = {
        width: '100%',
        padding: '10px',
        margin: '10px 0',
        borderRadius: '4px',
        border: '1px solid #ddd',
        boxSizing: 'border-box'
    };

    if (selectedCourse) {
        return (
            <div style={containerStyle}>
                <button 
                    style={{ ...buttonStyle, backgroundColor: '#5f6368', marginBottom: '20px' }} 
                    onClick={() => setSelectedCourse(null)}
                >
                    ← Back to Courses
                </button>
                <div style={cardStyle}>
                    <h1 style={{ color: '#1a1f36' }}>{selectedCourse.title}</h1>
                    <p style={{ color: '#5f6368' }}>{selectedCourse.description}</p>
                </div>
                
                <div style={{ ...cardStyle, borderLeft: '5px solid #1a73e8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3>Course Lessons</h3>
                        <button style={buttonStyle} onClick={() => setShowLessonForm(!showLessonForm)}>
                            {showLessonForm ? 'Cancel' : '+ Add New Lesson'}
                        </button>
                    </div>

                    {showLessonForm && (
                        <form onSubmit={handleAddLesson} style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '6px' }}>
                            <input 
                                placeholder="Lesson Title" 
                                style={inputStyle} 
                                value={lessonTitle}
                                onChange={(e) => setLessonTitle(e.target.value)}
                                required 
                            />
                            <textarea 
                                placeholder="Lesson Content" 
                                style={{ ...inputStyle, height: '100px' }} 
                                value={lessonContent}
                                onChange={(e) => setLessonContent(e.target.value)}
                                required 
                            />
                            <button type="submit" style={buttonStyle}>Save Lesson</button>
                        </form>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        {lessons.length === 0 ? (
                            <p style={{ color: '#9aa0a6' }}>No lessons added yet.</p>
                        ) : (
                            lessons.map(lesson => (
                                <div key={lesson.id} style={{ padding: '15px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h4 style={{ margin: '0 0 5px 0', color: '#1a1f36' }}>{lesson.title}</h4>
                                        <p style={{ margin: 0, fontSize: '14px', color: '#5f6368' }}>{lesson.content}</p>
                                    </div>
                                    <button 
                                        onClick={() => deleteLesson(lesson.id)}
                                        style={{ background: 'none', border: 'none', color: '#d93025', cursor: 'pointer', fontSize: '13px' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <h1>Instructor Dashboard</h1>
                <button style={buttonStyle} onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ Create New Course'}
                </button>
            </div>

            {showForm && (
                <div style={cardStyle}>
                    <h3>Create New Course</h3>
                    <form onSubmit={handleCreateCourse}>
                        <input 
                            placeholder="Course Title" 
                            style={inputStyle} 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required 
                        />
                        <textarea 
                            placeholder="Course Description" 
                            style={{ ...inputStyle, height: '100px' }} 
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required 
                        />
                        <button type="submit" style={buttonStyle}>Save Course</button>
                    </form>
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {courses.map(course => (
                    <div key={course.id} style={cardStyle}>
                        <h3 style={{ color: '#1a73e8', marginTop: 0 }}>{course.title}</h3>
                        <p style={{ color: '#5f6368', minHeight: '60px' }}>{course.description}</p>
                        <div style={{ marginTop: '20px' }}>
                            <button style={buttonStyle} onClick={() => setSelectedCourse(course)}>
                                View Lessons
                            </button>
                            <button 
                                style={{ ...buttonStyle, backgroundColor: 'transparent', color: '#d93025', border: '1px solid #d93025' }}
                                onClick={() => deleteCourse(course.id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;