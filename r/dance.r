
year <- function(planet){
  res <- switch(planet,
    "Mercury" = 87.969,
    "Venus" = 224.701,
    "Earth" = 365.256,
    "Mars" = 686.980,
    "Jupiter" = 4332.6,
    "Saturn" = 10759.2,
    "Uranus" = 30685.0,
    "Neptune" = 60190.0,
    "Pluto" = 90465.0,
    stop("unknown planet")
  )
  return(res)
} 

orbit <- function(planet){
  res <- switch(planet,
    "Mercury" = 57.91,
    "Venus" = 108.21,
    "Earth" = 149.60,
    "Mars" = 227.92,
    "Jupiter" = 778.57,
    "Saturn" = 1433.5,
    "Uranus" = 2872.46,
    "Neptune" = 4495.1,
    "Pluto" = 5869.7,
    stop("unknown planet")
  )
  return(res)
}

black <- "#000000"
blue <- "#0000FF"
red <- "#FF0000"
green <- "#00FF00"
purple <- "#800080"
maroon <- "#800000"
navy <- "#8B0000"
dark_red <- "#8B0000"
orange <- "#FFA500"

canvas_len = 400

dance <- function(outer_planet, inner_planet, orbits){
   outer_planet_year = year(outer_planet)
   inner_planet_year = year(inner_planet)
   outer_planet_radius = orbit(outer_planet)
   inner_planet_raidus = orbit(inner_planet)
   interval_days = outer_planet_year / 75.0
   ycenter = canvas_len / 2
   xcenter = canvas_len / 2
   r1 = ycenter
   r2 = r1 * inner_planet_raidus / outer_planet_radius
   r <- 0
   rstop = outer_planet_year * orbits
   a1 <- 0
   a1_interval = 2 * pi * interval_days / outer_planet_year
   a2 <- 0
   a2_interval = 2 * pi * interval_days / inner_planet_year

   orbit_text = sprintf("%.f orbits", orbits)
   text(10, canvas_len - 30, labels=outer_planet, col="blue")
   text(10, canvas_len - 50, labels=inner_planet, col="blue")
   text(10, 20, orbit_text, col="blue")
   
   while (r < rstop){
      i = floor(r / interval_days / 75)

      color <- if(i == 0) "#000000"
      else if (i == 1) "#0000FF"
      else if (i == 2) "#FF0000"
      else if (i == 3) "#00FF00"
      else if (i == 4) "#800080"
      else if (i == 5) "#800000"
      else if (i == 6) "#8B0000"
      else if (i == 7) "#8B0000"
      else "#FFA500"

      a1 <- a1 - a1_interval
      a2 <- a2 - a2_interval
      x1 <- r1 * cos(a1) + xcenter
      y1 <- - r1 * sin(a1) + ycenter
      x2 <- r2 * cos(a2) + xcenter
      y2 <- - r2 * sin(a2) + ycenter
      segments(x1, y1, x2, y2, col=color)
      r <- r + interval_days
   }   
}

png('dance.png', width=canvas_len, height=canvas_len)
plot(NULL, type="n", xlim=c(0, canvas_len), ylim=c(0, canvas_len), axes=F, ann=F)
dance("Earth", "Venus", 8.0)
invisible(dev.off())
