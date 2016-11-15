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
		preview.init();
		gameview.init();
	}
};

var player = {
	character : ["357", "56-1type", "56typeR", "59type", "63type", "64type", "64type_11", "79type", "88type", "92type", "95type", "97type", "98K", "9A91", "AAT52", "Aegis", "AK47", "Alchemist", "APS", "AR", "AR15", "ARX160", "ASVAL", "BM59", "BrenMK", "C96", "CZ805", "Destroyer", "Dinergate", "DP28", "Dragoon", "Drone", "EVO3", "Excutioner", "ExcutionerElite", "F2000", "FAMAS", "FG42", "FMG9", "FN49", "FNFAL", "FNFNC", "FNP9", "G11", "G11_9", "G3", "G36", "G36C", "G41", "G43", "Glock17", "Grizzly", "Guard", "HK416", "Hunter", "HunterElite", "IDW", "Intruder", "Jaeger", "Jaguar", "KP31", "L85A1", "LWMMG", "M1", "M14", "M16A1", "M1873", "M1891", "M1895", "M1903", "M1903_5", "M1911", "M1918", "M1919A4", "M1919A4_7", "M1928A1", "M1A1", "M21", "M249SAW", "M2HB", "M3", "M4 SOPMOD II", "m45", "m45_4", "M4A1", "M60", "M9", "M950A", "M99", "MAB38", "MAC10", "Manticore", "MG3", "MG34", "MG4", "MG42", "MG5", "MicroUZI", "Mk23", "Mk23_8", "MK48", "MLEMK1", "MLEMK1_10", "MP40", "MP446", "MP5", "MP5_3", "NEGEV", "Nemeum", "NTW20", "NZ75", "OTs12", "OTs14", "P08", "P38", "P7", "P99", "PK", "PM", "PM_1", "PP2000", "PPK", "PPS43", "PPsh41", "Prowler", "PSG1", "PTRD", "R357", "R59type", "R64type", "R64type_11", "R88type", "R92type", "R95type", "R9A91", "RAAT52", "RAR15", "RBrenMK", "RC96", "RFAMAS", "RFG42", "RFMG9", "RFNFNC", "RFNP9", "RG11", "RG11_9", "RG36", "RG36C", "RG43", "Rghost", "RGlock17", "RHK416", "RIDW", "Ripper", "RLWMMG", "RM1", "RM14", "RM16A1", "RM1891", "RM1903_5", "RM1919A4", "RM1A1", "RM249SAW", "RM2HB", "Rm45", "Rm45_4", "RM4A1", "RM60", "RM9", "RM99", "RMAB38", "RMAC10", "RMG3", "RMG34", "RMG4", "RMG42", "RMG5", "RMk23", "RMK48", "RMLEMK1", "RMP40", "RMP5", "RMP5_3", "RNEGEV", "RNTW20", "RNZ75", "ROTs12", "ROTs14", "RP38", "RP7", "RP99", "RPD", "RPK", "RPM_1", "RPP2000", "RPPK", "RPPS43", "RPPsh41", "RPSG1", "RPTRD", "RRPD", "RSIG510", "RSKS", "RSpectreM4", "RSPP1", "RSPS", "RStenMK2", "RSTG44", "RSuperSass", "RSV98", "RSVD", "RSVT38", "RTAR21", "RTT33", "RUMP45", "Rump9", "RVector", "RVector_2", "RVZ61", "RWA2000", "RWA2000_6", "RWelrod", "RZ62", "Scarecrow", "Scouts", "SIG510", "SKS", "SpectreM4", "SPP1", "SPS", "StenMK2", "STG44", "Striker", "SuperSass", "SV98", "SVD", "SVT38", "TAR21", "TT33", "Type100", "UMP45", "ump9", "Vector", "Vector_2", "Vespid", "VZ61", "WA2000", "WA2000_6", "Weaver", "Welrod", "Z62"],

	background : ["Airport", "Bridge", "Forest", "IceLake", "Sonw", "Street"],

	spine : [],

	load : function(name){
		if(!player.spine[name]){
			var path = "character/" + name + ".json";
			PIXI.loader.add(name, path).load(function(loader, resources){
				player.spine[name] = resources[name].spineData;
				preview.changeCanvas(name);
			});
		}else{
			preview.changeCanvas(name);
		}
	}

};

