import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherDashboard = ({ token, user }) => {
    const [courses, setCourses] = useState([]);
    const [newCourse, setNewCourse] = useState({ title: '', description: '' });
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newLesson, setNewLesson] = useState({ title: '', content: '' });
    const [loading, setLoading] = useState(true);
    const [editingCourse, setEditingCourse] = useState(null);
    const [editingLesson, setEditingLesson] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/courses/', {
                headers: { Authorization: `Token ${token}` }
            });
            setCourses(res.data);
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
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateCourse = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/courses/${editingCourse.id}/`, editingCourse, {
                headers: { Authorization: `Token ${token}` }
            });
            setEditingCourse(null);
            fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCourse = async (courseId) => {
        if (!window.confirm("Are you sure? This removes all lessons and enrollments.")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/courses/${courseId}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            fetchCourses();
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddLesson = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/lessons/', {
                course: selectedCourse.id,
                ...newLesson
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            setNewLesson({ title: '', content: '' });
            refreshSelectedCourse();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateLesson = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://127.0.0.1:8000/lessons/${editingLesson.id}/`, {
                ...editingLesson,
                course: selectedCourse.id
            }, {
                headers: { Authorization: `Token ${token}` }
            });
            setEditingLesson(null);
            refreshSelectedCourse();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteLesson = async (lessonId) => {
        if (!window.confirm("Delete this lesson?")) return;
        try {
            await axios.delete(`http://127.0.0.1:8000/lessons/${lessonId}/`, {
                headers: { Authorization: `Token ${token}` }
            });
            refreshSelectedCourse();
        } catch (err) {
            console.error(err);
        }
    };

    const refreshSelectedCourse = async () => {
        const updated = await axios.get('http://127.0.0.1:8000/courses/', {
            headers: { Authorization: `Token ${token}` }
        });
        setCourses(updated.data);
        if (selectedCourse) {
            const refreshed = updated.data.find(c => c.id === selectedCourse.id);
            setSelectedCourse(refreshed);
        }
    };

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif' };
    const formCardStyle = { backgroundColor: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '40px' };
    const cardGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' };
    const cardStyle = { backgroundColor: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', borderTop: '5px solid #1a73e8' };
    const inputStyle = { display: 'block', width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
    const primaryBtn = { padding: '10px 20px', backgroundColor: '#1a73e8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
    const deleteBtn = { padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };
    const editBtn = { padding: '8px 16px', backgroundColor: '#f39c12', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' };

    if (loading) return <div style={containerStyle}>Loading...</div>;

    if (selectedCourse) {
        return (
            <div style={containerStyle}>
                <button style={{...primaryBtn, backgroundColor: '#6c757d', marginBottom: '20px'}} onClick={() => setSelectedCourse(null)}>← Back</button>
                <h1>{selectedCourse.title}</h1>

                <div style={formCardStyle}>
                    <h3>{editingLesson ? "Edit Lesson" : "Add New Lesson"}</h3>
                    <form onSubmit={editingLesson ? handleUpdateLesson : handleAddLesson}>
                        <input style={inputStyle} placeholder="Title" value={editingLesson ? editingLesson.title : newLesson.title} onChange={(e) => editingLesson ? setEditingLesson({...editingLesson, title: e.target.value}) : setNewLesson({...newLesson, title: e.target.value})} required />
                        <textarea style={{...inputStyle, minHeight: '100px'}} placeholder="Content" value={editingLesson ? editingLesson.content : newLesson.content} onChange={(e) => editingLesson ? setEditingLesson({...editingLesson, content: e.target.value}) : setNewLesson({...newLesson, content: e.target.value})} required />
                        <button type="submit" style={primaryBtn}>{editingLesson ? "Update Lesson" : "Save Lesson"}</button>
                        {editingLesson && <button type="button" onClick={() => setEditingLesson(null)} style={{...primaryBtn, backgroundColor: '#6c757d', marginLeft: '10px'}}>Cancel</button>}
                    </form>
                </div>

                <h3>Lessons</h3>
                {selectedCourse.lessons.map((lesson) => (
                    <div key={lesson.id} style={{padding: '15px', backgroundColor: 'white', borderLeft: '4px solid #34a853', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
                        <strong>{lesson.title}</strong>
                        <div>
                            <button style={{...editBtn, marginRight: '10px'}} onClick={() => setEditingLesson(lesson)}>Edit</button>
                            <button style={deleteBtn} onClick={() => handleDeleteLesson(lesson.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h1>Teacher Management Console</h1>
            
            <div style={formCardStyle}>
                <h2>{editingCourse ? "Edit Course" : "Create New Course"}</h2>
                <form onSubmit={editingCourse ? handleUpdateCourse : handleCreateCourse}>
                    <input style={inputStyle} placeholder="Title" value={editingCourse ? editingCourse.title : newCourse.title} onChange={(e) => editingCourse ? setEditingCourse({...editingCourse, title: e.target.value}) : setNewCourse({...newCourse, title: e.target.value})} required />
                    <textarea style={{...inputStyle, minHeight: '80px'}} placeholder="Description" value={editingCourse ? editingCourse.description : newCourse.description} onChange={(e) => editingCourse ? setEditingCourse({...editingCourse, description: e.target.value}) : setNewCourse({...newCourse, description: e.target.value})} required />
                    <button type="submit" style={primaryBtn}>{editingCourse ? "Update Course" : "Create Course"}</button>
                    {editingCourse && <button type="button" onClick={() => setEditingCourse(null)} style={{...primaryBtn, backgroundColor: '#6c757d', marginLeft: '10px'}}>Cancel</button>}
                </form>
            </div>

            <div style={cardGrid}>
                {courses.map(course => (
                    <div key={course.id} style={cardStyle}>
                        <h3 style={{color: '#1a73e8'}}>{course.title}</h3>
                        <p style={{flexGrow: 1}}>{course.description}</p>
                        <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                            <button style={{...primaryBtn, backgroundColor: '#34a853', flex: 1}} onClick={() => setSelectedCourse(course)}>Manage</button>
                            <button style={{...editBtn, flex: 1}} onClick={() => setEditingCourse(course)}>Edit</button>
                            <button style={{...deleteBtn, flex: 1}} onClick={() => handleDeleteCourse(course.id)}>Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeacherDashboard;