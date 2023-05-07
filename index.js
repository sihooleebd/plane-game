import Player from './Player.js';
import Missile from './Missile.js';
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  console.log('w=' + window.innerWidth + ', h=' + window.innerHeight);
  new App();
});

class App {
  constructor() {
    this.keysPressed = [];
    this.addEventListensers();
    this.isExplosionEnded = false;
    this.canvas = document.querySelector('#canvas');
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.player1 = new Player(
      this.canvas.width / 6,
      this.canvas.height / 2,
      90,
      './jet-blue.png',
    );
    this.player2 = new Player(
      (this.canvas.width / 6) * 5,
      this.canvas.height / 2,
      -90,
      './jet-purple.png',
    );
    this.missiles = [];
    this.isExplosionStarted = false;
    this.expFrame = 0;
    this.expx = 0;
    this.expy = 0;
    this.expImg = new Image();
    this.expImg.src = './explosion.png';
    this.prevT = 0;

    this.animate();
  }

  addEventListensers() {
    setInterval(() => {
      const length = Object.keys(this.keysPressed).length;

      if (length > 0) {
        var event = new CustomEvent('multiplekey', {
          detail: { codes: { ...this.keysPressed } },
        });
        document.body.dispatchEvent(event);
      }
    }, 10);

    document.body.addEventListener('keydown', (ev) => {
      ev.preventDefault();
      this.keysPressed[ev.code] = true;
    });
    document.body.addEventListener('keyup', (ev) => {
      ev.preventDefault();
      delete this.keysPressed[ev.code];
    });

    document.body.addEventListener('multiplekey', (e) => {
      if (e.detail.codes.KeyW) {
        this.player1.accelerate();
      }
      if (e.detail.codes.KeyA) {
        this.player1.left();
      }
      if (e.detail.codes.KeyS) {
        this.player1.slowDown();
      }
      if (e.detail.codes.KeyD) {
        this.player1.right();
      }
      if (e.detail.codes.Backquote) {
        this.player1.fire(this.missiles);
      }
      if (e.detail.codes.ArrowUp) {
        this.player2.accelerate();
      }
      if (e.detail.codes.ArrowLeft) {
        this.player2.left();
      }
      if (e.detail.codes.ArrowDown) {
        this.player2.slowDown();
      }
      if (e.detail.codes.ArrowRight) {
        this.player2.right();
      }
      if (e.detail.codes.Slash) {
        this.player2.fire(this.missiles);
      }
    });
  }

  getDistance({ x: x1, y: y1 }, { x: x2, y: y2 }) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  drawExplosion(ctx) {
    //expimg 200 * 282, 17FRM
    ctx.drawImage(
      this.expImg,
      this.expFrame * 200,
      0,
      200,
      282,
      this.expx - 100,
      this.expy - 141,
      200,
      282,
    );
  }

  endGame() {
    const endSign = document.querySelector('#end-sign');
    endSign.style.opacity = 1;
    const endSignWrapper = document.querySelector('#end-sign-wrapper');
    endSignWrapper.style.opacity = 1;
    if (this.player1.isDead) {
      if (this.player2.isDead) {
        endSign.innerHTML = 'Game Over<br />Tie';
      } else {
        endSign.innerHTML = 'Game Over<br />Player 2 wins!!!';
      }
    } else {
      endSign.innerHTML = 'Game Over<br />Player 1 wins!!!';
    }
  }

  move(t) {
    this.player1.move();
    this.player2.move();
    this.missiles.forEach((m) => m.move());

    this.missiles = this.missiles.filter(
      (m) =>
        m.x >= 0 &&
        m.x <= this.canvas.width &&
        m.y >= 0 &&
        m.y <= this.canvas.height,
    );
  }
  checkExp(t) {
    if (this.getDistance(this.player1.getPos(), this.player2.getPos()) < 100) {
      this.isExplosionStarted = true;
      this.prevT = t;
      this.expx = (this.player1.x + this.player2.x) / 2;
      this.expy = (this.player1.y + this.player2.y) / 2;
      this.player1.isDead = true;
      this.player2.isDead = true;
    }
    this.missiles
      .filter((m) => m.owner != this.player1)
      .forEach((m) => {
        if (this.getDistance(this.player1.getPos(), m.getPos()) < 100) {
          this.isExplosionStarted = true;
          this.prevT = t;
          this.expx = m.x;
          this.expy = m.y;
          this.player1.isDead = true;
        }
      });
    this.missiles
      .filter((m) => m.owner != this.player2)
      .forEach((m) => {
        if (this.getDistance(this.player2.getPos(), m.getPos()) < 100) {
          this.isExplosionStarted = true;
          this.prevT = t;
          this.expx = m.x;
          this.expy = m.y;
          this.player2.isDead = true;
        }
      });
  }

  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));

    let ctx = this.canvas.getContext('2d');
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player1.draw(ctx);
    this.player2.draw(ctx);
    this.missiles.forEach((m) => m.draw(ctx));
    this.move(t);

    if (!this.isExplosionStarted) {
      this.checkExp(t);
    }

    if (this.isExplosionStarted && !this.isExplosionEnded) {
      this.drawExplosion(ctx);

      if (t - this.prevT > 50) {
        this.expFrame = this.expFrame + 1;
        this.prevT = t;
      }
      if (this.expFrame > 16) {
        this.isExplosionEnded = true;
        this.endGame();
      }
    }
  }
}
