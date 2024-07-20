window.addEventListener('load', function() {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    let downloadLink = document.getElementById('download-link');
    const context = vrCanvas.getContext('2d');

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const imageWidth = img.width;
                    const imageHeight = img.height;

                    // Configurar el canvas
                    vrCanvas.width = imageWidth * 2; // duplicar el ancho para dos vistas
                    vrCanvas.height = imageHeight;

                    // Dibujar la imagen dos veces en el canvas
                    context.drawImage(img, 0, 0, imageWidth, imageHeight);
                    context.drawImage(img, imageWidth, 0, imageWidth, imageHeight);

                    // Mostrar el canvas
                    vrCanvas.style.display = 'block';

                    // Crear la URL de la imagen generada con un parámetro único para evitar caché
                    const vrImageDataUrl = vrCanvas.toDataURL('image/png') + '?' + new Date().getTime();
                    
                    // Configurar el enlace de descarga
                    downloadLink.href = vrImageDataUrl;
                    downloadLink.style.display = 'block';
                    downloadLink.textContent = 'Abrir imagen en nueva pestaña';

                    // Limpiar cualquier evento de clic previo
                    const newDownloadLink = downloadLink.cloneNode(true);
                    downloadLink.parentNode.replaceChild(newDownloadLink, downloadLink);
                    downloadLink = newDownloadLink;

                    // Abrir la imagen en una nueva pestaña al hacer clic en el enlace
                    downloadLink.addEventListener('click', function(event) {
                        event.preventDefault();
                        const newWindow = window.open();
                        if (newWindow) {
                            newWindow.document.write('<img src="' + vrImageDataUrl + '" style="width: 100%;">');
                            newWindow.document.title = "Imagen VR";
                        }
                    });
                };
            };
            reader.readAsDataURL(file);
        }
    });
});
