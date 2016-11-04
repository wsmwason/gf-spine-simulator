$(document).ready(function(){
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

	game.init();
});

var game = {
	character : ["357", "56-1type", "56typeR", "59type", "63type", "64type", "64type_11", "79type", "88type", "92type", "95type", "97type", "98K", "9A91", "AAT52", "Aegis", "AK47", "Alchemist", "APS", "AR", "AR15", "ARX160", "ASVAL", "BM59", "BrenMK", "C96", "CZ805", "Destroyer", "Dinergate", "DP28", "Dragoon", "Drone", "EVO3", "Excutioner", "ExcutionerElite", "F2000", "FAMAS", "FG42", "FMG9", "FN49", "FNFAL", "FNFNC", "FNP9", "G11", "G11_9", "G3", "G36", "G36C", "G41", "G43", "Glock17", "Grizzly", "Guard", "HK416", "Hunter", "HunterElite", "IDW", "Intruder", "Jaeger", "Jaguar", "KP31", "L85A1", "LWMMG", "M1", "M14", "M16A1", "M1873", "M1891", "M1895", "M1903", "M1903_5", "M1911", "M1918", "M1919A4", "M1919A4_7", "M1928A1", "M1A1", "M21", "M249SAW", "M2HB", "M3", "M4 SOPMOD II", "m45", "m45_4", "M4A1", "M60", "M9", "M950A", "M99", "MAB38", "MAC10", "Manticore", "MG3", "MG34", "MG4", "MG42", "MG5", "MicroUZI", "Mk23", "Mk23_8", "MK48", "MLEMK1", "MLEMK1_10", "MP40", "MP446", "MP5", "MP5_3", "NEGEV", "Nemeum", "NTW20", "NZ75", "OTs12", "OTs14", "P08", "P38", "P7", "P99", "PK", "PM", "PM_1", "PP2000", "PPK", "PPS43", "PPsh41", "Prowler", "PSG1", "PTRD", "R357", "R59type", "R64type", "R64type_11", "R88type", "R92type", "R95type", "R9A91", "RAAT52", "RAR15", "RBrenMK", "RC96", "RFAMAS", "RFG42", "RFMG9", "RFNFNC", "RFNP9", "RG11", "RG11_9", "RG36", "RG36C", "RG43", "Rghost", "RGlock17", "RHK416", "RIDW", "Ripper", "RLWMMG", "RM1", "RM14", "RM16A1", "RM1891", "RM1903_5", "RM1919A4", "RM1A1", "RM249SAW", "RM2HB", "Rm45", "Rm45_4", "RM4A1", "RM60", "RM9", "RM99", "RMAB38", "RMAC10", "RMG3", "RMG34", "RMG4", "RMG42", "RMG5", "RMk23", "RMK48", "RMLEMK1", "RMP40", "RMP5", "RMP5_3", "RNEGEV", "RNTW20", "RNZ75", "ROTs12", "ROTs14", "RP38", "RP7", "RP99", "RPD", "RPK", "RPM_1", "RPP2000", "RPPK", "RPPS43", "RPPsh41", "RPSG1", "RPTRD", "RRPD", "RSIG510", "RSKS", "RSpectreM4", "RSPP1", "RSPS", "RStenMK2", "RSTG44", "RSuperSass", "RSV98", "RSVD", "RSVT38", "RTAR21", "RTT33", "RUMP45", "Rump9", "RVector", "RVector_2", "RVZ61", "RWA2000", "RWA2000_6", "RWelrod", "RZ62", "Scarecrow", "Scouts", "SIG510", "SKS", "SpectreM4", "SPP1", "SPS", "StenMK2", "STG44", "Striker", "SuperSass", "SV98", "SVD", "SVT38", "TAR21", "TT33", "Type100", "UMP45", "ump9", "Vector", "Vector_2", "Vespid", "VZ61", "WA2000", "WA2000_6", "Weaver", "Welrod", "Z62"],

	init : function(){
		game.container = $("#container");
		game.selectCharacter = $("#selectCharacter");
		game.selectAnimation = $("#selectAnimation");
		game.selectScale = $("#selectScale");
		game.selectX = $("#selectX");
		game.selectY = $("#selectY");

		var stringCharacter = "<option>请选择</option>";
		for(var i =0; i < game.character.length; i++){
			stringCharacter += "<option>" + game.character[i] + "</option>";
		}
		game.selectCharacter.html(stringCharacter);
		game.selectCharacter.change(function(){
			game.load(game.character[this.selectedIndex - 1]);
		});
		game.selectAnimation.change(function(){
			game.change(this.selectedIndex - 1);
		});

		game.selectScale.val(100);
		game.selectX.val(400);
		game.selectY.val(600)

		game.stage = new PIXI.Container;
		game.renderer = new PIXI.CanvasRenderer(800, 800, {transparent : true});
		game.animationFrame = window.requestAnimationFrame(game.animate, game.renderer);
		game.container.html(game.renderer.view);
	},
	load : function(name){
		if(!game.player.spine[name]){
			game.path = "character/" + name + ".json";
			PIXI.loader.add(name, game.path).load(function(loader, resources){
				if(game.player.name){
					game.stage.removeChild(game.player.spine[game.player.name]);
				}
				game.player.name = name;
				game.player.spine[name] = new PIXI.spine.Spine(resources[name].spineData);
				game.start();
			});
		}else{
			game.stage.removeChild(game.player.spine[game.player.name]);
			game.player.name = name;
			game.start();
		}
	},
	start : function(){
		game.stage.addChild(game.player.spine[game.player.name]);
		var stringAnimations = "<option>请选择</option>";
		for(var i = 0;i < game.player.spine[game.player.name].spineData.animations.length;i++){
			stringAnimations += "<option>" + game.player.spine[game.player.name].spineData.animations[i].name + "</option>";
		}
		game.selectAnimation.html(stringAnimations);
        game.player.spine[game.player.name].state.setAnimationByName(0, game.player.spine[game.player.name].spineData.animations[0].name, true, 0);
        game.player.spine[game.player.name].x = game.selectX.val();
        game.player.spine[game.player.name].y = game.selectY.val();
        game.player.spine[game.player.name].scale.x = game.selectScale.val() / 100;
		game.player.spine[game.player.name].scale.y = game.selectScale.val() / 100;
	},
	animate : function(){
		game.animationFrame = window.requestAnimationFrame(game.animate, game.renderer);
		if(game.player.name){
			game.player.spine[game.player.name].scale.x = game.selectScale.val() / 100;
			game.player.spine[game.player.name].scale.y = game.selectScale.val() / 100;
			game.player.spine[game.player.name].x = game.selectX.val();
        	game.player.spine[game.player.name].y = game.selectY.val();
		}
		game.renderer.render(game.stage);
	},
	change : function(n){
		game.player.spine[game.player.name].state.setAnimationByName(0, game.player.spine[game.player.name].spineData.animations[n].name, true, 0);
	},
	player : {
		spine : []
	}
}