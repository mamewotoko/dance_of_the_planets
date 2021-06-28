#!/usr/bin/env perl

use strict;
use warnings;
use utf8;
use GD::Simple;
use Math::Trig;
use POSIX;

my $canvas_len = 400;
my $pi = pi();

my $earth = { "year" => 365.256, "orbit" => 149.60 };
my $venus = { "year" => 224.701, "orbit" => 108.21 };


sub color_of_i($){
    my ($i) = @_;

    if($i == 0){
        return "#000000";
    } elsif($i == 1){
        return "#0000FF";
    } elsif($i == 2){
        return "#FF0000";
    } elsif($i == 3){
        return "#00FF00";
    } elsif($i == 4){
        return "#800080";
    } elsif($i == 5) {
        return "#800000";
    } elsif($i == 6) {
        return "#00008B";
    } elsif($i == 7) {
        return "#8B0000";
    } else {
        return "#FFA500";
    }
}


sub dance($$$$){
    my ($img, $outer_planet, $inner_planet, $orbits) = @_;
    my $interval_days = $outer_planet->{"year"} / 75.0;
    my $ycenter = $canvas_len / 2;
    my $xcenter = $ycenter;
    my $r1 = $ycenter;
    my $r2 = $r1 * $inner_planet->{"orbit"} / $outer_planet->{"orbit"};
    my $r = 0.0;
    my $a1 = 0.0;
    my $a2 = 0.0;
    my $a1_interval = 2 * pi * $interval_days / $outer_planet->{"year"};
    my $a2_interval = 2 * pi * $interval_days / $inner_planet->{"year"};
    my $rstop = $outer_planet->{"year"} * $orbits;

    my $color0 = $img->colorAllocate(0, 0, 0);
    my $color1 = $img->colorAllocate(0, 0, 0xFF);
    my $color2 = $img->colorAllocate(0xFF, 0, 0);
    my $color3 = $img->colorAllocate(0, 0xFF, 0);
    my $color4 = $img->colorAllocate(0x80, 0, 0x80);
    my $color5 = $img->colorAllocate(0x80, 0, 0);
    my $color6 = $img->colorAllocate(0, 0, 0x8B);
    my $color7 = $img->colorAllocate(0x8B, 0, 0);
    my $color_else = $img->colorAllocate(0xFF, 0xA5, 0);
    
    while($r < $rstop){
        my $i = POSIX::floor($r / $interval_days / 75.0);
        my $color = undef;
        if($i == 0){
            $color = $color0;
        } elsif($i == 1){
            $color = $color1;
        } elsif($i == 2){
            $color = $color2;
        } elsif($i == 3){
            $color = $color3;
        } elsif($i == 4){
            $color = $color4;
        } elsif($i == 5) {
            $color = $color5;
        } elsif($i == 6) {
            $color = $color6;
        } elsif($i == 7) {
            $color = $color7;
        } else {
            $color = $color_else;
        }
        
        $img->fgcolor($color);
        $a1 -= $a1_interval;
        $a2 -= $a2_interval;

        my $x1 = $r1 * cos($a1) + $xcenter;
        my $y1 = $r1 * sin($a1) + $ycenter;
        my $x2 = $r2 * cos($a2) + $xcenter;
        my $y2 = $r2 * sin($a2) + $ycenter;
        
        $img->moveTo($x1, $y1);
        $img->lineTo($x2, $y2);
        $r += $interval_days;
    }
}

# main
my $img = GD::Simple->new($canvas_len, $canvas_len);
dance($img, $earth, $venus, 8.0);
open(FH, ">result.png");
print FH $img->png;
close(FH);
