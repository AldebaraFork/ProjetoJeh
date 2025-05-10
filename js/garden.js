function Vector(x, y) {
    this.x = x;
    this.y = y;
}

Vector.prototype = {
    rotate: function (theta) {
        var x = this.x;
        var y = this.y;
        this.x = Math.cos(theta) * x - Math.sin(theta) * y;
        this.y = Math.sin(theta) * x + Math.cos(theta) * y;
        return this;
    },
    mult: function (f) {
        this.x *= f;
        this.y *= f;
        return this;
    },
    clone: function () {
        return new Vector(this.x, this.y);
    },
    length: function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    },
    subtract: function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    },
    set: function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
};

function Petal(stretchA, stretchB, startAngle, angle, growFactor, bloom) {
    this.stretchA = stretchA;
    this.stretchB = stretchB;
    this.startAngle = startAngle;
    this.angle = angle;
    this.growFactor = growFactor;
    this.bloom = bloom;
    this.r = 1;
    this.isfinished = false;
}

Petal.prototype = {
    draw: function () {
        var ctx = this.bloom.garden.ctx;
        var v1, v2, v3, v4;
        v1 = new Vector(0, this.r).rotate(this.startAngle);
        v2 = v1.clone().rotate(this.angle);
        v3 = v1.clone().mult(this.stretchA);
        v4 = v2.clone().mult(this.stretchB);
        ctx.beginPath();
        ctx.moveTo(v1.x + this.bloom.x, v1.y + this.bloom.y);
        ctx.bezierCurveTo(
            v3.x + this.bloom.x, v3.y + this.bloom.y,
            v4.x + this.bloom.x, v4.y + this.bloom.y,
            v2.x + this.bloom.x, v2.y + this.bloom.y
        );
        ctx.strokeStyle = this.bloom.c;
        ctx.stroke();
    },
    render: function () {
        if (this.r <= this.bloom.r) {
            this.r += this.growFactor;
            this.draw();
        } else {
            this.isfinished = true;
        }
    }
};

function Bloom(x, y, r, c, pc, garden) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.c = c;
    this.pc = pc;
    this.petals = [];
    this.garden = garden;
    this.init();
    this.garden.addBloom(this);
}

Bloom.prototype = {
    draw: function () {
        var p;
        var isfinished = true;
        for (var i = 0; i < this.petals.length; i++) {
            p = this.petals[i];
            p.render();
            if (!p.isfinished) {
                isfinished = false;
            }
        }
        if (isfinished) {
            this.garden.removeBloom(this);
        }
    },
    init: function () {
        var angle = 360 / this.pc;
        var startAngle = Math.random() * 90;
        for (var i = 0; i < this.pc; i++) {
            this.petals.push(new Petal(
                Math.random() * 1.3 + 0.1,
                Math.random() * 1.3 + 0.1,
                startAngle + i * angle,
                angle,
                this.garden.options.growFactor,
                this
            ));
        }
    }
};

function Garden(ctx, canvas) {
    this.blooms = [];
    this.element = canvas;
    this.canvas = canvas;
    this.ctx = ctx;
}

Garden.prototype = {
    options: {
        petalCount: 15,
        growFactor: 1,
        bloomRadius: { min: 8, max: 15 },
        density: 10,
        growSpeed: 1000 / 60
    },
    render: function () {
        for (var i = 0; i < this.blooms.length; i++) {
            this.blooms[i].draw();
        }
    },
    addBloom: function (bloom) {
        this.blooms.push(bloom);
    },
    removeBloom: function (bloom) {
        var index = this.blooms.indexOf(bloom);
        if (index > -1) {
            this.blooms.splice(index, 1);
        }
    },
    createRandomBloom: function (x, y) {
        this.createBloom(x, y,
            this.randomInt(this.options.bloomRadius.min, this.options.bloomRadius.max),
            this.randomColor(),
            this.options.petalCount);
    },
    createBloom: function (x, y, r, c, pc) {
        new Bloom(x, y, r, c, pc, this);
    },
    clear: function () {
        this.blooms = [];
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    randomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    randomColor: function () {
        var r = this.randomInt(128, 255);
        var g = this.randomInt(0, 128);
        var b = this.randomInt(128, 255);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
};

// Ajuste do canvas
function adjustCanvasSize() {
    var canvas = document.getElementById('garden');
    var ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    var garden = new Garden(ctx, canvas);
    garden.createRandomBloom(canvas.width / 2, canvas.height / 2);
}

// Ajuste o canvas ao carregar a página e quando a janela for redimensionada
window.addEventListener('resize', adjustCanvasSize);
adjustCanvasSize();  // Chama inicialmente
