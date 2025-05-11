import React, { useState, useEffect, useRef } from 'react';

// Escáner puramente basado en la API navigator.mediaDevices
// Sin dependencias externas que puedan causar problemas
const DniScanner = ({ onDniScanned }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Limpiar la cámara al desmontar el componente
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Función para iniciar la cámara directamente sin bibliotecas externas
  const startCamera = async () => {
    try {
      setScanning(true);
      setError(null);
      
      // Verificar soporte de la cámara
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Tu navegador no soporta acceso a la cámara. Intenta con otro navegador.");
      }

      // Obtener acceso a la cámara trasera preferentemente
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      // Guardar referencia al stream para poder limpiarlo después
      streamRef.current = stream;
      
      // Conectar el stream al elemento de video
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Intentar forzar un tamaño más grande
        videoRef.current.width = 1280;
        videoRef.current.height = 720;
      }
    } catch (err) {
      console.error('Error al iniciar la cámara:', err);
      setError(err.message || "No se pudo iniciar la cámara. Verifica los permisos e intenta de nuevo.");
      setScanning(false);
    }
  };

  // Función para detener la cámara
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setScanning(false);
    }
  };

  // Para implementación real, aquí iría la lógica de captura y procesamiento del código PDF417
  // Por ahora simulamos el escaneo con un botón
  const simulateScanning = () => {
    // Detener la cámara
    stopCamera();
    
    // Simular que encontramos un DNI válido
    onDniScanned("38437748");
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
    <div style={{
      maxWidth: "500px",
      margin: "0 auto",
      padding: "20px",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
        color: "#333333"
      }}>
        Escanear DNI
      </h2>
      
      <p style={{
        textAlign: "center",
        marginBottom: "20px",
        color: "#666666"
      }}>
        Coloca el código de barras PDF417 frente a la cámara
      </p>

      <div style={{
        width: "100%",
        height: "300px",
        backgroundColor: "#2a3f5f",
        position: "relative",
        overflow: "hidden",
        borderRadius: "8px",
        marginBottom: "20px"
      }}>
        {scanning ? (
          <>
            {/* Video element para mostrar la cámara */}
            <video 
              ref={videoRef}
              autoPlay 
              playsInline
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover"
              }}
              onLoadedMetadata={() => {
                // Intentar iniciar el video cuando los metadatos estén cargados
                videoRef.current.play();
              }}
            />
            
            {/* Guía de posicionamiento */}
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "250px",
              height: "80px",
              border: "4px solid #00BFFF",
              borderRadius: "8px",
              pointerEvents: "none"
            }}>
              <div style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "3px",
                backgroundColor: "#00BFFF",
                animation: "scanline 2s linear infinite"
              }}></div>
            </div>
            
            {/* Texto de ayuda */}
            <div style={{
              position: "absolute",
              bottom: "20px",
              left: "0",
              right: "0",
              textAlign: "center"
            }}>
              <p style={{
                display: "inline-block",
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "20px",
                fontSize: "14px"
              }}>
                Alinea el código de barras dentro del recuadro
              </p>
            </div>
            
            {/* Botón para simular escaneo exitoso */}
            <div style={{
              position: "absolute",
              top: "10px",
              right: "10px"
            }}>
              <button 
                onClick={simulateScanning}
                style={{
                  backgroundColor: "#18a2b8",
                  color: "white",
                  border: "none",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  fontSize: "12px",
                  cursor: "pointer"
                }}
              >
                Simular Escaneo
              </button>
            </div>
          </>
        ) : (
          <div style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            color: "white"
          }}>
            <div style={{
              backgroundColor: "white",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "15px"
            }}>
              <div style={{
                width: "180px",
                height: "80px",
                border: "3px solid #18a2b8",
                borderRadius: "5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "12px", color: "#333" }}>PDF417</div>
                  <div style={{ fontSize: "10px", color: "#666", marginTop: "5px" }}>Código en reverso del DNI</div>
                </div>
              </div>
            </div>
            <p style={{color: "white", fontWeight: "500"}}>
              Presiona el botón para activar la cámara
            </p>
          </div>
        )}
      </div>

      {error && (
        <div style={{
          backgroundColor: "#ffebee",
          color: "#d32f2f",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "20px",
          textAlign: "center"
        }}>
          {error}
        </div>
      )}

      {!scanning ? (
        <button 
          onClick={startCamera}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#18a2b8",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          Iniciar cámara
        </button>
      ) : (
        <button 
          onClick={stopCamera}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#bb1e3b",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "10px"
          }}
        >
          Cancelar
        </button>
      )}

      <button 
        onClick={enterDniManually}
        style={{
          width: "100%",
          padding: "10px",
          backgroundColor: "transparent",
          color: "#18a2b8",
          border: "1px solid #18a2b8",
          borderRadius: "5px",
          fontSize: "14px",
          cursor: "pointer"
        }}
      >
        Ingresar DNI manualmente
      </button>
      
      <style jsx>{`
        @keyframes scanline {
          0% { top: 0; }
          50% { top: calc(100% - 3px); }
          100% { top: 0; }
        }
      `}</style>
    </div>
  );
};

export default DniScanner;