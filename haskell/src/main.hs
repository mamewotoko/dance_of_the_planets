{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE TypeFamilies #-}
module Main where

import Codec.Picture
-- import Debug.Trace
import Graphics.Rasterific
import Graphics.Rasterific.Texture


data Planet = Mercury | Venus | Earth | Mars | Jupiter | Saturn | Uranus | Neptune | Pluto
  deriving (Enum, Show)

yearOfPlanet :: Planet -> Float
yearOfPlanet planet =
  case planet of
    Mercury -> 87.969
    Venus -> 224.701
    Earth -> 365.256
    Mars -> 686.980
    Jupiter -> 4432.6
    Saturn -> 10759.2
    Uranus -> 30685.0
    Neptune -> 60190.0
    Pluto -> 90465.0

orbitOfPlanet :: Planet -> Float
orbitOfPlanet planet =
  case planet of
    Mercury -> 57.91
    Venus -> 108.21
    Earth -> 149.60
    Mars -> 227.92
    Jupiter -> 778.57
    Saturn -> 1433.5
    Uranus -> 2872.46
    Neptune -> 4495.1
    Pluto -> 5869.7

white :: PixelRGBA8
white = PixelRGBA8 255 255 255 255

black :: PixelRGBA8
black = PixelRGBA8 0 0 0 255

blue :: PixelRGBA8
blue = PixelRGBA8 0 0 255 255

red :: PixelRGBA8
red = PixelRGBA8 255 0 0 255

green :: PixelRGBA8
green = PixelRGBA8 0 255 0 255

purple :: PixelRGBA8
purple = PixelRGBA8 128 0 128 255

maroon :: PixelRGBA8
maroon = PixelRGBA8 128 0 0 255

navy :: PixelRGBA8
navy = PixelRGBA8 32 47 85 255

darkred :: PixelRGBA8
darkred = PixelRGBA8 139 0 0 255

orange :: PixelRGBA8
orange = PixelRGBA8 255 165 0 255

colorOfI :: (Eq a, Num a) => a -> PixelRGBA8
colorOfI 0 = black
colorOfI 1 = blue
colorOfI 2 = red
colorOfI 3 = green
colorOfI 4 = purple
colorOfI 5 = maroon
colorOfI 6 = navy
colorOfI 7 = darkred
colorOfI _ = orange

drawDance :: Planet -> Planet -> Int -> IO ()
drawDance innerPlanet outerPlanet orbits =
  writePng "dop.png" image
  where
    image =
      renderDrawing 400 400 white $ do
      mapM_ oneLine $
        takeWhile (\n -> (n * intervalDays) < (outerPlanetYear * (fromIntegral orbits))) [0..]

    oneLine n =
      withTexture (uniformTexture c) $
      stroke 1 (JoinMiter 0) (CapStraight 0, CapStraight 0) $
      -- trace ("x1: " ++ show x1 ++ " r1: " ++ show r1 ++ " x2: " ++ show x2 ++ " r2: " ++ show r2) $
      line (V2 x1 y1) (V2 x2 y2)
      where
        x1 = r1 * (cos a1) + xcenter
        y1 = r1 * (sin a1) + ycenter
        x2 = r2 * (cos a2) + xcenter
        y2 = r2 * (sin a2) + ycenter
        xcenter = canvasLen / 2
        ycenter = canvasLen / 2
        c = colorOfI i
        i :: Int
        i = round (r / intervalDays / 75.0)
        r = intervalDays * n
        r2 = r1 * innerPlanetRadius / outerPlanetRadius
        r1 = canvasLen / 2
        innerPlanetRadius = orbitOfPlanet innerPlanet
        outerPlanetRadius = orbitOfPlanet outerPlanet
        a1 = -2.0 * n * pi * intervalDays / outerPlanetYear
        a2 = -2.0 * n * pi * intervalDays / innerPlanetYear

    intervalDays = outerPlanetYear / 75.0
    outerPlanetYear = yearOfPlanet outerPlanet
    innerPlanetYear = yearOfPlanet innerPlanet
    canvasLen = 400

main :: IO ()
main = do
  drawDance Venus Earth 8
