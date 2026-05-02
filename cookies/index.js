const banner = document.getElementById("cookie-banner");

// Mostrar solo si no eligió
if (!localStorage.getItem("cookies")) {
    setTimeout(() => {
        banner.classList.add("show");
    }, 1000);
}

// ACEPTAR
window.aceptarCookies = function () {
    localStorage.setItem("cookies", "accepted");
    banner.classList.remove("show");
}

// RECHAZAR
window.rechazarCookies = function () {
    localStorage.setItem("cookies", "rejected");
    banner.classList.remove("show");
}






