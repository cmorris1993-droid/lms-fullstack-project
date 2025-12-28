import React from 'react';

const LessonViewer = ({ course, onBack }) => {
    const viewerStyle = {
        padding: '40px',
        maxWidth: '900px',
        margin: '0 auto',
        fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    };

    const lessonCardStyle = {
        backgroundColor: '#f9f9f9',
        padding: '25px',
        borderRadius: '12px',
        marginBottom: '25px',
        borderLeft: '6px solid #1a73e8',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    };

    const backBtnStyle = {
        padding: '10px 20px',
        backgroundColor: '#6c757d',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        marginBottom: '30px',
        fontWeight: 'bold'
    };

    return (
        <div style={viewerStyle}>
            <button style={backBtnStyle} onClick={onBack}>
                ← Back to My Courses
            </button>
            
            <h1 style={{ color: '#1a1f36', fontSize: '2.5rem' }}>{course.title}</h1>
            <p style={{ fontSize: '1.2rem', color: '#4f566b', marginBottom: '40px' }}>
                {course.description}
            </p>

            <h2 style={{ borderBottom: '2px solid #e3e8ee', paddingBottom: '10px' }}>
                Course Lessons
            </h2>

            {course.lessons && course.lessons.length > 0 ? (
                course.lessons.map((lesson, index) => (
                    <div key={lesson.id} style={lessonCardStyle}>
                        <h3 style={{ color: '#1a73e8', marginTop: '0' }}>
                            {index + 1}. {lesson.title}
                        </h3>
                        <div style={{ 
                            lineHeight: '1.8', 
                            color: '#3c4257', 
                            whiteSpace: 'pre-wrap' 
                        }}>
                            {lesson.content}
                        </div>
                    </div>
                ))
            ) : (
                <p style={{ fontStyle: 'italic', color: '#a3acb9' }}>
                    No lessons have been added to this course yet.
                </p>
            )}
        </div>
    );
};

export default LessonViewer;