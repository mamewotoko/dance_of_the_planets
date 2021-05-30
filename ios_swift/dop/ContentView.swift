//
//  ContentView.swift
//  dop
//
//  Created by Takashi Masuyama on 2021/05/30.
//

import SwiftUI

struct ContentView: View {
    var orbits = 8.0
    var canvasLen = 400
    //venus
    var innerPlanetName = "Venus"
    var innerPlanetYear = 224.701
    var innerPlanetOrbit = 108.21
    //earth
    var outerPlanetName = "Earth"
    var outerPlanetYear = 365.256
    var outerPlanetOrbit = 149.60
    
    func colorOfI(i: Int) -> Color {
        switch i {
        case 0:
            return Color.black
        case 1:
            return Color.blue
        case 2:
            return Color.red
        case 3:
            return Color.green
        case 4:
            return Color.purple
        case 5:
            return Color.init(red: 128.0/255.0, green: 0.0, blue: 0.0)
        case 6:
            return Color.init(red: 32.0/255.0, green: 47.0/255.0, blue: 85/255.0)
        case 7:
            return Color.init(red: 139.0/255.0, green: 0.0, blue: 0.0)
        default:
            return Color.orange;
        }
    }
    
    var body: some View {
        ZStack {
            let intervalDays : Double = outerPlanetYear / 75.0
            let r1 : Double = Double(canvasLen / 2)
            let r2 : Double = Double(r1) * innerPlanetOrbit / outerPlanetOrbit
            let xcenter : Double = Double(canvasLen / 2)
            let ycenter : Double = Double(canvasLen / 2)
            let rstop  : Double = outerPlanetYear * orbits
            let endIndex = Int(rstop / intervalDays)
            ForEach(0..<endIndex) { j in
                let a1Interval : Double = -2.0 * Double.pi * intervalDays / outerPlanetYear
                let a2Interval : Double = -2.0 * Double.pi * intervalDays / innerPlanetYear
                let a1 : Double = -1.0 * Double(j) * a1Interval
                let a2 : Double = -1.0 * Double(j) * a2Interval
                let i : Int = Int(round (Double(j) / 75.0))
                Path { path in
                    let x1 : Double = r1 * cos(a1) + xcenter
                    let y1 = r1 * sin(a1) + ycenter
                    let x2 = r2 * cos(a2) + xcenter
                    let y2 = r2 * sin(a2) + ycenter
                    path.move(to: CGPoint(x: x1, y: y1))
                    path.addLine(to: CGPoint(x: x2, y: y2))
                }.stroke(colorOfI(i: i))
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
