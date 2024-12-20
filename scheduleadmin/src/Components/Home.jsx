import axios from 'axios';
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [employees, setEmployees] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [adminRecords, setAdminRecords] = useState([]);

  useEffect(() => {
    adminCount();
    employeeCount();
    fetchEmployees();
    AdminRecords();
  }, []);

  const AdminRecords = () => {
    axios.get('http://localhost:3000/auth/admin_records')
      .then(result => {
        if (result.data.Status) {
          setAdminRecords(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      });
  };

  // Fetch the list of employees
  const fetchEmployees = () => {
    axios.get('http://localhost:3000/auth/employees') // Adjust API endpoint as necessary
      .then(result => {
        if (result.data.Status) {
          setEmployees(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const adminCount = () => {
    axios.get('http://localhost:3000/auth/admin_count')
      .then(result => {
        if (result.data.Status) {
          setAdminTotal(result.data.Result[0].admin);
        }
      });
  };

  const employeeCount = () => {
    axios.get('http://localhost:3000/auth/employee_count')
      .then(result => {
        if (result.data.Status) {
          setEmployeeTotal(result.data.Result[0].employee);
        }
      });
  };

  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Admin</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{adminTotal}</h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className='d-flex justify-content-between'>
            <h5>Total:</h5>
            <h5>{employeeTotal}</h5>
          </div>
        </div>
      </div>

      {/* List of Employees */}
      <div className='mt-4'>
        <h3>Employee List</h3>
        <ul className='list-group'>
          {employees.map((employee) => (
            <li key={employee.id} className='list-group-item'>
              {employee.name} {employee.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
