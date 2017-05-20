$(document).ready(function(){
	/*
	var lastTime = 0;
	var vendors = ['ms', 'moz', 'webkit', 'o'];
	for(var x = 0; x < vendors.length && !window.requestAnimationFrame; x++){
		window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
		window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
	}
	if(!window.requestAnimationFrame){
		window.requestAnimationFrame = function(callback, element){
			var currTime = new Date().getTime();
			var timeToCall = Math.max(0, 16 - (currTime - lastTime));
			var id = window.setTimeout(function(){callback(currTime + timeToCall)});
			lastTime = currTime + timeToCall;
			return id;
		}
	}
	if(!window.cancelAnimationFrame){
		window.cancelAnimationFrame = function(id){clearTimeout(id);}
	}
	*/

	game.init();
});

var game = {
	init : function(){
		game.girls = new Girls("character/");
		game.background = ["Airport", "Bridge", "Forest", "IceLake", "Sonw", "Street", "zhiwu"];
		preview.init();
		gameview.init();
	}
};

var preview = {
	init : function(){
		preview.canvas = $(".preCanvas");
		preview.selectCharacter = $(".preSelectCharacter > select");
		preview.selectSkin = $(".preSelectSkin > select");
		preview.selectAnimation = $(".preSelectAnimation > select");
		preview.stopRole = $(".preStopRole");
		preview.addRole = $(".preAddRole");
		preview.isUpdate = true;

		var stringCharacter = "<option>请选择</option>";
		for(var name in girlsData){
			stringCharacter += "<option value=\"" + name + "\">" + name + "</option>";
		}
		preview.selectCharacter.html(stringCharacter);
		preview.selectCharacter.change(function(){
			if(this.selectedIndex == 0)
				return;
			var name = $(this).val();
			var strSkinsOption = "";
			if(!girlsData[name])
				return;
			for(var skin in girlsData[name]){
				strSkinsOption += "<option value=\"" + skin + "\">" + skin + "</option>";
			}
			preview.selectSkin.html(strSkinsOption);
      preview.selectSkin.change();
		});

		preview.selectSkin.change(function(){
			var skin = $(this).val();
			game.girls.load(preview.selectCharacter.val(), preview.selectSkin.val(), preview);
		});

		preview.selectAnimation.change(function(){
			preview.changeAnimation(this.selectedIndex);
		});

		preview.addRole.click(function(){
			if(preview.skeletonData)
				gameview.addRole(preview.skeletonData);
		});

		preview.stopRole.click(function(){
			if(preview.isUpdate){
				preview.isUpdate = false;
				preview.stopRole.html("开始");
			}else{
				preview.isUpdate = true;
				preview.stopRole.html("停止");
			}
		});

		preview.selectScale = 1;
		preview.selectX = 128;
		preview.selectY = 210;

		preview.stage = new PIXI.Container;
		preview.renderer = PIXI.autoDetectRenderer(preview.canvas.width(), preview.canvas.height(), {transparent : true});
		preview.lastTime = new Date().getTime();
		preview.nowTime = new Date().getTime();
		preview.animationFrame = window.requestAnimationFrame(preview.animate);
		preview.canvas.html(preview.renderer.view);
	},

	changeCanvas : function(skeletonData){
		preview.stage.removeChildren();
		preview.name = skeletonData.name;
		preview.skeletonData = skeletonData;
		preview.spine = new PIXI.spine.Spine(skeletonData);
        preview.spine.x = preview.selectX;
        preview.spine.y = preview.selectY;
        preview.spine.scale.x = preview.selectScale;
		preview.spine.scale.y = preview.selectScale;
		var animations = preview.spine.spineData.animations;
		var stringAnimations = "";
		for(var i = 0; i < animations.length; i++){
			stringAnimations += "<option value=\"" + animations[i].name + "\">" + animations[i].name + "</option>";
		}
		preview.selectAnimation.html(stringAnimations);
		preview.changeAnimation(0);
		preview.spine.skeleton.setToSetupPose();
		preview.spine.update(0);
		preview.spine.autoUpdate = false;
		preview.stage.addChild(preview.spine);
		GirlsTurn.nextAnimate();
	},

	animate : function(){
		preview.lastTime = preview.nowTime;
		preview.nowTime = new Date().getTime();
		preview.animationFrame = window.requestAnimationFrame(preview.animate);
		if(preview.isUpdate && preview.spine)
			preview.spine.update( (preview.nowTime - preview.lastTime) / 1000 );
		preview.renderer.render(preview.stage);
	},

	changeAnimation : function(num){
		var name = preview.spine.spineData.animations[num].name;
		var isload = true;
		if(name == "die" || name == "reload" || name == "victory")
			isload = false;
		preview.spine.state.setAnimationByName(0, name, isload, 0);
		preview.spine.update(0);
	}

};

