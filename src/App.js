// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import TestCaseManager from './components/TestCaseManager';
import TestSuiteManagementPage from './components/TestSuiteManager';
import TestResultsPage from './components/TestResultsPage';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/test-case-management" element={<TestCaseManager />} />
                <Route path="/test-suite-management" element={<TestSuiteManagementPage />} />
                <Route path="/test-results" element={<TestResultsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
