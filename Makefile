

all: xpi/RtWebMidi.xpi

xpi/RtWebMidi.xpi: build_plugin_lib xpi/plugins/libwebmidi.so
	cd xpi && ant xpi

xpi/plugins/libwebmidi.so:
	mkdir -p xpi/chrome
	mkdir -p xpi/plugins
	cd xpi/plugins && ln -s ../../libwebmidi.so .

.PHONY:
build_plugin_lib: external/nixysa libwebmidi.so

libwebmidi.so: *.cc *.h *.idl
	scons

external/nixysa:
	svn checkout http://nixysa.googlecode.com/svn/trunk/ nixysa
	mv nixysa external/

