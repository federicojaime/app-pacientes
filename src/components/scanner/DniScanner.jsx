import React, { useRef, useState, useEffect, useCallback } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, NotFoundException } from '@zxing/library';
import { FaCamera, FaQrcode, FaSpinner, FaTimes, FaKeyboard, FaBug, FaInfoCircle, FaAngleDown, FaAngleUp, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

const DniScanner = ({ onDniScanned }) => {
    const videoRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [rawScan, setRawScan] = useState(null);
    const [lastScan, setLastScan] = useState(null);
    const [timeoutMsg, setTimeoutMsg] = useState(null);
    const [scanTimeout, setScanTimeout] = useState(null);
    const codeReader = useRef(null);
    const [showDebug, setShowDebug] = useState(true); // Mostrar depuración por defecto
    const [debugInfo, setDebugInfo] = useState({
        parsedParts: [],
        detectedFormat: null,
        dniCandidates: [],
        deviceInfo: '',
        logs: []
    });

    // Función para añadir logs visibles sin usar console.log
    const addLog = (message, type = 'info') => {
        setDebugInfo(prev => ({
            ...prev,
            logs: [...prev.logs, { 
                message, 
                type, 
                timestamp: new Date().toLocaleTimeString()
            }]
        }));
    };

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    useEffect(() => {
        // Agregar información del dispositivo
        setDebugInfo(prev => ({
            ...prev,
            deviceInfo: `Dispositivo: ${isMobile ? 'Móvil' : 'PC/Laptop'}, UserAgent: ${navigator.userAgent.substring(0, 50)}...`
        }));
        
        addLog(`Inicializando escáner en ${isMobile ? 'dispositivo móvil' : 'PC/Laptop'}`);
        
        // Limpiar al desmontar el componente
        return () => {
            stopScanner();
        };
    }, []);

    const startScanner = async () => {
        setError(null);
        setRawScan(null);
        setLastScan(null);
        setTimeoutMsg(null);
        setDebugInfo(prev => ({
            ...prev,
            parsedParts: [],
            detectedFormat: null,
            dniCandidates: [],
            logs: [...prev.logs, { 
                message: 'Iniciando cámara...', 
                type: 'info', 
                timestamp: new Date().toLocaleTimeString()
            }]
        }));
        
        if (scanTimeout) clearTimeout(scanTimeout);
        
        setScanning(true);
        
        try {
            // Inicializar el lector de códigos
            codeReader.current = new BrowserMultiFormatReader();
            
            // Obtener dispositivos de video disponibles
            const reader = codeReader.current;
            const videoInputDevices = await reader.listVideoInputDevices();
            
            addLog(`Encontrados ${videoInputDevices.length} dispositivos de cámara`, 'success');
            
            if (videoInputDevices.length === 0) {
                throw new Error('No se encontró cámara disponible');
            }
            
            // Información sobre las cámaras disponibles
            videoInputDevices.forEach((device, index) => {
                addLog(`Cámara ${index + 1}: ${device.label || 'Sin etiqueta'} (${device.deviceId.substring(0, 10)}...)`, 'info');
            });
            
            // Encontrar la cámara trasera (si está disponible)
            let selectedDeviceId = null;
            
            if (isMobile) {
                // En dispositivos móviles, generalmente queremos la cámara trasera
                // Buscar cámara trasera por etiqueta
                const backCamera = videoInputDevices.find(device => 
                    device.label.toLowerCase().includes('back') ||
                    device.label.toLowerCase().includes('trasera') ||
                    device.label.toLowerCase().includes('rear') ||
                    device.label.toLowerCase().includes('ambiente') ||
                    device.label.toLowerCase().includes('dorsal')
                );
                
                if (backCamera) {
                    selectedDeviceId = backCamera.deviceId;
                    addLog(`Usando cámara trasera: ${backCamera.label}`, 'success');
                } else {
                    // De lo contrario, tratar de usar la última cámara (suele ser la trasera en móviles)
                    selectedDeviceId = videoInputDevices[videoInputDevices.length - 1].deviceId;
                    addLog(`No se encontró cámara trasera, usando la última disponible: ${videoInputDevices[videoInputDevices.length - 1].label}`, 'warning');
                }
            } else {
                // En PC/laptop, usar la primera disponible (generalmente solo hay una)
                selectedDeviceId = videoInputDevices[0].deviceId;
                addLog(`Usando cámara: ${videoInputDevices[0].label}`, 'info');
            }
            
            const hints = new Map();
            hints.set(BarcodeFormat.PDF_417, {});
            
            // Comenzar la decodificación continua
            reader.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const scannedText = result.getText();
                        addLog(`¡Código escaneado! (${scannedText.length} caracteres)`, 'success');
                        setRawScan(scannedText);
                        setTimeoutMsg(null);
                        if (scanTimeout) clearTimeout(scanTimeout);
                        processPdf417Data(scannedText);
                        stopScanner();
                    } else if (err && !(err instanceof NotFoundException)) {
                        addLog(`Error durante el escaneo: ${err}`, 'error');
                        setError('Error al escanear: ' + err);
                    }
                },
                { formats: [BarcodeFormat.PDF_417] }
            );
            
            addLog('Escáner iniciado correctamente, listo para detectar códigos PDF417', 'success');
            
            // Establecer un tiempo de espera para mostrar mensaje si no se escanea nada
            const timeout = setTimeout(() => {
                setTimeoutMsg("No se detectó ningún código. Intenta mover el DNI, mejorar la iluminación o enfocar mejor.");
                addLog('Timeout: No se detectó código en 10 segundos', 'warning');
            }, 10000);
            
            setScanTimeout(timeout);
            
        } catch (err) {
            addLog(`Error al iniciar el escáner: ${err.message}`, 'error');
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
            addLog('Escáner detenido', 'info');
        }
    };

    const processPdf417Data = (data) => {
        try {
            setLastScan(data);
            addLog(`Procesando datos: ${data.substring(0, 30)}...`, 'info');
            
            // Extraer el DNI: buscar el primer número de 7 u 8 dígitos
            let dni = null;
            let detectedFormat = 'desconocido';
            let parsedParts = [];
            let dniCandidates = [];
            
            // Intentar extraer el DNI según diferentes formatos de códigos PDF417 de DNI argentino
            
            // Formato 1: Separado por pipes (|)
            if (data.includes('|')) {
                const parts = data.split('|');
                parsedParts = parts;
                detectedFormat = 'pipes';
                addLog(`Formato detectado: PIPES con ${parts.length} partes`, 'info');
                
                // En algunos formatos el DNI es el 2do elemento (índice 1)
                if (parts.length > 1 && /^\d{7,8}$/.test(parts[1])) {
                    dni = parts[1];
                    dniCandidates.push({ value: parts[1], source: 'posición 2', selected: true });
                    addLog(`DNI encontrado en posición 2: ${parts[1]}`, 'success');
                } else {
                    // Buscar en cualquier parte
                    const found = parts.find(p => /^\d{7,8}$/.test(p));
                    if (found) {
                        dni = found;
                        const index = parts.indexOf(found) + 1;
                        dniCandidates.push({ value: found, source: `posición ${index}`, selected: true });
                        addLog(`DNI encontrado en posición ${index}: ${found}`, 'success');
                    }
                }
                
                // Recopilar todos los candidatos posibles
                parts.forEach((part, index) => {
                    if (/^\d{6,9}$/.test(part) && part !== dni) {
                        dniCandidates.push({ value: part, source: `posición ${index + 1}`, selected: false });
                        addLog(`Posible DNI en posición ${index + 1}: ${part}`, 'info');
                    }
                });
            } 
            // Formato 2: Separado por arrobas (@)
            else if (data.includes('@')) {
                const parts = data.split('@');
                parsedParts = parts;
                detectedFormat = 'arrobas';
                addLog(`Formato detectado: ARROBAS con ${parts.length} partes`, 'info');
                
                // En algunos formatos el DNI es el 5to elemento (índice 4)
                if (parts.length > 4 && /^\d{7,8}$/.test(parts[4])) {
                    dni = parts[4];
                    dniCandidates.push({ value: parts[4], source: 'posición 5', selected: true });
                    addLog(`DNI encontrado en posición 5: ${parts[4]}`, 'success');
                } else {
                    // Buscar en cualquier parte
                    const found = parts.find(p => /^\d{7,8}$/.test(p));
                    if (found) {
                        dni = found;
                        const index = parts.indexOf(found) + 1;
                        dniCandidates.push({ value: found, source: `posición ${index}`, selected: true });
                        addLog(`DNI encontrado en posición ${index}: ${found}`, 'success');
                    }
                }
                
                // Recopilar todos los candidatos posibles
                parts.forEach((part, index) => {
                    if (/^\d{6,9}$/.test(part) && part !== dni) {
                        dniCandidates.push({ value: part, source: `posición ${index + 1}`, selected: false });
                        addLog(`Posible DNI en posición ${index + 1}: ${part}`, 'info');
                    }
                });
            }
            // Otros formatos posibles
            else {
                detectedFormat = 'texto plano';
                parsedParts = [data];
                addLog('Formato detectado: TEXTO PLANO (sin separadores)', 'warning');
            }
            
            // Si no se encontró con los separadores conocidos, buscar cualquier número de 7 u 8 dígitos en el texto completo
            if (!dni) {
                addLog('Buscando DNI con expresiones regulares en texto completo', 'info');
                const dniMatches = data.match(/\b\d{7,8}\b/g);
                if (dniMatches && dniMatches.length > 0) {
                    addLog(`Se encontraron ${dniMatches.length} posibles DNIs con regex`, 'info');
                    // Tomar el primer número que parece un DNI
                    dni = dniMatches[0];
                    dniCandidates.push({ value: dniMatches[0], source: 'regex', selected: true });
                    addLog(`DNI seleccionado por regex: ${dniMatches[0]}`, 'success');
                    
                    // Agregar otros candidatos
                    dniMatches.slice(1).forEach((match, idx) => {
                        dniCandidates.push({ value: match, source: `regex adicional ${idx+1}`, selected: false });
                        addLog(`Otro posible DNI por regex: ${match}`, 'info');
                    });
                }
            }
            
            // Actualizar información de depuración
            setDebugInfo(prev => ({
                ...prev,
                parsedParts,
                detectedFormat,
                dniCandidates,
            }));
            
            // Última verificación y procesamiento
            if (dni && /^\d{7,8}$/.test(dni)) {
                addLog(`DNI extraído con éxito: ${dni}`, 'success');
                onDniScanned(dni);
            } else {
                addLog('No se pudo extraer un DNI válido automáticamente', 'error');
                setError("No se pudo extraer un DNI válido del código escaneado. Por favor, intenta de nuevo o ingresa el DNI manualmente.");
                setLastScan(data);
            }
        } catch (err) {
            addLog(`Error al procesar el código: ${err.message}`, 'error');
            setError("El código escaneado no contiene un DNI válido o no es un DNI argentino");
        }
    };

    const enterDniManually = () => {
        const dni = prompt("Ingresa el número de DNI:");
        if (dni && /^\d{7,8}$/.test(dni)) {
            addLog(`DNI ingresado manualmente: ${dni}`, 'success');
            onDniScanned(dni);
        } else if (dni) {
            alert("El DNI debe tener entre 7 y 8 dígitos");
            addLog(`DNI manual inválido: ${dni}`, 'error');
        }
    };
    
    const toggleDebug = () => {
        setShowDebug(!showDebug);
    };
    
    const useCandidateDni = (dni) => {
        if (dni && /^\d{7,8}$/.test(dni)) {
            addLog(`Usando DNI candidato seleccionado manualmente: ${dni}`, 'success');
            onDniScanned(dni);
        } else {
            alert("El DNI seleccionado no es válido");
            addLog(`Intento de usar DNI candidato inválido: ${dni}`, 'error');
        }
    };
    
    // Función para obtener el estilo según el tipo de log
    const getLogStyle = (type) => {
        switch(type) {
            case 'success':
                return 'text-green-600 dark:text-green-400';
            case 'error':
                return 'text-red-600 dark:text-red-400';
            case 'warning':
                return 'text-yellow-600 dark:text-yellow-400';
            default:
                return 'text-gray-600 dark:text-gray-400';
        }
    };
    
    // Función para obtener el ícono según el tipo de log
    const getLogIcon = (type) => {
        switch(type) {
            case 'success':
                return <FaCheck className="text-green-500" />;
            case 'error':
                return <FaExclamationTriangle className="text-red-500" />;
            case 'warning':
                return <FaInfoCircle className="text-yellow-500" />;
            default:
                return <FaInfoCircle className="text-blue-500" />;
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-200">
            <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white text-center mb-4">
                    Escanear DNI (Debug)
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
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400 p-3 rounded-lg mb-2">
                        <strong>{timeoutMsg}</strong>
                    </div>
                )}
                
                {/* Botón de depuración */}
                <div className="flex justify-between mb-2">
                    <div className="text-xs text-gray-500">Modo depuración</div>
                    <button
                        onClick={toggleDebug}
                        className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
                    >
                        <FaBug /> {showDebug ? "Ocultar registros" : "Mostrar registros"}
                        {showDebug ? <FaAngleUp /> : <FaAngleDown />}
                    </button>
                </div>
                
                {/* Información del dispositivo */}
                <div className="bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400 p-2 rounded-lg mb-2 text-xs">
                    {debugInfo.deviceInfo}
                </div>
                
                {/* Registros de actividad */}
                {showDebug && debugInfo.logs.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4 max-h-60 overflow-y-auto">
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-gray-100 dark:bg-gray-900 z-20">
                            <h3 className="font-medium text-gray-800 dark:text-white text-sm">Registros de actividad ({debugInfo.logs.length})</h3>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800">
                            {debugInfo.logs.map((log, idx) => (
                                <div key={idx} className="p-2 text-xs flex items-start gap-2">
                                    <span className="text-gray-400 dark:text-gray-600 min-w-[40px]">
                                        {log.timestamp}
                                    </span>
                                    <span className="mt-0.5 flex-shrink-0">
                                        {getLogIcon(log.type)}
                                    </span>
                                    <span className={getLogStyle(log.type)}>
                                        {log.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Información de texto escaneado completo */}
                {rawScan && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                            <h3 className="font-medium text-gray-800 dark:text-white text-sm">Texto escaneado completo</h3>
                        </div>
                        <div className="p-2">
                            <div className="bg-gray-50 dark:bg-gray-900 p-2 rounded text-xs text-gray-800 dark:text-gray-200 break-all max-h-32 overflow-y-auto">
                                {rawScan}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Formato detectado */}
                {debugInfo.detectedFormat && (
                    <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 p-3 rounded-lg mb-2">
                        <div className="flex items-center justify-between">
                            <strong>Formato detectado:</strong>
                            <span className="font-mono text-sm bg-indigo-100 dark:bg-indigo-800 px-2 py-0.5 rounded">
                                {debugInfo.detectedFormat}
                            </span>
                        </div>
                    </div>
                )}
                
                {/* Candidatos a DNI */}
                {debugInfo.dniCandidates.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900">
                            <h3 className="font-medium text-gray-800 dark:text-white text-sm">Candidatos a DNI ({debugInfo.dniCandidates.length})</h3>
                        </div>
                        <div className="p-2 space-y-2">
                            {debugInfo.dniCandidates.map((candidate, index) => (
                                <div key={index} className={`flex items-center justify-between p-2 rounded border ${candidate.selected 
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700'}`}>
                                    <div>
                                        <span className="font-medium text-gray-800 dark:text-white">{candidate.value}</span>
                                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">({candidate.source})</span>
                                        {candidate.selected && (
                                            <span className="ml-2 text-xs bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-1.5 py-0.5 rounded">
                                                Seleccionado
                                            </span>
                                        )}
                                    </div>
                                    {!candidate.selected && (
                                        <button 
                                            onClick={() => useCandidateDni(candidate.value)}
                                            className="text-xs bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded hover:bg-primary-200 dark:hover:bg-primary-800/20"
                                        >
                                            Usar este DNI
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* Partes analizadas (solo mostrar si hay texto escaneado) */}
                {debugInfo.parsedParts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-4">
                        <div className="p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-900 flex justify-between items-center">
                            <h3 className="font-medium text-gray-800 dark:text-white text-sm">
                                Partes analizadas ({debugInfo.parsedParts.length})
                            </h3>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                Separador: {debugInfo.detectedFormat === 'pipes' ? '|' : 
                                            debugInfo.detectedFormat === 'arrobas' ? '@' : 'ninguno'}
                            </span>
                        </div>
                        <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-40 overflow-y-auto">
                            {debugInfo.parsedParts.map((part, index) => (
                                <div key={index} className="flex items-start gap-2 p-2">
                                    <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded text-xs min-w-[24px] text-center">
                                        {index + 1}
                                    </span>
                                    <span className="text-xs text-gray-800 dark:text-gray-200 break-all">
                                        {part || '(vacío)'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-lg mb-4">
                        <div className="flex items-start gap-2">
                            <FaExclamationTriangle className="text-red-500 dark:text-red-400 mt-0.5" />
                            <div>
                                <div className="font-medium">{error}</div>
                                {debugInfo.dniCandidates.length > 0 && (
                                    <div className="mt-2 text-sm">
                                        <p>Se encontraron posibles números pero no cumplen con el formato de DNI.</p>
                                        <p className="mt-1">Si crees que uno de estos es tu DNI, puedes seleccionarlo manualmente:</p>
                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                            {debugInfo.dniCandidates.map((candidate, index) => (
                                                <button 
                                                    key={index}
                                                    onClick={() => useCandidateDni(candidate.value)}
                                                    className="text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                >
                                                    {candidate.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
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