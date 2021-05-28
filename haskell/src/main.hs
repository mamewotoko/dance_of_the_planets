{-# LANGUAGE FlexibleContexts #-}
{-# LANGUAGE TypeFamilies #-}
module Main where

import Codec.Picture
import Graphics.Rasterific
import Graphics.Rasterific.Texture

drawTriangle :: IO ()
drawTriangle =
  writePng "triangle.png" image
  where
    image =
      renderDrawing 400 400 black $
      withTexture (uniformTexture white) $
      stroke 2 (JoinMiter 0)
      (CapStraight 0, CapStraight 0)
      triangle

    triangle =
        Path (V2 200 50) True
          [ PathLineTo (V2 50 350)
          , PathLineTo (V2 350 350)
          ]

    black = PixelRGBA8 0 0 0 255

    white = PixelRGBA8 255 255 255 255

main :: IO ()
main = do
  drawTriangle
