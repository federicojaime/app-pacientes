import { createContext } from 'react';

const PatientContext = createContext({
    patient: null,
    setPatient: () => { }
});

export default PatientContext;