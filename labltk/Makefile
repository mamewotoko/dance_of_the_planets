OCAMLMAKEFILE=OCamlMakefile

SOURCES=src/dance.ml
TARGET=dance

OPTS=RESULT=$(TARGET) SOURCES=$(SOURCES) PACKS=labltk,unix

all: $(TARGET)

$(TARGET): $(SOURCES)
	make -f $(OCAMLMAKEFILE) $(OPTS) nc

clean:
	make -f $(OCAMLMAKEFILE) $(OPTS) clean
