OCAMLMAKEFILE=OCamlMakefile

SOURCES=src/dance.ml
TARGET=dance

OPTS=RESULT=$(TARGET) SOURCES=$(SOURCES) PACKS=lablgtk2,unix LIBS=lablgnomecanvas THREADS=t

all: $(TARGET)

$(TARGET): $(SOURCES)
	make -f $(OCAMLMAKEFILE) $(OPTS) nc

clean:
	make -f $(OCAMLMAKEFILE) $(OPTS) clean
