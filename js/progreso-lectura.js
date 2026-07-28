(function () {
    'use strict';

    var STORAGE_KEY = 'bdd-facil-progreso-lectura';

    function obtenerProgreso(articuloId) {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            return data[articuloId] || { completado: false, scrollMaximo: 0 };
        } catch (e) {
            return { completado: false, scrollMaximo: 0 };
        }
    }

    function guardarProgreso(articuloId, progreso) {
        try {
            var data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
            data[articuloId] = progreso;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    function inicializar(config) {
        var articleContent = document.querySelector('.article-content');
        if (!articleContent) return;

        var progressContainer = document.createElement('div');
        progressContainer.id = 'lectura-progress-container';
        progressContainer.style.cssText =
            'position:sticky;top:0;z-index:999;background:#0f172a;padding:0.5rem 0;margin-bottom:1.5rem;border-bottom:1px solid rgba(139,92,246,0.3);';

        progressContainer.innerHTML =
            '<div style="display:flex;align-items:center;gap:1rem;">' +
                '<div style="flex:1;height:8px;background:#1e293b;border-radius:4px;overflow:hidden;">' +
                    '<div id="lectura-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#8b5cf6,#06b6d4);border-radius:4px;transition:width 0.2s;"></div>' +
                '</div>' +
                '<span id="lectura-text" style="color:#94a3b8;font-size:0.85rem;font-weight:600;min-width:40px;text-align:right;">0%</span>' +
            '</div>';

        articleContent.parentNode.insertBefore(progressContainer, articleContent);

        var completadoSection = document.createElement('div');
        completadoSection.id = 'completado-section';
        completadoSection.style.cssText =
            'background:rgba(139,92,246,0.05);border:1px solid rgba(139,92,246,0.2);border-radius:12px;padding:2rem;margin:3rem 0;text-align:center;';

        completadoSection.innerHTML =
            '<div id="completado-status-icon" style="font-size:2rem;margin-bottom:0.5rem;">📖</div>' +
            '<h3 style="color:#e2e8f0;margin-bottom:0.5rem;">Progreso del artículo</h3>' +
            '<p id="completado-mensaje" style="color:#94a3b8;margin-bottom:1.5rem;">Leé el artículo completo y marcalo como completado para desbloquear el siguiente.</p>' +
            '<button id="btn-completar" style="background:linear-gradient(135deg,#8b5cf6,#06b6d4);color:white;border:none;padding:0.8rem 2rem;border-radius:25px;font-weight:600;font-size:1rem;cursor:pointer;transition:all 0.3s;box-shadow:0 5px 20px rgba(139,92,246,0.4);opacity:0.5;">✓ Marcar como completado</button>';

        var nav = articleContent.querySelector('#link-siguiente');
        if (nav) {
            var wrapper = document.createElement('div');
            wrapper.id = 'next-wrapper';
            wrapper.style.display = 'inline-block';
            nav.parentNode.insertBefore(wrapper, nav);
            wrapper.appendChild(nav);
        }

        articleContent.appendChild(completadoSection);

        actualizarEstado(config);

        var ticking = false;
        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    actualizarScroll(config);
                    ticking = false;
                });
                ticking = true;
            }
        });

        document.getElementById('btn-completar').addEventListener('click', function () {
            marcarCompletado(config);
        });
    }

    function actualizarScroll(config) {
        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        var percent = scrollHeight > 0 ? Math.min(100, Math.round((scrollTop / scrollHeight) * 100)) : 0;

        var bar = document.getElementById('lectura-bar');
        var text = document.getElementById('lectura-text');
        if (bar) bar.style.width = percent + '%';
        if (text) text.textContent = percent + '%';

        var progreso = obtenerProgreso(config.articuloId);
        if (percent > progreso.scrollMaximo) {
            progreso.scrollMaximo = percent;
            guardarProgreso(config.articuloId, progreso);
        }

        var btn = document.getElementById('btn-completar');
        if (btn) {
            btn.style.opacity = percent >= 95 ? '1' : '0.5';
            btn.style.cursor = percent >= 95 ? 'pointer' : 'not-allowed';
            btn.title = percent >= 95 ? 'Hacé clic para marcar como completado' : 'Leé el artículo completo primero (95%)';
        }
    }

    function marcarCompletado(config) {
        var btn = document.getElementById('btn-completar');
        if (btn && btn.style.opacity === '0.5') return;

        var progreso = obtenerProgreso(config.articuloId);
        progreso.completado = true;
        progreso.scrollMaximo = 100;
        guardarProgreso(config.articuloId, progreso);

        actualizarEstado(config);
    }

    function actualizarEstado(config) {
        var progreso = obtenerProgreso(config.articuloId);

        var icon = document.getElementById('completado-status-icon');
        var mensaje = document.getElementById('completado-mensaje');
        var btn = document.getElementById('btn-completar');

        if (progreso.completado) {
            if (icon) icon.textContent = '✅';
            if (mensaje) {
                mensaje.innerHTML =
                    '<strong style="color:#00ff88;">Artículo completado</strong> — Ya podés continuar con el siguiente.';
            }
            if (btn) {
                btn.textContent = '✓ Completado';
                btn.style.background = 'linear-gradient(135deg,#00ff88,#06b6d4)';
                btn.style.opacity = '1';
                btn.style.cursor = 'default';
                btn.disabled = true;
            }
        } else {
            if (icon) icon.textContent = '📖';
            if (mensaje) {
                mensaje.textContent =
                    'Leé el artículo completo y marcalo como completado para desbloquear el siguiente.';
            }
            if (btn) {
                btn.textContent = '✓ Marcar como completado';
                btn.style.background = 'linear-gradient(135deg,#8b5cf6,#06b6d4)';
                btn.disabled = false;
            }
        }

        var nextLink = document.getElementById('link-siguiente');
        if (nextLink) {
            if (progreso.completado) {
                nextLink.style.pointerEvents = 'auto';
                nextLink.style.opacity = '1';
                nextLink.style.cursor = 'pointer';
                nextLink.title = '';
            } else {
                nextLink.style.pointerEvents = 'none';
                nextLink.style.opacity = '0.4';
                nextLink.style.cursor = 'not-allowed';
                nextLink.title = 'Completá este artículo primero';
            }
        }

        var bar = document.getElementById('lectura-bar');
        var text = document.getElementById('lectura-text');
        if (progreso.completado) {
            if (bar) { bar.style.width = '100%'; }
            if (text) { text.textContent = '100%'; }
        } else if (progreso.scrollMaximo > 0 && text) {
            if (text) text.textContent = progreso.scrollMaximo + '%';
        }
    }

    window.ProgresoLectura = { inicializar: inicializar };
})();
