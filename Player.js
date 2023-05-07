import Missile from './Missile.js';

export default class Player {
  constructor(x, y, angle, src) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.img = new Image();
    this.img.src = src;
    this.v = 0;
    this.width = 100;
    this.height = 130;
    this.isDead = false;
    this.missileImg = new Image();
    this.missileImg.src = './missile.png';

    this.lastFiredTime = undefined;
  }

  getPos() {
    return { x: this.x, y: this.y };
  }

  left() {
    this.angle = this.angle - 1;
  }

  right() {
    this.angle = this.angle + 1;
  }

  accelerate() {
    this.v = Math.min(3, this.v + 0.01);
  }

  slowDown() {
    this.v = Math.max(0, this.v - 0.01);
  }

  fire(missiles) {
    if (this.isDead) {
      return;
    }
    if (this.lastFiredTime && Date.now() - this.lastFiredTime < 1000) {
      return;
    }
    const missile = new Missile(
      this,
      this.x,
      this.y,
      this.angle,
      this.missileImg,
    );
    missiles.push(missile);
    this.lastFiredTime = Date.now();
  }

  move() {
    this.x = this.x + this.v * Math.sin((this.angle * Math.PI) / 180);
    this.y = this.y - this.v * Math.cos((this.angle * Math.PI) / 180);
  }

  draw(ctx) {
    if (this.isDead) {
      return;
    }
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.angle * Math.PI) / 180);
    ctx.drawImage(
      this.img,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height,
    );
    ctx.restore();
  }
}
