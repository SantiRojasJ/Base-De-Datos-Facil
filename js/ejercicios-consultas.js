var ejerciciosData = [
    {
        solucion: "SELECT A.nombre, C.nombre_carrera FROM Alumnos A INNER JOIN Carreras C ON A.id_carrera = C.id_carrera;",
        pista: "INNER JOIN combina filas que tienen coincidencia en ambas tablas. Usá ON para indicar la condición."
    },
    {
        solucion: "SELECT A.nombre, C.nombre_carrera FROM Alumnos A LEFT JOIN Carreras C ON A.id_carrera = C.id_carrera;",
        pista: "LEFT JOIN trae todas las filas de la tabla izquierda, aunque no haya coincidencia en la derecha."
    },
    {
        solucion: "SELECT A.nombre, C.nombre_carrera FROM Alumnos A RIGHT JOIN Carreras C ON A.id_carrera = C.id_carrera;",
        pista: "RIGHT JOIN trae todas las filas de la tabla derecha, aunque no haya coincidencia en la izquierda."
    },
    {
        solucion: "SELECT C.nombre_carrera, COUNT(*) AS cantidad FROM Alumnos A INNER JOIN Carreras C ON A.id_carrera = C.id_carrera GROUP BY C.nombre_carrera;",
        pista: "GROUP BY agrupa filas por columna. COUNT(*) cuenta las filas de cada grupo."
    },
    {
        solucion: "SELECT C.nombre_carrera, COUNT(*) AS cantidad FROM Alumnos A INNER JOIN Carreras C ON A.id_carrera = C.id_carrera GROUP BY C.nombre_carrera HAVING COUNT(*) > 3;",
        pista: "HAVING filtra después de GROUP BY. Es como WHERE pero para grupos."
    },
    {
        solucion: "SELECT * FROM Alumnos WHERE id_carrera IN (SELECT id_carrera FROM Carreras WHERE nombre_carrera LIKE 'S%');",
        pista: "Usá WHERE id_carrera IN (SELECT id_carrera FROM Carreras WHERE nombre_carrera LIKE 'S%')."
    },
    {
        solucion: "SELECT * FROM Alumnos WHERE nombre LIKE 'A%';",
        pista: "LIKE busca patrones. El % es un comodín para cualquier carácter."
    },
    {
        solucion: "SELECT * FROM Alumnos WHERE edad BETWEEN 20 AND 25;",
        pista: "BETWEEN incluye ambos valores extremos. Es equivalente a >= y <=."
    },
    {
        solucion: "SELECT A.nombre, C.nombre_carrera FROM Alumnos A INNER JOIN Carreras C ON A.id_carrera = C.id_carrera WHERE C.nombre_carrera = 'Ingeniería en Sistemas' ORDER BY A.nombre ASC;",
        pista: "Combiná INNER JOIN con WHERE para filtrar y ORDER BY para ordenar."
    },
    {
        solucion: "SELECT C.nombre_carrera, (SELECT COUNT(*) FROM Alumnos A WHERE A.id_carrera = C.id_carrera) AS cantidad_alumnos, (SELECT COUNT(*) FROM Materias M WHERE M.id_carrera = C.id_carrera) AS cantidad_materias FROM Carreras C HAVING cantidad_alumnos > 2 ORDER BY cantidad_alumnos DESC;",
        pista: "Usá subconsultas para contar alumnos y materias por carrera, o combiná JOINs con GROUP BY y HAVING."
    }
];

var estado = {
    intentos: {},
    completados: {},
    respuestas: {}
};

var ejercicioActual = 0;
var totalEjercicios = ejerciciosData.length;
var CLAVE_STORAGE = "bdd-facil-ejercicios-consultas";

function cargarEstado() {
    try {
        var guardado = localStorage.getItem(CLAVE_STORAGE);
        if (guardado) {
            var parsed = JSON.parse(guardado);
            estado.intentos = parsed.intentos || {};
            estado.completados = parsed.completados || {};
            estado.respuestas = parsed.respuestas || {};
        }
    } catch (e) {
        estado = { intentos: {}, completados: {}, respuestas: {} };
    }
}

function guardarEstado() {
    try {
        localStorage.setItem(CLAVE_STORAGE, JSON.stringify(estado));
    } catch (e) {}
}

