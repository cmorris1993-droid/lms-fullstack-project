import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LessonViewer from './LessonViewer';
import API_URL from '../config';

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
            // Updated to use API_URL
            const coursesRes = await axios.get(`${API_URL}/courses/`, {
                headers: { Authorization: `Token ${token}` }
            });
            setAllCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);

            // Updated to use API_URL
            const enrollmentsRes = await axios.get(`${API_URL}/enrolled-courses/`, {
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
            // Updated to use API_URL
            await axios.post(`${API_URL}/enrollments/`, {
                course: courseId
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchData();
        } catch (err) {
            console.error("Enrollment error:", err.response?.data);
        }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fc', minHeight: '100vh' };
    const sectionStyle = { marginBottom: '50px' };
    const headerStyle = { borderBottom: '2px solid #eee', paddingBottom: '12px', marginBottom: '25px', color: '#1a1f36', fontSize: '22px' };
    const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px' };
    
    const cardBase = { 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s'
    };

    const enrollmentCardStyle = { ...cardBase, borderTop: '5px solid #34a853' };
    const availableCardStyle = { ...cardBase, borderTop: '5px solid #1a73e8' };

    const btnBase = { padding: '12px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.2s' };
    const btnPrimary = { ...btnBase, backgroundColor: '#1a73e8', color: 'white' };
    const btnSuccess = { ...btnBase, backgroundColor: '#e6f4ea', color: '#1e8e3e' };

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
            <h1 style={{ color: '#1a1f36', fontSize: '28px', marginBottom: '8px' }}>Student Learning Portal</h1>
            <p style={{ color: '#5f6368', marginBottom: '40px' }}>Welcome back, <span style={{fontWeight: 'bold', color: '#1a73e8'}}>{user?.username || 'Student'}</span>.</p>

            <div style={sectionStyle}>
                <h2 style={headerStyle}>My Active Courses</h2>
                {myEnrollments.length === 0 ? (
                    <div style={{...cardBase, textAlign: 'center', padding: '40px', color: '#70757a'}}>
                        <p>You haven't enrolled in any courses yet. Check out the available courses below!</p>
                    </div>
                ) : (
                    <div style={cardGrid}>
                        {myEnrollments.map(enrollment => (
                            <div key={enrollment.id} style={enrollmentCardStyle}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#1a1f36', margin: '0 0 10px 0' }}>
                                        {enrollment.course_details?.title || "Untitled Course"}
                                    </h3>
                                    <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.5' }}>
                                        {enrollment.course_details?.description || "No description available."}
                                    </p>
                                </div>
                                <button 
                                    style={btnSuccess}
                                    onClick={() => setSelectedCourse(enrollment.course_details)}
                                >
                                    Continue Learning
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={sectionStyle}>
                <h2 style={headerStyle}>Available for Enrollment</h2>
                {availableCourses.length === 0 ? (
                    <p style={{ color: '#70757a' }}>No new courses available at the moment.</p>
                ) : (
                    <div style={cardGrid}>
                        {availableCourses.map(course => (
                            <div key={course.id} style={availableCardStyle}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{ color: '#1a1f36', margin: '0 0 10px 0' }}>{course?.title}</h3>
                                    <p style={{ color: '#5f6368', fontSize: '14px', lineHeight: '1.5' }}>{course?.description}</p>
                                    <div style={{marginTop: '15px'}}>
                                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '4px 10px', borderRadius: '20px' }}>
                                            {course.teacher_name || "Instructor"}
                                        </span>
                                    </div>
                                </div>
                                <button 
                                    style={btnPrimary} 
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