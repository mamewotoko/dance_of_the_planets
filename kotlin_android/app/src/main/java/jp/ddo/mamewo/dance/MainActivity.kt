package jp.ddo.mamewo.dance

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.view.View
import java.lang.Math.cos
import java.lang.Math.sin

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

fun yearOfPlanet(planet: Planet) : Float =
    when(planet){
        Planet.MERCURY -> 87.969f
        Planet.VENUS -> 224.701f
        Planet.EARTH -> 365.256f
        Planet.MARS -> 686.980f
        Planet.JUPITER -> 4332.6f
        Planet.SATURN -> 10759.2f
        Planet.URANUS -> 30685.0f
        Planet.NEPTUNE -> 60190.0f
        Planet.PLUTO -> 90465.0f
    }


fun orbitOfPlanet(planet: Planet) : Float =
    when(planet){
        Planet.MERCURY -> 57.91f
        Planet.VENUS -> 108.21f
        Planet.EARTH -> 149.60f
        Planet.MARS -> 227.92f
        Planet.JUPITER -> 778.57f
        Planet.SATURN -> 1433.5f
        Planet.URANUS -> 2872.46f
        Planet.NEPTUNE -> 4495.1f
        Planet.PLUTO -> 5869.7f
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

class MainActivity : AppCompatActivity() {
    class DanceView : View {
        private val paint = Paint()

        constructor(c: Context) : super(c)

        override fun onDraw(canvas: Canvas?) {
            super.onDraw(canvas)
            dance(canvas, Planet.EARTH, Planet.VENUS, 8.0f)
        }

        private fun dance(canvas: Canvas?, outerPlanet: Planet, innerPlanet: Planet, orbit: Float) {
            canvas ?: return
            val canvasLen : Int = canvas.width.coerceAtMost(canvas.height)
            val outerPlanetYear : Float = yearOfPlanet(outerPlanet)
            val innerPlanetYear : Float = yearOfPlanet(innerPlanet)
            val outerPlanetRadius : Float = orbitOfPlanet(outerPlanet)
            val innerPlanetRadius : Float = orbitOfPlanet(innerPlanet)
            val intervalDays : Float = outerPlanetYear / 75.0f
            val xcenter : Float = canvasLen / 2.0f
            val ycenter : Float = canvasLen / 2.0f
            val r1 : Float = ycenter
            val r2 : Float = r1 * innerPlanetRadius / outerPlanetRadius
            var r : Float = 0.0f
            val rstop : Float = outerPlanetYear * orbit
            var a1 : Double = 0.0
            val a1Interval : Float = (2.0f * Math.PI * intervalDays / outerPlanetYear).toFloat()
            var a2 : Double = 0.0
            val a2Interval : Float = (2.0f * Math.PI * intervalDays / innerPlanetYear).toFloat()
            val outerPlanetName = nameOfPlanet(outerPlanet)
            val innerPlanetName = nameOfPlanet(innerPlanet)
            paint.setColor(0xFF0000FF.toInt())
            paint.setTextSize(34.0f)
            canvas.drawText(outerPlanetName, 10.0f, 25.0f, paint)
            canvas.drawText(innerPlanetName, 10.0f, 55.0f, paint)
            canvas.drawText("${orbit} orbits", 10.0f, canvasLen - 20.0f, paint)

            while(r < rstop){
                val i = (r / intervalDays / 75.0).toInt()
                val colorCode : Int = when(i) {
                    0 -> 0xFF000000.toInt()
                    1 -> 0xFF0000FF.toInt()
                    2 -> 0xFFFF0000.toInt()
                    3 -> 0xFF00FF00.toInt()
                    4 -> 0xFF800080.toInt() //purple
                    5 -> 0xFF800000.toInt() //maroon
                    6 -> 0xFF8B0000.toInt() //navy
                    7 -> 0xFF8B0000.toInt() //dark red
                    8 -> 0xFFFFA500.toInt() //orange
                    else -> 0xFFFFA500.toInt()
                }
                a1 -= a1Interval
                a2 -= a2Interval
                val x1 : Float = (r1 * cos(a1)).toFloat()
                val y1 : Float = (r1 * sin(a1)).toFloat()
                val x2 : Float = (r2 * cos(a2)).toFloat()
                val y2 : Float = (r2 * sin(a2)).toFloat()

                paint.setColor(colorCode)
                canvas.drawLine(x1 + xcenter, y1 + ycenter, x2 + xcenter, y2 + ycenter, paint)
                r += intervalDays
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        setContentView(DanceView(this))
    }
}
