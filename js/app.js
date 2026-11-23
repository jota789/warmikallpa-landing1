
/* WARMIKALLPA — INTERACCIONES PRINCIPALES */
/* AYNITECH | PROYECTO ACADEMICO UPC */

document.addEventListener("DOMContentLoaded", () => {

    /* 1. CONFIGURACION GENERAL */

    const reducirMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* 2. MENU DE NAVEGACION */

    const menuToggle = document.getElementById("menuToggle");
    const menuPrincipal = document.getElementById("menuPrincipal");

    function cerrarMenu() {
        if (!menuToggle || !menuPrincipal) return;

        menuPrincipal.classList.remove("menu-abierto");
        menuToggle.classList.remove("activo");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    }

    if (menuToggle && menuPrincipal) {

        menuToggle.addEventListener("click", () => {
            const abierto = menuPrincipal.classList.toggle("menu-abierto");

            menuToggle.classList.toggle("activo", abierto);
            menuToggle.setAttribute("aria-expanded", String(abierto));
            menuToggle.setAttribute(
                "aria-label",
                abierto ? "Cerrar menú" : "Abrir menú"
            );
        });

        menuPrincipal.querySelectorAll("a").forEach(enlace => {
            enlace.addEventListener("click", cerrarMenu);
        });

        document.addEventListener("click", evento => {
            const clicDentro =
                menuPrincipal.contains(evento.target) ||
                menuToggle.contains(evento.target);

            if (!clicDentro) cerrarMenu();
        });

        document.addEventListener("keydown", evento => {
            if (evento.key === "Escape") {
                cerrarMenu();
                menuToggle.focus();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 760) cerrarMenu();
        });
    }


    /* 3. DESPLAZAMIENTO ENTRE SECCIONES */

    document.querySelectorAll('a[href^="#"]').forEach(enlace => {

        enlace.addEventListener("click", evento => {

            const destino = enlace.getAttribute("href");

            if (!destino || destino === "#") return;

            const seccion = document.querySelector(destino);

            if (!seccion) return;

            evento.preventDefault();

            seccion.scrollIntoView({
                behavior: reducirMovimiento ? "auto" : "smooth",
                block: "start"
            });

            history.replaceState(null, "", destino);
        });
    });


    /* 4. ANIMACIONES DE APARICION */

    const elementosAnimados = document.querySelectorAll(
        ".tarjeta-funcion, " +
        ".integrante, " +
        ".mapa-texto, " +
        ".mapa-real-contenedor, " +
        ".demo-texto, " +
        ".demo-panel, " +
        ".problema-titulo, " +
        ".problema-texto"
    );

    if ("IntersectionObserver" in window && !reducirMovimiento) {

        const observador = new IntersectionObserver(
            (entradas, observer) => {

                entradas.forEach(entrada => {

                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("elemento-visible");
                        observer.unobserve(entrada.target);
                    }

                });

            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        elementosAnimados.forEach(elemento => {
            elemento.classList.add("elemento-animado");
            observador.observe(elemento);
        });

    } else {

        elementosAnimados.forEach(elemento => {
            elemento.classList.add("elemento-visible");
        });
    }


    /* 5. EFECTO DE ONDAS EN BOTONES */

    const botones = document.querySelectorAll(
        ".boton, .boton-sos, .boton-cancelar"
    );

    botones.forEach(boton => {

        boton.addEventListener("click", evento => {

            if (reducirMovimiento || boton.disabled) return;

            const rectangulo = boton.getBoundingClientRect();

            const onda = document.createElement("span");
            onda.classList.add("efecto-onda");

            const tamano = Math.max(
                rectangulo.width,
                rectangulo.height
            );

            onda.style.width = `${tamano}px`;
            onda.style.height = `${tamano}px`;

            onda.style.left =
                `${evento.clientX - rectangulo.left - tamano / 2}px`;

            onda.style.top =
                `${evento.clientY - rectangulo.top - tamano / 2}px`;

            boton.appendChild(onda);

            onda.addEventListener("animationend", () => {
                onda.remove();
            }, { once: true });

        });

    });


     /* 6. DEMOSTRACION DE ALERTA SOS */

    const botonSOS = document.getElementById("botonSOS");
    const cancelarSOS = document.getElementById("cancelarSOS");

    const estadoDemo = document.getElementById("estadoDemo");
    const textoEstado = document.getElementById("textoEstado");
    const codigoCaso = document.getElementById("codigoCaso");
    const numeroCaso = document.getElementById("numeroCaso");
    const sinConexion = document.getElementById("sinConexion");

    let alertaActiva = false;
    let enCola = false;
    let temporizadorDemo = null;
    let temporizadorReinicio = null;
    let numeroDemostracion = 1;

    function actualizarEstado(texto, clase) {

        if (textoEstado) {
            textoEstado.textContent = texto;
        }

        if (estadoDemo) {

            estadoDemo.classList.remove(
                "estado-listo",
                "estado-activo",
                "estado-enviada",
                "estado-cola",
                "estado-cancelado"
            );

            if (clase) {
                estadoDemo.classList.add(clase);
            }
        }
    }

    function marcarEnviada() {
        enCola = false;
        actualizarEstado(
            "Alerta enviada a tus contactos de confianza (simulado)",
            "estado-enviada"
        );
    }

    function iniciarDemostracion() {

        if (alertaActiva || !botonSOS) return;

        clearTimeout(temporizadorDemo);
        clearTimeout(temporizadorReinicio);

        alertaActiva = true;
        enCola = false;

        botonSOS.classList.add("sos-activo");
        botonSOS.disabled = true;

        if (codigoCaso) {
            codigoCaso.hidden = false;
        }

        if (numeroCaso) {
            const consecutivo = String(numeroDemostracion).padStart(3, "0");
            numeroCaso.textContent = `WK-2026-${consecutivo}`;
        }

        if (cancelarSOS) {
            cancelarSOS.hidden = false;
            cancelarSOS.focus();
        }

        actualizarEstado("Enviando alerta…", "estado-activo");

        temporizadorDemo = setTimeout(() => {

            if (!alertaActiva) return;

            if (sinConexion && sinConexion.checked) {
                enCola = true;
                actualizarEstado(
                    "Sin conexión: la alerta quedó en cola y se enviará al recuperarla",
                    "estado-cola"
                );
            } else {
                marcarEnviada();
            }

        }, 1500);
    }

    function cancelarDemostracion() {

        if (!alertaActiva) return;

        alertaActiva = false;
        enCola = false;
        numeroDemostracion++;

        clearTimeout(temporizadorDemo);
        clearTimeout(temporizadorReinicio);

        botonSOS.classList.remove("sos-activo");
        botonSOS.disabled = false;

        if (codigoCaso) {
            codigoCaso.hidden = true;
        }

        if (cancelarSOS) {
            cancelarSOS.hidden = true;
        }

        botonSOS.focus();

        actualizarEstado("Demostración cancelada", "estado-cancelado");

        temporizadorReinicio = setTimeout(() => {

            if (!alertaActiva) {
                actualizarEstado("Demostración lista", "estado-listo");
            }

        }, 2500);
    }

    if (botonSOS) {
        botonSOS.addEventListener("click", iniciarDemostracion);
    }

    if (cancelarSOS) {
        cancelarSOS.addEventListener("click", cancelarDemostracion);
    }

    /* Al recuperar la "conexión", la alerta en cola se envía */
    if (sinConexion) {
        sinConexion.addEventListener("change", () => {

            if (alertaActiva && enCola && !sinConexion.checked) {
                actualizarEstado(
                    "Conexión recuperada. Enviando alerta…",
                    "estado-activo"
                );
                temporizadorDemo = setTimeout(() => {
                    if (alertaActiva) marcarEnviada();
                }, 1200);
            }
        });
    }
    actualizarEstado("Demostración lista", "estado-listo");

    /* 7. NAVEGACION: SECCION ACTUAL */
    const enlacesNavegacion = document.querySelectorAll(
        '.menu-principal a[href^="#"]'
    );
    const secciones = document.querySelectorAll(
        "main section[id]"
    );
    if ("IntersectionObserver" in window) {
        const observadorSecciones = new IntersectionObserver(
            entradas => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        const id = entrada.target.id;
                        enlacesNavegacion.forEach(enlace => {
                            enlace.classList.toggle(
                                "enlace-activo",
                                enlace.getAttribute("href") === `#${id}`
                            );

                        });
                    }

                });

            },
            {
                rootMargin: "-35% 0px -55% 0px"
            }
        );
        secciones.forEach(seccion => {
            observadorSecciones.observe(seccion);
        });
    }

    /* 8. MAPA INTERACTIVO */

    const contenedorMapa = document.getElementById("mapaReal");
    const botonUbicacion = document.getElementById("ubicarme");
    const textoUbicacion = document.getElementById(
        "ubicacionSeleccionada"
    );
    let mapa = null;
    let marcadorSeleccionado = null;
     function agregarZonasEjemplo() {

        if (!mapa || typeof L === "undefined") return;

        const zonas = [
            { nombre: "Zona Naranjal",       nivel: "Alto",     color: "#C82B42", pos: [-11.9965, -77.0595] },
            { nombre: "Centro de Lima",      nivel: "Medio",    color: "#E5A52A", pos: [-12.0510, -77.0350] },
            { nombre: "Zona Miraflores",     nivel: "Bajo",     color: "#31956D", pos: [-12.1210, -77.0300] },
            { nombre: "Zona Ate",            nivel: "Sin datos", color: "#A9A0B3", pos: [-12.0260, -76.9170], punteado: true }
        ];

        zonas.forEach(zona => {

            const circulo = L.circle(zona.pos, {
                radius: 600,
                color: zona.color,
                fillColor: zona.color,
                fillOpacity: 0.28,
                weight: 2,
                dashArray: zona.punteado ? "6 6" : null
            }).addTo(mapa);

            /* El nivel se indica con texto y no solo con color */
            circulo.bindTooltip(zona.nivel, {
                permanent: true,
                direction: "center",
                className: "zona-etiqueta"
            });

            circulo.bindPopup(
                `<strong>${zona.nombre}</strong><br>
                Nivel de riesgo: ${zona.nivel}.<br>
                Datos de ejemplo; no reflejan reportes reales.`
            );
        });
    }
    function iniciarMapa() {
        if (!contenedorMapa || typeof L === "undefined") return;
        if (mapa) {
            mapa.invalidateSize();
            return;
        }
        mapa = L.map("mapaReal", {
            scrollWheelZoom: false
        }).setView([-12.0464, -77.0428], 12);
        L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution:
                    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19
            }
        ).addTo(mapa);
        mapa.on("click", evento => {
            agregarZonasEjemplo();
            seleccionarUbicacion(
                evento.latlng.lat,
                evento.latlng.lng,
                "Ubicación de prueba"
            );
        });
        setTimeout(() => {
            mapa.invalidateSize();
        }, 150);
    }
    function seleccionarUbicacion(lat, lng, descripcion) {
        if (!mapa) return;

        if (marcadorSeleccionado) {
            mapa.removeLayer(marcadorSeleccionado);
        }
        marcadorSeleccionado = L.marker([lat, lng]).addTo(mapa);
        marcadorSeleccionado.bindPopup(
            `<strong>${descripcion}</strong><br>
            Ubicación seleccionada para la demostración.`
        ).openPopup();
        if (textoUbicacion) {
            textoUbicacion.textContent =
                `${descripcion} · Latitud: ${lat.toFixed(5)} · Longitud: ${lng.toFixed(5)}`;
        }
    }
    iniciarMapa();
    if (contenedorMapa && "IntersectionObserver" in window) {
        const observadorMapa = new IntersectionObserver(
            entradas => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting && mapa) {
                        setTimeout(() => {
                            mapa.invalidateSize();
                        }, 100);
                    }
                });
            },
            { threshold: 0.1 }
        );
        observadorMapa.observe(contenedorMapa);
    }
    if (botonUbicacion) {

        botonUbicacion.addEventListener("click", () => {

            if (!navigator.geolocation) {

                if (textoUbicacion) {
                    textoUbicacion.textContent =
                        "Tu navegador no permite consultar la ubicación.";
                }

                return;
            }

            botonUbicacion.disabled = true;
            botonUbicacion.textContent = "Buscando...";

            navigator.geolocation.getCurrentPosition(

                posicion => {

                    const lat = posicion.coords.latitude;
                    const lng = posicion.coords.longitude;

                    if (mapa) {
                        mapa.setView([lat, lng], 16);

                        seleccionarUbicacion(
                            lat,
                            lng,
                            "Tu ubicación actual"
                        );
                    }

                    botonUbicacion.disabled = false;
                    botonUbicacion.textContent = "◎ Mi ubicación";
                },

                () => {

                    if (textoUbicacion) {
                        textoUbicacion.textContent =
                            "No se pudo obtener la ubicación. Revisa los permisos del navegador.";
                    }

                    botonUbicacion.disabled = false;
                    botonUbicacion.textContent = "◎ Mi ubicación";
                },

                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );

        });
    }

    /* 9. ANO AUTOMATICO DEL PIE DE PAGINA */
    const textoFooter = document.querySelector(".footer-final p");
    if (textoFooter) {
        textoFooter.textContent =
            `© ${new Date().getFullYear()} WarmiKallpa · AyniTech`;
    }
});
