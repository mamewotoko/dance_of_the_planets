// Base code: https://github.com/fsprojects/Avalonia.FuncUI/tree/master/src/Examples/Component%20Examples/Examples.DrawingApp
namespace fsharp_avalonia

open Avalonia
open Avalonia.Controls
open Avalonia.Controls.ApplicationLifetimes
open Avalonia.Controls.Shapes
open Avalonia.FuncUI.Hosts
open Avalonia.FuncUI.Types
open Avalonia.Layout
open Avalonia.Media
open Avalonia.Themes.Fluent
open Avalonia.FuncUI
open Avalonia.FuncUI.DSL
open System

[<AbstractClass; Sealed>]
type Views =

    static member colorOfI (i: int) =
        match i with
        | 0 -> Brushes.Black
        | 1 -> Brushes.Blue
        | 2 -> Brushes.Red
        | 3 -> Brushes.Green
        | 4 -> Brushes.Purple
        | 5 -> Brushes.DarkRed
        | 6 -> Brushes.DarkBlue
        | 7 -> Brushes.Pink
        | _ -> Brushes.Orange

    static member dance (canvasOutlet: IWritable<Canvas>, orbits: float) =
        //outer: Earth
        //inner: Venus
        let outerPlanetYear = 365.256 
        let innerPlanetYear = 224.701
        let outerPlanetRadius = 149.60 
        let innerPlanetRadius = 108.21
        let intervalDays = outerPlanetYear / 75.0
        //TODO: get canvas size
        let xcenter = 400.0 / 2.0
        let ycenter = 400.0 / 2.0
        let r1 = ycenter
        let r2 = r1 * innerPlanetRadius / outerPlanetRadius
        let mutable r = 0.0
        let rstop = outerPlanetYear * orbits
        let mutable a1 = 0.0
        let mutable a2 = 0.0
        let a1Interval = 2.0 * Math.PI * intervalDays / outerPlanetYear
        let a2Interval = 2.0 * Math.PI * intervalDays / innerPlanetYear

        // while loop
        while r < rstop do

            a1 <- a1 - a1Interval
            a2 <- a2 - a2Interval
            let i = Math.Floor(r / intervalDays / 75.0) |> Convert.ToInt32
            let x1 = Math.Round(r1 * Math.Cos(a1)) + xcenter
            let y1 = Math.Round(r1 * Math.Sin(a1)) + ycenter
            let x2 = Math.Round(r2 * Math.Cos(a2)) + xcenter
            let y2 = Math.Round(r2 * Math.Sin(a2)) + ycenter
            let line = Line(
                StartPoint = Point(x1, y1),
                EndPoint = Point(x2, y2),
                Stroke = Views.colorOfI(i)
            )
            canvasOutlet.Current.Children.Add line
            r <- r + intervalDays

    static member canvas () =
        Component.create ("canvas", fun ctx ->
            let canvasOutlet = ctx.useState (null, renderOnChange = false)
            ctx.attrs [
                Component.dock Dock.Top
            ]
            View.createWithOutlet canvasOutlet.Set Canvas.create [
                Canvas.verticalAlignment VerticalAlignment.Stretch
                Canvas.horizontalAlignment HorizontalAlignment.Stretch
                Canvas.background Brushes.White
                //TODO: call when canvas is rendered
                Canvas.onPointerEnter (fun _ ->
                    printfn "onPointerEnter"
                    Views.dance(canvasOutlet, 8.0)
                )
            ] :> IView
        )
    static member main () =
        Component (fun ctx ->
            DockPanel.create [
                DockPanel.lastChildFill true
                DockPanel.background Brushes.White
                DockPanel.children [
                    Views.canvas ()
                ]
            ]
        )

type MainWindow() as this =
    inherit HostWindow()
    do
        base.Title <- "Drawing App"
        base.Width <- 400.0
        base.Height <- 400.0

        //this.VisualRoot.VisualRoot.Renderer.DrawFps <- true
        //this.VisualRoot.VisualRoot.Renderer.DrawDirtyRects <- true

        this.Content <- Views.main ()

type App() =
    inherit Application()

    override this.Initialize() =
        this.Styles.Add (FluentTheme(baseUri = null, Mode = FluentThemeMode.Light))

    override this.OnFrameworkInitializationCompleted() =
        match this.ApplicationLifetime with
        | :? IClassicDesktopStyleApplicationLifetime as desktopLifetime ->
            desktopLifetime.MainWindow <- MainWindow()
        | _ -> ()

module Program =

    [<EntryPoint>]
    let main(args: string[]) =
        AppBuilder
            .Configure<App>()
            .UsePlatformDetect()
            .UseSkia()
            .StartWithClassicDesktopLifetime(args)