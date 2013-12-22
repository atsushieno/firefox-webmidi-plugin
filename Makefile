
all: xpi/RtWebMidi.xpi

xpi/RtWebMidi.xpi: xpi/plugins/libwebmidi.so
	cd xpi && ant xpi

xpi/plugins/libwebmidi.so: libwebmidi.so
	mkdir -p xpi/chrome
	mkdir -p xpi/plugins
	cd xpi/plugins && ln -s ../../libwebmidi.so .

libwebmidi.so: external/nixysa
	scons

external/nixysa:
	svn checkout http://nixysa.googlecode.com/svn/trunk/ nixysa
	mv nixysa external/

