(*
https://web.archive.org/web/20140122124421/http:/ensign.editme.com/t43dances

Usage:
opam install -y lablgtk

 *)

let canvas_len = 400

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
;;

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

let f_canvas_len = float_of_int (canvas_len / 2)

let pi = 4.0 *. atan 1.0

let black = "#000000"
let blue = "#0000FF"
let red = "#FF0000"
let green = "#00FF00"
let purple = "#800080"
let maroon = "#800000"
let navy = "#8B0000"
let dark_red = "#8B0000"
let orange = "#FFA500"

let draw_text ~group ~color ~x ~y ~text =
  ignore @@ GnoCanvas.text
              ~props:[`X (~-. f_canvas_len +. x); `Y (~-. f_canvas_len +. y);
                      `FILL_COLOR color;
                      `TEXT text;
                      `FONT "Sans 12";
                      `CLIP_WIDTH 50.; `CLIP_HEIGHT 55.;]
              group
;;
           
let draw_line group color from_x from_y to_x to_y =
  ignore @@ GnoCanvas.line
    ~props:[`POINTS [| from_x; from_y; to_x; to_y |];
    `FILL_COLOR color]
    group
;;

let main group outer_planet inner_planet orbits =
  let outer_planet_year = year outer_planet in
  let inner_planet_year = year inner_planet in
  let outer_planet_radius = orbit outer_planet in
  let inner_planet_radius = orbit inner_planet in
  let interval_days = outer_planet_year /. 75. in
  let ycenter = float_of_int (canvas_len / 2) in
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
  (* draw text *)
  let outer_planet_name = name outer_planet in
  let inner_planet_name = name inner_planet in
  let orbit_text = Printf.sprintf "%.0f orbits" orbits in
  begin
    (* TODO cannot draw *)
    draw_text ~group ~color:blue ~x:30. ~y:20. ~text:outer_planet_name;
    draw_text ~group ~color:blue ~x:30. ~y:40. ~text:inner_planet_name;
    draw_text ~group ~color:blue ~x:40. ~y:(float_of_int (canvas_len - 20)) ~text:orbit_text;
    while !r < rstop do
      let i = int_of_float (floor (!r /. interval_days /. 75.)) in
      let color = 
        if i = 0 then black
        else if i = 1 then blue
        else if i = 2 then red
        else if i = 3 then green
        else if i = 4 then purple
        else if i = 5 then maroon
        else if i = 6 then navy
        else if i = 7 then dark_red
        else orange in
      begin
        a1 := !a1 -. a1_interval;
        a2 := !a2 -. a2_interval;
        let x1 = r1 *. cos !a1 in
        let y1 = r1 *. sin !a1 in
        let x2 = r2 *. cos !a2 in
        let y2 = r2 *. sin !a2 in
        ignore @@ draw_line group color
                    x1 y1
                    x2 y2;
        r := !r +. interval_days;
      end;
    done;
  end
;;

let _ =
  ignore @@ GtkMain.Main.init ();
  let window = GWindow.window ~width:(canvas_len + 40) ~height:(canvas_len + 40)
                 ~title:"Dance of the Planets" () in
  ignore @@ window#connect#destroy ~callback:GMain.Main.quit;
  let canvas = GnoCanvas.canvas
                 ~width:canvas_len
                 ~height:canvas_len
                 ~packing:window#add
                 ~show:true () in
  let group = canvas#root in
  ignore @@ GnoCanvas.rect ~props:[`X1 ~-.f_canvas_len; `Y1 ~-.f_canvas_len;
                                   `X2 f_canvas_len; `Y2 f_canvas_len;
                                   `FILL_COLOR "white"]
              group;
  main group Earth Venus 8.;
  (* window# *)
  window#show ();
  GtkMain.Main.main ();
;;
