
if (Navigator.prototype.requestMIDIAccess === undefined) {

	MIDIPortType = {"input": 0, "output": 1};

	// MIDIPort
	function MIDIPort (port) {
		this.__binding = port;
		this.ondisconnect = new EventHandler ();
		
		Object.defineProperty (this, "id",
			{ get: function () { return this.__binding.id (); } });
		Object.defineProperty (this, "manufacturer",
			{ get: function () { return this.__binding.manufacturer (); } });
		Object.defineProperty (this, "name",
			{ get: function () { return this.__binding.name (); } });
		Object.defineProperty (this, "type",
			{ get: function () { return this.__binding.type () ? MIDIPortType.output : MIDIPortType.input; } });
		Object.defineProperty (this, "version",
			{ get: function () { return this.__binding.version (); } });
	};
	
	MIDIPort.prototype = Object.create (EventTarget.prototype);
	MIDIPort.prototype.constructor = MIDIPort;

	function MIDIInput (input) {
		this.__binding = input;
		MIDIPort.call (this, input);
		this.onmidimessage = new EventHandler ();
	}
	MIDIInput.prototype = Object.create (MIDIPort.prototype);
	MIDIInput.prototype.constructor = MIDIInput;

	function MIDIOutput (output) {
		this.__binding = output;
		MIDIPort.call (this, output);
	}
	MIDIOutput.prototype = Object.create (MIDIOutput.prototype);
	MIDIOutput.prototype.constructor = MIDIOutput;
	MIDIOutput.prototype.send = function (data, timestamp) {
		this.__binding.send (data, (timestamp !== undefined) ? timestamp : Performance,now ());
	};

	// MIDIInputMap and MIDIOutputMap

	function __WebMIDIMap (map, portInstantiator) {
		this.__binding = map;
		this.__port_instantiator = portInstantiator;
	}
	
	__WebMIDIMap.prototype.has = function (key) {
		return this.__binding.has (key);
	};
	
	__WebMIDIMap.prototype.get = function (key) {
		return this.__port_instantiator (this.__binding.get (key));
	};
	
	__WebMIDIMap.prototype.keys = function (key) {
		var keys = this.__binding.keys ();
		for (var i = 0; i < keys.size (); i++)
			key (keys.get (i));
	};
	
	__WebMIDIMap.prototype.entries = function (pair) {
		this.keys (function (key) {
			pair ([key, this.get (key)]);
		});
	};
	
	__WebMIDIMap.prototype.values = function (val) {
		this.keys (function (key) {
			val (this.get (key));
		});
	};

	function MIDIInputMap (binding)
	{
		__WebMIDIMap.call (this, binding.inputs (), function (p) { return new MIDIInput (p); });
	}
	MIDIInputMap.prototype = Object.create (__WebMIDIMap.prototype);
	MIDIInputMap.prototype.constructor = MIDIInputMap;
	
	function MIDIOutputMap (binding)
	{
		__WebMIDIMap.call (this, binding.outputs (), function (p) { return new MIDIOutput (p); });
	}
	MIDIOutputMap.prototype = Object.create (__WebMIDIMap.prototype);
	MIDIOutputMap.prototype.constructor = MIDIOutputMap;

	// MIDIOptions and MIDIAccess

	function MIDIOptions () {}

	function MIDIConnectionEvent () {}
	MIDIConnectionEvent.prototype = new Event ("MIDIConnectionEvent");

	function MIDIAccess (options)
	{
		this.__options = options;

		var plugin = document.createElement ("object");
		plugin.setAttribute ("type", "application/RtWebMidi");
		plugin.setAttribute ("width", "0");
		plugin.setAttribute ("height", "0");
		// TODO: find any other way that we don't have to inject the document...
		document.documentElement.appendChild (plugin);
		
		Object.defineProperty (this, "sysExEnabled",
			{ get: function () { return options != null && options.sysex == true; } });
		var binding = plugin.WebMidiAccess ();
		binding.setSysexEnabled (this.sysExEnabled);
		var inputMap = new MIDIInputMap (binding);
		Object.defineProperty (this, "inputs",
			{ get: function () { return inputMap; } });
		var outputMap = new MIDIOutputMap (binding);
		Object.defineProperty (this, "outputs",
			{ get: function () { return outputMap; } });

		var onConnectionEvent = function (access, port, name) {
			var evt = document.createEvent ("Event");
			evt.initEvent (name, true, true);
			evt.port = port;
			access.dispatchEvent (evt);
		}
		var waitConnectionSingle = function (func, waiter, name) {
			var newPort = waiter ();
			onConnectionEvent (access, newPort, name);
			waitConnectionSingle (func, waiter, name);
		}
		// FIXME: It cannot be like this. Promise runs on the same thread, so it cannot block.
		new Promise (function (resolver) { waitConnectionSingle (resolver, function () { return binding.waitConnection (); }, "connect"); });
		new Promise (function (resolver) { waitConnectionSingle (resolver, function () { return binding.waitDisconnection (); }, "disconnect"); });
	}
	
	MIDIAccess.prototype = Object.create (EventTarget.prototype);
	MIDIAccess.prototype.constructor = MIDIAccess;

	// Navigator

	Navigator.prototype.requestMIDIAccess = function (options) {
		return new Promise (function (resolver) {
			var access = new MIDIAccess (options);
			resolver (access);
			});
	};
	
	if (navigator.requestMIDIAccess === undefined)
		navigator.requestMIDIAccess = Navigator.prototype.requestMIDIAccess;
}
