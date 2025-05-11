import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, NotFoundException } from '@zxing/library';
import { FaCamera, FaQrcode, FaSpinner, FaTimes, FaKeyboard, FaCheck, FaInfoCircle } from 'react-icons/fa';

const DniScanner = ({ onDniScanned }) => {
    const videoRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [rawScan, setRawScan] = useState(null);
    const [timeoutMsg, setTimeoutMsg] = useState(null);
    const [scanTimeout, setScanTimeout] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const codeReader = useRef(null);

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    useEffect(() => {
        // Limpiar al desmontar el componente
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        setError(null);
        setRawScan(null);
        setScannedData(null);
        setTimeoutMsg(null);
        
        if (scanTimeout) clearTimeout(scanTimeout);
        
        setScanning(true);
        
        try {
            // Inicializar el lector de códigos
            codeReader.current = new BrowserMultiFormatReader();
            
            // Obtener dispositivos de video disponibles
            const reader = codeReader.current;
            const videoInputDevices = await reader.listVideoInputDevices();
            
            if (videoInputDevices.length === 0) {
                throw new Error('No se encontró cámara disponible');
            }
            
            // Encontrar la cámara adecuada
            let selectedDeviceId = null;
            
            if (isMobile) {
                // En dispositivos móviles, intentar usar la cámara trasera
                const backCamera = videoInputDevices.find(device => 
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('trasera') ||
                    device.label.toLowerCase().includes('rear') ||
                    device.label.toLowerCase().includes('ambiente') ||
                    device.label.toLowerCase().includes('dorsal')
                );
                
                if (backCamera) {
                    selectedDeviceId = backCamera.deviceId;
                } else {
                    // De lo contrario, tratar de usar la última cámara (suele ser la trasera en móviles)
                    selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                }
            } else {
                // En PC/laptop, usar la primera disponible
                selectedDeviceId = videoInputDevices[0].deviceId;
            }
            
            // Comenzar la decodificación continua
            reader.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const scannedText = result.getText();
                        setRawScan(scannedText);
                        setTimeoutMsg(null);
                        if (scanTimeout) clearTimeout(scanTimeout);
                        processDniData(scannedText);
                        stopScanner();
                    } else if (err && !(err instanceof NotFoundException)) {
                        setError('Error al escanear: ' + err);
                    }
                },
                { formats: [BarcodeFormat.PDF_417] }
            );
            
            // Establecer un tiempo de espera para mostrar mensaje si no se escanea nada
            const timeout = setTimeout(() => {
                setTimeoutMsg("No se detectó ningún código. Intenta mover el DNI, mejorar la iluminación o enfocar mejor.");
            }, 20000); // Aumentado a 20 segundos para dar más tiempo
            
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

    const processDniData = (data) => {
        try {
            console.log("Datos escaneados:", data);
            
            // Verificar si el formato contiene @ como separador (formato requerido)
            if (data.includes('@')) {
                const parts = data.split('@');
                
                // Según el formato proporcionado, el DNI está en la posición 5 (índice 4)
                // "00610299988@JAIME@FEDERICO NICOLAS@M@38437748@C@22/09/1994@28/09/2019@204"
                if (parts.length >= 5) {
                    const dni = parts[4];
                    const apellido = parts[1] || '';
                    const nombre = parts[2] || '';
                    const genero = parts[3] || '';
                    const fechaNac = parts.length >= 7 ? parts[6] : '';
                    
                    // Verificar que el DNI tenga el formato correcto (7-8 dígitos)
                    if (/^\d{7,8}$/.test(dni)) {
                        setScannedData({
                            dni,
                            apellido,
                            nombre,
                            genero,
                            fechaNac
                        });
                        
                        // Notificar el DNI escaneado correctamente
                        onDniScanned(dni);
                    } else {
                        setError(`El DNI encontrado (${dni}) no tiene el formato correcto. Debe tener entre 7 y 8 dígitos.`);
                    }
                } else {
                    setError("El código escaneado no contiene suficientes datos en el formato esperado.");
                }
            } else {
                // Intentar buscar un número de DNI en el texto completo como fallback
                const dniMatch = data.match(/\b\d{7,8}\b/);
                if (dniMatch) {
                    setScannedData({
                        dni: dniMatch[0],
                        apellido: 'No disponible',
                        nombre: 'No disponible',
                        genero: 'No disponible',
                        fechaNac: 'No disponible'
                    });
                    
                    // Notificar el DNI escaneado encontrado
                    onDniScanned(dniMatch[0]);
                } else {
                    setError("El código escaneado no tiene el formato esperado y no se pudo encontrar un DNI.");
                }
            }
        } catch (err) {
            console.error("Error al procesar el código:", err);
            setError("Error al procesar el código: " + err.message);
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
                            className="absolute inset-0 w-full h-full object-cover rounded-lg camera-active"
                            autoPlay
                            playsInline
                            muted
                            style={{ zIndex: 1 }}
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
                    
                    {/* Guía visual de escáner */}
                    {scanning && (
                        <>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-24 border-2 border-primary-400 rounded-md pointer-events-none z-10">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-primary-400 scanner-animation"></div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                                <p className="inline-block px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                                    Alinea el código PDF417 dentro del marco
                                </p>
                            </div>
                        </>
                    )}
                </div>
                
                {/* Carteles de feedback */}
                {timeoutMsg && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-3 rounded-lg mb-4">
                        <strong>{timeoutMsg}</strong>
                    </div>
                )}
                
                {scannedData && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 p-4 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                            <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold">¡DNI escaneado correctamente!</h3>
                                <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                    <div><strong>DNI:</strong> {scannedData.dni}</div>
                                    <div><strong>Apellido:</strong> {scannedData.apellido}</div>
                                    <div><strong>Nombre:</strong> {scannedData.nombre}</div>
                                    <div><strong>Género:</strong> {scannedData.genero === 'M' ? 'Masculino' : 'Femenino'}</div>
                                    <div><strong>Fecha Nac.:</strong> {scannedData.fechaNac}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                
                {error && !scannedData && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
                        <p className="font-medium">{error}</p>
                        {rawScan && (
                            <div className="mt-2 text-xs">
                                <p>Texto escaneado: {rawScan.substring(0, 50)}...</p>
                            </div>
                        )}
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
                
                {/* Ayuda sobre formato de DNI */}
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-xs text-blue-700 dark:text-blue-300">
                    <div className="flex items-start gap-2">
                        <FaInfoCircle className="mt-0.5 text-blue-500" />
                        <div>
                            <p>El scanner está configurado para el formato de DNI argentino.</p>
                            <p className="mt-1">Formato esperado: @APELLIDO@NOMBRE@SEXO@DNI@...@FECHA_NACIMIENTO@...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DniScanner;