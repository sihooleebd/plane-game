export default class Missile {
  constructor(owner, x, y, angle, image) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.img = image;
    this.v = 5;
    this.width = 13;
    this.height = 28;
  }

  getPos() {
    return { x: this.x, y: this.y };
  }

  move() {
    this.x = this.x + this.v * Math.sin((this.angle * Math.PI) / 180);
    this.y = this.y - this.v * Math.cos((this.angle * Math.PI) / 180);
  }

  draw(ctx) {
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
