document.addEventListener('DOMContentLoaded', function () {
    // Elementos del modal
    const modal = document.getElementById("nuevoTemaModal");
    const btnNuevoTema = document.querySelector(".btn-nuevo-tema");
    const span = document.querySelector(".close-modal");
    const form = document.getElementById("formNuevoTema");
    const btnCancelar = document.querySelector(".btn-cancelar");

    // Abrir modal
    if (btnNuevoTema && modal) {
        btnNuevoTema.addEventListener("click", function() {
            modal.style.display = "block";
            document.getElementById("tituloModal").focus();
        });

        // Cerrar modal
        span.addEventListener("click", function() {
            modal.style.display = "none";
        });

        btnCancelar.addEventListener("click", function() {
            modal.style.display = "none";
        });

        // Cerrar al hacer clic fuera
        window.addEventListener("click", function(event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        });
    }

    // Manejar tags
    const tagOptions = document.querySelectorAll(".tag-option");
    const selectedTags = document.querySelector(".selected-tags");
    let selectedTag = "General"; // Valor por defecto

    if (tagOptions.length > 0) {
        tagOptions.forEach(option => {
            option.addEventListener("click", function() {
                // Remover selección previa
                tagOptions.forEach(opt => opt.classList.remove("active"));
                // Añadir selección actual
                this.classList.add("active");
                selectedTag = this.dataset.tag;
                
                // Actualizar visualización
                if (selectedTags) {
                    selectedTags.innerHTML = `
                        <div class="selected-tag">
                            #${selectedTag}
                        </div>
                    `;
                }
            });
        });

        // Seleccionar "General" por defecto
        tagOptions[0].click();
    }

    // Formateo de texto
    const formatButtons = document.querySelectorAll(".format-toolbar button");
    formatButtons.forEach(button => {
        button.addEventListener("click", function() {
            const tag = this.dataset.tag;
            const textarea = document.getElementById("contenidoModal");
            if (!textarea) return;
            
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            
            let newText, cursorPos;
            
            switch(tag) {
                case 'b':
                    newText = `[b]${selectedText}[/b]`;
                    cursorPos = start + 3;
                    break;
                case 'i':
                    newText = `[i]${selectedText}[/i]`;
                    cursorPos = start + 3;
                    break;
                case 'h2':
                    newText = `[h2]${selectedText}[/h2]`;
                    cursorPos = start + 4;
                    break;
                case 'url':
                    newText = `[url=ejemplo.com]${selectedText || "texto del enlace"}[/url]`;
                    cursorPos = start + 16;
                    break;
                case 'list':
                    newText = `[list]\n[*]${selectedText || "ítem de lista"}\n[/list]`;
                    cursorPos = start + 15;
                    break;
                default:
                    return;
            }
            
            textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
            textarea.focus();
            textarea.setSelectionRange(cursorPos, cursorPos + (selectedText ? selectedText.length : 0));
        });
    });

    // Enviar formulario
    if (form) {
        form.addEventListener("submit", function(e) {
            e.preventDefault();
            
            const titulo = document.getElementById("tituloModal").value.trim();
            const contenido = document.getElementById("contenidoModal").value.trim();
            
            if (!titulo || !contenido) {
                alert("Por favor completa todos los campos requeridos.");
                return;
            }
            
            // Crear nuevo tema
            const temas = JSON.parse(localStorage.getItem("temas")) || [];
            const nuevoTema = {
                id: Date.now(),
                titulo,
                contenido,
                hashtag: selectedTag,
                autor: "UsuarioActual",
                fecha: new Date().toISOString(),
                comentarios: [],
                visitas: 0
            };
            
            temas.push(nuevoTema);
            localStorage.setItem("temas", JSON.stringify(temas));
            
            // Cerrar modal y limpiar
            if (modal) modal.style.display = "none";
            form.reset();
            if (tagOptions[0]) tagOptions[0].click();
            
            // Recargar la página para mostrar el nuevo tema
            location.reload();
        });
    }

    // Cargar temas en la lista principal
    const listaTemas = document.getElementById("listaTemas");
    if (listaTemas) {
        const temas = JSON.parse(localStorage.getItem("temas")) || [];
        
        // Ordenar por fecha más reciente
        temas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
        
        // Limpiar lista antes de agregar temas
        listaTemas.innerHTML = "";
        
        temas.forEach(tema => {
            const div = document.createElement("div");
            div.classList.add("tema-item");
            div.innerHTML = `
                <div class="tema-titulo">
                    <h4><a href="/pages/foro/tema.html?id=${tema.id}">${tema.titulo}</a></h4>
                    <div class="tema-tags"><span class="tag">${tema.hashtag}</span></div>
                </div>
                <div class="tema-respuestas">${tema.comentarios.length}</div>
                <div class="tema-visitas">${tema.visitas}</div>
                <div class="tema-ultimo">
                    <span>${formatFecha(tema.fecha)}</span>
                    <span>por <a href="#">${tema.autor}</a></span>
                </div>
            `;
            listaTemas.appendChild(div);
        });
    }

    // Función para formatear fechas
    function formatFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const ahora = new Date();
        const diff = ahora - fecha;
        
        // Menos de 1 minuto
        if (diff < 60000) return "ahora";
        // Menos de 1 hora
        if (diff < 3600000) return `hace ${Math.floor(diff/60000)} minutos`;
        // Menos de 24 horas
        if (diff < 86400000) return `hace ${Math.floor(diff/3600000)} horas`;
        // Más de 24 horas
        return `hace ${Math.floor(diff/86400000)} días`;
    }

    // Manejar selección de hashtags
    const hashtags = document.querySelectorAll(".hashtag");
    hashtags.forEach(tag => {
        tag.addEventListener("click", function(e) {
            e.preventDefault();
            hashtags.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            
            // Filtrar temas por hashtag seleccionado
            const hashtagSeleccionado = this.textContent;
            const temas = JSON.parse(localStorage.getItem("temas")) || [];
            const listaTemas = document.getElementById("listaTemas");
            
            if (!listaTemas) return;
            
            listaTemas.innerHTML = "";
            
            const temasFiltrados = hashtagSeleccionado === "#Todos" 
                ? temas 
                : temas.filter(t => t.hashtag === hashtagSeleccionado);
            
            temasFiltrados.forEach(tema => {
                const div = document.createElement("div");
                div.classList.add("tema-item");
                div.innerHTML = `
                    <div class="tema-titulo">
                        <h4><a href="/pages/foro/tema.html?id=${tema.id}">${tema.titulo}</a></h4>
                        <div class="tema-tags"><span class="tag">${tema.hashtag}</span></div>
                    </div>
                    <div class="tema-respuestas">${tema.comentarios.length}</div>
                    <div class="tema-visitas">${tema.visitas}</div>
                    <div class="tema-ultimo">
                        <span>${formatFecha(tema.fecha)}</span>
                        <span>por <a href="#">${tema.autor}</a></span>
                    </div>
                `;
                listaTemas.appendChild(div);
            });
        });
    });
});