var gameview = {
	role : [],
	bgImage : [],
	init : function(){
		gameview.canvas = $('.gameCanvas');
		gameview.selectBackground = $(".gameSelectBackground > select");
		gameview.showFPS = $(".gameShowFPS > input");
		gameview.selectCharacter = $(".gameSelectCharacter > select");
		gameview.selectAnimation = $(".gameSelectAnimation > select");
		gameview.selectposX = $(".gameSelectposX > input");
		gameview.selectposY = $(".gameSelectposY > input");
		gameview.selectscale = $(".gameSelectscale > input");
		gameview.turnRole = $(".gameTurnRole");
		gameview.stopRole = $(".gameStopRole");
		gameview.removeRole = $(".gameRemoveRole");
		gameview.isUpdate = true;
		gameview.isShowFPS = true;

		var stringBackground = "<option>空</option>";
		for(var i = 0;i < game.background.length; i++)
			stringBackground += "<option>" + game.background[i] + "</option>";
		gameview.selectBackground.html(stringBackground);

		gameview.selectBackground.change(function(){
			gameview.changeBackground(this.selectedIndex);
		});

		gameview.showFPS.change(function(){
			gameview.isShowFPS = this.checked;
		});

		var stringCharacter = "<option>请选择</option>";
		gameview.selectCharacter.html(stringCharacter);

		gameview.selectCharacter.change(function(){
			if(this.selectedIndex == 0) return ;
			var role = gameview.role[this.selectedIndex - 1];
			gameview.selectposX.val(role.x);
			gameview.selectposY.val(role.y);
			gameview.selectscale.val(role.scale.x * 1000);
			gameview.focusRole = role;
			var stringAnimations = "<option>请选择</option>";
			for(var i = 0;i < role.spineData.animations.length;i++){
				stringAnimations += "<option>" + role.spineData.animations[i].name + "</option>";
			}
			gameview.selectAnimation.html(stringAnimations);
		});

		gameview.selectAnimation.change(function(){
			gameview.changeAnimation(this.selectedIndex);
		});

		gameview.removeRole.click(function(){
			var n =gameview.selectCharacter[0].selectedIndex;
			if(n == 0) return ;
			gameview.stage.removeChild(gameview.role[n - 1]);
			gameview.selectCharacter[0].remove(n);
			gameview.role.splice(n - 1, n);
			n =gameview.selectCharacter[0].selectedIndex;
			gameview.focusRole = null;
			gameview.selectAnimation.html("");
		});

		gameview.turnRole.click(function(){
			gameview.focusRole.scale.x *= -1;
		});

		gameview.stopRole.click(function(){
			if(gameview.isUpdate){
				gameview.isUpdate = false;
				gameview.stopRole.html("开始");
			}else{
				gameview.isUpdate = true;
				gameview.stopRole.html("停止");
			}
		});

		gameview.selectX = 1920 / 2;
		gameview.selectY = 1080 / 2;
		gameview.selectScale = 1;

		gameview.selectposX.attr("max", 1920);
		gameview.selectposY.attr("max", 1080);
		gameview.selectposX.val(gameview.selectX);
		gameview.selectposY.val(gameview.selectY);
		gameview.selectscale.val(gameview.selectScale * 1000);

		gameview.stage = new PIXI.Container;
		gameview.renderer = PIXI.autoDetectRenderer(1920, 1080, { transparent : true });
		gameview.background = new PIXI.Sprite(PIXI.Texture.EMPTY);
		gameview.stage.addChild(gameview.background);
		gameview.lastTime = new Date().getTime();
		gameview.nowTime = new Date().getTime();
		gameview.fpsText = new PIXI.Text("0", { fill : "#ffffff"});
		gameview.fpsText.x = gameview.fpsText.y = 0;
		gameview.stage.addChild(gameview.fpsText);
		gameview.animationFrame = window.requestAnimationFrame(gameview.animate);
		gameview.canvas.html(gameview.renderer.view);
	},
	animate : function(){
		gameview.lastTime = gameview.nowTime;
		gameview.nowTime = new Date().getTime();
		gameview.animationFrame = window.requestAnimationFrame(gameview.animate);
		if(gameview.isShowFPS)
			gameview.fpsText.text = Math.floor(1000 / (gameview.nowTime - gameview.lastTime));
		else
			gameview.fpsText.text = "";
		if(gameview.isUpdate)
			for(var i = 0; i < gameview.role.length; i++)
				gameview.role[i].update( (gameview.nowTime - gameview.lastTime) / 1000);
		if(gameview.focusRole){
			gameview.focusRole.x = gameview.selectposX.val();
			gameview.focusRole.y = gameview.selectposY.val();
			if(gameview.focusRole.scale.x > 0)
				gameview.focusRole.scale.x = gameview.selectscale.val() / 1000;
			else
				gameview.focusRole.scale.x = -gameview.selectscale.val() / 1000;
			gameview.focusRole.scale.y = gameview.selectscale.val() / 1000;
		}
		gameview.renderer.render(gameview.stage);
	},

	changeAnimation : function(num){
		var name = gameview.focusRole.spineData.animations[num].name;
		var isload = true;
		if(name == "die" || name == "reload" || name == "victory")
			isload = false;
		gameview.focusRole.state.setAnimationByName(0, name, isload, 0);
		gameview.focusRole.update(0);
	},

	addRole : function(skeletonData){
		var role = gameview.role[gameview.role.length] = new PIXI.spine.Spine(skeletonData);
		var name = skeletonData.name;
		gameview.selectposX.val(gameview.selectX);
		gameview.selectposY.val(gameview.selectY);
		gameview.selectscale.val(gameview.selectScale * 1000);
		gameview.focusRole = role;
		var stringAnimations = "";
		for(var i = 0;i < role.spineData.animations.length;i++){
			stringAnimations += "<option>" + role.spineData.animations[i].name + "</option>";
		}
		gameview.selectAnimation.html(stringAnimations);
		gameview.changeAnimation(0);
        role.x = gameview.selectX;
        role.y = gameview.selectY;
        role.scale.x = gameview.selectScale;
		role.scale.y = gameview.selectScale;
		role.skeleton.setToSetupPose();
		role.update(0);
		role.autoUpdate = false;
		var stringCharacter = "<option>" + name + "</option>";
		gameview.selectCharacter.append(stringCharacter);
		gameview.selectCharacter[0].selectedIndex = gameview.role.length;
		gameview.stage.addChild(role);
	},
	changeBackground : function(n){
		if(n == 0 && gameview.background){
			gameview.background.texture = PIXI.Texture.EMPTY;
			return;
		}
		if(gameview.bgImage[n-1]){
			gameview.background.texture = gameview.bgImage[n-1];
			gameview.background.scale.x = gameview.renderer.width / gameview.bgImage[n-1].width;
			gameview.background.scale.y = gameview.renderer.height / gameview.bgImage[n-1].height;
		}
		else{
			var name = "bg" + game.background[n-1];
			var path = "background/" + game.background[n-1] + ".jpg"
			PIXI.loader.add(name, path).load(function(loader, resources){
				gameview.bgImage[n - 1] = resources[name].texture;
				gameview.background.texture = gameview.bgImage[n - 1];
				gameview.background.scale.x = gameview.renderer.width / gameview.bgImage[n-1].width;
				gameview.background.scale.y = gameview.renderer.height / gameview.bgImage[n-1].height;
			});
		}
	}
}

