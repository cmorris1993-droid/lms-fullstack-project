import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = ({ token }) => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });
    const [newLesson, setNewLesson] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    
    const [editingCourse, setEditingCourse] = useState(null);
    const [editCourseData, setEditCourseData] = useState({ title: '', description: '' });
    
    const [editingLesson, setEditingLesson] = useState(null);
    const [editLessonData, setEditLessonData] = useState({ title: '', content: '' });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setCourses(res.data);
            if (selectedCourse) {
                const updated = res.data.find(c => c.id === selectedCourse.id);
                if (updated) setSelectedCourse(updated);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/courses/', newCourse, {
                headers: { Authorization: `Token ${token}` }
            });
            setNewCourse({ title: '', description: '' });
            fetchCourses();
        } catch (err) { console.error(err); }
    };

    const deleteCourse = async (id) => {
        if (!window.confirm("Delete course?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/courses/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchCourses();
        } catch (err) { console.error(err); }
    };

    const saveEditCourse = async (id) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/courses/${id}/`, editCourseData, {
                headers: { Authorization: `Token ${token}` }
            });
            setEditingCourse(null);
            fetchCourses();
        } catch (err) { console.error(err); }
    };

    const handleCreateLesson = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/lessons/', { ...newLesson, course: selectedCourse.id }, {
                headers: { Authorization: `Token ${token}` }
            });
            setNewLesson({ title: '', content: '' });
            fetchCourses();
        } catch (err) { console.error(err); }
    };

    const saveEditLesson = async (lessonId) => {
        try {
            await axios.patch(`http://127.0.0.1:8000/lessons/${lessonId}/`, editLessonData, {
                headers: { Authorization: `Token ${token}` }
            });
            setEditingLesson(null);
            fetchCourses();
        } catch (err) { console.error(err); }
    };

    const deleteLesson = async (id) => {
        if (!window.confirm("Delete lesson?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/lessons/${id}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchCourses();
        } catch (err) { console.error(err); }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fc', minHeight: '100vh' };
    const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '20px' };
    const btnBase = { padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' };
    const btnPrimary = { ...btnBase, backgroundColor: '#1a73e8', color: 'white' };
    const btnEdit = { ...btnBase, backgroundColor: '#e8f0fe', color: '#1a73e8' };
    const btnDelete = { ...btnBase, backgroundColor: '#fce8e6', color: '#d93025' };
    const inputStyle = { padding: '10px', borderRadius: '6px', border: '1px solid #dcdfe6', width: '100%', marginBottom: '10px', boxSizing: 'border-box' };

    if (loading) return <div style={containerStyle}>Loading...</div>;

    if (selectedCourse) {
        return (
            <div style={containerStyle}>
                <button onClick={() => setSelectedCourse(null)} style={{ marginBottom: '20px', background: 'none', border: 'none', color: '#1a73e8', cursor: 'pointer', fontWeight: 'bold' }}>← Back to All Courses</button>
                <h1>{selectedCourse.title}</h1>
                <div style={cardStyle}>
                    <h3>Add New Lesson</h3>
                    <form onSubmit={handleCreateLesson}>
                        <input style={inputStyle} placeholder="Lesson Title" value={newLesson.title} onChange={(e) => setNewLesson({...newLesson, title: e.target.value})} required />
                        <textarea style={{...inputStyle, minHeight: '60px'}} placeholder="Content" value={newLesson.content} onChange={(e) => setNewLesson({...newLesson, content: e.target.value})} required />
                        <button type="submit" style={btnPrimary}>Add Lesson</button>
                    </form>
                </div>
                <h3>Lessons</h3>
                {selectedCourse.lessons?.map(lesson => (
                    <div key={lesson.id} style={cardStyle}>
                        {editingLesson === lesson.id ? (
                            <>
                                <input style={inputStyle} value={editLessonData.title} onChange={(e) => setEditLessonData({...editLessonData, title: e.target.value})} />
                                <textarea style={inputStyle} value={editLessonData.content} onChange={(e) => setEditLessonData({...editLessonData, content: e.target.value})} />
                                <button onClick={() => saveEditLesson(lesson.id)} style={{...btnPrimary, backgroundColor: '#34a853', marginRight: '10px'}}>Save</button>
                                <button onClick={() => setEditingLesson(null)} style={{...btnBase, backgroundColor: '#eee'}}>Cancel</button>
                            </>
                        ) : (
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h4 style={{ margin: 0 }}>{lesson.title}</h4>
                                    <p style={{ color: '#5f6368', fontSize: '14px' }}>{lesson.content}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', height: 'fit-content' }}>
                                    <button onClick={() => { setEditingLesson(lesson.id); setEditLessonData({title: lesson.title, content: lesson.content}); }} style={btnEdit}>Edit</button>
                                    <button onClick={() => deleteLesson(lesson.id)} style={btnDelete}>Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h1>Teacher Management Console</h1>
            <div style={cardStyle}>
                <h3>Create New Course</h3>
                <form onSubmit={handleCreateCourse}>
                    <input style={inputStyle} placeholder="Course Title" value={newCourse.title} onChange={(e) => setNewCourse({...newCourse, title: e.target.value})} required />
                    <textarea style={{...inputStyle, minHeight: '60px'}} placeholder="Description" value={newCourse.description} onChange={(e) => setNewCourse({...newCourse, description: e.target.value})} required />
                    <button type="submit" style={btnPrimary}>Create Course</button>
                </form>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {courses.map(course => (
                    <div key={course.id} style={{ ...cardStyle, borderLeft: '5px solid #34a853' }}>
                        {editingCourse === course.id ? (
                            <>
                                <input style={inputStyle} value={editCourseData.title} onChange={(e) => setEditCourseData({...editCourseData, title: e.target.value})} />
                                <textarea style={inputStyle} value={editCourseData.description} onChange={(e) => setEditCourseData({...editCourseData, description: e.target.value})} />
                                <button onClick={() => saveEditCourse(course.id)} style={{...btnPrimary, backgroundColor: '#34a853', marginRight: '10px'}}>Save</button>
                                <button onClick={() => setEditingCourse(null)} style={{...btnBase, backgroundColor: '#eee'}}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <h3>{course.title}</h3>
                                <p style={{ color: '#5f6368', fontSize: '14px' }}>{course.description}</p>
                                <div style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                                    <button onClick={() => setSelectedCourse(course)} style={btnEdit}>Manage Lessons</button>
                                    <button onClick={() => { setEditingCourse(course.id); setEditCourseData({title: course.title, description: course.description}); }} style={{...btnBase, backgroundColor: '#f1f3f4'}}>Edit</button>
                                    <button onClick={() => deleteCourse(course.id)} style={btnDelete}>Delete</button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;