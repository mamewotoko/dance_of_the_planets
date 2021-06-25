package com.mamewo;

import java.awt.BasicStroke;
import java.awt.Canvas;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Point;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.awt.event.MouseMotionListener;
import java.awt.image.BufferedImage;

import javax.swing.JFrame;
import javax.swing.JPanel;

public class Dance {
    static private int w = 400, h = 400;
    static private Color BLACK = new Color(0x00, 0x00, 0x00);
    static private Color BLUE = new Color(0x00,0x00,0xFF);
    static private Color RED = new Color(0xFF,0x00,0x00);
    static private Color GREEN = new Color(0x00,0xFF,0x00);
    static private Color PURPLE = new Color(0x80,0x00,0x80);
    static private Color MAROON = new Color(0x80,0x00,0x00);
    static private Color NAVY = new Color(0x8B,0x00,0x00);
    static private Color DARK_RED = new Color(0x8B,0x00,0x00);
    static private Color ORANGE = new Color(0xFF,0xA5,0x00);
        
    private enum Planet {
        Mercury,
        Venus,
        Earth,
        Mars,
        Jupiter,
        Saturn,
        Uranus,
        Neptune,
        Pluto
    };
    
    private static double year(Planet planet){
        switch(planet){
        case Mercury:
            return 87.969;
        case Venus:
            return 224.701;
        case Earth:
            return 365.256;
        case Mars:
            return 686.980;
        case Jupiter:
            return 4332.6;
        case Saturn:
            return 10759.2;
        case Uranus:
            return 30685.0;
        case Neptune:
            return 60190.0;
        case Pluto:
            return 90465.0;
        default:
            assert false;
        }
        return -1.0;
    }

    private static double orbit(Planet planet){
        switch(planet){
        case Mercury: return 57.91;
        case Venus: return 108.21;
        case Earth: return 149.60;
        case Mars: return 227.92;
        case Jupiter: return 778.57;
        case Saturn: return 1433.5;
        case Uranus: return 2872.46;
        case Neptune: return 4495.1;
        case Pluto: return 5869.7;
        default:
            assert false;
        }
        return -1.0;
    }

    public static void main(String[] args) {
        run();
    }

    public static void run() {
        final double orbits = 8.0;
        final int headerHeight = 30;
        // JFrameのインスタンスを生成
        JFrame frame = new JFrame("Dance of the planets");
        // ウィンドウを閉じたらプログラムを終了する
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        // ウィンドウのサイズ・初期位置
        frame.setSize(w, h + headerHeight);
        frame.setLocationRelativeTo(null);

        // PaintCanvasのインスタンスを生成
        PaintCanvas canvas = new PaintCanvas(Planet.Earth, Planet.Venus, orbits);

        // フレームに追加
        JPanel pane = new JPanel();
        frame.getContentPane().add(pane);

        canvas.setPreferredSize(new Dimension(w, h));
        pane.add(canvas);

        // ウィンドウを表示
        frame.setVisible(true);
    }

    // キャンバスクラス
    static class PaintCanvas extends Canvas
    {
        private final Planet outerPlanet_;
        private final Planet innerPlanet_;
        private final double orbits_;

        public PaintCanvas(Planet outerPlanet, Planet innerPlanet, double orbits) {
            // 座標を初期化
            outerPlanet_ = outerPlanet;
            innerPlanet_ = innerPlanet;
            orbits_ = orbits;

            // キャンバスの背景を白に設定
            setBackground(Color.white);

            // 描画
            repaint();
        }

        @Override
        public void paint(Graphics g) {
            Graphics2D g2d = (Graphics2D)g;
            final double outerPlanetYear = year(outerPlanet_);
            final double innerPlanetYear = year(innerPlanet_);
            final double outerPlanetRadius = orbit(outerPlanet_);
            final double innerPlanetRadius = orbit(innerPlanet_);
            final double intervalDays = outerPlanetYear / 75.0;
            final int ycenter = w / 2;
            final int xcenter = h / 2;
            final double r1 = ycenter;
            final double r2 = r1 * innerPlanetRadius / outerPlanetRadius;
            double r = 0.0;
            final double rstop = outerPlanetYear * orbits_;
            double a1 = 0.0;
            double a1Interval = 2.0 * Math.PI * intervalDays / outerPlanetYear;
            double a2 = 0.0;
            final double a2Interval = 2 * Math.PI * intervalDays / innerPlanetYear;
            final String outerPlanetName = outerPlanet_.toString();
            final String innerPlanetName = innerPlanet_.toString();

            while(r < rstop){
                int i = (int)(Math.floor (r / intervalDays / 75.0));
                Color color;
                if(i == 0){
                    color = BLACK;
                } else if(i == 1){
                    color = BLUE;
                } else if(i == 2){
                    color = RED;
                } else if(i == 3){
                    color = GREEN;
                } else if(i == 4){
                    color = PURPLE;
                } else if(i == 5){
                    color = MAROON;
                } else if(i == 6){
                    color = NAVY;
                } else if(i == 7){
                    color = DARK_RED;
                } else {
                    color = ORANGE;
                }
                a1 = a1 - a1Interval;
                a2 = a2 - a2Interval;
                final int x1 = (int)(r1 * Math.cos(a1));
                final int y1 = (int)(r1 * Math.sin(a1));
                final int x2 = (int)(r2 * Math.cos(a2));
                final int y2 = (int)(r2 * Math.sin(a2));
                g2d.setColor(color);
                g2d.drawLine(x1 + xcenter, y1 + ycenter, x2  + xcenter, y2 + ycenter);
                r = r + intervalDays;
            }
        }
    }
}
