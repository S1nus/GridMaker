function Brick(x, y, width, height) {
  Entity.call(this, x, y, width, height);
  this.type = "Brick";
  this.draw = function(page) {
    page.ctx.fillStyle = "rgb(128, 128, 128)";
    page.ctx.fillRect(this.x, this.y, this.width, this.height);
    page.ctx.stroke();
    page.ctx.lineWidth = 1;
    page.ctx.strokeStyle = "black";
    page.ctx.beginPath();
    page.ctx.rect(this.x, this.y, this.width, this.height);
    page.ctx.stroke();
  };

}
Brick.prototype = Object.create(Entity.prototype);
Brick.prototype.constructor = Brick;

function Ladder(x, y, width, height) {
  Entity.call(this, x, y, width, height);
  this.type = "Ladder";
  this.draw = function(page) {
    page.ctx.strokeStyle = "black";
    page.ctx.moveTo(this.x, this.y);
    page.ctx.lineTo(this.x, this.y+this.height);
    page.ctx.stroke();
    page.ctx.moveTo(this.x+this.width, this.y);
    page.ctx.lineTo(this.x+this.width, this.y+this.height);
    page.ctx.stroke();
    page.ctx.moveTo(this.x, this.y+(this.height/3));
    page.ctx.lineTo(this.x+this.width, this.y+(this.height/3));
    page.ctx.stroke();
    page.ctx.moveTo(this.x, this.y+2*(this.height/3));
    page.ctx.lineTo(this.x+this.width, this.y+2*(this.height/3));
    page.ctx.stroke();
    page.ctx.moveTo(this.x, this.y+3*(this.height/3));
    page.ctx.lineTo(this.x+this.width, this.y+3*(this.height/3));
    page.ctx.stroke();
    page.ctx.moveTo(this.x, this.y);
    page.ctx.lineTo(this.x+this.width, this.y);
    page.ctx.stroke();
  };
}
Ladder.prototype = Object.create(Entity.prototype);
Ladder.prototype.constructor = Ladder;

function CursorBrick(platform) {
  Entity.call(this, 0, 0, 20, 20);

  this.lastTime = Date.now();

  this.draw = function(page) {
    if (page.mouse.isTouching(buttons)) {
      return;
    }
    if (page.tool == "brick") {
      page.ctx.fillStyle = "rgba(128, 128, 128, .5)";
      page.ctx.fillRect(this.x, this.y, this.width, this.height);
      page.ctx.lineWidth = 1;
      page.ctx.beginPath();
      page.ctx.rect(this.x, this.y, this.width, this.height);
      page.ctx.stroke();
    }
    if (page.tool == "delete") {
      page.ctx.strokeStyle = "black";
      page.ctx.lineWidth = 1;
      page.ctx.beginPath();
      page.ctx.rect(this.x, this.y, this.width, this.height);
      page.ctx.closePath();
      page.ctx.stroke();
      page.ctx.strokeStyle = "red";
      page.ctx.moveTo(this.x, this.y);
      page.ctx.lineTo(this.x+this.width, this.y+this.height);
      page.ctx.stroke();
      page.ctx.moveTo(this.x+this.width, this.y);
      page.ctx.lineTo(this.x, this.y+this.height);
      page.ctx.stroke();
    }
    if (page.tool == "ladder") {
      page.ctx.strokeStyle = "black";
      page.ctx.moveTo(this.x, this.y);
      page.ctx.lineTo(this.x, this.y+this.height);
      page.ctx.stroke();
      page.ctx.moveTo(this.x+this.width, this.y);
      page.ctx.lineTo(this.x+this.width, this.y+this.height);
      page.ctx.stroke();
      page.ctx.moveTo(this.x, this.y+(this.height/3));
      page.ctx.lineTo(this.x+this.width, this.y+(this.height/3));
      page.ctx.stroke();
      page.ctx.moveTo(this.x, this.y+2*(this.height/3));
      page.ctx.lineTo(this.x+this.width, this.y+2*(this.height/3));
      page.ctx.stroke();
      page.ctx.moveTo(this.x, this.y+3*(this.height/3));
      page.ctx.lineTo(this.x+this.width, this.y+3*(this.height/3));
      page.ctx.stroke();
      page.ctx.moveTo(this.x, this.y);
      page.ctx.lineTo(this.x+this.width, this.y);
      page.ctx.stroke();
    }
  };

  this.update = function(page) {
    this.x = Math.floor((page.mouse.x)/20)*20;
    this.y = Math.floor((page.mouse.y)/20)*20;
    if (page.canvas.mousedown) {
      if ((Date.now() - this.lastTime)>25 && !page.mouse.isTouching(buttons)) {
        if (page.tool == "brick") {
          this.lastTime = Date.now();
          var newBrick = new Brick(this.x, this.y, this.width, this.height);
          if (!newBrick.isTouching(platform)) {
            platform.add(newBrick);
          }
        }
        if (page.tool == "ladder") {
          this.lastTime = Date.now();
          var newLadder = new Ladder(this.x, this.y, this.width, this.height);
          if (!newLadder.isTouching(platform)) {
            platform.add(newLadder);
          }
        }
        if (page.tool == "delete") {
          if (this.isTouching(platform)) {
            platform.destroy(platform.isTouching(this)[0].id);
          }
        }
      }
    }
  };
}
CursorBrick.prototype = Object.create(Entity.prototype);
CursorBrick.prototype.constructor = CursorBrick;

function Button(x, y, content=new Entity(0, 0, 0, 100)) {
  this.radius = 10;
  this.padding = 5;
  this.width = content.width+(2*this.padding);
  this.height = content.height+(2*this.padding);
  Entity.call(this, x, y, this.width, this.height);
  this.offsetX = x;
  this.offsetY = y;
  this.content = content;
  this.color = "lightgrey";

  this.draw = function(game) {
    game.ctx.fillStyle = this.color;
    game.ctx.lineWidth = 1;
    game.ctx.strokeStyle = "black";
    game.ctx.beginPath();
    game.ctx.moveTo(this.x + this.radius, this.y);
    game.ctx.lineTo(this.x + this.width - this.radius, this.y);
    game.ctx.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.radius);
    game.ctx.lineTo(this.x + this.width, this.y + this.height - this.radius);
    game.ctx.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.radius, this.y + this.height);
    game.ctx.lineTo(this.x + this.radius, this.y + this.height);
    game.ctx.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.radius);
    game.ctx.lineTo(this.x, this.y + this.radius);
    game.ctx.quadraticCurveTo(this.x, this.y, this.x + this.radius, this.y);
    game.ctx.closePath();
    game.ctx.fill();
    game.ctx.stroke();
    game.ctx.save();
    game.ctx.translate(this.x+this.padding, this.y+this.padding);
    this.content.draw(game);
    game.ctx.restore();
  };

  this.click = function(page) {
    return;
  };

  this.update = function(game) {
    this.x = -game.camX+this.offsetX;
    this.y = -game.camY+this.offsetY;
    if (this.isTouching(game.mouse)) {
      this.color = "grey";
      if (game.canvas.mousedown) {
        this.click(game);
      }
    }
    else {
      this.color = "lightgrey";
    }
  };
}
Button.prototype = Object.create(Entity.prototype);
Button.prototype.constructor = Button;
