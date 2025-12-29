import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LessonViewer from './LessonViewer';

const StudentDashboard = ({ token, user }) => {
    const [allCourses, setAllCourses] = useState([]);
    const [myEnrollments, setMyEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);

    useEffect(() => {
        if (token) {
            fetchData();
        }
    }, [token]);

    const fetchData = async () => {
        try {
            const coursesRes = await axios.get('http://127.0.0.1:8000/courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setAllCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);

            const enrollmentsRes = await axios.get('http://127.0.0.1:8000/enrolled-courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setMyEnrollments(Array.isArray(enrollmentsRes.data) ? enrollmentsRes.data : []);
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
            fetchData();
        } catch (err) {
            console.error("Enrollment error:", err.response?.data);
        }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif' };
    const sectionStyle = { marginBottom: '50px' };
    const headerStyle = { borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '25px', color: '#1a1f36' };
    const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' };
    const cardStyle = { 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '8px', 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: '5px solid #1a73e8'
    };
    const enrollmentCardStyle = { ...cardStyle, borderTop: '5px solid #34a853' };
    const primaryBtn = { padding: '12px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' };
    const successBtn = { ...primaryBtn, backgroundColor: '#34a853' };

    if (loading) return <div style={containerStyle}>Loading your learning portal...</div>;

    if (selectedCourse) {
        return (
            <LessonViewer 
                course={selectedCourse} 
                onBack={() => setSelectedCourse(null)} 
            />
        );
    }

    const enrolledCourseIds = myEnrollments.map(e => e.course || null);
    const availableCourses = allCourses.filter(c => !enrolledCourseIds.includes(c.id));

    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Student Learning Portal</h1>
            <p style={{ color: '#5f6368', marginBottom: '40px' }}>Welcome back, {user?.username || 'Student'}.</p>

            <div style={sectionStyle}>
                <h2 style={headerStyle}>My Active Courses</h2>
                {myEnrollments.length === 0 ? (
                    <p style={{ color: '#70757a' }}>You haven't enrolled in any courses yet.</p>
                ) : (
                    <div style={cardGrid}>
                        {myEnrollments.map(enrollment => (
                            <div key={enrollment.id} style={enrollmentCardStyle}>
                                <div>
                                    <h3 style={{ color: '#1a73e8', marginTop: 0 }}>
                                        {enrollment.course_details?.title || "Untitled Course"}
                                    </h3>
                                    <p style={{ color: '#4f566b' }}>
                                        {enrollment.course_details?.description || "No description available."}
                                    </p>
                                </div>
                                <button 
                                    style={successBtn}
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
                <h2 style={headerStyle}>Available for Enrollment</h2>
                {availableCourses.length === 0 ? (
                    <p style={{ color: '#70757a' }}>No new courses available.</p>
                ) : (
                    <div style={cardGrid}>
                        {availableCourses.map(course => (
                            <div key={course.id} style={cardStyle}>
                                <div>
                                    <h3 style={{ color: '#1a1f36', marginTop: 0 }}>{course?.title}</h3>
                                    <p style={{ color: '#4f566b' }}>{course?.description}</p>
                                </div>
                                <button 
                                    style={primaryBtn} 
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