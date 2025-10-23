window.addEventListener('load', () => {
    const fileInput = document.getElementById('file-input');
    const vrCanvas = document.getElementById('vr-canvas');
    const downloadBtn = document.getElementById('download-btn');
    const ctx = vrCanvas.getContext('2d');
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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

                ctx.drawImage(img, 0, 0, w, h);
                ctx.drawImage(img, w, 0, w, h);

                vrCanvas.style.display = 'block';
                downloadBtn.style.display = 'block';
                downloadBtn.textContent = 'Ver imagen en pantalla completa';

                downloadBtn.onclick = () => {
                    vrCanvas.toBlob(blob => {
                        const vrImageUrl = URL.createObjectURL(blob);

                        if (isIOS) {
                            // Reemplazamos el contenido de la página con la imagen
                            document.body.innerHTML = `
                                <div style="background:black;display:flex;justify-content:center;align-items:center;height:100vh;">
                                    <img src="${vrImageUrl}" style="width:100%;height:auto;"/>
                                </div>
                            `;
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
    });
});
