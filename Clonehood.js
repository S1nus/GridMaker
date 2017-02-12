function Clonehood() {

  this.objects = [];

  this.destroy = function(id) {
    this.objects.splice(id, 1);
  };

  this.draw = function(game) {
    for (var i = 0; i<this.objects.length; i++) {
      this.objects[i].draw(game);
    }
  };

  this.update = function(game) {
    for (var i = 0; i<this.objects.length; i++) {
      this.objects[i].update(game);
    }
  };

  this.getBoxes = function() {
    return this.objects;
  };

  this.pixelInBox = function(x, y, box) {
    for (var i = 0; i<this.objects.length; i++) {
      if (this.objects[i].pixelInBox(x, y, box)) {
        return true;
      }
    }
    return false;
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
  				//overlapping.push({"x":xMin, "y":yMin, "width":xMax-xMin, "height":yMax-yMin});
          var addObj = new Entity(xMin, yMin, xMax-xMin, yMax-yMin);
          addObj.other = otherBoxes[b];
          addObj.id = a;
          overlapping.push(addObj);
  			}
      }
    }
    //return touching array
    var touching = [];
    for (var i = 0; i<overlapping.length; i++) {
      for (var row = overlapping[i].y; row < overlapping[i].y+overlapping[i].height; row++) {
        for (var collumn = overlapping[i].x; collumn < overlapping[i].x+overlapping[i].width; collumn++) {
          if (this.pixelInBox(collumn, row, overlapping[i]) && overlapping[i].other.pixelInBox(collumn, row, overlapping[i])) {
            touching.push(overlapping[i]);
          }
        }
      }
    }
    if (touching.length == 0) {
      return false;
    }
    return touching;
  };

  this.add = function(obj) {
    this.objects.push(obj);
  };
}
