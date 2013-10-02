/*global $ MIDI $SCRIPT_ROOT */
var sat_data,
    notes = [],
    piano_minor = [0, 3, 7, 12, 15, 19, 24, 27, 31, 36, 39, 43, 48, 51, 55, 60, 63, 67, 72, 75, 79, 84, 87],
    drums = [36],
    instruments = [ "accordion", "acoustic_bass", "acoustic_grand_piano", "acoustic_guitar_nylon", "acoustic_guitar_steel", "agogo", "alto_sax", "applause", "bag_pipe", "banjo", "baritone_sax", "bassoon", "bird_tweet", "bright_acoustic_piano", "celesta", "cello", "choir_aahs", "church_organ", "clarinet", "clavichord", "contrabass", "drawbar_organ", "dulcimer", "electric_bass_fi", "electric_grand_piano", "electric_guitar_clean", "electric_guitar_muted", "electric_piano_1", "electric_piano_2", "english_horn", "fiddle", "french_horn", "fretless_bass", "fx_1_rain", "fx_2_soundtrack", "fx_3_crystal", "fx_4_atmosphere", "fx_5_brightness", "fx_6_goblins", "fx_7_echoes", "fx_8_scifi", "glockenspiel", "guitar_fret_noise", "guitar_harmonics", "gunshot", "harmonica", "harpsichord", "helicopter", "honkytonk_piano", "kalimba", "koto", "lead_1_square", "lead_2_sawtooth", "lead_3_calliope", "lead_4_chiff", "lead_5_charang", "lead_6_voice", "lead_7_fifths", "lead_8_bass_lead", "marimba", "melodic_tom", "music_box", "muted_trumpet", "oboe", "ocarina", "orchestra_hit", "orchestral_harp", "overdriven_guitar", "pad_1_new_age", "pad_2_warm", "pad_3_polysynth", "pad_4_choir", "pad_5_bowed", "pad_6_metallic", "pad_7_halo", "pad_8_sweep", "pan_flute", "percussive_organ", "piccolo", "pizzicato_strings", "recorder", "reed_organ", "reverse_cymbal", "rock_organ", "seashore", "shakuhachi", "shamisen", "shanai", "slap_bass_1", "slap_bass_2", "soprano_sax", "steel_drums", "string_ensemble_1", "string_ensemble_2", "synth_bass_1", "synth_bass_2", "synthbrass_1", "synthbrass_2", "synthstrings_1", "synthstrings_2", "taiko_drum", "telephone_ring", "tenor_sax", "timpani", "tinkle_bell", "tremolo_strings", "trombone", "trumpet", "tubular_bells", "vibraphone", "viola", "violin" ],
    n = 0,
    ws;

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
    playNoteAt(n);
    n = (n + 1) % 16;
    setTimeout(playMusic, 250);
};

var fetch_satellites = function() {
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
              play_satellites();
          });
};

setInterval(fetch_satellites, 1000);

var arrayOf = function(n, times) {
    Array.apply(null, new Array(times)).map(Number.prototype.valueOf,n);
};

var random_choice = function(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

var play_satellites = function() {
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

        var instrument = random_choice(instruments);
        var this_note = piano_minor[note_bucket] + getRandomArbitary(0, 87);
        if (Math.random() < 0.15) {
            instrument = random_choice(instrument);
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

    instruments = shuffle(instruments).slice(0, 4);
    $.each(instruments, function(i, e) {
        var instrumentname = MIDI.GeneralMIDI.byName[e].instrument;
        $('#instruments').append($('<li>', {'text': instrumentname}));
    });
    var rhythm = $('#rhythm').val();
    if (rhythm) {
        instruments = [];
        var rhythm_json = JSON.parse(rhythm);
        instruments.push(rhythm_json.instrument);
        ws = new WebSocket("ws://localhost:1338/echo");
        ws.onopen = function() {
            alert("connected");
            $('#rhythm').bind('keypress', function () {
                var self = $(this);

                clearTimeout(self.data('timeout'));

                self.data('timeout', setTimeout(function() {
                    alert(self.val());
                    ws.send(self.val());
                }, 500));
            });
        };
        ws.onmessage = function (evt) {
            var received_msg = evt.data;
            alert("received message");
            alert(received_msg);
            $('#rhythm').val(received_msg);
        };
        ws.onclose = function() {
        };
    }
    MIDI.loadPlugin({
        soundfontUrl: $SCRIPT_ROOT + "/static/soundfont/",
        instruments: instruments,
        callback: function() {
            $('#play').html('\u25B6 Play');
            $('#play').removeClass('pure-button-disabled');
            $('#play').addClass('pure-button-primary');

            var updateRhythm = function() {
                try {
                    var rhythm = $('#rhythm').val();
                    if (rhythm) {
                        var rhythm_json = JSON.parse(rhythm);
                        var new_sequence = [];
                        for (var key in rhythm_json.sequence) {
                            var value = rhythm_json.sequence[key];
                            if (value == "*") {
                                new_sequence.push(random_choice(piano_minor));
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
            playMusic();
        }
    });

    $('#play').click(function() {
        playMusic();
    });

});