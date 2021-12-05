ipycanvas: Dance of the Planets
======================================

[![Open In Colab](https://colab.research.google.com/assets/colab-badge.svg)](https://colab.research.google.com/github/mamewotoko/dance_of_the_planets/blob/master/ipycanvas/DanceOfThePlanets.ipynb)

![](./image/ipy_dance.png)

Method1: Run in docker container
-----------------------------------

1. Install docker and docker-compose
2. Run Jupyter Notebook container

    ```
    docker-compose up -d
    ```
3. Check token to login to Jupyter Notebook

    ```
    docker-compose logs -f
    ```
2. access to Jupyter Notebook
   * Browse <http://127.0.0.1:8888/notebooks/work/DanceOfThePlantes.ipynb>
   * enter token to login
3. Run cells


Method2: Run with VS code
-------------------------

1. Open `DanceOfThePlanets.ipynb` with VS code
2. Install ipykernel
3. Enable jupyter widget setting of VS code.
   Select menu, Codes > Preferences.
   Search with keywords `widget jupyter`, then add `Widget Script Sources`.
   ![](image/jupyter_widget.png)
4. Run `DanceOfThePlanets.ipynb` by pressing `Shift-Enter`.
   ![](image/vscode_result.png)

--------
Takashi Masuyama < mamewotoko@gamil.com >
https://mamewo.ddo.jp/
