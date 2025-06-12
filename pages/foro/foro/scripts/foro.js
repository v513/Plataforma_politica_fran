// Funcionalidad del foro
document.addEventListener('DOMContentLoaded', function () {
    // Elementos del modal
    const modal = document.getElementById("nuevoTemaModal");
    const btnNuevoTema = document.querySelector(".btn-nuevo-tema"); // Cambié el selector
    const span = document.querySelector(".close-modal");

    // Selector de hashtags
    const tagInput = document.getElementById('tag-input');
    const tagOptions = document.querySelectorAll('.tag-option');
    const selectedTags = document.querySelector('.selected-tags');

    // Elementos del formulario (declarados una sola vez)
    const formNuevoTemaModal = document.getElementById("formNuevoTema"); // Formulario del modal
    const formNuevoTemaPagina = document.getElementById('form-nuevo-tema'); // Formulario de la página

    // Funcionalidad del modal
    if (btnNuevoTema && modal) {
        btnNuevoTema.onclick = function () {
            modal.style.display = "block";
        }

        if (span) {
            span.onclick = function () {
                modal.style.display = "none";
            }
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
    }

    // Si no hay modal, redirigir a la página de nuevo tema
    if (btnNuevoTema && !modal) {
        btnNuevoTema.onclick = function () {
            window.location.href = '/pages/foro/nuevo_tema.html';
        }
    }

    // Manejar envío del formulario del modal
    if (formNuevoTemaModal) {
        formNuevoTemaModal.addEventListener("submit", function (e) {
            e.preventDefault();
            const titulo = document.getElementById("tituloModal").value;
            const contenido = document.getElementById("contenidoModal").value;
            
            if (!titulo.trim() || !contenido.trim()) {
                alert("Por favor completa todos los campos requeridos.");
                return;
            }
            
            // Aquí iría la lógica para publicar el nuevo tema
            alert("Tema creado exitosamente!");
            modal.style.display = "none";
            // Limpiar formulario
            formNuevoTemaModal.reset();
        });
    }

    // Funcionalidad de tags
    if (tagInput) {
        tagInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const tagText = this.value.trim();
                if (tagText) {
                    addTag(tagText);
                    this.value = '';
                }
            }
        });
    }

    if (tagOptions) {
        tagOptions.forEach(option => {
            option.addEventListener('click', function () {
                const tagText = this.getAttribute('data-tag');
                addTag(tagText);
            });
        });
    }

    function addTag(tagText) {
        if (!tagText || !selectedTags) return;

        const tagId = tagText.toLowerCase().replace(/ /g, '-');
        if (document.getElementById(`tag-${tagId}`)) return;

        const tagElement = document.createElement('div');
        tagElement.className = 'selected-tag';
        tagElement.id = `tag-${tagId}`;
        tagElement.innerHTML = `
            #${tagText}
            <span class="remove-tag" data-tag="${tagId}">×</span>
            <input type="hidden" name="tags[]" value="${tagText}">
        `;

        selectedTags.appendChild(tagElement);

        // Agregar evento para eliminar tag
        tagElement.querySelector('.remove-tag').addEventListener('click', function () {
            tagElement.remove();
        });
    }

    // Formateo de texto en textareas
    const formatButtons = document.querySelectorAll('.format-toolbar button');
    formatButtons.forEach(button => {
        button.addEventListener('click', function () {
            const tag = this.getAttribute('data-tag');
            const textarea = document.getElementById('contenido') || 
                           document.getElementById('contenidoModal') || 
                           document.querySelector('.responder-box textarea');
            if (!textarea) return;

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let beforeText = textarea.value.substring(0, start);
            let afterText = textarea.value.substring(end);

            let newText, cursorPos;

            switch (tag) {
                case 'b':
                    newText = beforeText + '[b]' + selectedText + '[/b]' + afterText;
                    cursorPos = start + (selectedText ? 3 + selectedText.length + 4 : 3);
                    break;
                case 'i':
                    newText = beforeText + '[i]' + selectedText + '[/i]' + afterText;
                    cursorPos = start + (selectedText ? 3 + selectedText.length + 4 : 3);
                    break;
                case 'h2':
                    newText = beforeText + '[h2]' + selectedText + '[/h2]' + afterText;
                    cursorPos = start + (selectedText ? 4 + selectedText.length + 5 : 4);
                    break;
                case 'url':
                    newText = beforeText + '[url=ejemplo.com]' + (selectedText || 'texto del enlace') + '[/url]' + afterText;
                    cursorPos = start + (selectedText ? 16 + selectedText.length + 7 : 16);
                    break;
                case 'list':
                    newText = beforeText + '[list]\n[*]' + (selectedText || 'ítem de lista') + '\n[/list]' + afterText;
                    cursorPos = start + (selectedText ? 15 + selectedText.length : 15);
                    break;
                case 'quote':
                    newText = beforeText + '[quote=usuario]\n' + (selectedText || 'texto citado') + '\n[/quote]' + afterText;
                    cursorPos = start + (selectedText ? 21 + selectedText.length : 21);
                    break;
                case 'spoiler':
                    newText = beforeText + '[spoiler]' + selectedText + '[/spoiler]' + afterText;
                    cursorPos = start + (selectedText ? 9 + selectedText.length + 10 : 9);
                    break;
                default:
                    return;
            }

            textarea.value = newText;
            textarea.focus();
            textarea.setSelectionRange(cursorPos, cursorPos);
        });
    });

    // Vista previa del tema
    const btnPreview = document.querySelector('.btn-preview');
    if (btnPreview) {
        btnPreview.addEventListener('click', function () {
            alert('Vista previa en desarrollo. Se mostrará el formato aplicado.');
            // Implementar lógica de vista previa más avanzada aquí
        });
    }

    // Validación del formulario en la página (no en el modal)
    if (formNuevoTemaPagina) {
        formNuevoTemaPagina.addEventListener('submit', function (e) {
            const titulo = document.getElementById('titulo').value.trim();
            const contenido = document.getElementById('contenido').value.trim();

            if (!titulo || !contenido) {
                e.preventDefault();
                alert('Por favor completa todos los campos requeridos.');
                return;
            }
            
            // Aquí puedes agregar la lógica para enviar el formulario
            e.preventDefault(); // Por ahora prevenir el envío
            alert('Tema creado exitosamente!');
            // Redirigir al foro principal
            // window.location.href = '/pages/foro/index.html';
        });
    }

    // Botón cancelar en la página de nuevo tema
    const btnCancelar = document.querySelector('.btn-cancelar');
    if (btnCancelar) {
        btnCancelar.addEventListener('click', function () {
            if (confirm('¿Estás seguro de que quieres cancelar? Se perderán los cambios.')) {
                window.location.href = '/pages/foro/index.html';
            }
        });
    }

    // Carrusel de temas destacados (si existe)
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    if (carouselSlides.length > 0) {
        let currentSlide = 0;

        function showSlide(index) {
            carouselSlides.forEach(slide => slide.classList.remove('active'));
            carouselSlides[index].classList.add('active');
        }

        function nextSlide() {
            currentSlide = (currentSlide + 1) % carouselSlides.length;
            showSlide(currentSlide);
        }

        // Auto-avance cada 8 segundos
        setInterval(nextSlide, 8000);
    }
});