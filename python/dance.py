#! /usr/bin/env python3
from PIL import Image, ImageDraw, ImageFont
from enum import Enum
import math

black = (0x00, 0x00, 0x00)
blue = (0x00, 0x00, 0xFF)
red = (0xFF, 0x00, 0x00)
green = (0x00, 0xFF, 0x00)
purple = (0x80, 0x00, 0x80)
maroon = (0x80, 0x00, 0x00)
dark_red = (0x8B, 0x00, 0x00)
navy = (0x8B, 0x00, 0x00)

orange = (0xFF, 0xA5, 0X00)


class Planets(Enum):
    MERCURY = 1
    VENUS = 2
    EARTH = 3
    MARS = 4
    JUPITER = 5
    SATURN = 6
    URANUS = 7
    NEPTUNE = 8
    PLUTO = 9


year = {
    Planets.MERCURY: 87.969,
    Planets.VENUS: 224.701,
    Planets.EARTH: 365.256,
    Planets.MARS: 686.980,
    Planets.JUPITER: 4332.6,
    Planets.SATURN: 10759.2,
    Planets.URANUS: 30685.0,
    Planets.NEPTUNE: 60190.0,
    Planets.PLUTO: 90465.0,
}

orbit = {
  Planets.MERCURY: 57.91,
  Planets.VENUS: 108.21,
  Planets.EARTH: 149.60,
  Planets.MARS: 227.92,
  Planets.JUPITER: 778.57,
  Planets.SATURN: 1433.5,
  Planets.URANUS: 2872.46,
  Planets.NEPTUNE: 4495.1,
  Planets.PLUTO: 5869.7,
}
line_color = [
    black,
    blue,
    red,
    green,
    purple,
    maroon,
    navy,
    dark_red,
    orange,
]


canvas_len = 400


def draw_line(draw, color, from_x, from_y, to_x, to_y):
    draw.line((from_x, from_y, to_x, to_y), fill=color, width=1)

font = ImageFont.truetype("/Library/Fonts/Comic Sans MS.ttf", 14)

def draw_text(draw, color, x, y, text):
    draw.text((x, y), text, fill=color, font=font)
    

def main(draw, outer_planet, inner_planet, orbits):
    outer_planet_year = year[outer_planet]
    inner_planet_year = year[inner_planet]
    outer_planet_radius = orbit[outer_planet]
    inner_planet_radius = orbit[inner_planet]
    interval_days = outer_planet_year / 75
    ycenter = canvas_len / 2
    xcenter = canvas_len / 2
    r1 = ycenter
    r2 = r1 * inner_planet_radius / outer_planet_radius
    r = 0.0 # theta
    a1 = 0.0
    a2 = 0.0
    rstop = outer_planet_year * orbits
    a1_interval = 2 * math.pi * interval_days / outer_planet_year
    a2_interval = 2 * math.pi * interval_days / inner_planet_year
    outer_planet_name = outer_planet.name
    inner_planet_name = inner_planet.name

    orbit_text = "%.0f orbits" % orbits
    draw_text(draw, blue, 10, 10, outer_planet_name)
    draw_text(draw, blue, 10, 30, inner_planet_name)
    draw_text(draw, blue, 10, (canvas_len - 30), orbit_text)
    
    while r < rstop:
        i = int(r / interval_days / 75.)
        color = line_color[i]
        a1 = a1 - a1_interval
        a2 = a2 - a2_interval
        x1 = r1 * math.cos(a1)
        y1 = r1 * math.sin(a1)
        x2 = r2 * math.cos(a2)
        y2 = r2 * math.sin(a2)
        draw_line(draw, color, xcenter + x1, ycenter + y1, xcenter + x2, ycenter + y2)
        r = r + interval_days
        
if __name__ == '__main__':
    im = Image.new('RGB', (400, 400), (0xFF, 0xFF, 0xFF))
    draw = ImageDraw.Draw(im)
    main(draw, Planets.EARTH, Planets.VENUS, 8.0)
    im.save('result_daonce.png')
