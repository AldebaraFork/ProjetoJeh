// Ajuste do canvas para maior responsividade
function adjustCanvasSize() {
    var canvas = document.getElementById('garden');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Inicializa o jardim
    var garden = new Garden(ctx, canvas);
    garden.clear(); // Limpa o canvas para evitar sobreposição

    // Adiciona flores iniciais
    for (let i = 0; i < 5; i++) {
        garden.createRandomBloom(
            Math.random() * canvas.width,
            Math.random() * canvas.height
        );
    }

    // Renderiza continuamente
    setInterval(() => garden.render(), garden.options.growSpeed);
}

// Ajusta o canvas ao carregar a página e ao redimensionar a janela
window.addEventListener('resize', adjustCanvasSize);
adjustCanvasSize(); // Chama a função inicialmente