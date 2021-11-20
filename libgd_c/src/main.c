/* Bring in gd library functions */
#include "gd.h"

/* Bring in standard I/O so we can output the PNG to a file */
#include <stdio.h>
#include <math.h>

#define CANVAS_LEN 400

enum PLANET {
    Mercury,
    Venus,
    Earth,
    Mars,
    Jupiter,
    Saturn,
    Uranus,
    Neptune,
    Pluto
};

double year(enum PLANET planet)
{
    switch(planet){
    case Mercury:
	return 87.969;
    case Venus:
	return 224.701;
    case Earth:
	return 365.256;
    case Mars:
	return 686.980;
    case Jupiter:
	return 4332.6;
    case Saturn:
	return 10759.2;
    case Uranus:
	return 30685.0;
    case Neptune:
	return 60190.0;
    case Pluto:
	return 90465.0;
	//default:
	//
    }
}

double orbit(enum PLANET planet)
{
    switch(planet){
    case Mercury: return 57.91;
    case Venus: return 108.21;
    case Earth: return 149.60;
    case Mars: return 227.92;
    case Jupiter: return 778.57;
    case Saturn: return 1433.5;
    case Uranus: return 2872.46;
    case Neptune: return 4495.1;
    case Pluto: return 5869.7;
	//default:
    }
}

int color_of_i(gdImagePtr im,
	       int i)
{
    int r, g, b;
    switch(i){
    case 0:
	r = 0x00;
	g = 0x00;
	b = 0x00;
	break;
    case 1:
	r = 0x00;
	g = 0x00;
	b = 0xff;
	break;
    case 2:
	r = 0xff;
	g = 0x00;
	b = 0x00;
	break;
    case 3:
	r = 0x00;
	g = 0xff;
	b = 0x00;
	break;
    case 4:
	r = 0x80;
	g = 0x00;
	b = 0x80;
	break;
    case 5:
	r = 0x80;
	g = 0x00;
	b = 0x00;
	break;
    case 6:
	r = 0x00;
	g = 0x00;
	b = 0x8b;
	break;
    case 7:
	r = 0x8b;
	g = 0x00;
	b = 0x00;
	break;
    default:
	r = 0xff;
	g = 0xa5;
	b = 0x00;
    }
    return gdImageColorAllocate(im, r, g, b);
}

void dance(gdImagePtr im,
	   double orbits,
	   enum PLANET outer_planet,
	   enum PLANET inner_planet)
{
    double interval_days = year(outer_planet) / 75.0;
    int ycenter = CANVAS_LEN / 2;
    int xcenter = CANVAS_LEN / 2;
    double r1 = (double)ycenter;
    //TODO: round
    double r2 = r1 * orbit(inner_planet) / orbit(outer_planet);
    double r = 0.0;
    double a1 = 0.0;
    double a2 = 0.0;
    double a1_interval = 2.0 * M_PI * interval_days / year(outer_planet);
    double a2_interval = 2.0 * M_PI * interval_days / year(inner_planet);
    double rstop = year(outer_planet) * orbits;
    int i, x1, y1, x2, y2, color;
    
    while(r < rstop){
	i = (int)floor(r / interval_days / 75.0);
	color = color_of_i(im, i);
	a1 -= a1_interval;
	a2 -= a2_interval;
	x1 = (int)(r1 * cos(a1)) + xcenter;
	y1 = (int)(r1 * sin(a1)) + ycenter;
	x2 = (int)(r2 * cos(a2)) + xcenter;
	y2 = (int)(r2 * sin(a2)) + ycenter;

	//printf("%d %d %d %d\n", x1, y1, x2, y2);
	gdImageLine(im, x1, y1, x2, y2, color);

	r += interval_days;
    }
}

int main()
{
  /* Declare the image */
  gdImagePtr im;
  /* Declare output files */
  FILE *pngout;
  /* Declare color indexes */
  int white;

  im = gdImageCreate(CANVAS_LEN, CANVAS_LEN);
  white = gdImageColorAllocate(im, 255, 255, 255);

  dance(im, 8.0, Earth, Venus);

  pngout = fopen("dance.png", "wb");
  if(pngout != NULL){
      gdImagePng(im, pngout);
      fclose(pngout);
  }
  gdImageDestroy(im);
}
