const synth = window.speechSynthesis
let isSpeaking = false
let isLoading = false
let activeMarker = null
let isProcessingMarker = false // Flag para evitar procesamiento simultáneo de marcadores

const playBtn = document.getElementById("play-btn")
const stopBtn = document.getElementById("stop-btn")
const playText = document.getElementById("play-text")
const loadingText = document.getElementById("loading-text")
const textElement = document.getElementById("valor-text")
const titleElement = document.getElementById("title")
const instructionMessage = document.getElementById("instruction-message")

const texts = {
  economia: {
    title: "Programa: ECONOMÍA",
    content:
      "El programa de Economía otorga el título de Economista, corresponde al nivel de pregrado y se ofrece como formación profesional universitaria bajo la metodología presencial y jornada única. Tiene una duración de 10 semestres, con un total de 175 créditos académicos, y pertenece a la Facultad de Ciencias Administrativas, Contables y Económicas. El número máximo de estudiantes admitidos en primer semestre es de 100, con una periodicidad de admisión semestral. Cuenta con registro calificado, aprobado mediante la Resolución No. 2439 del 7 de marzo de 2024, y está identificado con el Código SNIES 105814. Su creación se rige por norma interna a través de un acuerdo, y el programa se ofrece en la sede ubicada en Aguachica, departamento del Cesar.",
  },
  mision: {
    title: "Universidad: MISIÓN",
    content:
      "La Universidad Popular del Cesar, como institución de educación superior oficial del orden nacional, forma personas responsables social y culturalmente; con una educación de calidad, integral e inclusiva, rigor científico y tecnológico; mediante las diferentes modalidades y metodologías de educación, a través de programas pertinentes al contexto, dentro de la diversidad de campos disciplinares, en un marco de libertad de pensamiento; que consolide la construcción de saberes, para contribuir a la solución de problemas y conflictos, en un ambiente sostenible, con visibilidad nacional e internacional.",
  },
  logo: {
    title: "LOGO",
    content:
      "La marca gráfica es el principal signo identificador de la Universidad Popular del Cesar y está conformada por un símbolo con las letras UPC y la representación del ser humano, y el logotipo. Es la firma de la institución en la cual se manifiestan sus valores, principios y personalidad, originando un impacto y un reconocimiento en la memoria.",
  },
  honestidad: {
    title: "Valor Intitucional: HONESTIDAD",
    content:
      "Actuar con transparencia, rectitud y coherencia entre lo que se piensa, se dice y se hace, fomentando la confianza y el respeto mutuo. La honestidad en la Universidad Popular del Cesar guía el comportamiento ético de todos sus miembros, promoviendo relaciones basadas en la verdad y la integridad, fundamentales para el desarrollo académico y humano.",
  },
  respeto: {
    title: "Valor Intitucional: RESPETO",
    content:
      "Reconocer y valorar la dignidad, ideas, creencias y diferencias de los demás, manteniendo una convivencia armónica. En la Universidad Popular del Cesar, el respeto es un pilar esencial para construir una comunidad incluyente, tolerante y democrática, donde el diálogo y la aceptación de la diversidad enriquecen el proceso formativo.",
  },
  justicia: {
    title: "Valor Intitucional: JUSTICIA",
    content:
      "Garantizar la equidad, la imparcialidad y el cumplimiento de los derechos y deberes de todos los miembros de la comunidad universitaria. La Universidad Popular del Cesar se compromete con una educación justa, donde se brinda igualdad de oportunidades y se vela por el bienestar común, contribuyendo a una sociedad más equilibrada y solidaria.",
  },
  compromiso: {
    title: "Valor Intitucional: COMPROMISO",
    content:
      "Asumir con responsabilidad y entrega las tareas y metas institucionales, aportando al cumplimiento de la misión y visión universitaria. El compromiso en la Universidad Popular del Cesar refleja la disposición de sus miembros para contribuir activamente con el desarrollo personal, profesional y social desde su rol en la comunidad educativa.",
  },

  diligencia: {
    title: "Valor Intitucional: DILIGENCIA",
    content:
      "Cumplir con esmero, responsabilidad y eficiencia las funciones y tareas asignadas, procurando siempre la excelencia. En la Universidad Popular del Cesar, la diligencia impulsa una cultura del trabajo bien hecho, del esfuerzo constante y del compromiso con la mejora continua en los procesos académicos y administrativos.",
  },
}

