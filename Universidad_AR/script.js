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
  historia: {
    title: "Universidad: HISTORIA",
    content:
      "La Universidad Popular del Cesar, Seccional Aguachica, es una institución de educación superior dedicada a la formación integral del ser humano, con énfasis en la docencia, la investigación y la proyección social.\n\nEn sus más de 20 años de historia, ha contribuido al desarrollo educativo, científico, cultural y social del sur del Cesar y su área de influencia. Cuenta con un campus moderno, laboratorios, salas de cómputo y Biblioteca.\n\nActualmente ofrece siete programas de pregrado: Ingeniería de Sistemas, Ingeniería Agroindustrial, Ingeniería Ambiental y Sanitaria, Administración de Empresas, Contaduría, Economía e Ingeniería Agropecuaria, además de especializaciones, y avanza en la apertura de nuevas carreras. ",
  },
  mision: {
    title: "Universidad: MISIÓN",
    content:
      "La Universidad Popular del Cesar, como institución de educación superior oficial del orden nacional, forma personas responsables social y culturalmente; con una educación de calidad, integral e inclusiva, rigor científico y tecnológico; mediante las diferentes modalidades y metodologías de educación, a través de programas pertinentes al contexto, dentro de la diversidad de campos disciplinares, en un marco de libertad de pensamiento; que consolide la construcción de saberes, para contribuir a la solución de problemas y conflictos, en un ambiente sostenible, con visibilidad nacional e internacional.",
  },
  vision: {
    title: "Universidad: VISIÓN",
    content:
      "En el año 2025, la Universidad Popular del Cesar será una Institución de Educación Superior de alta calidad, incluyente y transformadora; comprometida en el desarrollo sustentable de la Región, con visibilidad nacional y alcance internacional. ",
  },
  escudo: {
    title: "Universidad: ESCUDO",
    content:
      "El escudo de la Universidad Popular del Cesar simboliza el conocimiento y la superación. El diamante representa la luz de la educación, mientras que el azul y el negro reflejan la búsqueda de la verdad y la lucha contra la ignorancia.\n\n Inspirado en la mitología griega, el fuego de Prometeo simboliza la inteligencia, y los laureles representan los logros culturales y académicos. \n\n El escudo se enmarca con el lema -Educación y Futuro-, destacando el compromiso de la universidad con el desarrollo y la formación integral. ",
  },
  bandera: {
    title: "Universidad: BANDERA",
    content:
      "Tiene un diseño muy sobrio pero inconfundible, porque le podemos reconocer a lo lejos que es nuestra bandera. Representa el todo y la parte, la esperanza y la blancura impoluta y guarda uniformidad con el ESCUDO ya que se haya estampado en el centro. ",
  },
  himno: {
  title: "Universidad: HIMNO",
  content:
    "El himno de la Universidad Popular del Cesar, escrito y musicalizado por la docente Martha Esther Guerra Muñoz, es una expresión poética del espíritu académico, cultural y humano de la institución.\n\n Su letra exalta valores como el humanismo, la libertad, el conocimiento y la diversidad, resaltando la importancia de la educación como faro de esperanza y transformación.\n\n Con un tono solemne y emotivo, el himno rinde homenaje a la historia, el entorno natural, y el compromiso de estudiantes y docentes con la construcción de un futuro mejor. ",
  }, 
  logo: {
    title: "LOGO",
    content:
      "La marca gráfica es el principal signo identificador de la Universidad Popular del Cesar y está conformada por un símbolo con las letras UPC y la representación del ser humano, y el logotipo.\n\nEs la firma de la institución en la cual se manifiestan sus valores, principios y personalidad, originando un impacto y un reconocimiento en la memoria.",
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
document.querySelector("#marker-historia").addEventListener("markerFound", () => {
  showMarkerContent("marker-historia")
  // Restablecer escala al tamaño original 
  document.querySelector("#historia-model").setAttribute("scale", "0.6 1 1")
})
document.querySelector("#marker-mision").addEventListener("markerFound", () => {
  showMarkerContent("marker-mision")
  document.querySelector("#mision-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-vision").addEventListener("markerFound", () => {
  showMarkerContent("marker-vision")
  document.querySelector("#vision-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-escudo").addEventListener("markerFound", () => {
  showMarkerContent("marker-escudo")
  document.querySelector("#escudo-model").setAttribute("scale", "0.6 1 1")
})
document.querySelector("#marker-bandera").addEventListener("markerFound", () => {
  showMarkerContent("marker-bandera")
  document.querySelector("#bandera-model").setAttribute("scale", "0.6 1 1")
})
document.querySelector("#marker-himno").addEventListener("markerFound", () => {
  showMarkerContent("marker-himno")
  document.querySelector("#himno-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-logo").addEventListener("markerFound", () => {
  showMarkerContent("marker-logo")
  document.querySelector("#logo-model").setAttribute("scale", "0.6 1 1")
})

// Detectar cuándo un marcador se pierde
document.querySelector("#marker-historia").addEventListener("markerLost", () => {
  hideMarkerContent("marker-historia")
})
document.querySelector("#marker-mision").addEventListener("markerLost", () => {
  hideMarkerContent("marker-mision")
})
document.querySelector("#marker-vision").addEventListener("markerLost", () => {
  hideMarkerContent("marker-vision")
})
document.querySelector("#marker-escudo").addEventListener("markerLost", () => {
  hideMarkerContent("marker-escudo")
})
document.querySelector("#marker-bandera").addEventListener("markerLost", () => {
  hideMarkerContent("marker-bandera")
})
document.querySelector("#marker-himno").addEventListener("markerLost", () => {
  hideMarkerContent("marker-himno")
})
document.querySelector("#marker-logo").addEventListener("markerLost", () => {
  hideMarkerContent("marker-logo")
})

// Función para iniciar la reproducción
playBtn.addEventListener("click", () => {
  if (textElement.innerText && !isLoading) {
    // Mostrar estado de carga
    showLoadingState()

    const utterance = new SpeechSynthesisUtterance(textElement.innerText)
    utterance.lang = "es-ES"
    utterance.rate = 1.0
    utterance.pitch = 1.0

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
