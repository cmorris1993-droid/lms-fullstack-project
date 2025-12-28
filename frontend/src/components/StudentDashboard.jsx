import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LessonViewer from './LessonViewer';

const StudentDashboard = ({ token, user }) => {
    const [allCourses, setAllCourses] = useState([]);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const coursesRes = await axios.get('http://127.0.0.1:8000/courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setAllCourses(coursesRes.data);

            const enrollmentsRes = await axios.get('http://127.0.0.1:8000/enrolled-courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setMyEnrollments(enrollmentsRes.data);
            
            setLoading(false);
        } catch (err) {
            console.error("Error fetching student data:", err);
            setLoading(false);
        }
    };

    const handleEnroll = async (courseId) => {
        try {
            await axios.post('http://127.0.0.1:8000/enrollments/', {
                course: courseId
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            alert("Enrolled successfully!");
            fetchData();
        } catch (err) {
            console.error("Enrollment error:", err.response?.data);
            alert("Enrollment failed. See console for details.");
        }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif' };
    const sectionStyle = { marginBottom: '40px' };
    const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' };
    const cardStyle = { 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
    };
    const btnStyle = {
        marginTop: '15px',
        padding: '10px 15px',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    };

    if (loading) return <div style={containerStyle}>Loading your learning portal...</div>;

    if (selectedCourse) {
        return (
            <LessonViewer 
                course={selectedCourse} 
                onBack={() => setSelectedCourse(null)} 
            />
        );
    }

    const enrolledCourseIds = myEnrollments.map(e => e.course);
    const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id));

    return (
        <div style={containerStyle}>
            <h1>Student Learning Portal</h1>

            <div style={sectionStyle}>
                <h2>My Courses</h2>
                {myEnrollments.length === 0 ? (
                    <p>You haven't enrolled in any courses yet.</p>
                ) : (
                    <div style={cardGrid}>
                        {myEnrollments.map(enrollment => (
                            <div key={enrollment.id} style={cardStyle}>
                                <h3 style={{ color: '#1a73e8' }}>{enrollment.course_details?.title}</h3>
                                <p>{enrollment.course_details?.description}</p>
                                <button 
                                    style={{ ...btnStyle, backgroundColor: '#34a853' }}
                                    onClick={() => setSelectedCourse(enrollment.course_details)}
                                >
                                    Go to Lessons
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={sectionStyle}>
                <h2>Available Courses</h2>
                {availableCourses.length === 0 ? (
                    <p>No new courses available at the moment.</p>
                ) : (
                    <div style={cardGrid}>
                        {availableCourses.map(course => (
                            <div key={course.id} style={cardStyle}>
                                <h3 style={{ color: '#1a1f36' }}>{course.title}</h3>
                                <p>{course.description}</p>
                                <button 
                                    style={{ ...btnStyle, backgroundColor: '#1a73e8' }} 
                                    onClick={() => handleEnroll(course.id)}
                                >
                                    Enroll Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentDashboard;