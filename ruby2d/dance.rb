#! /usr/bin/env ruby
require 'ruby2d'

module Planet
  MERCURY = 1
  VENUS = 2
  EARTH = 3
  MARS = 4
  JUPITER = 5
  SATURN = 6
  URANUS = 7
  NEPTUNE = 8
  PLUTO = 9
end

YEAR = {
  Planet::MERCURY => 87.969,
  Planet::VENUS => 224.701,
  Planet::EARTH => 365.256,
  Planet::MARS => 686.980,
  Planet::JUPITER => 4332.6,
  Planet::SATURN => 10759.2,
  Planet::URANUS => 30685.0,
  Planet::NEPTUNE => 60190.0,
  Planet::PLUTO => 90465.0
}

ORBIT = {
    Planet::MERCURY => 57.91,
    Planet::VENUS => 108.21,
    Planet::EARTH => 149.60,
    Planet::MARS => 227.92,
    Planet::JUPITER => 778.57,
    Planet::SATURN => 1433.5,
    Planet::URANUS => 2872.46,
    Planet::NEPTUNE => 4495.1,
    Planet::PLUTO => 5869.7
}

PLANET_NAME = {
    Planet::MERCURY => "Mercury",
    Planet::VENUS => "Venus",
    Planet::EARTH => "Earth",
    Planet::MARS => "Mars",
    Planet::JUPITER => "Jupiter",
    Planet::SATURN => "Saturn",
    Planet::URANUS => "Uarnus",
    Planet::NEPTUNE => "Neptune",
    Planet::PLUTO => "Pluto"
}

CANVAS_LEN = 400

def color_of_i(i)
  case i
  when 0 then
    return "black"
  when 1 then
    return "blue"
  when 2 then
    return "red"
  when 3 then
    return "green"
  when 4 then
    return "#800080"
  when 5 then
    return "#800000"
  when 6 then
    return "#8B0000"
  when 7 then
    return "#202F55"
  else
    return "#FFA500"
  end
end


def dance(inner_planet, outer_planet, orbits)
  outer_planet_year = YEAR[outer_planet]
  inner_planet_year = YEAR[inner_planet]
  outer_planet_radius = ORBIT[outer_planet]
  inner_planet_radius = ORBIT[inner_planet]

  interval_days = outer_planet_year / 75
  ycenter = CANVAS_LEN / 2
  xcenter = CANVAS_LEN / 2
  r1 = ycenter
  r2 = r1 * inner_planet_radius / outer_planet_radius

  r = 0.0
  a1 = 0.0
  a2 = 0.0
  rstop = outer_planet_year * orbits
  a1_interval = 2 * Math::PI * interval_days / outer_planet_year
  a2_interval = 2 * Math::PI * interval_days / inner_planet_year

  inner_planet_name = PLANET_NAME[inner_planet]
  outer_planet_name = PLANET_NAME[outer_planet]
  orbit_text = sprintf("orbit %.1f", orbits)
  Text.new(outer_planet_name, x: 10, y: 10, color: "blue")
  Text.new(inner_planet_name, x: 10, y: 30, color: "blue")
  Text.new(orbit_text, x: 10, y: CANVAS_LEN - 30, color: "blue")
  
  while r < rstop do
    i = (r / interval_days / 75.0).to_i
    color = color_of_i(i)

    a1 -= a1_interval
    a2 -= a2_interval

    x1 = r1 * Math.cos(a1) + xcenter
    y1 = r1 * Math.sin(a1) + ycenter
    x2 = r2 * Math.cos(a2) + xcenter
    y2 = r2 * Math.sin(a2) + ycenter

    Line.new(x1: x1, y1: y1, x2: x2, y2: y2, width: 1, color: color)
    r += interval_days
  end
end


# Set the window size
set width: CANVAS_LEN, height: CANVAS_LEN, background: 'white'
dance(Planet::VENUS, Planet::EARTH, 8.0)
# Show the window
show
