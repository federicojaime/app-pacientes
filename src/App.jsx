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
import { getColorVariables } from './config/theme';

function App() {
  const [patient, setPatient] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    // Leer preferencia del usuario del localStorage
    const savedPreference = localStorage.getItem('darkMode');
    return savedPreference ? JSON.parse(savedPreference) :
      // O usar preferencia del sistema
      window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Aplicar variables de color CSS según el tema
  useEffect(() => {
    const root = document.documentElement;
    const colorVars = getColorVariables();

    // Aplicar todas las variables de color al elemento root
    Object.entries(colorVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, []);

  // Aplicar clase dark al elemento html cuando cambia darkMode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Guardar preferencia en localStorage
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prevMode => !prevMode);
  };

  // Usar el basename para que funcione correctamente en el servidor en subcarpeta
  const basename = '/app-dni';

  // Animación para transiciones de página
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <PatientContext.Provider value={{ patient, setPatient }}>
        <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
          <Router basename={basename}>
            <Navbar />
            <main className="flex-grow px-4 py-6 md:px-6 pt-24">
              <AnimatePresence mode="wait">
                <Routes>
                  <Route
                    path="/"
                    element={
                      <motion.div
                        key="home"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.3 }}
                      >
                        <HomePage />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/scan"
                    element={
                      <motion.div
                        key="scan"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.3 }}
                      >
                        <ScannerPage />
                      </motion.div>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <motion.div
                        key="profile"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.3 }}
                      >
                        {patient ? <ProfilePage /> : <Navigate to="/scan" />}
                      </motion.div>
                    }
                  />
                  <Route
                    path="/register"
                    element={
                      <motion.div
                        key="register"
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        transition={{ duration: 0.3 }}
                      >
                        <RegisterPage />
                      </motion.div>
                    }
                  />
                </Routes>
              </AnimatePresence>
            </main>
            <Footer />
          </Router>
        </div>
      </PatientContext.Provider>
    </DarkModeContext.Provider>
  );
}

export default App;