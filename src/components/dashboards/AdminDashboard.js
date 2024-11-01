import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminDashboard = () => {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('/api/enterprises/employees');
            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const handleEdit = (employee) => {
        setSelectedEmployee(employee);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (employeeId) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`/api/users/${employeeId}`);
                fetchEmployees(); // Refresh the list
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleSaveEdit = async (updatedEmployee) => {
        try {
            await api.put(`/api/users/${updatedEmployee.id}`, updatedEmployee);
            setIsEditModalOpen(false);
            fetchEmployees(); // Refresh the list
        } catch (error) {
            console.error('Error updating employee:', error);
        }
    };

    // Edit Modal Component
    const EditModal = ({ employee, onSave, onClose }) => {
        const [editData, setEditData] = useState(employee);

        return (
            <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Edit Employee</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="mb-3">
                                    <label className="form-label">Username</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={editData.username}
                                        onChange={(e) => setEditData({...editData, username: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={editData.email}
                                        onChange={(e) => setEditData({...editData, email: e.target.value})}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Role</label>
                                    <select
                                        className="form-select"
                                        value={editData.role}
                                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="MANAGER">Manager</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                Close
                            </button>
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => onSave(editData)}
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="container mt-4">
            <h2>Admin Dashboard</h2>

            {/* Employees Table */}
            <div className="table-responsive">
                <table className="table">
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Department</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.username}</td>
                            <td>{employee.email}</td>
                            <td>{employee.role}</td>
                            <td>{employee.department}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm me-2"
                                    onClick={() => handleEdit(employee)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(employee.id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedEmployee && (
                <EditModal
                    employee={selectedEmployee}
                    onSave={handleSaveEdit}
                    onClose={() => setIsEditModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;