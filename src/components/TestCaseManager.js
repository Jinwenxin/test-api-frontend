// src/components/TestCaseManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import JsonViewer from './JsonViewer'
import { type } from '@testing-library/user-event/dist/type';
import './TestCaseManager.css';

const TestCaseManager = () => {
    const [testCases, setTestCases] = useState([]);
    const [testSuites, setTestSuites] = useState([]);
    const [newTestCase, setNewTestCase] = useState({ name: '', endpoint: '', testSuiteId: '', method: 'GET', requestBody: '', expectedResponse: '' });
    // use for edit
    const [selectedTestCase, setSelectedTestCase] = useState(null); // use for edit
    // use for run test case
    const [actualResponse, setActualResponse] = useState('');
    const [responseDiff, setTestRunResult] = useState('');
    const [testCaseToRun, setTestCaseToRun] = useState([]);
    // use for delete
    const [showModal, setShowModal] = useState(false);
    const [testCaseToDelete, setTestCaseToDelete] = useState(null);
    const [testCaseToDeleteName, setTestCaseToDeleteName] = useState('');
    // use for run test case
    const [testResult, setTestResult] = useState('');

    useEffect(() => {
        fetchTestCases();
        fetchTestSuites();
    }, []);

    const fetchTestCases = () => {
        axios.get('/api/testcases')
            .then(response => setTestCases(response.data))
            .catch(error => console.error('Error fetching test cases:', error));
    };

    const fetchTestSuites = () => {
        axios.get('/api/testsuites')
            .then(response => setTestSuites(response.data))
            .catch(error => console.error('Error fetching test suites:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedTestCase) {
            updateTestCase(selectedTestCase.id);
        } else {
            createTestCase();
        }
    };


    const createTestCase = () => {
        axios.post('/api/testcases', newTestCase)
            .then(() => {
                fetchTestCases();
                resetForm();
            })
            .catch(error => console.error('Error creating test case:', error));
    };

    const handleEdit = (testCase) => {
        console.log(testCase);
        setSelectedTestCase(testCase);
        setTestSuites(testSuites.map(suite => {
            if (suite.id === testCase.testSuiteId) {
                return { ...suite, selected: true }
            }
            return { ...suite, selected: false }

        }));

        setNewTestCase(
            {
                name: testCase.name, endpoint: testCase.endpoint, testSuiteId: testCase.testSuiteId, method: testCase.method, requestBody: testCase.requestBody, expectedResponse: testCase.expectedResponse,
                id: testCase.id,
                testSuiteId: testCase.testSuite ? testCase.testSuite.id : ''
            });

    };

    const resetForm = () => {
        setSelectedTestCase(null);
        setNewTestCase({ name: '', endpoint: '', testSuiteId: '', method: 'GET', requestBody: '', expectedResponse: '' });
    };

    const updateTestCase = (id) => {
        const updatedTestCase = { name: newTestCase.name, endpoint: newTestCase.endpoint, testSuiteId: newTestCase.testSuiteId, method: newTestCase.method, requestBody: newTestCase.requestBody, expectedResponse: newTestCase.expectedResponse.replace(/\n/g, ''), id };
        console.log(updatedTestCase);
        axios.put(`/api/testcases/${id}`, updatedTestCase)
            .then(response => {
                setTestCases(testCases.map(tc => (tc.id === id ? response.data : tc)));
                resetForm();
            })
            .catch(error => console.error('Error updating test case:', error));
    };

    const handleShowModal = (id, name) => {
        console.log(id);
        setTestCaseToDelete(id);
        setTestCaseToDeleteName(name);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setTestCaseToDelete(null);
        setTestCaseToDeleteName('');
    };

    const deleteTestCase = (id) => {
        axios.delete(`/api/testcases/${id}`)
            .then(() => {
                setTestCases(testCases.filter(tc => tc.id !== id));
                handleCloseModal();
            })
            .catch(error => console.error('Error deleting test case:', error));
    };

    const runTestCase = (testCase) => {
        setTestCaseToRun(testCase);
        axios.get(`/api/testcases/${testCase.id}/run`)
            .then(runResponse => {
                setActualResponse(runResponse.data.testResult);
                setTestRunResult(runResponse.data.diff ? 'Pass' : 'Fail');
                const firstResponse = runResponse.data;
                // save test result to test case
                console.log(runResponse);
                const testResult =
                {
                    testCase: { id: testCase.id },
                    runAt: new Date().toISOString(),
                    status: runResponse.status,
                    expectedResult: testCase.expectedResponse,
                    actualResult: actualResponse,
                    errorMessage: firstResponse.errorMessage,
                    comparisonResult: firstResponse.diff ? 'PASS' : 'FAIL'
                };
                // save test result to database
                return axios.post(`/api/testresults/save`, testResult)
                    .then(secondResponse => {
                        console.log(secondResponse);
                    })
                    .catch(error =>
                        console.error('Error saving test result:', error)
                    );
            })
            .catch(runError => {
                console.error('Error running test case:', runError);
                setActualResponse(runError.message);
                setTestRunResult('N/A');
                const errorResult =
                {
                    testCase: { id: testCase.id },
                    runAt: new Date().toISOString(),
                    status: runError.response.status,
                    expectedResult: testCase.expectedResponse,
                    actualResult: runError.message,
                    errorMessage: runError.response.statusText,
                    comparisonResult: 'N/A'
                };
                // save test result to database
                return axios.post(`/api/testresults/save`, errorResult)
                    .then(secondResponse => {
                        console.log(secondResponse);
                    })
                    .catch(error =>
                        console.error('Error saving test result:', error)
                    );
            });
    };





    return (
        <Layout>
            <div className='container'>
                <h1>Test Case Management</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newTestCase.name}
                        onChange={(e) => setNewTestCase({ ...newTestCase, name: e.target.value })}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Endpoint"
                        value={newTestCase.endpoint}
                        onChange={(e) => setNewTestCase({ ...newTestCase, endpoint: e.target.value })}
                        required
                    />
                    <select value={newTestCase.method}
                        onChange={(e) => setNewTestCase({ ...newTestCase, method: e.target.value })}>
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                    </select>
                    <textarea
                        placeholder="Request Body"
                        value={newTestCase.requestBody}
                        onChange={(e) => setNewTestCase({ ...newTestCase, requestBody: e.target.value })}
                    />
                    <textarea
                        placeholder="Expected Response"
                        value={newTestCase.expectedResponse}
                        onChange={(e) => setNewTestCase({ ...newTestCase, expectedResponse: e.target.value })}
                    />
                    <select
                        value={newTestCase.testSuiteId}
                        onChange={(e) => setNewTestCase({ ...newTestCase, testSuiteId: e.target.value })}
                        required
                    >
                        <option value="">Select Test Suite</option>
                        {testSuites.map(suite => (
                            <option key={suite.id} value={suite.id}>{suite.name}</option>
                        ))}
                    </select>
                    <button type="submit">{selectedTestCase ? 'Update Test Case' : 'Create Test Case'}</button>
                    <button type="button" onClick={resetForm}>Cancel</button>
                </form>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Endpoint</th>
                            <th>Test Suite</th>
                            <th>Request Body</th>
                            <th>Expected Response</th>
                            <th>Method</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testCases.map(testCase => (
                            <tr key={testCase.id}>
                                <td>{testCase.name}</td>
                                <td>{testCase.endpoint}</td>
                                <td>{testCase.testSuite ? testCase.testSuite.name : 'N/A'}</td>
                                <td>{testCase.requestBody}</td>
                                <td>{testCase.expectedResponse}</td>
                                <td>{testCase.method}</td>

                                <td>
                                    <div className="btn-group" role='group'>
                                        <button className="btn btn-primary me-2" onClick={() => handleEdit(testCase)}>Edit</button>
                                        <button className="btn btn-danger me-2" onClick={() => handleShowModal(testCase.id, testCase.name)}>Delete</button>
                                        <button className="btn btn-success" onClick={() => runTestCase(testCase)}>Run</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {actualResponse && (
                    <div>
                        <h2>Test Case Run Result</h2>
                        <h3>Test Case: {testCaseToRun.name}</h3>
                        <h3>Actual Response:</h3>
                        <JsonViewer jsonString={actualResponse} />

                        <h3>Diff:</h3>
                        <p>{responseDiff}</p>
                    </div>

                )}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <div className="modal-header">
                                <h5>Confirm Delete</h5>
                                <button className="close-button" onClick={handleCloseModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this test case with name: {testCaseToDeleteName}?
                            </div>
                            <div className="modal-footer">
                                <button className="btn" onClick={handleCloseModal}>Cancel</button>
                                <button className="btn btn-danger" onClick={() => deleteTestCase(testCaseToDelete)}>Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>


    );
};

export default TestCaseManager;
