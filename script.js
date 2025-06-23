document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault();

  const inicioStr = document.getElementById("inicio").value;
  const perdidos = parseInt(document.getElementById("perdidos").value);
  const objetivo = parseInt(document.getElementById("objetivo").value);
  const resultadoDiv = document.getElementById("resultado");

  if (!inicioStr || isNaN(perdidos) || isNaN(objetivo) || perdidos < 0 || objetivo <= 0) {
    resultadoDiv.innerHTML = "<p>Por favor, ingresa valores válidos.</p>";
    return;
  }

  const inicio = new Date(inicioStr + 'T00:00:00');
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  let diasHabiles = 0;
  let fechaIter = new Date(inicio);

  while (fechaIter <= hoy) {
    const dia = fechaIter.getDay();
    if (dia >= 1 && dia <= 5) {
      diasHabiles++;
    }
    fechaIter.setDate(fechaIter.getDate() + 1);
    fechaIter.setHours(0, 0, 0, 0);
  }

  diasHabiles -= perdidos;
  if (diasHabiles < 0) diasHabiles = 0;

  let diasRestantes = objetivo - diasHabiles;
  let fechaFinal = new Date(hoy);

  while (diasRestantes > 0) {
    fechaFinal.setDate(fechaFinal.getDate() + 1);
    fechaFinal.setHours(0, 0, 0, 0);
    const dia = fechaFinal.getDay();
    if (dia >= 1 && dia <= 5) {
      diasRestantes--;
    }
  }

  const msPorDia = 1000 * 60 * 60 * 24;
  const diasNaturalesRestantes = Math.round((fechaFinal - hoy) / msPorDia);

  const opcionesFecha = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
  const hoyStr = hoy.toLocaleDateString('es-ES', opcionesFecha);
  const fechaFinalStr = fechaFinal.toLocaleDateString('es-ES', opcionesFecha);

  // Calcular horas y minutos restantes hoy
  const ahora = new Date();
  const salida = new Date();
  salida.setHours(17, 0, 0, 0); // 5:00 p. m.

  let hrMinRestantes = "0 hr : 0 min";
  if (ahora < salida) {
    const msRestantes = salida - ahora;
    const totalMin = Math.floor(msRestantes / (1000 * 60));
    const horas = Math.floor(totalMin / 60);
    const minutos = totalMin % 60;
    hrMinRestantes = `${horas} hr : ${minutos} min`;
  }

  resultadoDiv.innerHTML = `
    <p><strong>Hoy es:</strong> ${hoyStr}</p>
    <p><strong>Horas que faltan para salir hoy:</strong> ${hrMinRestantes}</p>
    <p><strong>Días de práctica acumulados:</strong> ${diasHabiles}</p>
    <p><strong>Faltan:</strong> ${objetivo - diasHabiles} días hábiles de práctica</p>
    <p><strong>Finalizarás el:</strong> ${fechaFinalStr}</p>
    <p><strong>Faltan:</strong> ${diasNaturalesRestantes} días naturales desde hoy</p>
  `;
});
