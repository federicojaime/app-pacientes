import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat } from '@zxing/browser';
import { FaCamera, FaQrcode, FaSpinner, FaTimes, FaKeyboard } from 'react-icons/fa';

const DniScanner = ({ onDniScanned }) => {
    const videoRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [rawScan, setRawScan] = useState(null);
    const [lastScan, setLastScan] = useState(null);
    const [timeoutMsg, setTimeoutMsg] = useState(null);
    const [scanTimeout, setScanTimeout] = useState(null);
    const codeReader = useRef(null);

    useEffect(() => {
        return () => {
            stopScanner();
        };
        // eslint-disable-next-line
    }, []);

    const startScanner = async () => {
        setError(null);
        setRawScan(null);
        setLastScan(null);
        setTimeoutMsg(null);
        if (scanTimeout) clearTimeout(scanTimeout);
        setScanning(true);
        try {
            codeReader.current = new BrowserMultiFormatReader();
            const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();
            // Buscar cámara trasera
            let deviceId = null;
            if (videoInputDevices.length === 0) throw new Error('No se encontró cámara disponible');
            // Buscar por label (puede variar según el dispositivo)
            const backCam = videoInputDevices.find(device =>
                device.label.toLowerCase().includes('back') ||
                device.label.toLowerCase().includes('trasera') ||
                device.label.toLowerCase().includes('rear')
            );
            if (backCam) {
                deviceId = backCam.deviceId;
            } else {
                deviceId = videoInputDevices[0].deviceId;
            }
            codeReader.current.decodeFromVideoDevice(
                deviceId,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        setRawScan(result.getText());
                        setTimeoutMsg(null);
                        if (scanTimeout) clearTimeout(scanTimeout);
                        processPdf417Data(result.getText());
                        stopScanner();
                    } else if (err && !(err instanceof NotFoundException)) {
                        setError('Error al escanear: ' + err);
                    }
                },
                {
                    formats: [BarcodeFormat.PDF_417],
                }
            );
            // Timeout de 10 segundos para mostrar mensaje si no se escanea nada
            const timeout = setTimeout(() => {
                setTimeoutMsg("No se detectó ningún código. Intenta mover el DNI, mejorar la iluminación o enfocar mejor.");
            }, 10000);
            setScanTimeout(timeout);
        } catch (err) {
            setError(err.message || 'No se pudo iniciar la cámara. Verifica los permisos e intenta de nuevo.');
            setScanning(false);
        }
    };

    const stopScanner = () => {
        setScanning(false);
        setTimeoutMsg(null);
        if (scanTimeout) clearTimeout(scanTimeout);
        if (codeReader.current) {
            codeReader.current.reset();
        }
    };

    const processPdf417Data = (data) => {
        try {
            setLastScan(data);
            // Extraer el DNI: buscar el primer número de 7 u 8 dígitos
            let dni = null;
            let parts = [];
            if (data.includes('|')) {
                parts = data.split('|');
            } else if (data.includes('@')) {
                parts = data.split('@');
            }
            dni = parts.find(p => /^\d{7,8}$/.test(p));
            if (!dni) {
                const dniMatch = data.match(/\b\d{7,8}\b/);
                if (dniMatch) {
                    dni = dniMatch[0];
                }
            }
            if (dni && /^\d{7,8}$/.test(dni)) {
                onDniScanned(dni);
            } else {
                setError("No se pudo extraer un DNI válido del código escaneado. Por favor, intenta de nuevo o ingresa el DNI manualmente.");
                setLastScan(data);
            }
        } catch (err) {
            setError("El código escaneado no contiene un DNI válido o no es un DNI argentino");
        }
    };

    const enterDniManually = () => {
        const dni = prompt("Ingresa el número de DNI:");
        if (dni && /^\d{7,8}$/.test(dni)) {
            onDniScanned(dni);
        } else if (dni) {
            alert("El DNI debe tener entre 7 y 8 dígitos");
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                    Escanear DNI
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
                    Coloca el código PDF417 del reverso de tu DNI frente a la cámara
                </p>
                <div className="relative w-full h-64 bg-gray-900 rounded-lg overflow-hidden mb-4 flex items-center justify-center">
                    {scanning ? (
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover rounded-lg"
                            style={{ zIndex: 1 }}
                            autoPlay
                            muted
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-white w-full">
                            <div className="bg-white/10 p-6 rounded-xl mb-4">
                                <div className="w-36 h-16 border-2 border-primary-400 rounded flex items-center justify-center">
                                    <div className="text-center">
                                        <FaQrcode className="mx-auto text-primary-400 text-xl mb-1" />
                                        <span className="text-xs text-gray-300">Código PDF417</span>
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm">
                                Presiona el botón para activar la cámara
                            </p>
                        </div>
                    )}
                    {/* Guía visual */}
                    {scanning && (
                        <>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-24 border-2 border-primary-400 rounded-md pointer-events-none" style={{zIndex: 2}}>
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary-400 scanner-animation"></div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center" style={{zIndex: 2}}>
                                <p className="inline-block px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                                    Alinea el código PDF417 dentro del marco
                                </p>
                            </div>
                        </>
                    )}
                </div>
                {/* Carteles de feedback */}
                {timeoutMsg && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-3 rounded-lg mb-2" style={{zIndex: 10}}>
                        <strong>{timeoutMsg}</strong>
                    </div>
                )}
                {rawScan && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-3 rounded-lg mb-2" style={{zIndex: 10}}>
                        <strong>Texto escaneado:</strong>
                        <div className="break-all text-xs mt-1">{rawScan}</div>
                    </div>
                )}
                {lastScan && !error && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-3 rounded-lg mb-2" style={{zIndex: 10}}>
                        <strong>Último intento de extracción:</strong>
                        <div className="break-all text-xs mt-1">{lastScan}</div>
                    </div>
                )}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4" style={{zIndex: 10}}>
                        {error}
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    {!scanning ? (
                        <button
                            onClick={startScanner}
                            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FaCamera /> Iniciar cámara
                        </button>
                    ) : (
                        <button
                            onClick={stopScanner}
                            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                        >
                            <FaTimes /> Cancelar
                        </button>
                    )}
                    <button
                        onClick={enterDniManually}
                        className="w-full py-2.5 border border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <FaKeyboard /> Ingresar DNI manualmente
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DniScanner;