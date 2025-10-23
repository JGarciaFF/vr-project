window.addEventListener('load', () => {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    const downloadBtn = document.getElementById('download-btn');
    const videoContainer = document.getElementById('video-container');
    const videoLeft = document.getElementById('video-left');
    const videoRight = document.getElementById('video-right');
    const ctx = vrCanvas.getContext('2d');

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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
                    downloadBtn.textContent = isIOS ? 'Abrir imagen' : 'Descargar imagen';

                    downloadBtn.onclick = () => {
                        vrCanvas.toBlob(blob => {
                            const vrImageUrl = URL.createObjectURL(blob);

                            if (isIOS) {
                                // Abre imagen en nueva pestaña, compatible con Safari
                                const newWindow = window.open();
                                if (newWindow) {
                                    const imgHtml = `
                                        <html>
                                            <head><title>Imagen VR</title></head>
                                            <body style="margin:0;background:#000;display:flex;justify-content:center;align-items:center;">
                                                <img src="${vrImageUrl}" style="width:100%;height:auto;"/>
                                            </body>
                                        </html>`;
                                    newWindow.document.write(imgHtml);
                                    newWindow.document.close();
                                } else {
                                    alert("Desbloquea las ventanas emergentes para poder abrir la imagen.");
                                }
                            } else {
                                const a = document.createElement('a');
                                a.href = vrImageUrl;
                                a.download = 'vr_image.png';
                                document.body.appendChild(a);
                                a.click();
                                document.body.removeChild(a);
                                URL.revokeObjectURL(vrImageUrl);
                            }
                        }, 'image/png');
                    };
                };
            };
            reader.readAsDataURL(file);
        } else if (fileType.startsWith('video/')) {
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
        } else {
            alert("Formato no soportado.");
        }
    });
});
