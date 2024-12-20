import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';
import './style.css';

const Schedule = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dateMap, setDateMap] = useState({});
  const [timeMap, setTimeMap] = useState({});
  const [commentMap, setCommentMap] = useState({});

  // Fetch employees on component mount
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/employees');
        if (response.data.Status) {
          setEmployees(response.data.Result);
        } else {
          alert(response.data.Error);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleCheckboxChange = (employeeId) => {
    setSelectedEmployees((prevSelected) =>
      prevSelected.includes(employeeId)
        ? prevSelected.filter(id => id !== employeeId)
        : [...prevSelected, employeeId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedEmployees.length === 0) {
      alert('Please select at least one employee.');
      return;
    }

    // Prepare schedule data
    const scheduleData = {
      employees: selectedEmployees,
      date: dateMap[selectedEmployees[0]], // Assuming all selected employees have the same date
      time: timeMap[selectedEmployees[0]], // Assuming all selected employees have the same time
      comment: commentMap[selectedEmployees[0]], // Assuming all selected employees have the same comment
      adminEmail: localStorage.getItem('adminEmail') // Retrieve admin email from local storage
    };

    try {
      const response = await axios.post('http://localhost:3000/auth/schedule', scheduleData);
      if (response.data.Status) {
        alert('Schedule created successfully!'); // Alert on success
        // Reset form fields after successful submission
        setSelectedEmployees([]);
        setDateMap({});
        setTimeMap({});
        setCommentMap({});
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error('Error submitting schedule:', error);
      alert('Failed to create schedule.');
    }
  };

  return (
    <div className="container">
      <h2>Scheduling Page</h2>
      <form onSubmit={handleSubmit}>
        <table className="table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Employee Name</th>
              <th>Date</th>
              <th>Time</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <input
                    type="checkbox"
                    id={`employee-${employee.id}`}
                    checked={selectedEmployees.includes(employee.id)}
                    onChange={() => handleCheckboxChange(employee.id)}
                  />
                </td>
                <td>{employee.name}</td>
                <td>
                  <input
                    type="date"
                    value={dateMap[employee.id] || ''}
                    onChange={(e) => setDateMap({ ...dateMap, [employee.id]: e.target.value })}
                    min={new Date().toISOString().split('T')[0]} // Future-only dates
                    required={selectedEmployees.includes(employee.id)}
                  />
                </td>
                <td>
                  <input
                    type="time"
                    value={timeMap[employee.id] || ''}
                    onChange={(e) => setTimeMap({ ...timeMap, [employee.id]: e.target.value })}
                    required={selectedEmployees.includes(employee.id)}
                  />
                </td>
                <td>
                  <textarea
                    value={commentMap[employee.id] || ''}
                    onChange={(e) => setCommentMap({ ...commentMap, [employee.id]: e.target.value })}
                    maxLength="200"
                    placeholder="Enter your comment (200 characters max)"
                    required={selectedEmployees.includes(employee.id)}
                  ></textarea>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button type="submit" className="btn btn-primary mt-3">Submit Schedule</button>
      </form>
    </div>
  );
};

export default Schedule;
