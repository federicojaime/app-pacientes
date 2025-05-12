import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, NotFoundException } from '@zxing/library';
import { FaCamera, FaQrcode, FaSpinner, FaTimes, FaKeyboard, FaCheck, FaInfoCircle, FaExclamationCircle } from 'react-icons/fa';
// Importamos la imagen de muestra
import DniSampleImg from '../../assets/images/dni.png';
// Importamos estilos específicos
import '../../styles/DniScanner.css';

const DniScanner = ({ onDniScanned }) => {
    const videoRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState(null);
    const [rawScan, setRawScan] = useState(null);
    const [timeoutMsg, setTimeoutMsg] = useState(null);
    const [scanTimeout, setScanTimeout] = useState(null);
    const [scannedData, setScannedData] = useState(null);
    const codeReader = useRef(null);
    const [cameraPermission, setCameraPermission] = useState({
        requested: false,
        granted: false,
        denied: false,
        unsupported: false
    });

    // Detectar si es un dispositivo móvil
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    useEffect(() => {
        // Limpiar al desmontar el componente
        return () => {
            stopScanner();
        };
    }, []);

    // Verificar si el navegador soporta MediaDevices
    const checkMediaDevicesSupport = () => {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setCameraPermission(prev => ({ ...prev, unsupported: true }));
            setError('Tu navegador no soporta acceso a la cámara. Intenta con un navegador más reciente como Chrome, Firefox o Safari.');
            return false;
        }
        return true;
    };

    // Solicitar permiso de cámara explícitamente
    const requestCameraPermission = async () => {
        if (!checkMediaDevicesSupport()) return false;

        try {
            setCameraPermission(prev => ({ ...prev, requested: true }));
            await navigator.mediaDevices.getUserMedia({ video: true });
            setCameraPermission(prev => ({ ...prev, granted: true, denied: false }));
            return true;
        } catch (err) {
            console.error('Error al solicitar permisos de cámara:', err);
            setCameraPermission(prev => ({
                ...prev,
                granted: false,
                denied: true
            }));

            if (err.name === 'NotAllowedError') {
                setError('Permiso de cámara denegado. Por favor, permite el acceso a la cámara para escanear tu DNI.');
            } else if (err.name === 'NotFoundError') {
                setError('No se detectó ninguna cámara en tu dispositivo.');
            } else {
                setError(`Error al acceder a la cámara: ${err.message}`);
            }

            return false;
        }
    };

    const startScanner = async () => {
        setError(null);
        setRawScan(null);
        setScannedData(null);
        setTimeoutMsg(null);

        if (scanTimeout) clearTimeout(scanTimeout);

        // Primero verifica permisos
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) return;

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
                        const scanData = {
                            dni,
                            apellido,
                            nombre,
                            genero,
                            fechaNac
                        };

                        setScannedData(scanData);

                        // Notificar con todos los datos escaneados, no solo el DNI
                        onDniScanned(dni, scanData);
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
                    const scanData = {
                        dni: dniMatch[0],
                        apellido: 'No disponible',
                        nombre: 'No disponible',
                        genero: 'No disponible',
                        fechaNac: 'No disponible'
                    };

                    setScannedData(scanData);

                    // Notificar el DNI escaneado encontrado con datos limitados
                    onDniScanned(dniMatch[0], scanData);
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
            onDniScanned(dni, {
                dni: dni,
                apellido: 'No disponible',
                nombre: 'No disponible',
                genero: 'No disponible',
                fechaNac: 'No disponible'
            });
        } else if (dni) {
            alert("El DNI debe tener entre 7 y 8 dígitos");
        }
    };

    const handleResetPermissions = () => {
        // Mostrar instrucciones para resetear permisos
        setError(
            "Para resetear los permisos de cámara:\n" +
            "1. Haz clic en el icono de candado en la barra de direcciones\n" +
            "2. Selecciona 'Configuración del sitio'\n" +
            "3. Cambia 'Cámara' a 'Permitir'\n" +
            "4. Recarga la página"
        );
    };

    return (
        <div className="w-full h-full">
            {/* Alerta de permisos denegados */}
            {cameraPermission.denied && (
                <div className="mb-4 bg-yellow-50 border-2 border-yellow-200 p-4 rounded-xl">
                    <div className="flex gap-3">
                        <div className="flex-shrink-0 text-yellow-500">
                            <FaExclamationCircle className="text-xl" />
                        </div>
                        <div>
                            <h4 className="font-medium text-yellow-800">Permiso de cámara denegado</h4>
                            <p className="mt-1 text-sm text-yellow-700">
                                Necesitamos acceso a tu cámara para escanear el DNI. Por favor, permite el acceso desde la configuración de tu navegador.
                            </p>
                            <button
                                onClick={handleResetPermissions}
                                className="mt-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 text-sm rounded"
                            >
                                Cómo permitir acceso
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Visor de cámara mejorado */}
            <div className="relative w-full h-full flex items-center justify-center">
                {scanning ? (
                    <>
                        <video
                            ref={videoRef}
                            className="absolute inset-0 w-full h-full object-cover camera-active"
                            autoPlay
                            playsInline
                            muted
                            style={{ zIndex: 1 }}
                        />
                        <div className="scan-guide">
                            <div className="scan-line"></div>
                            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-400 rounded-tl-md"></div>
                            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-400 rounded-tr-md"></div>
                            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-400 rounded-bl-md"></div>
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-400 rounded-br-md"></div>
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                            <p className="inline-block px-4 py-2 bg-black/70 text-white text-sm rounded-full shadow-lg backdrop-blur-sm border border-white/10">
                                Alineá el código dentro del marco
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="bg-gray-900/5 p-6 rounded-xl mb-4 shadow-inner">
                            <img
                                src={DniSampleImg}
                                alt="Ejemplo de DNI"
                                className="h-32 mx-auto rounded"
                            />
                        </div>
                        <p className="text-gray-500 text-sm">
                            Presiona el botón para activar la cámara
                        </p>
                    </div>
                )}
            </div>

            {/* Mensajes de feedback mejorados */}
            {timeoutMsg && (
                <div className="mt-4 bg-yellow-50 border-2 border-yellow-200 text-yellow-700 p-3 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-yellow-100 rounded-full flex-shrink-0">
                            <FaInfoCircle className="text-yellow-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-800 mb-1">Código no detectado</h4>
                            <p className="text-sm">{timeoutMsg}</p>
                        </div>
                    </div>
                </div>
            )}

            {scannedData && (
                <div className="mt-4 bg-green-50 border-2 border-green-200 text-green-700 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-green-100 rounded-full flex-shrink-0">
                            <FaCheck className="text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-green-800 text-lg">¡DNI escaneado correctamente!</h3>
                            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm bg-white/80 p-3 rounded-lg border border-green-100">
                                <div><span className="font-semibold">DNI:</span> {scannedData.dni}</div>
                                <div><span className="font-semibold">Apellido:</span> {scannedData.apellido}</div>
                                <div><span className="font-semibold">Nombre:</span> {scannedData.nombre}</div>
                                <div><span className="font-semibold">Género:</span> {scannedData.genero === 'M' ? 'Masculino' : 'Femenino'}</div>
                                <div><span className="font-semibold">Fecha Nac.:</span> {scannedData.fechaNac}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {error && !scannedData && (
                <div className="mt-4 bg-red-50 border-2 border-red-200 text-red-600 p-4 rounded-xl">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-red-100 rounded-full flex-shrink-0">
                            <FaTimes className="text-red-500" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-red-800 mb-1">Error al escanear</h4>
                            <p className="text-sm whitespace-pre-line">{error}</p>
                            {rawScan && (
                                <div className="mt-3 text-xs bg-white/80 p-3 rounded-lg border border-red-100">
                                    <p className="font-semibold mb-1">Texto escaneado:</p>
                                    <p className="text-red-600/80 break-all">{rawScan.substring(0, 50)}...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Botones con estilo mejorado */}
            <div className="mt-6">
                {!scanning ? (
                    <button
                        onClick={startScanner}
                        className="action-button primary-button"
                    >
                        <FaCamera /> Iniciar cámara
                    </button>
                ) : (
                    <button
                        onClick={stopScanner}
                        className="action-button bg-red-600 hover:bg-red-700 text-white border-none"
                    >
                        <FaTimes /> Cancelar
                    </button>
                )}

                <button
                    onClick={enterDniManually}
                    className="action-button secondary-button mt-3"
                >
                    <FaKeyboard /> Ingresar DNI manualmente
                </button>
            </div>
        </div>
    );
};

export default DniScanner;