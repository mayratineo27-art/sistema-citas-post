import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { PatientListPage } from './pages/PatientListPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/patients" element={<PatientListPage />} />
                {/* Add more routes here */}
            </Routes>
        </Router>
    );
}

export default App;
