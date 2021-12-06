extern crate gdk;
extern crate gio;
extern crate gtk;
extern crate cairo;

use gio::prelude::*;
use gtk::prelude::*;

use std::env::args;

// gtk doc
// http://gtk-rs.org/docs/gtk/

fn color_of_i(i: i32) -> (f64, f64, f64) {
    match i {
        0 => { return (0.0, 0.0, 0.0); }
        1 => { return (0.0, 0.0, 1.0); }
        2 => { return (1.0, 0.0, 0.0); }
        3 => { return (0.0, 1.0, 0.0); }
        4 => { return (0x80 as f64/0xFF as f64, 0.0, 0x80 as f64/0xFF as f64); }
        5 => { return (0x80 as f64/0xFF as f64, 0.0, 0.0); }
        6 => { return (0.0, 0.0, 0x8B as f64/0xFF as f64); }
        7 => { return (0x8B as f64/0xFF as f64, 0.0, 0.0); }
        _ => { return (1.0, 0xA5 as f64/0xFF as f64, 0.0); }
    }
}

fn dance(cairo: &cairo::Context, orbits: f64){
    //TODO: get as argument
    let pi =  std::f64::consts::PI;
    let canvas_len = 400;
    //earth, venus
    let outer_planet_year = 365.256;
    let inner_planet_year = 224.701;
    let outer_planet_radius = 149.60;
    let inner_planet_radius = 108.21;
    let interval_days = outer_planet_year / 75.0;
    let ycenter = (canvas_len / 2) as f64;
    let xcenter = ycenter;
    let r1 = ycenter;
    let r2 = r1 * inner_planet_radius / outer_planet_radius;
    let mut r = 0.0;
    let rstop = outer_planet_year * orbits;
    let mut a1 = 0.0;
    let a1_interval = 2. * pi * interval_days / outer_planet_year;
    let mut a2 = 0.0;
    let a2_interval = 2. * pi * interval_days / inner_planet_year;

    //fill white background
    cairo.set_source_rgb(1.0, 1.0, 1.0);
    cairo.rectangle(0.0, 0.0, canvas_len as f64, canvas_len as f64);
    cairo.fill();

    while r < rstop {
        let i = (r / interval_days / 75.).floor() as i32;
        let color = color_of_i(i);
        //TODO: ???
        cairo.set_source_rgb(color.0, color.1, color.2);
        a1 -= a1_interval;
        a2 -= a2_interval;
        let x1 = r1 * a1.cos() + xcenter;
        let y1 = r1 * a1.sin() + ycenter;
        let x2 = r2 * a2.cos() + xcenter;
        let y2 = r2 * a2.sin() + ycenter;
        //draw line
        cairo.move_to(x1, y1);
        cairo.line_to(x2, y2);
        cairo.stroke();
        r += interval_days
    }
}

fn build_ui(application: &gtk::Application) {
    let canvas_len = 400;
    let window = gtk::ApplicationWindow::new(application);

    window.set_title("First GTK+ Program");
    window.set_border_width(10);
    window.set_position(gtk::WindowPosition::Center);
    window.set_default_size(canvas_len, canvas_len);
    let area = gtk::DrawingArea::new();
    area.set_size_request(400, 400);

    //    let button = gtk::Canvas
    window.add(&area);
    area.connect_draw(|_, cairo| {
        let orbits = 8.0;
        dance(cairo, orbits);
        Inhibit(false)
    });
    window.show_all();
}

fn main() {
    let application =
        gtk::Application::new(Some("com.github.mamewo.dance_of_the_plantes"), Default::default())
            .expect("Initialization failed...");

    application.connect_activate(|app| {
        build_ui(app);
    });

    application.run(&args().collect::<Vec<_>>());
}
