(*
https://web.archive.org/web/20140122124421/http:/ensign.editme.com/t43dances

Usage:
opam install -y graphics

ocaml
#load "graphics.cma"
#use "dance.ml";;
 *)

open Graphics

let year i =
  if i = 1 then 87.969
  else if i = 2 then 224.701
  else if i = 3 then 365.256
  else if i = 4 then 686.980
  else if i = 5 then 4332.6
  else if i = 6 then 10759.2
  else if i = 7 then 30685.
  else if i = 8 then 60190.
  else if i = 9 then 90465.
  else 0.
;;

let orbit i =
  if i=1 then 57.91
  else if i=2 then 108.21
  else if i=3 then 149.60
  else if i=4 then 227.92
  else if i=5 then 778.57
  else if i=6 then 1433.5
  else if i=7 then 2872.46
  else if i=8 then 4495.1
  else if i=9 then 5869.7
  else 0.
;;

let name i = 
  if i = 1 then "Mercury"
  else if i = 2 then "Venus"
  else if i = 3 then "Earth"
  else if i = 4 then "Mars"
  else if i = 5 then "Jupiter"
  else if i = 6 then "Saturn"
  else if i = 7 then "Uranus"
  else if i = 8 then "Neptune"
  else if i = 9 then "Pluto"
  else "yyy"
;;

(* let draw_caption outer_planet inner_planet orbits =
 *   let outer_planet_name = name outer_planet in
 *   let inner_planet_name = name inner_planet in
 *   let orbit_text = Printf.sprintf "%.0f" orbits in
 *   draw_text 10 10 *)

let main () =
  let pi = 4.0 *. atan 1.0 in
  let canvas_len = 400 in
  let outer_planet = 3 in
  let inner_planet = 2 in
  (* number of outer rotations *)
  let orbits = 8. in
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
  let rec interactive () =
    let event = Graphics.wait_next_event [Graphics.Key_pressed] in
    if event.key == 'q' then exit 0
    else interactive () in
  begin
    Graphics.open_graph (Printf.sprintf " %dx%d" canvas_len canvas_len);
    (* draw text *)
    let outer_planet_name = name outer_planet in
    let inner_planet_name = name inner_planet in
    let orbit_text = Printf.sprintf "%.0f orbits" orbits in
    set_color Graphics.blue;
    Graphics.moveto 10 (canvas_len - 20 - 5);
    Graphics.draw_string outer_planet_name;
    Graphics.moveto 10 (canvas_len - 40 - 5);
    Graphics.draw_string inner_planet_name;
    Graphics.moveto 10 20;
    Graphics.draw_string orbit_text;
    while !r < rstop do
      let i = int_of_float (floor (!r /. interval_days /. 75.)) in
      let c = 
        if i = 0 then Graphics.black
        else if i = 1 then Graphics.blue
        else if i = 2 then Graphics.red
        else if i = 3 then Graphics.green
        else if i = 4 then Graphics.rgb 128 0 128 (* purple *)
        else if i = 5 then Graphics.rgb 128 0 0   (* maroon *)
        else if i = 6 then Graphics.rgb 0 0 128   (* navy *)
        else if i = 7 then Graphics.rgb 139 0 0   (* darkred *)
        else Graphics.rgb 255 165 0 in (* orange *)
      begin
        a1 := !a1 -. a1_interval;
        a2 := !a2 -. a2_interval;
        let x1 = r1 *. cos !a1 in
        let y1 = r1 *. sin !a1 in
        let x2 = r2 *. cos !a2 in
        let y2 = r2 *. sin !a2 in
        Graphics.set_color c;
        Graphics.moveto (int_of_float (x1 +. xcenter)) (int_of_float (~-. y1 +. ycenter));
        Graphics.lineto (int_of_float (x2 +. xcenter)) (int_of_float (~-. y2 +. ycenter));
        r := !r +. interval_days;
      end
    done;
    interactive ()
  end
;;

let _ = main ()
