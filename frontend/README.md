# LMS Full-Stack Project

A comprehensive Learning Management System (LMS) featuring a Django REST Framework backend and a React (Vite) frontend. This project demonstrates full-stack integration, role-based access control, and automated testing.

## 🚀 Project Overview
This application provides a platform for educational management. It allows administrators to manage users, teachers to create and oversee courses, and students to enroll in and view learning materials.

## 🛠️ Tech Stack

### Backend
* **Language:** Python
* **Framework:** Django & Django REST Framework
* **Database:** SQLite (Development)
* **Authentication:** Token-based Auth

### Frontend
* **Library:** React (v19)
* **Build Tool:** Vite
* **HTTP Client:** Axios
* **Styling:** CSS-in-JS (Inline Styles)

### Testing
* **Backend Testing:** Django TestCase (built-in)
* **Frontend Testing:** Vitest, React Testing Library, and JSDOM

## Design & Wireframes
The user flows and interface designs were planned in FigJam. 
[View Interactive Wireframes on Figma](https://embed.figma.com/design/tbZubJ4DQtu86sFxpdTEYk/LMS-Wireframe?embed-host=share)
* **Brand Palette**:
    * **Primary Blue**: `#1A73E8` (Actions & Branding)
    * **Deep Navy**: `#1A1F36` (Headings & Navigation)
    * **Success Green**: `#34A853` (Affirmative actions)

## 🚀 Live Demo

- **Frontend Application**: [https://playful-kleicha-656982.netlify.app/](https://playful-kleicha-656982.netlify.app/)
- **Backend API (Admin)**: [https://lms-backend-1sbb.onrender.com/admin/](https://lms-backend-1sbb.onrender.com/admin/)

> **Note**: This project is hosted on Render's free tier. If the site is slow to respond initially, the backend may be "waking up" from sleep mode. Please allow 30-60 seconds for the first request.

### 🔑 Credentials for Testing
The backend is configured to automatically regenerate a test account on every deploy:
- **Username**: `cyan`
- **Password**: `Password1234!`
- **Role**: `Admin`

## ⚙️ Setup and Installation

### 1. Backend (Django)
* Navigate to the backend folder: `cd backend`
* Create a virtual environment: `python -m venv venv`
* Activate the environment:
  * Windows: `venv\Scripts\activate`
  * Mac/Linux: `source venv/bin/activate`
* Install dependencies: `pip install -r requirements.txt`
* Run migrations: `python manage.py migrate`
* Start the server: `python manage.py runserver`

### 2. Frontend (React)
* Navigate to the frontend folder: `cd frontend`
* Install dependencies: `npm install`
* Start the development server: `npm run dev`

## 🧪 Running Automated Tests
This project utilizes a rigorous testing suite to ensure both API reliability and UI accessibility.

### Backend Tests (Django)
To run the server-side logic and API endpoint tests:
```bash
python manage.py test
```

### Frontend Tests (Vitest)
To run the React component tests for Login and Dashboards:
```bash
npm test
```
---

## 🚀 Features & Resources

### 🎓 Student Experience
* **Student Dashboard**: Overview of active enrollments and available courses.
* **Course Enrollment**: Real-time enrollment logic connecting students to learning content.
* **Lesson Viewer**: A dedicated component for viewing course materials and navigating lessons.

### 👨‍🏫 Teacher & Admin Tools
* **Teacher Dashboard**: Interface for educators to manage their specific course listings.
* **Admin Portal**: High-level overview for user and system management.
* **Role-Based Routing**: Secure logic that ensures users only see the dashboard associated with their account type.

### 💻 Technical Implementation
* **RESTful API**: Full CRUD operations for courses and enrollments via Django REST Framework.
* **State Management**: React hooks (`useState`, `useEffect`) used for managing tokens and course data.
* **Component Testing**: Verified UI reliability for both the Login flow and the Student Dashboard using Vitest.

## 🗄️ Data Architecture (Relational Schema)

The backend follows a relational database pattern designed for scalability:

* **Course Model**: The central entity containing title, description, and teacher information.
* **Lesson Model (Many-to-One)**: Linked to `Course` via a `ForeignKey`. This allows each course to have multiple lessons.
* **Enrollment Model (Many-to-Many)**: An intermediate table that connects `Students` to `Courses`. This supports the logic where one student can join many courses, and one course can have many students.
* **User Model**: Utilizes Django's built-in authentication system to manage Student, Teacher, and Admin roles.

## 📚 Technical References & Resources

This project was built following industry-standard patterns and documentation:

### 1. Core Framework & API Structure
* **[Django Models & Fields](https://docs.djangoproject.com/en/stable/topics/db/models/)**: The foundation for how we built the Course, Lesson, and Enrollment tables.
* **[DRF Quickstart](https://www.django-rest-framework.org/tutorial/quickstart/)**: Explains the "Translation" layer (Serializers) and the ViewSets we used to handle course data.

### 2. Authentication & Security
* **[DRF Token Authentication](https://www.django-rest-framework.org/api-guide/authentication/#tokenauthentication)**: This is the specific method we used to let React "handshake" with Django via the `api-token-auth/` endpoint.
* **[Django-CORS-Headers](https://pypi.org/project/django-cors-headers/)**: The essential library we added to `settings.py` to allow the React frontend to communicate with the Django API.

### 3. Routing & Logic Patterns
* **[DRF Routers](https://www.django-rest-framework.org/api-guide/routers/)**: Explains the use of `DefaultRouter()` in `urls.py` to automatically create all the "List", "Create", and "Delete" addresses.
* **[Django Permissions](https://www.django-rest-framework.org/api-guide/permissions/)**: Explains how the `IsAdminUser` and `IsAuthenticated` flags keep student data private.

### 4. Automated Testing & Reliability
* **[React Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)**: The primary framework used to validate that role-based dashboards (Student, Teacher, Admin) render correctly and securely.
* **[Common Testing Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)**: A guide that helped ensure the automated tests were focused on user behavior rather than code implementation.

### 5. Frontend Architecture & Design
* **[React Conditional Rendering](https://react.dev/learn/conditional-rendering)**: Deep dive into the logic used to toggle UI views dynamically, such as displaying different buttons based on whether a user is a Teacher or a Student.
* **[Refactoring UI](https://www.refactoringui.com/)**: A resource for establishing visual hierarchy using our specific brand colors, such as Deep Navy (`#1A1F36`) for headers and Success Green (`#34A853`) for course actions.
* **[Figma Design Systems](https://help.figma.com/hc/en-us/articles/360040449773-Best-practices-for-design-systems)**: The methodology used to translate FigJam wireframes into consistent UI components across all management dashboards.

### 6. Modern Development & AI Assistance
This project integrated AI-assisted development workflows to accelerate troubleshooting and ensure architectural consistency:
* **Gemini & LLMs**: Used as a thought partner for interpreting complex Django Rest Framework error logs and mapping out Role-Based Access Control (RBAC) logic.
* **VS Code AI Tools**: Leveraged for rapid debugging and identifying syntax errors within React components without compromising the project's clean-code standards.
* **Troubleshooting & Refinement**: AI was instrumental in identifying specific Hex codes from browser inspections to ensure the frontend perfectly matched the intended design system.