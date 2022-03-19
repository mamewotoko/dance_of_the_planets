all: dance

dance: dance.f90
	gfortran dance.f90 -o dance $(shell pkg-config --cflags --libs gtk-3-fortran)

run: dance
	./dance

clean:
	rm dance
