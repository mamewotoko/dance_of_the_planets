package main

import (
	"math"
	"github.com/fogleman/gg"
)

type Planet int

const (
	Mercury Planet = iota
	Venus
	Earth
	Mars
	Jupiter
	Saturn
	Uranus
	Neptune
	Pluto
)

func nameOfPlanet(planet Planet) string {
	switch planet {
	case Mercury:
		return "Mercury"
	case Venus:
		return "Venus"
	case Earth:
		return "Earth"
	case Mars:
		return "Mars"
	case Jupiter:
		return "Jupiter"
	case Saturn:
		return "Saturn"
	case Uranus:
		return "Uranus"
	case Neptune:
		return "Neptune"
	case Pluto:
		return "Pluto"
	default:
		//TODO: return error
		return ""
	}
}

func orbitOfPlanet(planet Planet) float64 {
	switch planet {
	case Mercury:
		return 57.91
	case Venus:
		return 108.21
	case Earth:
		return 149.60
	case Mars:
		return 227.92
	case Jupiter:
		return 778.57
	case Saturn:
		return 1433.5
	case Uranus:
		return 2872.46
	case Neptune:
		return 4495.1
	case Pluto:
		return 5869.7
	default:
		//TODO: return error
		return 1.0
	}
}

func yearOfPlanet(planet Planet) float64 {
	switch planet {
	case Mercury:
		return 87.969
	case Venus:
		return 224.701
	case Earth:
		return 365.256
	case Mars:
		return 686.980
	case Jupiter:
		return 4332.6
	case Saturn:
		return 10759.2
	case Uranus:
		return 30685.0
	case Neptune:
		return 60190.0
	case Pluto:
		return 60190.0
	default:
		//TODO: return error
		return 1.0
	}
}

func colorOfI(i int) (float64, float64, float64, float64) {
	alpha := 1.0
	switch i {
	case 0:
		return 0.0, 0.0, 0.0, alpha
	case 1:
		return 0.0, 0.0, 1.0, alpha
	case 2:
		return 1.0, 0.0, 0.0, alpha
	case 3:
		return 0.0, float64(0xFF) / 255.0, 0.0, alpha
	case 4:
		return float64(0x80) / 255.0, 0.0, float64(0x80) / 255.0, alpha
	case 5:
		return float64(0x80) / 255.0, 0.0, 0.0, alpha
	case 6:
		return float64(0x8B) / 255.0, 0.0, 0.0, alpha
	case 7:
		return float64(0x20) / 255.0, float64(0x2F) / 255.0, float64(0x55) / 255.0, alpha
	default:
		return 1.0, float64(0xA5) / 255.0, 0.0, alpha
	}
}

func dance(dc *gg.Context, canvasLen int, innerPlanet Planet, outerPlanet Planet, orbits float64) {
	innerPlanetYear := yearOfPlanet(innerPlanet)
	outerPlanetYear := yearOfPlanet(outerPlanet)
	innerPlanetRadius := orbitOfPlanet(innerPlanet)
	outerPlanetRadius := orbitOfPlanet(outerPlanet)
	intervalDays := outerPlanetYear / 75
	xcenter := float64(canvasLen / 2)
	ycenter := float64(canvasLen / 2)
	r1 := float64(ycenter)
	r2 := float64(r1) * innerPlanetRadius / outerPlanetRadius
	r := 0.0
	a1 := 0.0
	a2 := 0.0
	rstop := outerPlanetYear * orbits
	a1Interval := 2 * math.Pi * intervalDays / outerPlanetYear
	a2Interval := 2 * math.Pi * intervalDays / innerPlanetYear
	dc.SetRGB(1.0, 1.0, 1.0)
	dc.DrawRectangle(0.0, 0.0, float64(canvasLen), float64(canvasLen))
	dc.Fill()
	for r < rstop {
		i := int(r / intervalDays / 75.0)
		//		fmt.Println("i ", i)
		a1 = a1 - a1Interval
		a2 = a2 - a2Interval
		x1 := r1*math.Cos(a1) + xcenter
		y1 := r1*math.Sin(a1) + ycenter
		x2 := r2*math.Cos(a2) + xcenter
		y2 := r2*math.Sin(a2) + ycenter
		dc.SetRGBA(colorOfI(i))
		dc.DrawLine(x1, y1, x2, y2)
		dc.Stroke()
		r = r + intervalDays
	}
}

func main() {
	const canvasLen = 400
	dc := gg.NewContext(canvasLen, canvasLen)
	dance(dc, canvasLen, Venus, Earth, 8.0)
	dc.SavePNG("result.png")
}
