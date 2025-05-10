function adjustCanvasSize() {
    var canvas = document.getElementById('garden');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    
    var garden = new Garden(ctx, canvas);

    for (let i = 0; i < 5; i++) {
        garden.createRandomBloom(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
    }

    setInterval(() => garden.render(), garden.options.growSpeed);
}

window.addEventListener('resize', adjustCanvasSize);
adjustCanvasSize(); 