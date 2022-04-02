Office.onReady((info) => {
    if (info.host === Office.HostType.Excel) {
	document.getElementById("sideload-msg").style.display = "none";
	document.getElementById("app-body").style.display = "flex";
	document.getElementById("run").onclick = run;
    }
});

//var black = "#000000";
//var blue = "#0000FF";
//var red = "#FF0000";
//var green = "#00FF00";
//var purple = "#800080";
//var maroon = "#800000";
//var navy = "#8B0000";
//var dark_red = "8B0000";
//var orange = "#FFA500";

var black = "black";
var blue = "blue";
var red = "red";
var green = "green";
var purple = "purple";
var maroon = "maroon";
var navy = "navy";
var dark_red = "darkred";
var orange = "orange";

const PLANETS = {
    mercury: { year: 87.969, orbit: 57.91 },
    venus: { year: 224.701, orbit: 108.21 },
    earth: { year: 365.256, orbit: 149.60 },
    mars: { year: 686.980, orbit: 227.92 },
    jupiter: { year: 4332.6, orbit: 4332.6 },
    saturn: { year: 10759.2, orbit: 1433.5 },
    uranus: { year: 30685., orbit: 2872.46 },
    neptune: { year: 60190., orbit: 4495.1 },
    pluto: { year: 90465., orbit: 5869.7 },
}

async function dance(context, outer_planet, inner_planet, orbits) {
    var worksheet_name = "Sheet1";
    var shapes = context.workbook.worksheets.getItem(worksheet_name).shapes;
    var pi = 3.141592;
    var outer_planet_year = PLANETS[outer_planet].year;
    var inner_planet_year = PLANETS[inner_planet].year;
    var outer_planet_radius = PLANETS[outer_planet].orbit;
    var inner_planet_radius = PLANETS[inner_planet].orbit;
    var interval_days = outer_planet_year / 75;
    var ycenter = 200;
    var xcenter = 200;
    var r2 = ycenter * inner_planet_radius / outer_planet_radius;
    var r = 0;
    var rstop = outer_planet_year * orbits;
    var a1 = 0;
    var a1_interval = 2 * pi * interval_days / outer_planet_year;
    var a2 = 0;
    var a2_interval = 2 * pi * interval_days / inner_planet_year;
    while(r < rstop) {
		var i = Math.floor(r / interval_days / 75);
		var c;
		if(i == 0){
	   		c = black;
		}
		else if(i == 1){
			c = blue;
		}
		else if(i == 2){
			c = red;
		}
		else if(i == 3){
			c = green;
		}
		else if(i == 4){
			c = purple;
		}
		else if(i == 5){
			c = maroon;
		}
		else if(i == 6){
			c = navy;
		}
		else if(i == 7){
			c = dark_red;
		}
		else {
			c = orange
		}
		a1 = a1 - a1_interval;
		a2 = a2 - a2_interval;

		var x1 = ycenter * Math.cos(a1);
		var y1 = ycenter * Math.sin(a1);
		var x2 = r2 * Math.cos(a2);
		var y2 = r2 * Math.sin(a2);

		var line = shapes.addLine(Math.round(x1) + xcenter,
					Math.round(y1) + ycenter,
					Math.round(x2) + xcenter,
					Math.round(y2) + ycenter,
					Excel.ConnectorType.straight);
		line.lineFormat.color = c;
		r = r + interval_days;
    };
}

export async function run() {
    try {
	await Excel.run(async (context) => {
	    console.log("start");
	    dance(context, "earth", "venus", 8.0);
	    await context.sync();
	});
    } catch (error) {
	console.log("error");
	console.error(error);
    }
}
