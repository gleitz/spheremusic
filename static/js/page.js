/*global $ MIDI */
var sat_data,
    notes = [],
    piano_minor = [0, 3, 7, 12, 15, 19, 24, 27, 31, 36, 39, 43, 48, 51, 55, 60, 63, 67, 72, 75, 79, 84, 87, 91, 96, 99, 103, 108, 111, 115, 120, 123, 127];
    // piano_minor = [0, 2, 3, 5, 7, 9, 11, 12, 14, 15, 17, 19, 21, 23, 24, 26, 27, 29, 31, 33, 35, 36, 38, 39, 41, 43, 45, 47, 48, 50, 51, 53, 55, 57, 59, 60, 62, 63, 65, 67, 69, 71, 72, 74, 75, 77, 79, 81, 83, 84, 86, 87, 89, 91, 93, 95, 96, 98, 99, 101, 103, 105, 107, 108, 110, 111, 113, 115, 117, 119, 120, 122, 123, 125, 127];

function getRandomArbitary(min, max) {
    return Math.random() * (max - min) + min;
}

var playNoteAt = function(n) {
    $.each(notes, function(i, e) {
        var velocity = getRandomArbitary(0, 127);
        MIDI.noteOn(0, MIDI.pianoKeyOffset + e[n], velocity);
    });
};

var playMusic = function () {
    var n = 0;
    playNoteAt(n);
    n = (n + 1) % 16;
    setTimeout(playMusic, 62.5);
    // for (var n = 0; n < 100; n ++) {
        // var delay = n / 4; // play one note every quarter second
        // var note = MIDI.pianoKeyOffset + n; // the MIDI note
        // var velocity = 127; // how hard the note hits
        // // play the note
        // MIDI.noteOn(0, note, velocity, delay);
    // }
};

var fetch_satellites = function() {
    $.get('/ajax/satellites', function(data) {
        sat_data = data;
        play_satellites();
    });
};

setInterval(fetch_satellites, 1000);

var arrayOf = function(n, times) {
    Array.apply(null, new Array(times)).map(Number.prototype.valueOf,n);
};

var play_satellites = function() {
    notes = [];
    var note_buckets = 14,
        note_bucket_width = (sat_data.max_velocity - sat_data.min_velocity) / note_buckets,
        tempo_buckets = 4,
        tempo_bucket_width = (sat_data.max_range - sat_data.min_range) / tempo_buckets;

    $.each(sat_data.satellites, function(i, sat) {
        var note_bucket = Math.floor((Math.abs(sat.velocity) - sat_data.min_velocity) / note_bucket_width),
            tempo_bucket = Math.floor((sat.range - sat_data.min_range) / tempo_bucket_width);
        var note;

        var this_note = piano_minor[note_bucket];

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
        notes.push(note);
    });
};

$(document).ready(function() {

    MIDI.loadPlugin({
        soundfontUrl: "/static/soundfont/",
        instruments: [ "acoustic_grand_piano", "synth_drum" ],
        callback: function() {
            $('#play').html('\u25B6 Play');
            $('#play').removeClass('pure-button-disabled');
            $('#play').addClass('pure-button-primary');
        }
    });

    $('#play').click(function() {
        MIDI.programChange(0, 0);
        playMusic();
    });

});