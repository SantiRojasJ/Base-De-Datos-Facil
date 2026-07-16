var ejerciciosData = [
    {
        solucion: "CREATE DATABASE Biblioteca;\nUSE Biblioteca;",
        pista: "Primero creá la base de datos con CREATE DATABASE, y luego seleccionala con USE."
    },
    {
        solucion: "CREATE TABLE Libros (\n    id_libro INT PRIMARY KEY,\n    titulo VARCHAR(100),\n    autor VARCHAR(100),\n    anio_publicacion INT\n);",
        pista: "Definí cada columna con su nombre y tipo de dato. La PRIMARY KEY identifica cada fila."
    },
    {
        solucion: "INSERT INTO Libros VALUES (1, 'El Principito', 'Antoine de Saint-Exupéry', 1943);\nINSERT INTO Libros VALUES (2, 'Cien Años de Soledad', 'Gabriel García Márquez', 1967);\nINSERT INTO Libros VALUES (3, 'Don Quijote', 'Miguel de Cervantes', 1605);\nINSERT INTO Libros VALUES (4, '1984', 'George Orwell', 1949);\nINSERT INTO Libros VALUES (5, 'La Sombra del Viento', 'Carlos Ruiz Zafón', 2001);",
        pista: "Usá INSERT INTO Libros VALUES (valor1, valor2, ...) para cada libro."
    },
    {
        solucion: "SELECT * FROM Libros;",
        pista: "El asterisco * selecciona todas las columnas de la tabla."
    },
    {
        solucion: "SELECT titulo, autor FROM Libros;",
        pista: "Listá las columnas que querés ver separadas por comas después de SELECT."
    },
    {
        solucion: "SELECT * FROM Libros WHERE anio_publicacion > 2015;",
        pista: "WHERE filtra filas. Para comparar números no necesitás comillas."
    },
    {
        solucion: "UPDATE Libros SET titulo = 'Nuevo Titulo' WHERE id_libro = 1;",
        pista: "UPDATE tabla SET columna = nuevo_valor WHERE condición;"
    },
    {
        solucion: "DELETE FROM Libros WHERE id_libro = 1;",
        pista: "DELETE FROM tabla WHERE condición; siempre usá WHERE para no borrar todo."
    },
    {
        solucion: "SELECT * FROM Libros ORDER BY anio_publicacion DESC;",
        pista: "ORDER BY ordena los resultados. DESC es de mayor a menor."
    },
    {
        solucion: "CREATE DATABASE Universidad;\nUSE Universidad;\nCREATE TABLE Alumnos (\n    id_alumno INT PRIMARY KEY,\n    nombre VARCHAR(100),\n    apellido VARCHAR(100),\n    edad INT\n);\nINSERT INTO Alumnos VALUES (1, 'Juan', 'García', 22);\nINSERT INTO Alumnos VALUES (2, 'María', 'López', 19);\nINSERT INTO Alumnos VALUES (3, 'Carlos', 'Martínez', 24);\nINSERT INTO Alumnos VALUES (4, 'Ana', 'Rodríguez', 21);\nINSERT INTO Alumnos VALUES (5, 'Pedro', 'Sánchez', 18);\nSELECT * FROM Alumnos WHERE edad > 20 ORDER BY apellido ASC;",
        pista: "Combiná todo: CREATE DATABASE, CREATE TABLE, INSERT y un SELECT con WHERE y ORDER BY."
    }
];

var estado = {
    intentos: {},
    completados: {},
    respuestas: {}
};

var ejercicioActual = 0;
var totalEjercicios = ejerciciosData.length;
var CLAVE_STORAGE = "bdd-facil-ejercicios";

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
            localStorage.setItem("nivel1_completado", "true");
        } else {
            msg.classList.remove("visible");
        }
    }
}

function verificarDesbloqueoNivel2() {
    var nivel1 = localStorage.getItem("nivel1_completado");
    var nivel2Link = document.getElementById("nivel2-link");
    if (nivel1 === "true" && nivel2Link) {
        nivel2Link.innerHTML = "Nivel 2 - Consultas SQL";
        nivel2Link.href = "ejercicios-consultas.html";
        nivel2Link.classList.remove("locked-level");
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
    verificarDesbloqueoNivel2();
});