// Función para actualizar el estado de los botones
function updateButtonState() {
  // Ocultar ambos botones primero
  playBtn.classList.add("hidden")
  stopBtn.classList.add("hidden")

  // Solo mostrar botones si hay un marcador activo
  if (activeMarker) {
    if (isSpeaking) {
      // Si está reproduciendo, mostrar el botón de detener
      stopBtn.classList.remove("hidden")
    } else {
      // Si no está reproduciendo, mostrar el botón de reproducir
      playBtn.classList.remove("hidden")

      // Asegurarse de que el botón muestre "Reproducir" y no "Cargando"
      if (!isLoading) {
        playText.classList.remove("hidden")
        loadingText.classList.add("hidden")
      }
    }
  }
}

// Función para mostrar el estado de carga
function showLoadingState() {
  isLoading = true
  playText.classList.add("hidden")
  loadingText.classList.remove("hidden")
  playBtn.disabled = true
}

// Función para ocultar el estado de carga
function hideLoadingState() {
  isLoading = false
  playText.classList.remove("hidden")
  loadingText.classList.add("hidden")
  playBtn.disabled = false
}

// Función para detener la reproducción
function stopSpeaking() {
  synth.cancel()
  isSpeaking = false
  hideLoadingState()
  updateButtonState()
}

// Función para mostrar el contenido del marcador
function showMarkerContent(markerId) {
  // Si ya hay un marcador activo o estamos procesando otro, ignorar este
  if (isProcessingMarker && activeMarker && activeMarker !== markerId) {
    return
  }

  isProcessingMarker = true

  const markerKey = markerId.replace("marker-", "")

  // Ocultar mensaje de instrucción
  instructionMessage.classList.add("hidden")

  // Mostrar título y texto
  titleElement.classList.remove("hidden")
  textElement.classList.remove("hidden")

  // Establecer contenido
  titleElement.innerText = texts[markerKey].title
  textElement.innerText = texts[markerKey].content

  // Actualizar marcador activo
  activeMarker = markerId

  // Actualizar botones
  updateButtonState()

  // Liberar el flag después de un breve retraso para evitar cambios rápidos
  setTimeout(() => {
    isProcessingMarker = false
  }, 500)
}

// Función para ocultar el contenido cuando se pierde un marcador
function hideMarkerContent(markerId) {
  if (activeMarker === markerId) {
    // Ocultar título y texto
    titleElement.classList.add("hidden")
    textElement.classList.add("hidden")
    // Mostrar mensaje de instrucción
    instructionMessage.classList.remove("hidden")
    // Resetear marcador activo
    activeMarker = null
    // Ocultar botones y detener reproducción
    playBtn.classList.add("hidden")
    stopBtn.classList.add("hidden")
    stopSpeaking()
  }
}

