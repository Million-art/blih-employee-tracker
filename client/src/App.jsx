import Test from './Test';
import React, { useState, useEffect } from 'react';

const apiBaseUrl = 'http://localhost:3001';

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', work: '' });
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error.message);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (selectedEmployeeId) {
      // Update existing employee
      try {
        const response = await fetch(`${apiBaseUrl}/employees/${selectedEmployeeId}`, {
          method: 'PUT', // Assuming your backend supports PUT for updates
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedEmployees = employees.map((employee) =>
            employee.id === selectedEmployeeId ? { ...employee, ...formData } : employee
          );
          setEmployees(updatedEmployees);
          setFormData({ name: '', email: '', work: '' });
          setSelectedEmployeeId(null);
        } else {
          console.error('Error updating employee:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating employee:', error.message);
      }
    } else {
      // Add new employee
      try {
        const response = await fetch(`${apiBaseUrl}/employees`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const data = await response.json();
          setEmployees([...employees, data]);
          setFormData({ name: '', email: '', work: '' });
        } else {
          console.error('Error creating employee:', response.statusText);
        }
      } catch (error) {
        console.error('Error creating employee:', error.message);
      }
    }
  };

  const handleEdit = (id) => {
    // Set the selected employee's data in the form for editing
    const selectedEmployee = employees.find((employee) => employee.id === id);
    setFormData({
      name: selectedEmployee.name,
      email: selectedEmployee.email,
      work: selectedEmployee.work,
    });
    setSelectedEmployeeId(id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${apiBaseUrl}/employees/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedEmployees = employees.filter((employee) => employee.id !== id);
        setEmployees(updatedEmployees);
      } else {
        console.error('Error deleting employee:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting employee:', error.message);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-4xl font-bold mb-4"> Blih Employees Attendance Manager</h1>

      <form onSubmit={handleFormSubmit} className="mb-8">
        <label className="block mb-2">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 mb-4"
          required
        />

        <label className="block mb-2">Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="border p-2 mb-4"
          required
        />

        <label className="block mb-2">Work:</label>
        <input
          type="text"
          name="work"
          value={formData.work}
          onChange={handleInputChange}
          className="border p-2 mb-4"
          required
        />

        <button type="submit" className="bg-blue-500 text-white p-2">
          {selectedEmployeeId ? 'Update Employee' : 'Add Employee'}
        </button>
      </form>

      {employees.length > 0 && (
        <table className="table-auto w-full text-center">
          <thead>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Work</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="border px-4 py-2">{employee.name}</td>
                <td className="border px-4 py-2">{employee.email}</td>
                <td className="border px-4 py-2">{employee.work}</td>
                <td className="border px-4 py-2">
                  <button onClick={() => handleEdit(employee.id)} className="mr-2 text-white bg-green-600 px-2">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(employee.id)} className="px-2 text-white bg-red-500">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div>
        <Test />
      </div>
    </div>
  );
};

export default App;
  