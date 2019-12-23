OCAMLMAKEFILE=OCamlMakefile

TARGET=dance
OPTS = RESULT=$(TARGET) SOURCES=src/dance.ml LIBS=graphics

all: $(TARGET)

$(TARGET): $(SOURCES)
	make -f $(OCAMLMAKEFILE) $(OPTS) nc

clean:
	make -f $(OCAMLMAKEFILE) $(OPTS) clean
