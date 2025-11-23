# 🎬 AI Video Enhancer & Upscaler

![Project Status](https://img.shields.io/badge/Status-Active-green)
![Python](https://img.shields.io/badge/Python-3.10%2B-blue)
![React](https://img.shields.io/badge/React-18-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109-teal)
![CUDA](https://img.shields.io/badge/CUDA-Enabled-green)

Una aplicación web completa para mejorar la calidad de videos automáticamente. Permite subir archivos MP4 para aplicar reducción de ruido, mejora de contraste, redimensionamiento estándar y **reescalado mediante Inteligencia Artificial (RealESRGAN)** utilizando aceleración por GPU.



## ✨ Características Principales

- **📤 Subida y Procesamiento Asíncrono:** Manejo de colas de procesamiento en segundo plano (BackgroundTasks).
- **📏 Redimensionamiento Inteligente:** Ajuste automático de resolución a estándares (720p, 1080p, etc.) manteniendo el aspecto.
- **🔇 Reducción de Ruido:** Implementación de Filtro Bilateral (OpenCV) para suavizar sin perder bordes.
- **✨ Mejora de Contraste:** Algoritmo CLAHE (Contrast Limited Adaptive Histogram Equalization).
- **🤖 AI Upscaling:** Super-resolución (x2) utilizando **RealESRGAN** con soporte FP16 en GPU.
- **💾 Compresión Optimizada:** Codificación final en H.264 (CPU/NVENC) para reducir el peso del archivo sin perder calidad.
- **🖥️ Frontend Moderno:** Interfaz reactiva construida con React, TypeScript y Tailwind CSS.

## 🛠️ Stack Tecnológico

### Backend
- **Framework:** FastAPI
- **Procesamiento de Video:** OpenCV (cv2), FFmpeg, MoviePy
- **IA / Deep Learning:** PyTorch, RealESRGAN
- **Despliegue:** Soporte para Docker / Vast.ai (GPU Cloud)

### Frontend
- **Framework:** React (Vite)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Comunicación:** Fetch API con Polling para estado de tareas

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- **Python 3.10+**
- **Node.js 18+**
- **FFmpeg** instalado en el sistema y agregado al PATH.
- **Drivers de NVIDIA (CUDA)** (Opcional, pero recomendado para el reescalado con IA).

### 1. Configuración del Backend

```bash
# Clonar el repositorio
git clone [https://github.com/TU_USUARIO/TU_REPO.git](https://github.com/TU_USUARIO/TU_REPO.git)
cd TU_REPO/backend

# Crear entorno virtual
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install fastapi uvicorn python-multipart opencv-python numpy torch torchvision moviepy tqdm

# Instalar FFmpeg estático (Recomendado para servidores Linux)
