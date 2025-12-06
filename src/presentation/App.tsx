import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DashboardPage } from './pages/DashboardPage';
import { PatientListPage } from './pages/PatientListPage';
import { LoginPage } from './pages/LoginPage';
import { DoctorListPage } from './pages/DoctorListPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<DashboardPage />} />
                <Route path="/patients" element={<PatientListPage />} />
                <Route path="/doctors" element={<DoctorListPage />} />
            </Routes>
        </Router>
    );
}

export default App;
