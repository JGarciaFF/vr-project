window.addEventListener('load', () => {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    const downloadBtn = document.getElementById('download-btn');
    const videoContainer = document.getElementById('video-container');
    const videoLeft = document.getElementById('video-left');
    const videoRight = document.getElementById('video-right');
    const ctx = vrCanvas.getContext('2d');

    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file) return;

        const fileType = file.type;

        if (fileType.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = e => {
                const img = new Image();
                img.src = e.target.result;
                img.onload = () => {
                    const w = img.width;
                    const h = img.height;

                    vrCanvas.width = w * 2;
                    vrCanvas.height = h;

                    ctx.drawImage(img, 0, 0, w, h);
                    ctx.drawImage(img, w, 0, w, h);

                    vrCanvas.style.display = 'block';
                    videoContainer.style.display = 'none';
                    downloadBtn.style.display = 'block';

                    downloadBtn.onclick = () => {
                        const vrImageDataUrl = vrCanvas.toDataURL('image/png');
                        const a = document.createElement('a');
                        a.href = vrImageDataUrl;
                        a.download = 'vr_image.png';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    };
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
            downloadBtn.style.display = 'block';
            downloadBtn.textContent = 'Descargar vídeo';

            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = videoURL;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        } 
        else {
            alert("Formato no soportado.");
        }
    });
});