function normalizar(sql) {
    return sql
        .toLowerCase()
        .replace(/\[|\]/g, "")
        .replace(/;\s*/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function getIntentos(index) {
    return estado.intentos[index] || 0;
}

function setIntentos(index, valor) {
    estado.intentos[index] = valor;
    guardarEstado();
}

function estaCompletado(index) {
    return !!estado.completados[index];
}

function marcarCompletado(index) {
    estado.completados[index] = true;
    guardarEstado();
}

function guardarRespuesta(index, texto) {
    estado.respuestas[index] = texto;
    guardarEstado();
}

function corregir(index) {
    if (estaCompletado(index)) return;

    var textarea = document.getElementById("respuesta-" + index);
    var resultado = document.getElementById("resultado-" + index);
    var intentosEl = document.getElementById("intentos-" + index);

    if (!textarea || !resultado) return;

    var respuesta = textarea.value.trim();

    if (!respuesta) {
        resultado.className = "result-message result-empty";
        resultado.innerHTML = "Escribí tu respuesta primero.";
        return;
    }

    var solucionNormalizada = normalizar(ejerciciosData[index].solucion);
    var respuestaNormalizada = normalizar(respuesta);

    if (respuestaNormalizada === solucionNormalizada) {
        resultado.className = "result-message result-correct";
        resultado.innerHTML = "✅ Correcto. Excelente trabajo.";
        marcarCompletado(index);
        guardarRespuesta(index, respuesta);
        mostrarSolucion(index);
        actualizarProgreso();
        actualizarDots();
        actualizarEstadoUI(index);
    } else {
        var intentos = getIntentos(index);
        intentos++;
        setIntentos(index, intentos);

        resultado.className = "result-message result-incorrect";

        if (intentos >= 3) {
            resultado.innerHTML = "❌ Incorrecto. Mirá la pista y la solución para entender el ejercicio.";
            mostrarPista(index);
            habilitarSolucion(index);
        } else {
            resultado.innerHTML = "❌ Incorrecto. Intento " + intentos + " de 3.";
        }

        intentosEl.textContent = "Intentos: " + intentos + "/3";
        guardarRespuesta(index, respuesta);
        actualizarEstadoUI(index);
    }
}

function mostrarPista(index) {
    var pista = document.getElementById("pista-" + index);
    if (pista) {
        pista.classList.add("visible");
    }
}

function habilitarSolucion(index) {
    var btn = document.getElementById("btn-solucion-" + index);
    if (btn) {
        btn.classList.remove("locked");
        btn.disabled = false;
    }
}

function mostrarSolucion(index) {
    var solucion = document.getElementById("solucion-" + index);
    if (solucion) {
        solucion.classList.add("visible");
    }
}

function toggleSolucion(index) {
    var btn = document.getElementById("btn-solucion-" + index);
    if (btn && btn.classList.contains("locked")) return;

    var solucion = document.getElementById("solucion-" + index);
    if (!solucion) return;

    if (solucion.classList.contains("visible")) {
        solucion.classList.remove("visible");
        if (btn) btn.innerHTML = "👁️ Mostrar solución";
    } else {
        solucion.classList.add("visible");
        if (btn) btn.innerHTML = "🙈 Ocultar solución";
    }
}

function mostrarEjercicio(index) {
    if (index < 0 || index >= totalEjercicios) return;

    ejercicioActual = index;

    var cards = document.querySelectorAll(".exercise-card");
    for (var i = 0; i < cards.length; i++) {
        cards[i].style.display = i === index ? "block" : "none";
    }

    restaurarEstadoEjercicio(index);
    actualizarProgreso();
    actualizarDots();
    actualizarEstadoUI(index);

    var container = document.querySelector(".exercise-container");
    if (container) {
        container.style.opacity = "0";
        container.style.transform = "translateY(12px)";
        requestAnimationFrame(function () {
            container.style.transition = "opacity 0.35s ease, transform 0.35s ease";
            container.style.opacity = "1";
            container.style.transform = "translateY(0)";
        });
    }
}

function restaurarEstadoEjercicio(index) {
    var textarea = document.getElementById("respuesta-" + index);
    var resultado = document.getElementById("resultado-" + index);
    var intentosEl = document.getElementById("intentos-" + index);
    var pista = document.getElementById("pista-" + index);
    var btnSolucion = document.getElementById("btn-solucion-" + index);

    if (textarea && estado.respuestas[index]) {
        textarea.value = estado.respuestas[index];
    }

    var intentos = getIntentos(index);

    if (intentosEl) {
        if (estaCompletado(index)) {
            intentosEl.textContent = "✅ Completado";
            intentosEl.className = "attempt-count completed";
        } else {
            intentosEl.textContent = "Intentos: " + intentos + "/3";
            intentosEl.className = "attempt-count";
        }
    }

    if (estaCompletado(index)) {
        if (resultado) {
            resultado.className = "result-message result-correct";
            resultado.innerHTML = "✅ Correcto. Excelente trabajo.";
        }
        mostrarSolucion(index);
        if (btnSolucion) {
            btnSolucion.innerHTML = "👁️ Mostrar solución";
        }
    } else if (intentos >= 3) {
        if (resultado) {
            resultado.className = "result-message result-incorrect";
            resultado.innerHTML = "❌ Incorrecto. Mirá la pista y la solución para entender el ejercicio.";
        }
        mostrarPista(index);
        habilitarSolucion(index);
    }
}

function actualizarEstadoUI(index) {
    var intentosEl = document.getElementById("intentos-" + index);
    if (!intentosEl) return;

    if (estaCompletado(index)) {
        intentosEl.textContent = "✅ Completado";
        intentosEl.className = "attempt-count completed";
    } else {
        var intentos = getIntentos(index);
        intentosEl.textContent = "Intentos: " + intentos + "/3";
        intentosEl.className = "attempt-count";
    }
}

function siguienteEjercicio() {
    if (ejercicioActual < totalEjercicios - 1) {
        mostrarEjercicio(ejercicioActual + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function ejercicioAnterior() {
    if (ejercicioActual > 0) {
        mostrarEjercicio(ejercicioActual - 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
}

function irAEjercicio(index) {
    mostrarEjercicio(index);
    window.scrollTo({ top: 0, behavior: "smooth" });
}

function actualizarProgreso() {
    var completados = 0;
    for (var i = 0; i < totalEjercicios; i++) {
        if (estaCompletado(i)) completados++;
    }

    var porcentaje = (completados / totalEjercicios) * 100;
    var fill = document.querySelector(".progress-fill");
    var count = document.querySelector(".progress-count");

    if (fill) fill.style.width = porcentaje + "%";
    if (count) count.textContent = completados + " / " + totalEjercicios;

    var msg = document.getElementById("completion-message");
    if (msg) {
        if (completados === totalEjercicios) {
            msg.classList.add("visible");
            localStorage.setItem("nivel2_completado", "true");
        } else {
            msg.classList.remove("visible");
        }
    }
}

function actualizarDots() {
    var dots = document.querySelectorAll(".dot");
    for (var i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
        dots[i].classList.remove("completed");

        if (i === ejercicioActual) {
            dots[i].classList.add("active");
        }
        if (estaCompletado(i) && i !== ejercicioActual) {
            dots[i].classList.add("completed");
        }
    }
}

function actualizarBotonesNav() {
    var btnAnterior = document.getElementById("btn-anterior");
    var btnSiguiente = document.getElementById("btn-siguiente");

    if (btnAnterior) btnAnterior.disabled = ejercicioActual === 0;
    if (btnSiguiente) btnSiguiente.disabled = ejercicioActual === totalEjercicios - 1;
}

document.addEventListener("keydown", function (e) {
    if (e.target && e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowRight" || e.key === "Right") siguienteEjercicio();
    if (e.key === "ArrowLeft" || e.key === "Left") ejercicioAnterior();
});

document.addEventListener("DOMContentLoaded", function () {
    cargarEstado();

    var textareas = document.querySelectorAll(".sql-answer");
    for (var i = 0; i < textareas.length; i++) {
        (function (ta, idx) {
            ta.addEventListener("input", function () {
                guardarRespuesta(idx, ta.value);
            });
        })(textareas[i], i);
    }

    mostrarEjercicio(0);
    actualizarBotonesNav();
});
