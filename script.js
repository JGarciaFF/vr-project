window.addEventListener('load', function() {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    const downloadLink = document.getElementById('download-link');
    const videoContainer = document.getElementById('video-container');
    const videoLeft = document.getElementById('video-left');
    const videoRight = document.getElementById('video-right');
    const context = vrCanvas.getContext('2d');

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;

        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.src = e.target.result;
                img.onload = function() {
                    const imageWidth = img.width;
                    const imageHeight = img.height;

                    vrCanvas.width = imageWidth * 2;
                    vrCanvas.height = imageHeight;

                    context.drawImage(img, 0, 0, imageWidth, imageHeight);
                    context.drawImage(img, imageWidth, 0, imageWidth, imageHeight);

                    vrCanvas.style.display = 'block';
                    videoContainer.style.display = 'none';

                    const vrImageDataUrl = vrCanvas.toDataURL('image/png');
                    downloadLink.href = vrImageDataUrl;
                    downloadLink.download = "imagen-vr.png";
                    downloadLink.style.display = 'block';
                    downloadLink.textContent = 'Descargar imagen';
                };
            };
            reader.readAsDataURL(file);
        } 
        else if (fileType.startsWith('video/')) {
            const videoURL = URL.createObjectURL(file);

            videoLeft.src = videoURL;
            videoRight.src = videoURL;

            videoLeft.onloadedmetadata = () => {
                videoRight.currentTime = videoLeft.currentTime;
                videoLeft.play();
                videoRight.play();
            };

            videoLeft.ontimeupdate = () => {
                if (Math.abs(videoLeft.currentTime - videoRight.currentTime) > 0.1) {
                    videoRight.currentTime = videoLeft.currentTime;
                }
            };

            videoContainer.style.display = 'flex';
            vrCanvas.style.display = 'none';

            // Activar el botón de descarga para vídeo
            downloadLink.href = videoURL;
            downloadLink.download = file.name;
            downloadLink.style.display = 'block';
            downloadLink.textContent = 'Descargar vídeo';
        } 
        else {
            alert("Formato no soportado.");
        }
    });
});
