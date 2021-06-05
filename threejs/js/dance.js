var canvas_len = 400;

var MERCURY = 1;
var VENUS = 2;
var EARTH = 3;
var MARS = 4;
var JUPITER = 5;
var SATURN = 6;
var URANUS = 7;
var NEPTUNE = 8;
var PLUTO = 9;

function year_of_planet(planet){
    switch(planet){
    case MERCURY:
        return 87.969;
    case VENUS:
        return 224.701;
    case EARTH:
        return 365.256;
    case MARS:
        return 686.980;
    case JUPITER:
        return 4332.6;
    case SATURN:
        return 10759.2;
    case URANUS:
        return 30685.0;
    case NEPTUNE:
        return 60190.0;
    case PLUTO:
        return 90465.0;
    default:
        console.error("unknown planet");
        return 100000.0;
    }
}

function orbit_of_planet(planet){
    switch(planet){
    case MERCURY:
        return 57.91;
    case VENUS:
        return 108.21;
    case EARTH:
        return 149.60;
    case MARS:
        return 227.92;
    case JUPITER:
        return 778.57;
    case SATURN:
        return 1433.5;
    case URANUS:
        return 2872.46;
    case NEPTUNE:
        return 4495.1;
    case PLUTO:
        return 5869.7;
    default:
        console.error("unknown planet");
        return 100000.0;
    }
}

function name_of_planet(planet){
    switch(planet){
    case MERCURY:
        return "Mercury";
    case VENUS:
        return "Venus";
    case EARTH:
        return "Earth";
    case MARS:
        return "Mars";
    case JUPITER:
        return "Jupiter";
    case SATURN:
        return "Saturn";
    case URANUS:
        return "Uranus";
    case NEPTUNE:
        return "Neptune";
    case PLUTO:
        return "Pluto";
    default:
        console.error("unknown planet");
        return "Unknown";
    }
}

var color_array = [
    0x000000,
    0x0000FF,
    0xFF0000,
    0x0000FF,
    0x800080,
    0x800000,
    0x8B0000,
    0x8B0000
]

var orange = 0xFFA500;

function dance(scene, inner_planet, outer_planet, orbits){
    var inner_planet_year = year_of_planet(inner_planet);
    var outer_planet_year = year_of_planet(outer_planet);
    var inner_planet_radius = orbit_of_planet(inner_planet);
    var outer_planet_radius = orbit_of_planet(outer_planet);
    var interval_days = outer_planet_year / 75;
    var xcenter = canvas_len / 2;
    var ycenter = canvas_len / 2;
    var r1 = ycenter;
    var r2 = r1 * inner_planet_radius / outer_planet_radius;
    var r = 0.0;
    var a1 = 0.0;
    var a2 = 0.0;
    var rstop = outer_planet_year * orbits;
    var a1_interval = 2 * Math.PI * interval_days / outer_planet_year;
    var a2_interval = 2 * Math.PI * interval_days / inner_planet_year;
    var outer_planet_name = name_of_planet(inner_planet);
    var inner_planet_name = name_of_planet(outer_planet);

    while(r < rstop){
        var i = Math.floor(r /interval_days / 75);
        var color = orange;
        if (i < color_array.length){
            color = color_array[i];
        }
        a1 -= a1_interval;
        a2 -= a2_interval;
        x1 = r1 * Math.cos(a1)
        y1 = r1 * Math.sin(a1)
        x2 = r2 * Math.cos(a2)
        y2 = r2 * Math.sin(a2)
        //draw line
        var material = new THREE.LineBasicMaterial({
            color: color
        });
        var geom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(x1, y1, 2),
                                                             new THREE.Vector3(x2, y2, 2)]);
        var line = new THREE.Line(geom, material, THREE.LineSegments);
        scene.add(line);
        r += interval_days;
    }
}

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 10000);

function render() {
    requestAnimationFrame(render);
    control.update();
    renderer.render( scene, camera );
}

camera.position.z = 400;

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild(renderer.domElement);
var control = new THREE.OrbitControls(camera, renderer.domElement);

var light = new THREE.AmbientLight(0x888888);
scene.add(light);
light = new THREE.DirectionalLight(0x888888, 1.0);
light.position.set(0, 0, 400);
scene.add(light);

var geometry = new THREE.BoxGeometry(canvas_len, canvas_len, 1);
var material = new THREE.MeshPhongMaterial( { color: 0xffffff } );
var cube = new THREE.Mesh(geometry, material);
scene.add( cube );

dance(scene, VENUS, EARTH, 8.0);

render();
