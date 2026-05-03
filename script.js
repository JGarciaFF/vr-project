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

                    const scale = 0.8;

                    // Dimensiones del bloque completo (dos imágenes)
                    const totalW = w * 2 * scale;
                    const totalH = h * scale;

                    // Centramos el bloque entero
                    const startX = (vrCanvas.width - totalW) / 2;
                    const startY = (vrCanvas.height - totalH) / 2;

                    // Dibujar imágenes pegadas
                    ctx.drawImage(img, startX, startY, w * scale, h * scale);
                    ctx.drawImage(img, startX + w * scale, startY, w * scale, h * scale);
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