import org.scalajs.dom
import org.scalajs.dom.html
import org.scalajs.dom.document

class Planet(val name: String, val year: Double, val orbit: Double)

case object Mercury extends Planet("Mercury", 87.969, 57.91)
case object Venus extends Planet("Venus", 224.701, 108.21)
case object Earth extends Planet("Earth", 365.256, 149.60)
case object Mars extends Planet("Mars", 686.980, 227.92)
case object Jupiter extends Planet("Jupiter", 4432.6, 778.57)
case object Saturn extends Planet("Saturn", 10759.2, 1433.5)
case object Uranus extends Planet("Uranus", 30685.0, 2872.46)
case object Neptune extends Planet("Neptune", 60190.0, 4495.1)
case object Pluto extends Planet("Plute", 90465.0, 5869.7)

object Dance {
  // http://scala-js.github.io/scala-js-dom/#dom.HTMLCanvasElement
  def main(args: Array[String]) = {
    val outer_planet = Earth
    val inner_planet = Venus
    val orbits = 8.0

    val c = document.getElementById("canvas").asInstanceOf[html.Canvas]
    type Ctx2D = dom.CanvasRenderingContext2D
    val ctx = c.getContext("2d").asInstanceOf[Ctx2D]
    val canvas_len = c.width

    val outer_planet_year = outer_planet.year
    val inner_planet_year = inner_planet.year
    val outer_planet_radius = outer_planet.orbit
    val inner_planet_radius = inner_planet.orbit
    val interval_days = outer_planet_year / 75.0
    val ycenter = canvas_len / 2
    val xcenter = canvas_len / 2
    val r1 = ycenter
    val r2 = r1 * inner_planet_radius / outer_planet_radius
    var r = 0.0
    val rstop = outer_planet_year * orbits
    var a1 = 0.0
    val a1_interval = 2.0 * math.Pi * interval_days / outer_planet_year
    var a2 = 0.0
    val a2_interval = 2.0 * math.Pi * interval_days / inner_planet_year

    val outer_planet_name = outer_planet.name
    val inner_planet_name = inner_planet.name
    val orbit_text = "%.0f orbits".format(orbits)
    ctx.strokeStyle = "blue";
    //ctx.font = "24pt"
    ctx.fillText(outer_planet_name, 10, (canvas_len - 20 - 5))
    ctx.fillText(inner_planet_name, 10, (canvas_len - 40 - 5))
    ctx.fillText(orbit_text, 10, 20);

    while (r < rstop){
      val i = (r / interval_days / 75.0).toInt
      val c =
        i match {
          case 0 => "black"
          case 1 => "blue"
          case 2 => "red"
          case 3 => "green"
          case 4 => "purple"
          case 5 => "maroon"
          case 6 => "navy"
          case 7 => "darkred"
          case _ => "orange"
        }
      a1 = a1 - a1_interval
      a2 = a2 - a2_interval
      val x1 = r1 * math.cos(a1)
      val y1 = r1 * math.sin(a1)
      val x2 = r2 * math.cos(a2)
      val y2 = r2 * math.sin(a2)
      ctx.strokeStyle = c
      ctx.beginPath()
      ctx.moveTo(x1 + xcenter, y1 + ycenter)
      ctx.lineTo(x2 + xcenter, y2 + ycenter)
      //ctx.closePath()
      ctx.stroke()
      r = r + interval_days
    }
  }
}
