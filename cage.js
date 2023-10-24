class Cage {
  constructor(game, x, y, width, height) {
      Object.assign(this, { game, x, y, width, height});
  }

  draw(ctx) {
      ctx.strokeStyle = 'black';
      ctx.strokeRect(this.x, this.y, this.width, this.height);
  };

  update() {

  }
}