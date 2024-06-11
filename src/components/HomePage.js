// src/components/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const HomePage = () => {
    return (
        <div className="container-fluid">
            <div className="row">
                <nav className="col-md-2 d-none d-md-block bg-light sidebar">
                    <div className="sidebar-sticky">
                        <ul className="nav flex-column">
                            <li className="nav-item">
                                <Link className="nav-link active" to="/test-case-management">
                                    Test Case Management
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/test-suite-management">
                                    Test Suite Management
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/test-results">
                                    Test Results
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
                <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4">
                    <h1>Welcome to the API Test Manager</h1>
                    <p>Select an option from the menu to get started.</p>
                </main>
            </div>
        </div>
    );
};

export default HomePage;
