import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const OwnerDashboard = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [enterpriseInfo, setEnterpriseInfo] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    userResponse,
                    enterpriseResponse,
                    employeesResponse,
                    departmentsResponse
                ] = await Promise.all([
                    api.get('/api/users/me'),
                    api.get('/api/enterprises/current'),
                    api.get('/api/enterprises/employees'),
                    api.get('/api/enterprises/departments')
                ]);

                setUserInfo(userResponse.data);
                setEnterpriseInfo(enterpriseResponse.data);
                setEmployees(employeesResponse.data);
                setDepartments(departmentsResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-4">
            <h2>Enterprise Owner Dashboard</h2>

            {/* Owner Info Section */}
            <section className="mb-4">
                <h3>Owner Information</h3>
                {userInfo && (
                    <div className="card p-3">
                        <p>Name: {userInfo.username}</p>
                        <p>Email: {userInfo.email}</p>
                        <p>Role: Enterprise Owner</p>
                    </div>
                )}
            </section>

            {/* Enterprise Info Section */}
            <section className="mb-4">
                <h3>Enterprise Information</h3>
                {enterpriseInfo && (
                    <div className="card p-3">
                        <p>Name: {enterpriseInfo.name}</p>
                        <p>Total Employees: {enterpriseInfo.totalEmployees}</p>
                        <p>Established: {enterpriseInfo.establishedDate}</p>
                    </div>
                )}
            </section>

            {/* Departments Overview */}
            <section className="mb-4">
                <h3>Departments</h3>
                <div className="row">
                    {departments.map(dept => (
                        <div key={dept.id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{dept.name}</h5>
                                    <p className="card-text">
                                        Manager: {dept.managerName}<br />
                                        Employees: {dept.employeeCount}<br />
                                        Items: {dept.itemCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* All Employees Table */}
            <section className="mb-4">
                <h3>All Employees</h3>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Role</th>
                            <th>Items Assigned</th>
                            <th>Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {employees.map(employee => (
                            <tr key={employee.id}>
                                <td>{employee.username}</td>
                                <td>{employee.department}</td>
                                <td>{employee.role}</td>
                                <td>{employee.itemsCount}</td>
                                <td>{employee.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default OwnerDashboard;