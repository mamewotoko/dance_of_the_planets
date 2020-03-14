(*
https://web.archive.org/web/20140122124421/http:/ensign.editme.com/t43dances
https://github.com/reasonml-community/bs-webapi-incubator/blob/master/tests/Webapi/Webapi__Canvas/Webapi__Canvas__Canvas2d__test.re

Usage:
npm i

 *)

open Webapi.Canvas
open Webapi

(* javascript *)
module CanvasGraphics = struct
  exception CanvasGraphicsException of string
  (* TODO: define color type *)
  let black = "#000000"
  let blue = "#0000FF"
  let red = "#FF0000"
  let green = "#00FF00"
  let purple = "#800080"
  let maroon = "#800000"
  let navy = "#8B0000"
  let dark_red = "8B0000"
  let orange = "#FFA500"

  let open_graph canvas_id =
    match Dom.Document.getElementById canvas_id Dom.document with
    | Some e ->
       (* e##setAttribute "width" (string_of_int width);
        * e##setAttribute "height" (string_of_int height); *)
       CanvasElement.getContext2d e
    | None ->
       (* elemnet not found *)
       raise Not_found

  let set_color context color =
    Canvas2d.setFillStyle context String color;
    Canvas2d.setStrokeStyle context String color
  (* TODO: private field *)

  let draw_string context x y str =
    Canvas2d.font context "12pt Osaka";
    context |> Canvas2d.fillText str ~x:(float_of_int x) ~y:(float_of_int y) ~maxWidth:50.

  let draw_line context from_x from_y x y =
    Canvas2d.lineWidth context 0.5;
    Canvas2d.beginPath context;
    context |> Canvas2d.moveTo ~x:(float_of_int from_x) ~y:(float_of_int from_y);
    context |> Canvas2d.lineTo ~x:(float_of_int x) ~y:(float_of_int y);
    Canvas2d.stroke context;
end
;;                

type planet_t =
  | Mercury
  | Venus
  | Earth
  | Mars
  | Jupiter
  | Saturn
  | Uranus
  | Neptune
  | Pluto

let year = function
  | Mercury -> 87.969
  | Venus -> 224.701
  | Earth -> 365.256
  | Mars -> 686.980
  | Jupiter -> 4332.6
  | Saturn -> 10759.2
  | Uranus -> 30685.
  | Neptune -> 60190.
  | Pluto -> 90465.
;;

let orbit = function
  | Mercury -> 57.91
  | Venus -> 108.21
  | Earth -> 149.60
  | Mars -> 227.92
  | Jupiter -> 778.57
  | Saturn -> 1433.5
  | Uranus -> 2872.46
  | Neptune -> 4495.1
  | Pluto -> 5869.7
;;

let name = function
  | Mercury -> "Mercury"
  | Venus -> "Venus"
  | Earth -> "Earth"
  | Mars -> "Mars"
  | Jupiter -> "Jupiter"
  | Saturn -> "Saturn"
  | Uranus -> "Uranus"
  | Neptune -> "Neptune"
  | Pluto -> "Pluto"
;;

(* let draw_caption outer_planet inner_planet orbits =
 *   let outer_planet_name = name outer_planet in
 *   let inner_planet_name = name inner_planet in
 *   let orbit_text = Printf.sprintf "%.0f" orbits in
 *   draw_text 10 10 *)

let dance context outer_planet inner_planet orbits =
  let pi = 4.0 *. atan 1.0 in
  (* constant... *)
  let canvas_len = 400 in
  (* number of outer rotations *)
  let outer_planet_year = year outer_planet in
  let inner_planet_year = year inner_planet in
  let outer_planet_radius = orbit outer_planet in
  let inner_planet_radius = orbit inner_planet in
  let interval_days = outer_planet_year /. 75. in
  let ycenter = float_of_int (canvas_len / 2) in
  let xcenter = float_of_int (canvas_len / 2) in
  (* outer radius *)
  let r1 = ycenter in 
  let r2 = r1 *. inner_planet_radius /. outer_planet_radius in
  let r = ref 0. in
  let rstop = outer_planet_year *. orbits in
  let a1 = ref 0. in
  let a1_interval = 2. *. pi *. interval_days /. outer_planet_year in
  let a2 = ref 0. in
  let a2_interval = 2. *. pi *. interval_days /. inner_planet_year in
  (* wait until q key is pressed*)
  let outer_planet_name = name outer_planet in
  let inner_planet_name = name inner_planet in
  let orbit_text = Printf.sprintf "%.0f orbits" orbits in
  begin
    (* draw text *)
    CanvasGraphics.set_color context CanvasGraphics.blue;
    CanvasGraphics.draw_string context 10 (20 + 5) outer_planet_name;
    CanvasGraphics.draw_string context 10 (40 + 5) inner_planet_name;
    CanvasGraphics.draw_string context 10 (canvas_len - 20) orbit_text;
    while !r < rstop do
      let i = int_of_float (floor (!r /. interval_days /. 75.)) in
      let c = 
        if i = 0 then CanvasGraphics.black
        else if i = 1 then CanvasGraphics.blue
        else if i = 2 then CanvasGraphics.red
        else if i = 3 then CanvasGraphics.green
        else if i = 4 then CanvasGraphics.purple
        else if i = 5 then CanvasGraphics.maroon
        else if i = 6 then CanvasGraphics.navy
        else if i = 7 then CanvasGraphics.dark_red
        else CanvasGraphics.orange in
      begin
        a1 := !a1 -. a1_interval;
        a2 := !a2 -. a2_interval;
        let x1 = r1 *. cos !a1 in
        let y1 = r1 *. sin !a1 in
        let x2 = r2 *. cos !a2 in
        let y2 = r2 *. sin !a2 in
        CanvasGraphics.set_color context c;
        CanvasGraphics.draw_line context
          (int_of_float (x1 +. xcenter)) (int_of_float (y1 +. ycenter))
          (int_of_float (x2 +. xcenter)) (int_of_float (y2 +. ycenter));
        r := !r +. interval_days;
      end
    done;
  end
;;

let _ =
  let context = CanvasGraphics.open_graph "canvas1" in
  dance context Earth Venus 8.;
  let context = CanvasGraphics.open_graph "canvas2" in
  dance context Mars Venus 7.;
  let context = CanvasGraphics.open_graph "canvas3" in
  dance context Saturn Jupiter 7.;
  let context = CanvasGraphics.open_graph "canvas4" in
  dance context Uranus Saturn 7.;
  let context = CanvasGraphics.open_graph "canvas5" in
  dance context Jupiter Earth 7.;
  let context = CanvasGraphics.open_graph "canvas6" in
  dance context Mars Earth 7.;
  let context = CanvasGraphics.open_graph "canvas7" in
  dance context Earth Mercury 6.;
;;
