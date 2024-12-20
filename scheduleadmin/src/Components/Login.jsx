// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import { useNavigate } from 'react-router';

const Login = () => {
  const [Values, setValues] = useState({
    username: '',
    password: '',
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post('http://localhost:3000/auth/adminlogin', Values)
      .then((result) => {
        if (result.data.loginStatus) {
          localStorage.setItem('adminEmail', result.data.email); 
          navigate('/dashboard');
        } else {
          setError(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-3 rounded w-25 border loginForm">
        <div className="text-warning">{error && error}</div>
        <h2>Login Admin Page</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Username:</strong>
            </label>
            <input
              type="text"
              name="username"
              autoComplete="off"
              id="username"
              placeholder="Enter your username"
              onChange={(e) =>
                setValues({ ...Values, username: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password">
              <strong>Password:</strong>
            </label>
            <input
              type="text"
              name="password"
              autoComplete="off"
              id="password"
              placeholder="Enter your password"
              onChange={(e) =>
                setValues({ ...Values, password: e.target.value })
              }
              className="form-control rounded-0"
            />
          </div>
          <button className="btn btn-success w-100 rounded-0">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
