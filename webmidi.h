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

#ifndef WEBMIDI_H
#define WEBMIDI_H

#include <string>
#include <vector>
#include <map>

class UInt8Array : public std::vector<char> {
  public:
	UInt8Array ();
};
class StringList : public std::vector<std::string> {
  public:
	StringList ();
};

class WebMidiMessage {
  public:
	WebMidiMessage ();
	double receivedTime ();
	UInt8Array data ();
};

class WebMidiPort {
  public:
	WebMidiPort ();
	std::string id ();
	std::string name ();
	int type ();
	std::string version ();
	void onDisconnect ();
};

class WebMidiOutput : public WebMidiPort {
  public:
	WebMidiOutput ();
	void send (UInt8Array data, double timestamp);
};

class WebMidiInput : public WebMidiPort {
  public:
	WebMidiInput ();
	void onMidiMessage (WebMidiMessage message);
};

class WebMidiPortDictionary : public std::map<std::string,WebMidiPort> {
  public:
	WebMidiPortDictionary ();
};
class WebMidiPortList : public std::vector<WebMidiPort> {
  public:
	WebMidiPortList ();
};

class WebMidiMap {
  public:
	WebMidiMap ();
	int size ();
	WebMidiPortDictionary entries ();
	StringList keys ();
	WebMidiPortList values ();
	WebMidiPort get (std::string key);
	bool has (std::string key);
	
	bool findsOutput;
};

class WebMidiAccess {
  public:
	WebMidiAccess ();
	~WebMidiAccess ();
	WebMidiMap inputs ();
	WebMidiMap outputs ();
	void onConnect (WebMidiPort port);
	void onDisconnect ();
	bool isSysexEnabled ();
	void setSysexEnabled (bool requireSysex);

  private:
	WebMidiMap *_inputs;
	WebMidiMap *_outputs;
	bool _sysex_enabled;
};

#endif  // WEBMIDI_H
