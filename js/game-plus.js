var gvHandler = {
  saveStage : function(gameview) {
    var jsonData = {
      'ro': [],
      'bg': ''
    };
    for (i in gameview.role) {
      jsonData.ro.push({
        'name' : gameview.role[i].stateData.skeletonData.code,
        'skin' : gameview.role[i].stateData.skeletonData.skin,
        'x' : gameview.role[i].x,
        'y' : gameview.role[i].y,
        'scale' : gameview.role[i].scale.x,
        'animation' : gameview.role[i].animation
      });
    }
    jsonData.bg = gameview.background.filename;
    var jsonString = JSON.stringify(jsonData);
    var shareUrl = location.protocol+'//'+location.host+location.pathname + '#' + encodeURIComponent(jsonString);
    alert(shareUrl);
  },

  savePng : function(gameview) {
    if (confirm("產生圖片在下方後請右鍵存檔")) {
      var renderTexture = new PIXI.RenderTexture(gameview.renderer, 1920, 1080);
      renderTexture.render(gameview.stage);
      var canvas = renderTexture.getCanvas();
      $('#saveImage').attr('src', canvas.toDataURL('image/png')).show();
    }
  }
};

game.setGameviewHandler(gvHandler);