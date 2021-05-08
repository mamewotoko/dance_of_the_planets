using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

// dotnet new winforms

namespace forms
{

    public partial class DanceForm : Form
    {
        enum Planet
        {
            Mercury,
            Venus,
            Earth,
            Mars,
            Jupiter,
            Saturn,
            Uranus,
            Neptune,
            Pluto
        }

        private double year(Planet p){
            switch(p){
                case Planet.Mercury:
                    return 87.969;
                case Planet.Venus:
                    return 224.701;
                case Planet.Earth:
                    return 365.256;
                case Planet.Mars:
                    return 686.980;
                case Planet.Jupiter:
                    return 4332.6;
                case Planet.Saturn:
                    return 10759.2;
                case Planet.Uranus:
                    return 30685.0;
                case Planet.Neptune:
                    return 60190.0;
                case Planet.Pluto:
                    return 90465.0;
                default:
                    throw new Exception("Unknown planet");
            }
        }

        private double orbit(Planet p){
            switch(p){
                case Planet.Mercury:
                    return 57.91;
                case Planet.Venus:
                    return 108.21;
                case Planet.Earth:
                    return 149.60;
                case Planet.Mars:
                    return 227.92;
                case Planet.Jupiter:
                    return 778.57;
                case Planet.Saturn:
                    return 1433.5;
                case Planet.Uranus:
                    return 2872.46;
                case Planet.Neptune:
                    return 4495.1;
                case Planet.Pluto:
                    return 5869.7;
                default:
                    throw new Exception("Unknown planet");
            }
        }

        Color orbitColor(int i){
            if(i == 0){
                return Color.Black;
            }
            else if(i == 1){
                return Color.Blue;
            }
            else if(i == 2){
                return Color.Red;
            }
            else if(i == 3){
                return Color.Green;
            }
            else if(i == 4){
                return Color.FromArgb(128, 0, 128);
            }
            else if(i == 5){
                return Color.FromArgb(128, 0, 0);
            }
            else if(i == 6){
                return Color.FromArgb(0, 0, 128);
            }
            else if(i == 7){
                return Color.FromArgb(139, 0, 0);
            }
            return Color.FromArgb(255, 165, 0);
        }

        protected override void OnPaint(PaintEventArgs e)
        {
            int canvasLen = 400;
            const Planet outerPlanet = Planet.Earth;
            const Planet innerPlanet = Planet.Venus;
            double orbits = 8.0;
            double outerPlanetYear = year(outerPlanet);
            double innerPlanetYear = year(innerPlanet);
            double outerPlanetRadius = orbit(outerPlanet);
            double innerPlanetRadius = orbit(innerPlanet);
            double intervalDays = outerPlanetYear /  75.0;
            int xcenter = canvasLen / 2;
            int ycenter = canvasLen / 2;
            double r1 = ycenter;
            double r2 = r1 * innerPlanetRadius / outerPlanetRadius;
            var r = 0.0;
            double rstop = outerPlanetYear * orbits;
            var a1 = 0.0;
            double a1Interval = 2.0 * Math.PI * intervalDays / outerPlanetYear;
            var a2 = 0.0;
            double a2Interval = 2.0 * Math.PI * intervalDays / innerPlanetYear;

            // Graphics オブジェクトを取得
            Graphics g = e.Graphics;

            while(r < rstop){
                int i = (int)Math.Floor(r / intervalDays / 75.0);
                Color c = orbitColor(i);
                a1 = a1 - a1Interval;
                a2 = a2 - a2Interval;
                int x1 = (int)Math.Round(r1 * Math.Cos(a1)) + xcenter;
                int y1 = (int)Math.Round(r1 * Math.Sin(a1)) + ycenter;
                int x2 = (int)Math.Round(r2 * Math.Cos(a2)) + xcenter;
                int y2 = (int)Math.Round(r2 * Math.Sin(a2)) + ycenter;
                Pen pen = new Pen(c, 1);
                g.DrawLine(pen, x1, y1, x2, y2);
                r = r + intervalDays;
                pen.Dispose();
            }
        }
        public DanceForm()
        {
            InitializeComponent();
            this.Size = new Size(500, 500);
        }
    }
}
