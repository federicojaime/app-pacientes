import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import HomePage from './pages/HomePage';
import ScannerPage from './pages/ScannerPage';
import ProfilePage from './pages/ProfilePage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import PatientContext from './contexts/PatientContext';
import DarkModeContext from './contexts/DarkModeContext';

function App() {
  const [patient, setPatient] = useState(null);
  // Forzamos modo claro por defecto, pero permitimos cambiar
  const [darkMode, setDarkMode] = useState(false);

  // Guardar preferencia de tema en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('darkMode', JSON.stringify(newMode));
      return newMode;
    });
  };

  // Usar el basename para que funcione correctamente en el servidor en subcarpeta
  const basename = '/app-dni';

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <PatientContext.Provider value={{ patient, setPatient }}>
        <div className={darkMode ? 'dark' : ''}>
          <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
            <Router basename={basename}>
              <Navbar />
              <main className="flex-grow px-4 py-6 md:px-6">
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/scan" element={<ScannerPage />} />
                    <Route path="/profile" element={
                      patient ? <ProfilePage /> : <Navigate to="/scan" />
                    } />
                    <Route path="/register" element={<RegisterPage />} />
                  </Routes>
                </AnimatePresence>
              </main>
              <Footer />
            </Router>
          </div>
        </div>
      </PatientContext.Provider>
    </DarkModeContext.Provider>
  );
}

export default App;