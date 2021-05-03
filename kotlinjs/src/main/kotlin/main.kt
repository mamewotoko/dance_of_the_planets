import kotlinx.browser.document
import org.w3c.dom.CanvasRenderingContext2D
import org.w3c.dom.HTMLCanvasElement
import kotlinx.browser.window

import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

//import kotlinx.html.js.canvas

enum class Planet {
    MERCURY,
    VENUS,
    EARTH,
    MARS,
    JUPITER,
    SATURN,
    URANUS,
    NEPTUNE,
    PLUTO
}

fun yearOfPlanet(planet: Planet) =
    when(planet){
        Planet.MERCURY -> 87.969
        Planet.VENUS -> 224.701
        Planet.EARTH -> 365.256
        Planet.MARS -> 686.980
        Planet.JUPITER -> 4332.6
        Planet.SATURN -> 10759.2
        Planet.URANUS -> 30685.0
        Planet.NEPTUNE -> 60190.0
        Planet.PLUTO -> 90465.0
    }


fun orbitOfPlanet(planet: Planet) =
    when(planet){
        Planet.MERCURY -> 57.91
        Planet.VENUS -> 108.21
        Planet.EARTH -> 149.60
        Planet.MARS -> 227.92
        Planet.JUPITER -> 778.57
        Planet.SATURN -> 1433.5
        Planet.URANUS -> 2872.46
        Planet.NEPTUNE -> 4495.1
        Planet.PLUTO -> 5869.7
    }


fun nameOfPlanet(planet: Planet) =
    when(planet){
        Planet.MERCURY -> "Mercury"
        Planet.VENUS -> "Venus"
        Planet.EARTH -> "Earth"
        Planet.MARS -> "Mars"
        Planet.JUPITER -> "Jupiter"
        Planet.SATURN -> "Saturn"
        Planet.URANUS -> "Uranus"
        Planet.NEPTUNE -> "Neptune"
        Planet.PLUTO -> "Pluto"
    }

// canvas width, height
const val CANVAS_LEN = 400.0

fun drawLine(c: CanvasRenderingContext2D, fromX: Double, fromY: Double, toX: Double, toY: Double, color: String){
    color.also { c.fillStyle = it }
    color.also { c.strokeStyle = it }
    c.beginPath()
    c.moveTo(fromX, fromY)
    c.lineTo(toX, toY)
    c.stroke()
}

fun dance(canvas: HTMLCanvasElement, outerPlanet: Planet, innerPlanet: Planet, orbit: Double) {
    val c = canvas.getContext("2d") as CanvasRenderingContext2D
    val outerPlanetYear = yearOfPlanet(outerPlanet)
    val innerPlanetYear = yearOfPlanet(innerPlanet)
    val outerPlanetRadius = orbitOfPlanet(outerPlanet)
    val innerPlanetRadius = orbitOfPlanet(innerPlanet)
    val intervalDays = outerPlanetYear / 75.0
    val xcenter = CANVAS_LEN / 2.0
    val ycenter = CANVAS_LEN / 2.0
    val r1 = ycenter
    val r2 = r1 * innerPlanetRadius / outerPlanetRadius
    var r = 0.0
    val rstop = outerPlanetYear * orbit
    var a1 = 0.0
    val a1Interval = 2.0 * PI * intervalDays / outerPlanetYear
    var a2 = 0.0
    val a2Interval = 2.0 * PI * intervalDays / innerPlanetYear
    while(r < rstop){
        val i = (r / intervalDays / 75.0).toInt()
        console.log(i)
        val color = when(i) {
            0 -> "black"
            1 -> "blue"
            2 -> "red"
            3 -> "green"
            4 -> "#800080" //purple
            5 -> "#800000" //maroon
            6 -> "#8B0000"  //navy
            7 -> "#8B0000" //dark red
            8 -> "#FFA500" //orange
            else -> "aqua"
        }
        a1 -= a1Interval
        a2 -= a2Interval
        val x1 = r1 * cos(a1)
        val y1 = r1 * sin(a1)
        val x2 = r2 * cos(a2)
        val y2 = r2 * sin(a2)

        drawLine(c, x1 + xcenter, y1 + ycenter, x2 + xcenter, y2 + ycenter, color)
        r = r + intervalDays
    }
}

fun main() {
    window.onload = {
        dance(document.getElementById("target") as HTMLCanvasElement, Planet.EARTH, Planet.VENUS, 8.0)
    }
}
