module handlers
  use gtk
  use cairo

contains
  subroutine draw_line(my_cairo_context, x0, y0, x1, y1)
    type(c_ptr), value, intent(in) :: my_cairo_context
    real(8), value :: x0, y0, x1, y1

    call cairo_move_to(my_cairo_context, x0, y0)
    call cairo_line_to(my_cairo_context, x1, y1)
    call cairo_stroke(my_cairo_context)
  end subroutine draw_line

  subroutine set_color(my_cairo_context, i)
    type(c_ptr), value, intent(in) :: my_cairo_context
    integer, value :: i

    select case (i)
    case (0)
       call cairo_set_source_rgb(my_cairo_context, 0d0, 0d0, 0d0)
       !r = 0d0; g = 0d0; b = 0d0
    case (1)
       call cairo_set_source_rgb(my_cairo_context, 0d0, 0d0, 1d0)
       !r = 0.0d0; g = 0.0d0; b = 1.0d0
    case (2)
       !r = 1.0d0; g = 0.0d0; b = 0.0d0
       call cairo_set_source_rgb(my_cairo_context, 1d0, 0d0, 1d0)
    case (3)
       !r = 0.0d0; g = 1.0d0; b = 0.0d0
       call cairo_set_source_rgb(my_cairo_context, 0d0, 1d0, 0d0)
    case (4)
       !r = 0.5d0; g = 0.0d0; b = 0.5d0
       call cairo_set_source_rgb(my_cairo_context, 0.5d0, 0d0, 0d0)
    case (5)
       !r = 0.5d0; g = 0.0d0; b = 0.0d0
       call cairo_set_source_rgb(my_cairo_context, 0.5d0, 0d0, 0d0)
    case (6)
       !r = 0.5d0; g = 0.0d0; b = 0.0d0
       call cairo_set_source_rgb(my_cairo_context, 0.5d0, 0d0, 0d0)
    case (7)
       !r = 0.0d0; g = 0.0d0; b = 0.5d0
       call cairo_set_source_rgb(my_cairo_context, 0d0, 0d0, 0.5d0)
    case (8)
       !r = 0.5d0; g = 0.0d0; b = 0.0d0
       call cairo_set_source_rgb(my_cairo_context, 0.5d0, 0d0, 0.0d0)
    case default
       !r = 1.0d0; g = 0.6d0; b = 0.0d0
       call cairo_set_source_rgb(my_cairo_context, 1d0, 0.6d0, 0d0)
    end select
  end subroutine set_color


  subroutine dance(my_cairo_context, canvas_len)
    type(c_ptr), value, intent(in) :: my_cairo_context
    integer, value :: canvas_len

    real(8), parameter :: pi = 3.1415926535897932384626d0
    real(8) :: xcenter, ycenter, x1, y1, x2, y2
    integer :: i
    real(8) :: r = 0.0d0, g = 0.0d0, b = 0.0d0

    ! outer_planet Earth
    ! inner_planet Venus
    orbits = 8.0

    outer_planet_year = 365.256
    inner_planet_year = 224.701
    outer_planet_radius = 149.60
    inner_planet_radius = 108.21
    interval_days = outer_planet_year / 75
    ycenter = canvas_len / 2
    xcenter = canvas_len / 2
    r1 = ycenter
    r2 = r1 * inner_planet_radius / outer_planet_radius
    r = 0.0
    a1 = 0.0
    a2 = 0.0
    rstop = outer_planet_year * orbits
    a1_interval = 2 * pi * interval_days / outer_planet_year
    a2_interval = 2 * pi * interval_days / inner_planet_year
    call cairo_set_line_width(my_cairo_context, 1d0)

    do while (r < rstop)
       i = r / (interval_days * 75)
       ! print *, i, r
       call set_color(my_cairo_context, i)
       a1 = a1 - a1_interval
       a2 = a2 - a2_interval
       x1 = r1 * cos(a1)
       y1 = r1 * sin(a1)
       x2 = r2 * cos(a2)
       y2 = r2 * sin(a2)

       call draw_line(my_cairo_context, xcenter + x1, ycenter + y1, xcenter + x2, ycenter + y2)
       r = r + interval_days
    end do
  end subroutine dance

  function expose_event(widget, my_cairo_context, gdata) result(ret) bind(c)
    type(c_ptr), value, intent(in) :: my_cairo_context
    call dance(my_cairo_context, 400)
    ret = FALSE
  end function expose_event
end module handlers

program hello
  use gtk
  use handlers

  type(c_ptr) :: my_window
  type(c_ptr) :: my_drawing_area
  integer :: canvas_len = 400

  call gtk_init()
  my_window = gtk_window_new(GTK_WINDOW_TOPLEVEL)
  call gtk_window_set_default_size(my_window, canvas_len, canvas_len)
  my_drawing_area = gtk_drawing_area_new()
  call gtk_container_add(my_window, my_drawing_area)
  call g_signal_connect (my_drawing_area, "draw"//c_null_char, c_funloc(expose_event))

  call gtk_widget_show_all(my_window)
  call gtk_main()
end program hello