// Detectar cuándo un marcador es visible
document.querySelector("#marker-economia").addEventListener("markerFound", () => {
  showMarkerContent("marker-economia")
  // Restablecer escala al tamaño original 
  document.querySelector("#economia-model").setAttribute("scale", "0.6 1 1")
})
document.querySelector("#marker-mision").addEventListener("markerFound", () => {
  showMarkerContent("marker-mision")
  document.querySelector("#mision-model").setAttribute("scale", "0.6 1 1")
})
document.querySelector("#marker-logo").addEventListener("markerFound", () => {
  showMarkerContent("marker-logo")
  document.querySelector("#logo-model").setAttribute("scale", "0.6 1 1")
})
document.querySelector("#marker-honestidad").addEventListener("markerFound", () => {
  showMarkerContent("marker-honestidad")
  document.querySelector("#honestidad-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-respeto").addEventListener("markerFound", () => {
  showMarkerContent("marker-respeto")
  document.querySelector("#respeto-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-justicia").addEventListener("markerFound", () => {
  showMarkerContent("marker-justicia")
  document.querySelector("#justicia-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-compromiso").addEventListener("markerFound", () => {
  showMarkerContent("marker-compromiso")
  document.querySelector("#compromiso-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-diligencia").addEventListener("markerFound", () => {
  showMarkerContent("marker-diligencia")
  document.querySelector("#diligencia-model").setAttribute("scale", "1 1 1")
})


// Detectar cuándo un marcador se pierde
document.querySelector("#marker-economia").addEventListener("markerLost", () => {
  hideMarkerContent("marker-economia")
})
document.querySelector("#marker-mision").addEventListener("markerLost", () => {
  hideMarkerContent("marker-mision")
})
document.querySelector("#marker-logo").addEventListener("markerLost", () => {
  hideMarkerContent("marker-logo")
})
document.querySelector("#marker-honestidad").addEventListener("markerLost", () => {
  hideMarkerContent("marker-honestidad")
})
document.querySelector("#marker-respeto").addEventListener("markerLost", () => {
  hideMarkerContent("marker-respeto")
})
document.querySelector("#marker-justicia").addEventListener("markerLost", () => {
  hideMarkerContent("marker-justicia")
})
document.querySelector("#marker-compromiso").addEventListener("markerLost", () => {
  hideMarkerContent("marker-compromiso")
})
document.querySelector("#marker-diligencia").addEventListener("markerLost", () => {
  hideMarkerContent("marker-diligencia")
})


// Función para iniciar la reproducción
playBtn.addEventListener("click", () => {
  if (textElement.innerText && !isLoading) {
    // Mostrar estado de carga
    showLoadingState()

    const utterance = new SpeechSynthesisUtterance(textElement.innerText)
    utterance.lang = "es-ES"
    utterance.rate = 1.0
    utterance.pitch = 0.9

    const loadingTimeout = setTimeout(() => {
      hideLoadingState()
    }, 5000) // Máximo 3 segundos esperando que empiece a hablar

    utterance.onstart = () => {
      // Cancelar el timeout ya que la reproducción ha comenzado
      clearTimeout(loadingTimeout)

      isSpeaking = true
      hideLoadingState()
      updateButtonState()
    }

    utterance.onend = () => {
      isSpeaking = false
      updateButtonState()
    }

    synth.speak(utterance)
  }
})

// Función para detener la reproducción
stopBtn.addEventListener("click", () => {
  stopSpeaking()
})

// prevenir zoom en dispositivos iOS
document.addEventListener("gesturestart", (e) => {
  e.preventDefault()
})

// Precarga de voces para mejorar el tiempo de respuesta
window.addEventListener("DOMContentLoaded", () => {
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
      speechSynthesis.getVoices()
    }
  }
})

// Detección de dispositivo móvil y mostrar advertencia en pantallas grandes
function isMobileDevice() {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  )
}

function checkDeviceAndShowWarning() {
  const desktopWarning = document.getElementById("desktop-warning")
  const container = document.getElementById("container")

  if (!isMobileDevice()) {
    desktopWarning.style.display = "flex"
    // Ocultar completamente el contenedor principal para que no se vea la cámara
    container.style.display = "none"
  } else {
    desktopWarning.style.display = "none"
    container.style.display = "flex"
  }
}

// Verificar al cargar la página y cuando cambie el tamaño de la ventana
window.addEventListener("load", checkDeviceAndShowWarning)
window.addEventListener("resize", checkDeviceAndShowWarning)

// Configurar botones de la advertencia
document.getElementById("back-btn").addEventListener("click", () => {
  window.history.back()
})
