/*global $ MIDI $SCRIPT_ROOT createNoteParticle */
var sat_data,
    notes = [],
    piano_minor = [0, 3, 7, 12, 15, 19, 24, 27, 31, 36, 39, 43, 48, 51, 55, 60, 63, 67, 72, 75, 79, 84, 87],
    note_delay = 250,
    // scales = {'minor': [0,2,3,5,7,8,10,12]},
    scales = {'natural major': [0,2,4,5,7,9,11,12],'ionian': [0,2,4,5,7,9,11,12],'major': [0,2,4,5,7,9,11,12],'chromatic': [0,1,2,3,4,5,6,7,8,9,10,11,12],'spanish 8 tone': [0,1,3,4,5,6,8,10,12],'flamenco': [0,1,3,4,5,7,8,10,12],'symmetrical': [0,1,3,4,6,7,9,10,12],'inverted diminished': [0,1,3,4,6,7,9,10,12],'diminished': [0,2,3,5,6,8,9,11,12],'whole tone': [0,2,4,6,8,10,12],'augmented': [0,3,4,7,8,11,12],'3 semitone': [0,3,6,9,12],'4 semitone': [0,4,8,12],'locrian ultra': [0,1,3,4,6,8,9,12],'locrian super': [0,1,3,4,6,8,10,12],'indian': [0,1,3,4,7,8,10,12],'locrian': [0,1,3,5,6,8,10,12],'phrygian': [0,1,3,5,7,8,10,12],'neapolitan minor': [0,1,3,5,7,8,11,12],'javanese': [0,1,3,5,7,9,10,12],'neapolitan major': [0,1,3,5,7,9,11,12],'todi': [0,1,3,6,7,8,11,12],'persian': [0,1,4,5,6,8,11,12],'oriental': [0,1,4,5,6,9,10,12],'phrygian major': [0,1,4,5,7,8,10,12],'spanish': [0,1,4,5,7,8,10,12],'jewish': [0,1,4,5,7,8,10,12],'double harmonic': [0,1,4,5,7,8,11,12],'gypsy': [0,1,4,5,7,8,11,12],'byzantine': [0,1,4,5,7,8,11,12],'chahargah': [0,1,4,5,7,8,11,12],'marva': [0,1,4,6,7,9,11,12],'enigmatic': [0,1,4,6,8,10,11,12],'locrian natural': [0,2,3,5,6,8,10,12],'natural minor': [0,2,3,5,7,8,10,12],'minor': [0,2,3,5,7,8,10,12],'melodic minor': [0,2,3,5,7,9,11,12],'aeolian': [0,2,3,5,7,8,10,12],'algerian 2': [0,2,3,5,7,8,10,12],'hungarian minor': [0,2,3,6,7,8,11,12],'algerian': [0,2,3,6,7,8,11,12],'algerian 1': [0,2,3,6,7,8,11,12],'harmonic minor': [0,2,3,5,7,8,11,12],'mohammedan': [0,2,3,5,7,8,11,12],'dorian': [0,2,3,5,7,9,10,12],'hungarian gypsy': [0,2,3,6,7,8,11,12],'romanian': [0,2,3,6,7,9,10,12],'locrian major': [0,2,4,5,6,8,10,12],'arabian': [0,1,4,5,7,8,11,12],'hindu': [0,2,4,5,7,8,10,12],'ethiopian': [0,2,4,5,7,8,11,12],'mixolydian': [0,2,4,5,7,9,10,12],'mixolydian augmented': [0,2,4,5,8,9,10,12],'harmonic major': [0,2,4,5,8,9,11,12],'lydian minor': [0,2,4,6,7,8,10,12],'lydian dominant': [0,2,4,6,7,9,10,12],'overtone': [0,2,4,6,7,9,10,12],'lydian': [0,2,4,6,7,9,11,12],'lydian augmented': [0,2,4,6,8,9,10,12],'leading whole tone': [0,2,4,6,8,10,11,12],'blues': [0,3,5,6,7,10,12],'hungarian major': [0,3,4,6,7,9,10,12],'pb': [0,1,3,6,8,12],'balinese': [0,1,3,7,8,12],'pe': [0,1,3,7,8,12],'pelog': [0,1,3,7,10,12],'iwato': [0,1,5,6,10,12],'japanese': [0,1,5,7,8,12],'kumoi': [0,1,5,7,8,12],'hirajoshi': [0,2,3,7,8,12],'pa': [0,2,3,7,8,12],'pd': [0,2,3,7,9,12],'pentatonic major': [0,2,4,7,9,12],'chinese': [0,2,4,7,9,12],'chinese 1': [0,2,4,7,9,12],'mongolian': [0,2,4,7,9,12],'pfcg': [0,2,4,7,9,12],'egyptian': [0,2,3,6,7,8,11,12],'pentatonic minor': [0,3,5,7,10,12],'chinese 2': [0,4,6,7,11,12],'altered': [0,1,3,4,6,8,10,12],'bebop dominant': [0,2,4,5,7,9,10,11,12],'bebop dominant flatnine': [0,1,4,5,7,9,10,11,12],'bebop major': [0,2,4,5,7,8,9,11,12],'bebop minor': [0,2,3,5,7,8,9,10,12],'bebop tonic minor': [0,2,3,5,7,8,9,11,12]},
    instruments = [],
    current_note = 0;

var getRandomNote = function(scale_arr) {
    var note = randomChoice(scale_arr) + 12 * getRandomArbitary(0, 7);
};

function debug() {
    window.console && console.log && console.log.apply(console, arguments);
}

function getRandomArbitary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