var GirlsTurn = {
	stop : true,
	sum : 0,
	girlsNum : 0,
	nextGirlNum : 0,
	skinsNum : 0,
	nextSkinNum : 0,
	animateNum : 0,
	nextAnimateNum : 0,
	init : function(){
		GirlsTurn.stop = false;
		GirlsTurn.girlsNum = preview.selectCharacter.children("option").length;
		GirlsTurn.nextGirlNum = 1;
		GirlsTurn.nextGirl();
	},
	nextGirl : function(){
		if(GirlsTurn.stop)
			return;
		if(GirlsTurn.nextGirlNum >= GirlsTurn.girlsNum){
			return;
		}
		preview.selectCharacter[0].selectedIndex = GirlsTurn.nextGirlNum++;
		preview.selectCharacter.change();
		GirlsTurn.skinsNum = preview.selectSkin.children("option").length;
		GirlsTurn.nextSkinNum = 1;
		GirlsTurn.nextSkin();
	},
	nextSkin : function(){
		if(GirlsTurn.stop)
			return;
		if(GirlsTurn.nextSkinNum >= GirlsTurn.skinsNum){
			GirlsTurn.nextGirl();
			return;
		}
		preview.selectSkin[0].selectedIndex = GirlsTurn.nextSkinNum++;
		preview.selectSkin.change();
		GirlsTurn.nextAnimateNum = 0;
	},
	nextAnimate : function(){
		if(GirlsTurn.stop)
			return;
		GirlsTurn.animateNum = preview.selectAnimation.children("option").length;
		preview.selectAnimation[0].selectedIndex = GirlsTurn.nextAnimateNum++;
		var girlname = preview.selectCharacter.children("option")[preview.selectCharacter[0].selectedIndex].value;
		var skinname = preview.selectSkin.children("option")[preview.selectSkin[0].selectedIndex].value;
		var animatename = preview.selectAnimation.children("option")[preview.selectAnimation[0].selectedIndex].value;
		console.log(girlname + "-" + skinname + "-" + animatename + "-" + GirlsTurn.sum++);
		preview.selectAnimation.change();
		if(GirlsTurn.nextAnimateNum < GirlsTurn.animateNum){
			setTimeout("GirlsTurn.nextAnimate()", 500);
		}else{
			setTimeout("GirlsTurn.nextSkin()", 500);
		}
	}
}

