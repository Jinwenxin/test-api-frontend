// src/components/TestSuiteManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';

const TestSuiteManager = () => {
    const [testSuites, setTestSuites] = useState([]);
    const [newTestSuite, setNewTestSuite] = useState({ name: '' });
    const [editMode, setEditMode] = useState(false);
    const [editTestSuite, setEditTestSuite] = useState({ id: null, name: '' });

    useEffect(() => {
        fetchTestSuites();
    }, []);

    const fetchTestSuites = () => {
        axios.get('/api/testsuites')
            .then(response => setTestSuites(response.data))
            .catch(error => console.error('Error fetching test suites:', error));
    };

    const handleCreateTestSuite = () => {
        axios.post('/api/testsuites', newTestSuite)
            .then(() => {
                fetchTestSuites();
                setNewTestSuite({ name: '' });
            })
            .catch(error => console.error('Error creating test suite:', error));
    };

    const handleDeleteTestSuite = (id) => {
        axios.delete(`/api/testsuites/${id}`)
            .then(() => {
                fetchTestSuites();
            })
            .catch(error => {console.error('Error deleting test suite:', error);
                alert('Error deleting test suite. Try to remove all test cases associated with this test suite first.');
            });
    };

    const handleEditTestSuite = () => {
        axios.put(`/api/testsuites/${editTestSuite.id}`, editTestSuite)
            .then(() => {
                fetchTestSuites();
                setEditMode(false);
                setEditTestSuite({ id: null, name: '' });
            })
            .catch(error => console.error('Error editing test suite:', error));
    };

    return (
        <Layout>
            <h1>Test Suite Management</h1>
            {editMode ? (
                <form onSubmit={(e) => { e.preventDefault(); handleEditTestSuite(); }}>
                    <input
                        type="text"
                        placeholder="Test Suite Name"
                        value={editTestSuite.name}
                        onChange={(e) => setEditTestSuite({ ...editTestSuite, name: e.target.value })}
                        required
                    />
                    <button type="submit">Update Test Suite</button>
                    <button onClick={() => { setEditMode(false); setEditTestSuite({ id: null, name: '' }); }}>Cancel</button>
                </form>
            ) : (
                <form onSubmit={(e) => { e.preventDefault(); handleCreateTestSuite(); }}>
                    <input
                        type="text"
                        placeholder="Test Suite Name"
                        value={newTestSuite.name}
                        onChange={(e) => setNewTestSuite({ name: e.target.value })}
                        required
                    />
                    <button type="submit">Create Test Suite</button>
                </form>
            )}
            <table className="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {testSuites.map(testSuite => (
                        <tr key={testSuite.id}>
                            <td>{testSuite.name}</td>
                            <td>
                                <button
                                    className="btn btn-danger me-2"
                                    onClick={() => handleDeleteTestSuite(testSuite.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => { setEditMode(true); setEditTestSuite({ id: testSuite.id, name: testSuite.name }); }}
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Layout>
    );
};

export default TestSuiteManager;
