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
  sistemas: {
    title: "Perfil: Ingeniero de Sistemas",
    content:
      "El ingeniero de sistemas será un profesional con sentido ético en cada labor que desempeñe, con capacidades para el trabajo en equipos interdisciplinarios lo que le permitirá desarrollar y aplicar diversas soluciones a través de las tecnologías de la información y la comunicación de manera asertiva con un enfoque global.\n Aplicará técnicas y tecnologías a la resolución de problemas relacionados con la representación, almacenamiento, gestión y comunicación de la información y del conocimiento con una visión sistémica y de respeto por el medio ambiente. ",
  },
  agroindustrial: {
    title: "Perfil: Ingeniero Agroindustrial",
    content:
      "El Ingeniero Agroindustrial de la UPCSA está en la capacidad de:\n\n Diseñar y aplicar procesos de transformación de materias primas de origen biológico procedentes del sector primario para la obtención de productos industriales y su comercialización. \n Formular y liderar proyectos productivos, de investigación y transferencia tecnológica. \n\ Generar soluciones a la problemática agroindustrial de la región. \n Promover el desarrollo sostenible y ambiental, en concordancia con las políticas económicas nacionales e      internacionales. \n Comprender los sistemas integrados de gestión. \n Desarrollar su espíritu investigativo en los procesos agroindustriales. ",
  },
  ambiental: {
    title: "Perfil: Ingeneiro Ambiental y Sanitario",
    content:
      "El Ingeniero Ambiental y Sanitario egresado de la UPC seccional Aguachica, es integral con pensamiento crítico, reflexivo y creativo, de espíritu emprendedor e investigativo, capaz de asumir el liderazgo en procesos de gestión ambiental y alternativas sostenibles asociadas a los modelos económicos de desarrollo, quien basado en el principio de precaución y el funcionamiento sistémico los procesos naturales, promueven la solución a problemas generados por los sistemas de producción, saneamiento básico e impacto de la globalización; con capacidad de trabajo en equipo, comunicación asertiva, visión  holística coherente con la ética, el civismo y la moral, responsable y legalmente. ",
  },
  agropecuario: {
    title: "Perfil: Ingeniero/a Agropecurio",
    content:
      "El Ingeniero Agropecuario de la UPCSA, será un profesional con capacidades científicas, tecnológicas y de la ingeniería aplicada propia del campo de conocimiento que le permitirán Diseñar, Desarrollar, Implementar y Liderar sistemas de producción agropecuarios con responsabilidad ambiental, social y ética; promoviendo soluciones y alternativas sustentables a problemáticas contextuales de seguridad e independencia alimentaria mediante la aplicación de estrategias innovadoras y de emprendimiento. ",
  },
  administrador: {
    title: "Perfil: Administrador de Empresas",
    content:
      "El Administrador de la Universidad Popular del Cesar deberá ser un hombre crítico, creativo, innovador, inconforme, humanista, solidario y democrático, con valores que trasciendan los límites de la organización para que las acciones que desarrolle en cualquier actividad profesional y personal, se caractericen por su transparencia, honestidad, equidad, responsabilidad y respeto por sí y por los demás.\n\n Deberá tener una serie de características propias que permitan generar nuevas ideas que lleven a emprender y desarrollar la formación de empresas, poseer carácter de triunfador, con una disciplina férrea para adquirir nuevos conocimientos,  un mejoramiento continuo a través del esfuerzo, un alto nivel de superación que concluya en un progreso académico y laboral, no conformarse con los parámetros entregados en sus clases, sino investigar y formar su propio criterio profesional, la búsqueda de la propia realización personal y profesional.   Deberá ser un profesional capaz de identificar problemas claves en las distintas áreas del conocimiento, de las organizaciones y de la sociedad, abstraerlos de la realidad, convertirlos en materia de investigación y encontrarles soluciones específicas. ",
  },
  contador: {
  title: "Perfil: Contador Público",
  content:
    "El Contador Público egresado de la Universidad Popular del Cesar está en capacidad de desarrollar un conjunto de conocimientos, destrezas, habilidades y actitudes necesarios para su ejercicio profesional dentro de las organizaciones y fuera de ellas, ampliando y profundizando las actuales áreas del conocimiento disciplinar y de la profesión contable y creando aquellas requeridas para hacer frente a los cambios que impone la nueva sociedad.\n\n  Su formación integral le permite un claro conocimiento en su entorno social, político, económico y cultural, para desarrollar un conjunto de actividades hacia el cambio, la innovación y la investigación que lo inducen a asumir el compromiso social de contribuir a conmover el desarrollo del país ejerciendo un liderazgo efectivo en su campo de acción. Así pues, las características de nuestro egresado son: creativo, innovador, internacional, líder, recursivo, crítico, prospectivo y multidisciplinario, filosófico-epistemológico. ",
  }, 
  economista: {
    title: "Perfil: Economista",
    content:
      "El Economista de la Universidad Popular del Cesar, seccional Aguachica se caracteriza por poseer habilidades en la compresión lectora así como de habilidades de comunicación verbal y escrita; dominio de las matemáticas y el pensamiento crítico, basando su actuaciones en principio éticos y morales, que le permiten aportar de manera creativa e innovadora al desarrollo de valor a las organizaciones del ámbito público y privado, así como generación de emprendimientos siendo capaz de atender a las necesidades y tendencias del mercado. ",
  },
  abogado: {
    title: "Perfil: Abogado",
    content:
      "El egresado del  Programa de Derecho de la Universidad Popular del Cesar seccional Aguachica será un abogado integral, capaz de responder a los desafíos de la sociedad, dotado de herramientas conceptuales, hermenéuticas, argumentativas, investigativas que le permita interpretar y aplicar la Legislación vigente en el ejercicio eficaz de su profesión; generando estrategias orientadas a la comprensión y apropiación de la ciencia, la tecnología y la innovación,  espíritu de paz, compromiso social y comunitario, generando soluciones responsables a los conflictos en virtud de la construcción de paz para la humanidad. ",
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
document.querySelector("#marker-sistemas").addEventListener("markerFound", () => {
  showMarkerContent("marker-sistemas")
  // Restablecer escala al tamaño original 
  document.querySelector("#sistemas-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-agroindustrial").addEventListener("markerFound", () => {
  showMarkerContent("marker-agroindustrial")
  document.querySelector("#agroindustrial-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-ambiental").addEventListener("markerFound", () => {
  showMarkerContent("marker-ambiental")
  document.querySelector("#ambiental-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-agropecuario").addEventListener("markerFound", () => {
  showMarkerContent("marker-agropecuario")
  document.querySelector("#agropecuario-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-administrador").addEventListener("markerFound", () => {
  showMarkerContent("marker-administrador")
  document.querySelector("#administrador-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-contador").addEventListener("markerFound", () => {
  showMarkerContent("marker-contador")
  document.querySelector("#contador-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-economista").addEventListener("markerFound", () => {
  showMarkerContent("marker-economista")
  document.querySelector("#economista-model").setAttribute("scale", "1 1 1")
})
document.querySelector("#marker-abogado").addEventListener("markerFound", () => {
  showMarkerContent("marker-abogado")
  document.querySelector("#abogado-model").setAttribute("scale", "1 1 1")
})

// Detectar cuándo un marcador se pierde
document.querySelector("#marker-sistemas").addEventListener("markerLost", () => {
  hideMarkerContent("marker-sistemas")
})
document.querySelector("#marker-agroindustrial").addEventListener("markerLost", () => {
  hideMarkerContent("marker-agroindustrial")
})
document.querySelector("#marker-ambiental").addEventListener("markerLost", () => {
  hideMarkerContent("marker-ambiental")
})
document.querySelector("#marker-agropecuario").addEventListener("markerLost", () => {
  hideMarkerContent("marker-agropecuario")
})
document.querySelector("#marker-administrador").addEventListener("markerLost", () => {
  hideMarkerContent("marker-administrador")
})
document.querySelector("#marker-contador").addEventListener("markerLost", () => {
  hideMarkerContent("marker-contador")
})
document.querySelector("#marker-economista").addEventListener("markerLost", () => {
  hideMarkerContent("marker-economista")
})
document.querySelector("#marker-abogado").addEventListener("markerLost", () => {
  hideMarkerContent("marker-abogado")
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