var playNoteAt = function(n) {
    var note_data;
    var note_instrument;
    var velocity;
    var value;

    $.each(notes, function(i, e) {
        note_data = e[0];
        note_instrument = e[1];
        velocity = getRandomArbitary(30, 127);
        value = note_data[n];
        if (!MIDI.GeneralMIDI.byName[note_instrument]) {
            return -1;
        }
        MIDI.programChange(0, MIDI.GeneralMIDI.byName[note_instrument].number);
        createNoteParticle(value, velocity, 1.1);
        MIDI.noteOn(0, value, velocity);
    });
};

var playMusic = function () {
    playNoteAt(current_note);
    current_note = (current_note + 1) % 16;
    setTimeout(playMusic, note_delay);
};

var fetchSatellites = function() {
    var rhythm = $('#rhythm').val();
    if (rhythm) {
        return;
    }
    var $location_form = $('#location_form'),
        lat = $location_form.data('lat'),
        lng = $location_form.data('lng');
    $.get($SCRIPT_ROOT + '/ajax/satellites',
          {lat: lat,
           lng: lng},
          function(data) {
              sat_data = data;
              playSatellites();
          });
    setTimeout(fetchSatellites, 1000);
};

var arrayOf = function(n, times) {
    return Array.apply(null, new Array(times)).map(Number.prototype.valueOf,n);
};

var randomChoice = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

var playSatellites = function() {
    notes = [];
    var $satellites = $('#satellites');
    $satellites.empty();
    var note_buckets = piano_minor.length - 1,
        note_bucket_width = (sat_data.max_velocity - sat_data.min_velocity) / note_buckets,
        tempo_buckets = 4,
        tempo_bucket_width = (sat_data.max_range - sat_data.min_range) / tempo_buckets;

    $.each(sat_data.satellites, function(i, sat) {
        var note_bucket = Math.floor((Math.abs(sat.velocity) - sat_data.min_velocity) / note_bucket_width) || 1,
            tempo_bucket = Math.floor((sat.range - sat_data.min_range) / tempo_bucket_width) || 1;
        var note;

        var instrument = randomChoice(instruments);
        var this_note = piano_minor[note_bucket]; // + getRandomArbitary(0, 87);
        if (Math.random() < 0.15) {
            instrument = randomChoice(instrument);
        }
        if (tempo_bucket == 4) {
            note = Array.apply(null, new Array(16)).map(Number.prototype.valueOf,this_note);
        } else if (tempo_bucket == 3) {
            note = [this_note, -1,this_note, -1,this_note, -1,this_note, -1,this_note, -1,this_note, -1,this_note, -1,this_note, -1];
        } else if (tempo_bucket == 2) {
            note = [this_note, -1,-1,-1,this_note, -1,-1,-1,this_note, -1,-1,-1,this_note, -1,-1,-1];
        } else if (tempo_bucket == 1) {
            note = [this_note, -1,-1, -1,-1, -1,-1, -1,this_note, -1,-1, -1,-1, -1, -1, -1];
        } else if (tempo_bucket == 0) {
            note = [this_note, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
        }
        if (Math.random() < 0.50) {
            var first_note = note.shift(1);
            note.push(first_note);
        }
        notes.push([note, instrument]);
        $satellites.append($('<li>', {text: sat.name}));
    });
};

function shuffle(array) {
    var tmp, current, top = array.length;

    if(top) while(--top) {
        current = Math.floor(Math.random() * (top + 1));
        tmp = array[current];
        array[current] = array[top];
        array[top] = tmp;
    }

    return array;
}

$(document).ready(function() {

    $.each(MIDI.GeneralMIDI.byName, function(k, v) {
        instruments.push(k);
    });
    instruments = shuffle(instruments).slice(0, 3);
    $.each(instruments, function(i, e) {
        var inst = MIDI.GeneralMIDI.byName[e];
        if (inst) {
            var instrumentname = inst.instrument;
            $('#instruments').append($('<li>', {'text': instrumentname}));
        } else {
            debug("cannot find instrument ", e);
        }
    });

    var full_scales = [];
    $.each(scales, function(scale_name, scale) {
        var note = 0,
            pos = 0,
            base = 0,
            full_scale = [],
            scale_length = scale.length;
        while (true) {
            note = base + scale[pos];
            if (note > 87) {
                break;
            }
            full_scale.push(note);
            pos = (pos + 1);
            if (pos == scale_length - 1) {
                base = base + 12;
                pos = 0;
            }
        }
        full_scales.push(full_scale);
    });
    piano_minor = shuffle(full_scales)[0];
    var rhythm = $('#rhythm').val();
    if (rhythm) {
        instruments = [];
        var rhythm_json = JSON.parse(rhythm);
        instruments.push(rhythm_json.instrument);
    }
    MIDI.loadPlugin({
        soundfontUrl: $SCRIPT_ROOT + "/static/midi-js-soundfonts/FluidR3_GM/",
        instruments: instruments,
        callback: function() {
            $('#play').html('\u25B6 Play');
            $('#play').removeClass('pure-button-disabled');
            $('#play').addClass('pure-button-primary');
            fetchSatellites();
            var updateRhythm = function() {
                try {
                    rhythm = $('#rhythm').val();
                    if (rhythm) {
                        var rhythm_json = JSON.parse(rhythm);
                        var new_sequence = [];
                        for (var key in rhythm_json.sequence) {
                            var value = rhythm_json.sequence[key];
                            if (value == "*") {
                                new_sequence.push(randomChoice(piano_minor));
                            } else if (rhythm_json.notes[value]) {
                                new_sequence.push(rhythm_json.notes[value]);
                            } else {
                                new_sequence.push(value);
                            }
                        }
                        notes = [[new_sequence, rhythm_json.instrument]];
                    }
                } catch (e) {
                }
                setTimeout(updateRhythm, 500);
            };
            updateRhythm();
        }
    });

    $('#play').click(function() {
        playMusic();
    });

});