// Copyright 2013 Atsushi Eno
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include <string>
#include <vector>
#include "webmidi.h"
#include "external/rtmidi/RtMidi.h"
#include "external/rtmidi/RtError.h"

// =====================================================================
// WebMidiAccess
// =====================================================================

WebMidiAccess::WebMidiAccess ()
{
	_inputs = new WebMidiMap ();
	_inputs->findsOutput = false;
	_outputs = new WebMidiMap ();
	_outputs->findsOutput = true;
}

WebMidiAccess::~WebMidiAccess ()
{
	delete _inputs;
	delete _outputs;
}

WebMidiMap WebMidiAccess::inputs ()
{
	return _inputs;
}

WebMidiMap WebMidiAccess::outputs ()
{
	return _outputs;
}

void WebMidiAccess::onConnect (WebMidiPort port)
{
}

void WebMidiAccess::onDisconnect ()
{
}

bool WebMidiAccess::isSysexEnabled ()
{
	return _sysex_enabled;
}

void WebMidiAccess::setSysexEnabled (bool sysexEnabled)
{
	_sysex_enabled = sysexEnabled;
}

// =====================================================================
// WebMidiMap
// =====================================================================

WebMidiMap::WebMidiMap () 
{
}

int WebMidiMap::size ()
{
}

WebMidiPortDictionary WebMidiMap::entries ()
{
}

StringList WebMidiMap::keys ()
{
}

WebMidiPortList WebMidiMap::values ()
{
}

WebMidiPort WebMidiMap::get (std::string key)
{
}

bool WebMidiMap::has (std::string key)
{
}

// =====================================================================
// WebMidiPort
// =====================================================================

WebMidiPort::WebMidiPort ()
{
}

std::string WebMidiPort::id ()
{
}

std::string WebMidiPort::name ()
{
}

int WebMidiPort::type ()
{
}

std::string WebMidiPort::version ()
{
}

void WebMidiPort::onDisconnect ()
{
}

// =====================================================================
// WebMidiInput
// =====================================================================

WebMidiInput::WebMidiInput ()
{
}

void WebMidiInput::onMidiMessage (WebMidiMessage message)
{
}

// =====================================================================
// WebMidiOutput
// =====================================================================

WebMidiOutput::WebMidiOutput ()
{
}

void WebMidiOutput::send (UInt8Array data, double timestamp)
{
}

// =====================================================================
// WebMidiMessage
// =====================================================================



WebMidiMessage::WebMidiMessage ()
{
}

double WebMidiMessage::receivedTime ()
{
}

UInt8Array WebMidiMessage::data ()
{
}
