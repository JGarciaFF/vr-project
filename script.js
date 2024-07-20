window.addEventListener('load', function() {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    const downloadLink = document.getElementById('download-link');
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

                    // Crear la URL de la imagen generada
                    const vrImageDataUrl = vrCanvas.toDataURL('image/png');
                    
                    // Configurar el enlace de descarga
                    downloadLink.href = vrImageDataUrl;
                    downloadLink.style.display = 'block';
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Abrir la imagen en una nueva pestaña al hacer clic en el enlace
    downloadLink.addEventListener('click', function(event) {
        event.preventDefault();
        window.open(downloadLink.href, '_blank');
    });
});
