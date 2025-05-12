import React, { useRef, useState, useEffect } from 'react';
import { BrowserMultiFormatReader, BarcodeFormat, NotFoundException } from '@zxing/library';
import { FaCamera, FaQrcode, FaSpinner, FaTimes, FaKeyboard, FaCheck, FaInfoCircle } from 'react-icons/fa';
// Importamos la imagen de muestra
import DniSampleImg from '../../assets/images/dni.png';

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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transition-all duration-200 border-2 border-gray-200 dark:border-gray-700">
            <div className="p-6 md:p-8">
                {/* Encabezado mejorado */}
                <div className="flex flex-col items-center justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 shadow-md">
                        <FaQrcode className="text-3xl text-blue-600 dark:text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                        Escanear DNI
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-center mt-2 max-w-md">
                        Colocá el código del DNI frente a la cámara y esperá que se escanee automáticamente.
                    </p>
                </div>

                {/* Visor de cámara mejorado */}
                <div className="relative w-full h-72 bg-gray-900 rounded-xl overflow-hidden mb-6 flex items-center justify-center border-3 border-blue-400 dark:border-blue-600 shadow-lg">
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
                        <div className="flex flex-col items-center justify-center h-full text-white w-full bg-gradient-to-b from-gray-800 to-gray-900">
                            <div className="bg-white/10 p-8 rounded-xl mb-4 backdrop-blur-sm shadow-inner border border-white/20">
                                <div className="   rounded-lg flex items-center justify-center">
                                    {/* Aquí cambiamos el icono por la imagen de muestra */}
                                    <div className="text-center">
                                        <img
                                            src={DniSampleImg}
                                            alt="Ejemplo de DNI"
                                            className="h-36 mx-auto mb-1 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-300 text-sm px-4 py-2 bg-black/40 rounded-full backdrop-blur-sm">
                                Presiona el botón para activar la cámara
                            </p>
                        </div>
                    )}

                    {/* Guía visual de escáner mejorada */}
                    {scanning && (
                        <>
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-28 border-3 border-primary-400 rounded-md pointer-events-none z-10 shadow-lg">
                                <div className="absolute top-0 left-0 w-full h-1 bg-primary-400 scanner-animation shadow-md"></div>
                                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary-400 rounded-tl-md"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary-400 rounded-tr-md"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary-400 rounded-bl-md"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary-400 rounded-br-md"></div>
                            </div>
                            <div className="absolute bottom-4 left-0 right-0 text-center z-10">
                                <p className="inline-block px-4 py-2 bg-black/70 text-white text-sm rounded-full shadow-lg backdrop-blur-sm border border-white/10">
                                    Alineá el código dentro del marco
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Mensajes de feedback mejorados */}
                {timeoutMsg && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-700 text-yellow-700 dark:text-yellow-400 p-4 rounded-xl mb-5 shadow-md">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-yellow-100 dark:bg-yellow-800/50 rounded-full flex-shrink-0">
                                <FaInfoCircle className="text-yellow-500 dark:text-yellow-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">Código no detectado</h4>
                                <p>{timeoutMsg}</p>
                            </div>
                        </div>
                    </div>
                )}

                {scannedData && (
                    <div className="bg-green-50 dark:bg-green-900/30 border-2 border-green-200 dark:border-green-700 text-green-700 dark:text-green-400 p-5 rounded-xl mb-5 shadow-md">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-green-100 dark:bg-green-800/50 rounded-full flex-shrink-0">
                                <FaCheck className="text-green-500 dark:text-green-400" />
                            </div>
                            <div>
                                <h3 className="font-bold text-green-800 dark:text-green-300 text-lg">¡DNI escaneado correctamente!</h3>
                                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-3 text-sm bg-white/50 dark:bg-black/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
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
                    <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 p-4 rounded-xl mb-5 shadow-md">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-100 dark:bg-red-800/50 rounded-full flex-shrink-0">
                                <FaTimes className="text-red-500 dark:text-red-400" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Error al escanear</h4>
                                <p>{error}</p>
                                {rawScan && (
                                    <div className="mt-3 text-xs bg-white/50 dark:bg-black/20 p-3 rounded-lg border border-red-100 dark:border-red-800">
                                        <p className="font-semibold mb-1">Texto escaneado:</p>
                                        <p className="text-red-600/80 dark:text-red-400/80 break-all">{rawScan.substring(0, 50)}...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Botones mejorados */}
                <div className="flex flex-col gap-3 mt-6">
                    {!scanning ? (
                        <button
                            onClick={startScanner}
                            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl border border-primary-500 hover:border-primary-600"
                        >
                            <FaCamera className="text-lg" /> Iniciar cámara
                        </button>
                    ) : (
                        <button
                            onClick={stopScanner}
                            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl border border-red-500 hover:border-red-600"
                        >
                            <FaTimes className="text-lg" /> Cancelar
                        </button>
                    )}
                    {/*
                    <button
                        onClick={enterDniManually}
                        className="w-full py-3.5 bg-white dark:bg-gray-700 border-2 border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg"
                    >
                        <FaKeyboard className="text-lg" /> Ingresar DNI manualmente
                    </button>*/}
                </div>

                {/* Ayuda sobre formato de DNI - Comentado en el original */}
                {/* <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-sm text-blue-700 dark:text-blue-300 shadow-md">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-800/50 rounded-full flex-shrink-0">
                            <FaInfoCircle className="text-blue-500 dark:text-blue-400" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-1">Información</h4>
                            <p>El scanner está configurado para el formato de DNI argentino.</p>
                            <p className="mt-2">Formato esperado: @APELLIDO@NOMBRE@SEXO@DNI@...@FECHA_NACIMIENTO@...</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
};

// Añade esta animación para el escaneo
const styles = `
@keyframes scan {
  0% {
    top: 0;
  }
  50% {
    top: calc(100% - 4px);
  }
  100% {
    top: 0;
  }
}

.scanner-animation {
  animation: scan 2s linear infinite;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.7);
}
`;

// Agrega los estilos a la página
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default DniScanner;