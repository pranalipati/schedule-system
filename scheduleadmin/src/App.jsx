import './App.css';
import Login from './Components/Login.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard.jsx';
import Home from './Components/Home.jsx';
import Schedule from './Components/Schedule.jsx';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/adminlogin" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} >
            <Route path="" element={<Home />} />
            <Route path="/dashboard/Schedule" element={<Schedule />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
