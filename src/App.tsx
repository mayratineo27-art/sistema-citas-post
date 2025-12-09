
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { ClientLayout } from './presentation/client/ClientLayout';
import { Home as ClientHome } from './presentation/client/Home';
import { Medicos as ClientMedicos } from './presentation/client/Medicos';
import { Citas as ClientCitas } from './presentation/client/Citas';
import { Perfil as ClientPerfil } from './presentation/client/Perfil';
import { Notificaciones as ClientNotificaciones } from './presentation/client/Notificaciones';
import { BookingSpecialties } from './presentation/client/BookingSpecialties';
import { BookingServices } from './presentation/client/BookingServices';
import { BookingSlots } from './presentation/client/BookingSlots';
import { BookingConfirmation } from './presentation/client/BookingConfirmation';
import { TestPage } from './TestPage';

import { Recetas } from './presentation/client/Recetas';
import { Historial } from './presentation/client/Historial';
import { Analisis } from './presentation/client/Analisis';
import { Familiares } from './presentation/client/Familiares';

// Minimal App for Debugging
function App() {
    return (
        <Router>
            <Routes>
                {/* 1. Route to verify React works */}
                <Route path="/test" element={<TestPage />} />

                {/* 2. Client Portal Routes */}
                <Route path="/cliente" element={<ClientLayout />}>
                    <Route index element={<ClientHome />} />
                    <Route path="home" element={<ClientHome />} />
                    <Route path="medicos" element={<ClientMedicos />} />
                    <Route path="citas" element={<ClientCitas />} />
                    {/* Booking Routes */}
                    <Route path="reservar" element={<BookingSpecialties />} />
                    <Route path="reservar/servicios/:especialidad" element={<BookingServices />} />
                    <Route path="reservar/horarios/:especialidad" element={<BookingSlots />} />
                    <Route path="reservar/confirmar" element={<BookingConfirmation />} />

                    <Route path="recetas" element={<Recetas />} />
                    <Route path="historial" element={<Historial />} />
                    <Route path="analisis" element={<Analisis />} />
                    <Route path="familiares" element={<Familiares />} />

                    <Route path="perfil" element={<ClientPerfil />} />
                    <Route path="notificaciones" element={<ClientNotificaciones />} />
                </Route>

                {/* Default Redirect to Client Home */}
                <Route path="/" element={<Navigate to="/cliente/home" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
