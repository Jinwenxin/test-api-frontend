import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';

const TestResultsPage = () => {
    const [testResults, setTestResults] = useState([]);


    useEffect(() => {
        fetchTestResults();
    }, []);

    const fetchTestResults = async () => {
        const result = await axios.get('/api/testresults');
        setTestResults(result.data);
    };
    return (
        <Layout>
        <div>
            <h1>Test Results</h1>
            <table className='table table-primary table-striped'>
                <thead>
                    <tr>
                        <th scope="col">Test Name</th>
                        <th scope="col">Test Date</th>
                        <th scope="col">Actual Result</th>
                        <th scope="col">Expected Result</th>
                        <th scope="col">Error Message</th>
                        <th scope="col">Comparison Result</th>
                        <th scope="col">Status</th>
                        <th scope="col">Test Suite</th>

                    </tr>
                </thead>
                <tbody>
                    {testResults.map(testResult => (
                        <tr key={testResult.testRunId}>
                            <td>{testResult.testCase.name}</td>
                            <td>{testResult.runAt}</td>
                            <td>{testResult.actualResult}</td>
                            <td>{testResult.expectedResult}</td>
                            <td>{testResult.errorMessage}</td>
                            <td>{testResult.comparisonResult}</td>
                            <td>{testResult.status}</td>
                            <td>{testResult.testSuite?testResult.testSuite.name:'N/A'}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </Layout>
    );
};

export default TestResultsPage;