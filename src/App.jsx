// App.jsx

import React, { useState, useEffect } from "react";

/* ================= LOCAL STORAGE ================= */

const STUDENTS_KEY = "students";
const SESSION_KEY = "student_session";

const getStudents = () => {
  return JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [];
};

const saveStudents = (students) => {
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

const saveSession = (student) => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(student));
};

const getSession = () => {
  return JSON.parse(localStorage.getItem(SESSION_KEY));
};

const clearSession = () => {
  localStorage.removeItem(SESSION_KEY);
};

/* ================= SIGNUP COMPONENT ================= */

const Signup = ({ setPage }) => {
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    course: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const students = getStudents();

    const alreadyExists = students.find(
      (student) => student.email === formData.email
    );

    if (alreadyExists) {
      alert("Student already registered");
      return;
    }

    const newStudent = {
      id: Date.now(),
      ...formData,
    };

    saveStudents([...students, newStudent]);

    alert("Signup Successful");

    setFormData({
      name: "",
      roll: "",
      course: "",
      email: "",
      password: "",
    });

    setPage("login");
  };

  return (
    <div className="container">
      <div className="box">
        <h1>Signup</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Enter Name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="roll"
            placeholder="Enter Roll Number"
            value={formData.roll}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="course"
            placeholder="Enter Course"
            value={formData.course}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Signup</button>
        </form>

        <p>
          Already have account?{" "}
          <span onClick={() => setPage("login")}>Login</span>
        </p>
      </div>
    </div>
  );
};

/* ================= LOGIN COMPONENT ================= */

const Login = ({ setPage, setStudent }) => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const students = getStudents();

    const foundStudent = students.find(
      (student) =>
        student.email === loginData.email &&
        student.password === loginData.password
    );

    if (!foundStudent) {
      alert("Invalid Email or Password");
      return;
    }

    saveSession(foundStudent);

    setStudent(foundStudent);

    alert("Login Successful");

    setPage("dashboard");
  };

  return (
    <div className="container">
      <div className="box">
        <h1>Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            value={loginData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>
        </form>

        <p>
          Don't have account?{" "}
          <span onClick={() => setPage("signup")}>Signup</span>
        </p>
      </div>
    </div>
  );
};

/* ================= DASHBOARD COMPONENT ================= */

const Dashboard = ({ student, logout }) => {
  return (
    <div className="container">
      <div className="box">
        <h1>Dashboard</h1>

        <h2>Welcome {student.name}</h2>

        <p>
          <strong>Roll No:</strong> {student.roll}
        </p>

        <p>
          <strong>Course:</strong> {student.course}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

/* ================= MAIN APP ================= */

const App = () => {
  const [page, setPage] = useState("signup");
  const [student, setStudent] = useState(null);

  // Auto Login
  useEffect(() => {
    const session = getSession();

    if (session) {
      setStudent(session);
      setPage("dashboard");
    }
  }, []);

  // Logout
  const logout = () => {
    clearSession();
    setStudent(null);
    setPage("login");
  };

  return (
    <>
      <style>{`
        body{
          margin:0;
          font-family:Arial;
          background:#f2f2f2;
        }

        .container{
          display:flex;
          justify-content:center;
          align-items:center;
          height:100vh;
        }

        .box{
          width:350px;
          background:white;
          padding:25px;
          border-radius:10px;
          box-shadow:0 0 10px rgba(0,0,0,0.1);
          text-align:center;
        }

        input{
          width:100%;
          padding:10px;
          margin-top:10px;
          border:1px solid #ccc;
          border-radius:5px;
          box-sizing:border-box;
        }

        button{
          width:100%;
          padding:10px;
          margin-top:15px;
          border:none;
          background:blue;
          color:white;
          border-radius:5px;
          cursor:pointer;
        }

        span{
          color:blue;
          cursor:pointer;
          font-weight:bold;
        }
      `}</style>

      {page === "signup" && <Signup setPage={setPage} />}

      {page === "login" && (
        <Login setPage={setPage} setStudent={setStudent} />
      )}

      {page === "dashboard" && (
        <Dashboard student={student} logout={logout} />
      )}
    </>
  );
};
export default App;
