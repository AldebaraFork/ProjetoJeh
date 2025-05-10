$(function () {
    // Setup do jardim
    $loveHeart = $("#loveHeart");
    var offsetX = $loveHeart.width() / 2;
    var offsetY = $loveHeart.height() / 2 - 55;
    $garden = $("#garden");
    gardenCanvas = $garden[0];
    gardenCanvas.width = $("#loveHeart").width();
    gardenCanvas.height = $("#loveHeart").height();
    gardenCtx = gardenCanvas.getContext("2d");
    gardenCtx.globalCompositeOperation = "lighter";
    garden = new Garden(gardenCtx, gardenCanvas);

    // Ajusta o conteúdo para centralizar
    $("#content").css("width", $loveHeart.width() + $("#code").width());
    $("#content").css("height", Math.max($loveHeart.height(), $("#code").height()));
    $("#content").css("margin-top", Math.max(($window.height() - $("#content").height()) / 2, 10));
    $("#content").css("margin-left", Math.max(($window.width() - $("#content").width()) / 2, 10));

    // Loop de renderização
    setInterval(function () {
        garden.render();
    }, garden.options.growSpeed);
});

// Ajusta o tamanho do canvas ao redimensionar a janela
$(window).resize(function () {
    var newWidth = $(window).width();
    var newHeight = $(window).height();
    if (newWidth !== clientWidth || newHeight !== clientHeight) {
        location.reload(); // Recarrega a página para ajustar elementos
    }
});

// Função para animar o coração
function startHeartAnimation() {
    var interval = 50; // Intervalo entre animações
    var angle = 10;
    var heart = [];
    var animationTimer = setInterval(function () {
        var bloom = getHeartPoint(angle);
        var draw = true;

        // Verifica se há colisão com outras flores
        for (var i = 0; i < heart.length; i++) {
            var p = heart[i];
            var distance = Math.sqrt(Math.pow(p[0] - bloom[0], 2) + Math.pow(p[1] - bloom[1], 2));
            if (distance < Garden.prototype.options.bloomRadius.max * 1.3) {
                draw = false;
                break;
            }
        }

        if (draw) {
            heart.push(bloom);
            garden.createRandomBloom(bloom[0], bloom[1]); // Cria uma flor no ponto calculado
        }

        if (angle >= 30) {
            clearInterval(animationTimer); // Para a animação ao atingir o limite
            showMessages();
        } else {
            angle += 0.2; // Incrementa o ângulo
        }
    }, interval);
}

// Calcula os pontos do coração para criar flores
function getHeartPoint(angle) {
    var t = angle / Math.PI;
    var x = 19.5 * (16 * Math.pow(Math.sin(t), 3));
    var y = -20 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return [offsetX + x, offsetY + y];
}

// Chama a animação do coração
startHeartAnimation();