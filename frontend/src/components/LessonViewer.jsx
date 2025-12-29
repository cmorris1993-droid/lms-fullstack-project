import React, { useState } from 'react';

const LessonViewer = ({ course, onBack }) => {
    const [activeLesson, setActiveLesson] = useState(null);

    const containerStyle = { padding: '40px', fontFamily: 'Segoe UI, sans-serif', backgroundColor: '#f8f9fc', minHeight: '100vh' };
    const cardStyle = { 
        backgroundColor: 'white', 
        padding: '25px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)', 
        marginBottom: '20px',
        cursor: 'pointer',
        borderLeft: '5px solid #1a73e8',
        transition: 'transform 0.2s'
    };
    
    const contentCardStyle = { 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        lineHeight: '1.6'
    };

    const btnBase = { padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' };
    const btnGhost = { ...btnBase, background: 'none', color: '#1a73e8', padding: '0', marginBottom: '20px', display: 'block' };
    const btnPrimary = { ...btnBase, backgroundColor: '#1a73e8', color: 'white', marginTop: '30px' };

    if (activeLesson) {
        return (
            <div style={containerStyle}>
                <button onClick={() => setActiveLesson(null)} style={btnGhost}>
                    ← Back to Lesson List
                </button>
                <div style={contentCardStyle}>
                    <h1 style={{ color: '#1a1f36', marginBottom: '10px' }}>{activeLesson.title}</h1>
                    <p style={{ color: '#9ea3ac', fontSize: '14px', marginBottom: '30px' }}>Part of: {course.title}</p>
                    <div style={{ color: '#4f566b', fontSize: '18px' }}>
                        {activeLesson.content}
                    </div>
                    <button onClick={() => setActiveLesson(null)} style={btnPrimary}>
                        Mark as Complete
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <button onClick={onBack} style={btnGhost}>
                ← Back to My Courses
            </button>
            <h1 style={{ color: '#1a1f36', fontSize: '28px', marginBottom: '8px' }}>{course.title}</h1>
            <p style={{ color: '#5f6368', marginBottom: '40px' }}>{course.description}</p>

            <h2 style={{ fontSize: '20px', marginBottom: '20px', color: '#1a1f36' }}>Course Lessons</h2>
            {course.lessons && course.lessons.length > 0 ? (
                <div>
                    {course.lessons.map((lesson, index) => (
                        <div 
                            key={lesson.id} 
                            style={cardStyle}
                            onClick={() => setActiveLesson(lesson)}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(10px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <h3 style={{ color: '#1a73e8', margin: '0 0 5px 0' }}>
                                {index + 1}. {lesson.title}
                            </h3>
                            <p style={{ color: '#5f6368', margin: 0, fontSize: '14px' }}>
                                Click to start this lesson
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <p style={{ color: '#70757a' }}>No lessons have been added to this course yet.</p>
            )}
        </div>
    );
};

export default LessonViewer;