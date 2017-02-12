function Entity(x, y, width=1, height=1) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.draw = function(game) {
		game.ctx.fillStyle = "black";
    game.ctx.fillRect(this.x, this.y, this.width, this.height);
	};

  this.update = function(game) {
		return;
	};

  this.getBoxes = function() {
    result = [];
    result.push(this);
    return result;
  };

  this.pixelInBox = function(x, y, box) {
    return true;
  }

  this.isTouching = function(other) {
    overlapping = [];
    myBoxes = this.getBoxes();
    otherBoxes = other.getBoxes();
    for (var a = 0; a<myBoxes.length; a++) {
      for (var b = 0; b<otherBoxes.length; b++) {
        var xMin = Math.max(myBoxes[a].x, otherBoxes[b].x);
  			var yMin = Math.max(myBoxes[a].y, otherBoxes[b].y);
  			var xMax = Math.min(myBoxes[a].x+myBoxes[a].width, otherBoxes[b].x+otherBoxes[b].width);
  			var yMax = Math.min(myBoxes[a].y+myBoxes[a].height, otherBoxes[b].y+otherBoxes[b].height);
        if (xMin >= xMax || yMin >= yMax) {
  			 continue;
  			}
  			else {
          var addObj = new Entity(xMin, yMin, xMax-xMin, yMax-yMin);
          addObj.other = otherBoxes[b];
          overlapping.push(addObj);
  			}
      }
    }
    for (var i = 0; i<overlapping.length; i++) {
      for (var row = overlapping[i].y; row < overlapping[i].y+overlapping[i].height; row++) {
        for (var collumn = overlapping[i].x; collumn < overlapping[i].x+overlapping[i].width; collumn++) {
          if (this.pixelInBox(collumn, row, overlapping[i]) && overlapping[i].other.pixelInBox(collumn, row, overlapping[i])) {
            return true;
          }
        }
      }
    }
    return false;
  };
}

function Circ(x, y, rad, color = "black") {
  Entity.call(this, (x-rad), (y+rad));
  this.rad = rad;
  this.color = color;
  this.width = this.rad*2;
  this.height = this.rad*2;

  this.draw = function(game) {
    game.ctx.fillStyle = this.color;
    game.ctx.beginPath();
    game.ctx.arc(this.x+this.rad, this.y+this.rad, this.rad, 0, Math.PI*2, false);
    game.ctx.closePath();
    game.ctx.fill();
  };

  this.pixelInBox = function(x, y, box) {
    if (Math.sqrt(((this.x+this.rad)-x)*((this.x+this.rad)-x)+((this.y+this.rad)-y)*((this.y+this.rad)-y)) < this.rad) {
      return true;
    }
    return false;
  };
}
Circ.prototype = Object.create(Entity.prototype);
Circ.prototype.constructor = Circ;
