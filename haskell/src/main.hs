{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE TypeFamilies #-}
module Main where

import Codec.Picture
import Graphics.Rasterific
import Graphics.Rasterific.Texture

drawTriangles :: IO ()
drawTriangles =
  writePng "triangle.png" image
  where
    image =
      renderDrawing 400 400 black $ do
      mapM_ drawTriangle [(white, triangle), (red, triangle2), (green, triangle3)]

    drawTriangle (color, path) =
      withTexture (uniformTexture color) $ 
      stroke 2 (JoinMiter 0) (CapStraight 0, CapStraight 0) path

    triangle =
        Path (V2 200 50) True
          [ PathLineTo (V2 50 350)
          , PathLineTo (V2 350 350)
          ]

    triangle2 =
        Path (V2 200 0) True
          [ PathLineTo (V2 50 400)
          , PathLineTo (V2 350 400)
          ]

    triangle3 =
        Path (V2 0 200) True
          [ PathLineTo (V2 400 50)
          , PathLineTo (V2 400 350)
          ]

    black = PixelRGBA8 0 0 0 255

    white = PixelRGBA8 255 255 255 255

    red = PixelRGBA8 255 0 0 255

    green = PixelRGBA8 0 0 255 255

main :: IO ()
main = do
  drawTriangles
