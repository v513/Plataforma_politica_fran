document.addEventListener("DOMContentLoaded", () => {
    // Obtener ID del tema desde la URL
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get("id"));
    const temas = JSON.parse(localStorage.getItem("temas")) || [];
    const tema = temas.find(t => t.id === id);

    // Si no existe el tema, mostrar error
    if (!tema) {
        document.body.innerHTML = "<h2>Tema no encontrado</h2>";
        return;
    }

    // Incrementar contador de visitas
    tema.visitas = (tema.visitas || 0) + 1;
    localStorage.setItem("temas", JSON.stringify(temas));

    // Mostrar información del tema
    document.getElementById("titulo").textContent = tema.titulo;
    document.getElementById("contenido").textContent = tema.contenido;

    // Mostrar comentarios
    const lista = document.getElementById("comentarios");
    tema.comentarios.forEach((c, index) => {
        const li = document.createElement("li");
        li.className = "comentario";
        li.innerHTML = `
            <div class="comentario-header">
                <span class="comentario-autor">Usuario ${index % 3 + 1}</span>
                <span class="comentario-fecha">${formatFecha(new Date().toISOString())}</span>
            </div>
            <div class="comentario-contenido">${c}</div>
        `;
        lista.appendChild(li);
    });

    // Manejar envío de nuevo comentario
    const form = document.getElementById("formComentario");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const texto = document.getElementById("nuevoComentario").value.trim();
        if (!texto) return;

        // Agregar comentario al tema
        tema.comentarios.push(texto);
        localStorage.setItem("temas", JSON.stringify(temas));

        // Mostrar el nuevo comentario
        const li = document.createElement("li");
        li.className = "comentario";
        li.innerHTML = `
            <div class="comentario-header">
                <span class="comentario-autor">Tú</span>
                <span class="comentario-fecha">ahora</span>
            </div>
            <div class="comentario-contenido">${texto}</div>
        `;
        lista.appendChild(li);
        form.reset();

        // Desplazarse al nuevo comentario
        li.scrollIntoView({ behavior: "smooth" });
    });

    // Función para formatear fechas
    function formatFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const ahora = new Date();
        const diff = ahora - fecha;
        
        if (diff < 60000) return "ahora";
        if (diff < 3600000) return `hace ${Math.floor(diff/60000)} minutos`;
        if (diff < 86400000) return `hace ${Math.floor(diff/3600000)} horas`;
        return `hace ${Math.floor(diff/86400000)} días`;
    }
});