var preview = {
	init : function(){
		preview.canvas = $(".preCanvas");
		preview.selectCharacter = $(".preSelectCharacter > select");
		preview.selectAnimation = $(".preSelectAnimation > select");
		preview.stopRole = $(".preStopRole");
		preview.addRole = $(".preAddRole");
		preview.isUpdate = true;

		var stringCharacter = "<option>请选择</option>";
		for(var i =0; i < player.character.length; i++){
			stringCharacter += "<option>" + player.character[i] + "</option>";
		}
		preview.selectCharacter.html(stringCharacter);
		preview.selectCharacter.change(function(){
			preview.selectAnimation.html("");
			player.load(player.character[this.selectedIndex - 1]);
		});

		preview.selectAnimation.change(function(){
			preview.changeAnimation(this.selectedIndex - 1);
		});

		preview.addRole.click(function(){
			if(preview.name)
				gameview.addRole(preview.name);
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

	changeCanvas : function(name){
		preview.stage.removeChildren();
		preview.name = name;
		preview.spine = new PIXI.spine.Spine(player.spine[preview.name]);
        preview.spine.x = preview.selectX;
        preview.spine.y = preview.selectY;
        preview.spine.scale.x = preview.selectScale;
		preview.spine.scale.y = preview.selectScale;
		var stringAnimations = "<option>请选择</option>";
		for(var i = 0;i < preview.spine.spineData.animations.length;i++){
			stringAnimations += "<option>" + preview.spine.spineData.animations[i].name + "</option>";
		}
		preview.selectAnimation.html(stringAnimations);
		preview.spine.state.setAnimationByName(0, preview.spine.spineData.animations[0].name, true, 0);
		preview.selectAnimation[0].selectedIndex = 1;
		preview.spine.skeleton.setToSetupPose();
		preview.spine.update(0);
		preview.spine.autoUpdate = false;
		preview.stage.addChild(preview.spine);
	},

	animate : function(){
		preview.lastTime = preview.nowTime;
		preview.nowTime = new Date().getTime();
		preview.animationFrame = window.requestAnimationFrame(preview.animate);
		if(preview.isUpdate && preview.spine)
			preview.spine.update( (preview.nowTime - preview.lastTime) / 1000 );
		preview.renderer.render(preview.stage);
	},

	changeAnimation : function(n){
		preview.spine.state.setAnimationByName(0, preview.spine.spineData.animations[n].name, true, 0);
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
		for(var i = 0;i < player.background.length; i++)
			stringBackground += "<option>" + player.background[i] + "</option>";
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
			var role = gameview.focusRole;
			role.state.setAnimationByName(0, role.spineData.animations[this.selectedIndex - 1].name, true, 0);
			role.update(0);
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

		gameview.selectX = gameview.canvas.width() / 2;
		gameview.selectY = gameview.canvas.height() / 2;
		gameview.selectScale = 1;

		gameview.selectposX.attr("max", gameview.canvas.width());
		gameview.selectposY.attr("max", gameview.canvas.height());
		gameview.selectposX.val(gameview.selectX);
		gameview.selectposY.val(gameview.selectY);
		gameview.selectscale.val(gameview.selectScale * 1000);

		gameview.stage = new PIXI.Container;
		gameview.renderer = PIXI.autoDetectRenderer(gameview.canvas.width(), gameview.canvas.height(), { transparent : true });
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
	addRole : function(name){
		var role = gameview.role[gameview.role.length] = new PIXI.spine.Spine(player.spine[name]);
		gameview.selectposX.val(gameview.selectX);
		gameview.selectposY.val(gameview.selectY);
		gameview.selectscale.val(gameview.selectScale * 1000);
		gameview.focusRole = role;
		var stringAnimations = "<option>请选择</option>";
		for(var i = 0;i < role.spineData.animations.length;i++){
			stringAnimations += "<option>" + role.spineData.animations[i].name + "</option>";
		}
		gameview.selectAnimation.html(stringAnimations);
		preview.selectAnimation[0].selectedIndex = 1;
		role.state.setAnimationByName(0, role.spineData.animations[0].name, true, 0);
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
			var name = "bg" + player.background[n-1];
			var path = "background/" + player.background[n-1] + ".jpg"
			PIXI.loader.add(name, path).load(function(loader, resources){
				gameview.bgImage[n - 1] = resources[name].texture;
				gameview.background.texture = gameview.bgImage[n - 1];
				gameview.background.scale.x = gameview.renderer.width / gameview.bgImage[n-1].width;
				gameview.background.scale.y = gameview.renderer.height / gameview.bgImage[n-1].height;
			});
		}
	}
}