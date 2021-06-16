Gauche scheme: The dance of the Planets
=========================================

Setup
------

1. Install Gauche scheme.
   http://practical-scheme.net/gauche/download.html
2. install gtk2
3. Build Gauche-gtk2 and install it.
   https://github.com/shirok/Gauche-gtk2

    ```
    git clone https://github.com/shirok/Gauche-gtk2.git
    cd Gauche-gtk2/
    ./configure
    autoconf
    autoupdate
    make
    make stubs
    sudo make install
    ```

Run
-----

```
gosh dance.scm
```

----
Takashi Masuyama < mamewotoko@gmail.com >  
https://mamewo.ddo.jp/
