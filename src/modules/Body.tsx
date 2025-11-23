import React, { useState, useRef } from "react";

export default function Body() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const API_BASE = "https://unbenumbed-flutey-marlin.ngrok-free.dev";

  const [params, setParams] = useState({
    noise: true,
    noise_d: 9,
    noise_sigmaColor: 75,
    noise_sigmaSpace: 75,
    contrast: true,
    contrast_clipLimit: 2.0,
    contrast_tileGridSize: "8,8",
    rescale: true,
    videoReescaled: true
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setVideoFile(event.target.files[0]);
      setDownloadUrl(null);
    }
  };

  const openFileDialog = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    
    console.log(`🔄 Cambio detectado: ${name} = ${type === "checkbox" ? checked : value}`);
    
    setParams((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!videoFile) return;

    const formData = new FormData();
    formData.append("file", videoFile);

    // 🔹 CRITICAL: Enviar booleanos como "true" o "false" strings
    console.log("📦 Estado actual de params:", params);
    
    Object.entries(params).forEach(([key, value]) => {
      let finalValue: string;
      
      if (typeof value === 'boolean') {
        finalValue = value ? "true" : "false";
      } else {
        finalValue = String(value);
      }
      
      formData.append(key, finalValue);
      console.log(`  ✅ ${key}: ${finalValue} (original: ${value}, tipo: ${typeof value})`);
    });

    // Verificar FormData completo
    console.log("\n📤 FormData final:");
    for (let [key, value] of formData.entries()) {
      if (key !== 'file') {
        console.log(`  ${key}: ${value}`);
      }
    }

    setLoading(true);
    setDownloadUrl(null);
    setProcessingStatus("Subiendo video...");

    try {
      const uploadResponse = await fetch(`${API_BASE}/uploadfile/`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorText = await uploadResponse.text();
        throw new Error(`Error al subir: ${uploadResponse.statusText} - ${errorText}`);
      }

      const uploadData = await uploadResponse.json();
      const { id } = uploadData;

      if (!id) throw new Error("No se devolvió ID de tarea.");

      console.log("✅ Video subido, ID:", id);
      setProcessingStatus("Procesando video...");

      // Polling
      const pollResult = async () => {
        try {
          const statusResponse = await fetch(`${API_BASE}/result/${id}`, {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "true",
            },
          });

          const contentType = statusResponse.headers.get("content-type") || "";

          if (contentType.includes("application/json")) {
            const json = await statusResponse.json();

            if (json.status === "processing") {
              setProcessingStatus("Procesando...");
              setTimeout(pollResult, 5000);
              return;
            } else if (json.status === "error") {
              alert("Error: " + (json.details || json.error || "Error desconocido"));
              setLoading(false);
              setProcessingStatus("");
              return;
            } else if (json.status === "not_found") {
              alert("Video no encontrado");
              setLoading(false);
              setProcessingStatus("");
              return;
            }
          } else if (contentType.includes("video/mp4") || contentType.includes("video/")) {
            setProcessingStatus("Descargando video...");
            
            const blob = await statusResponse.blob();
            
            if (blob.size === 0) {
              console.error("El blob está vacío");
              setTimeout(pollResult, 5000);
              return;
            }

            const blobUrl = URL.createObjectURL(blob);
            setDownloadUrl(blobUrl);
            setLoading(false);
            setProcessingStatus("¡Video listo!");
            return;
          } else {
            console.warn("Content-Type inesperado:", contentType);
            setProcessingStatus("Reintentando en 5s...");
            setTimeout(pollResult, 5000);
          }
        } catch (err) {
          console.error("Error durante polling:", err);
          setProcessingStatus("Error de conexión, reintentando en 5s...");
          setTimeout(pollResult, 5000);
        }
      };

      pollResult();
    } catch (err) {
      console.error("Error al subir el video:", err);
      alert("Error al subir el video: " + (err instanceof Error ? err.message : "Error desconocido"));
      setLoading(false);
      setProcessingStatus("");
    }
  };

  const Spinner = () => (
    <div className="flex flex-col items-center mt-6">
      <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <p className="mt-2 text-lg text-gray-700">{processingStatus || "Procesando..."}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 text-cyan-900">
          🎬 Reescala tus videos
        </h1>
        <p className="text-center text-lg mb-10 text-gray-700">
          Mejora la resolución de tus videos con IA y filtros avanzados
        </p>

        {!loading && (
          <div className="bg-white shadow-lg rounded-2xl p-8 space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ display: "none" }}
              />
              <button
                type="button"
                onClick={openFileDialog}
                className="bg-cyan-800 hover:bg-cyan-900 text-white font-semibold py-3 px-6 rounded-xl text-lg w-full transition-colors"
              >
                {videoFile ? `📁 ${videoFile.name}` : "📤 Seleccionar Video"}
              </button>
            </div>

            <div className="flex justify-between items-center border-t pt-4">
              <h2 className="font-semibold text-lg">⚙️ Opciones avanzadas</h2>
              <button
                type="button"
                onClick={() => setShowAdvanced((prev) => !prev)}
                className="text-blue-600 hover:underline"
              >
                {showAdvanced ? "Ocultar" : "Mostrar"}
              </button>
            </div>

            {showAdvanced && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-lg border-2 border-blue-200">
                <div className="col-span-2 bg-blue-100 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">
                    🔍 Estado actual:
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Resize Std: {params.videoReescaled ? "✅ Activo" : "❌ Desactivado"} |
                    Ruido: {params.noise ? "✅ Activo" : "❌ Desactivado"} | 
                    Contraste: {params.contrast ? "✅ Activo" : "❌ Desactivado"} | 
                    Reescalado: {params.rescale ? "✅ Activo" : "❌ Desactivado"}
                  </p>
                </div>

                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100 bg-yellow-50 border-yellow-200 col-span-2 md:col-span-1">
                  <input
                    type="checkbox"
                    name="videoReescaled" // Nombre exacto del state
                    checked={params.videoReescaled}
                    onChange={handleParamChange}
                    className="w-5 h-5 text-yellow-600"
                  />
                  <span className="font-semibold text-gray-800">📏 Reescalado Estándar</span>
                </label>
                
                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100">
                  <input
                    type="checkbox"
                    name="noise"
                    checked={params.noise}
                    onChange={handleParamChange}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">🔇 Eliminar ruido</span>
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">D:</span>
                  <input
                    type="number"
                    name="noise_d"
                    value={params.noise_d}
                    onChange={handleParamChange}
                    className="border rounded p-2 mt-1"
                    disabled={!params.noise}
                  />
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Sigma Color:</span>
                  <input
                    type="number"
                    name="noise_sigmaColor"
                    value={params.noise_sigmaColor}
                    onChange={handleParamChange}
                    className="border rounded p-2 mt-1"
                    disabled={!params.noise}
                  />
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Sigma Space:</span>
                  <input
                    type="number"
                    name="noise_sigmaSpace"
                    value={params.noise_sigmaSpace}
                    onChange={handleParamChange}
                    className="border rounded p-2 mt-1"
                    disabled={!params.noise}
                  />
                </label>

                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100">
                  <input
                    type="checkbox"
                    name="contrast"
                    checked={params.contrast}
                    onChange={handleParamChange}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">✨ Mejorar contraste</span>
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Clip Limit:</span>
                  <input
                    type="number"
                    step="0.1"
                    name="contrast_clipLimit"
                    value={params.contrast_clipLimit}
                    onChange={handleParamChange}
                    className="border rounded p-2 mt-1"
                    disabled={!params.contrast}
                  />
                </label>
                
                <label className="flex flex-col">
                  <span className="text-sm text-gray-600">Tile Grid:</span>
                  <input
                    type="text"
                    name="contrast_tileGridSize"
                    value={params.contrast_tileGridSize}
                    onChange={handleParamChange}
                    className="border rounded p-2 mt-1"
                    disabled={!params.contrast}
                  />
                </label>

                <label className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-100">
                  <input
                    type="checkbox"
                    name="rescale"
                    checked={params.rescale}
                    onChange={handleParamChange}
                    className="w-5 h-5"
                  />
                  <span className="font-semibold">🤖 Reescalar con IA</span>
                </label>
              </div>
            )}

            <div className="flex justify-center mt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!videoFile}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-3 px-8 rounded-2xl text-lg w-full transition-colors"
              >
                🚀 Subir y Procesar
              </button>
            </div>
          </div>
        )}

        {loading && <Spinner />}

        {downloadUrl && (
          <div className="text-center mt-6 bg-white p-6 rounded-2xl shadow-lg">
            <p className="text-green-600 font-semibold mb-4 text-xl">✅ ¡Video procesado exitosamente!</p>
            <a
              href={downloadUrl}
              download="video_procesado.mp4"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-colors font-semibold"
            >
              📥 Descargar Video
            </a>
          </div>
        )}
      </div>
    </div>
  );
}