window.addEventListener('load', () => {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    const downloadBtn = document.getElementById('download-btn');
    const paddingToggle = document.getElementById('padding-toggle');

    const ctx = vrCanvas.getContext('2d');

    const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) &&
        !window.MSStream;

    fileInput.addEventListener('change', event => {
        const file = event.target.files[0];
        if (!file || !file.type.startsWith('image/')) return;

        const reader = new FileReader();

        reader.onload = e => {
            const img = new Image();
            img.src = e.target.result;

            img.onload = () => {
                const w = img.width;
                const h = img.height;

                vrCanvas.width = w * 2;
                vrCanvas.height = h;

                ctx.clearRect(0, 0, vrCanvas.width, vrCanvas.height);

                if (!paddingToggle.checked) {
                    // Comportamiento normal
                    ctx.drawImage(img, 0, 0, w, h);
                    ctx.drawImage(img, w, 0, w, h);
                } else {
                    // Fondo negro
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0, 0, vrCanvas.width, vrCanvas.height);

                    // Escala (ajustable)
                    const scale = 0.8;
                    const newW = w * scale;
                    const newH = h * scale;

                    const offsetX = (w - newW) / 2;
                    const offsetY = (h - newH) / 2;

                    // Imagen izquierda
                    ctx.drawImage(img, offsetX, offsetY, newW, newH);

                    // Imagen derecha
                    ctx.drawImage(img, w + offsetX, offsetY, newW, newH);
                }

                vrCanvas.style.display = 'block';
                downloadBtn.style.display = 'block';
                downloadBtn.textContent = 'Ver imagen en pantalla completa';

                downloadBtn.onclick = () => {
                    vrCanvas.toBlob(blob => {
                        const url = URL.createObjectURL(blob);

                        if (isIOS) {
                            document.body.innerHTML = `
                                <div style="background:black;display:flex;justify-content:center;align-items:center;height:100vh;">
                                    <img src="${url}" style="width:100%;height:auto;" />
                                </div>
                            `;
                        } else {
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'vr_image.png';
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            URL.revokeObjectURL(url);
                        }
                    }, 'image/png');
                };
            };
        };

        reader.readAsDataURL(file);
    });
});