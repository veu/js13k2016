import Sequence from './TinyMusic.js';

const ac = typeof AudioContext !== 'undefined' ? new AudioContext : new webkitAudioContext;
  
const lead = [
    'D3  e',
    'D3  e',
    'E3  e',
    'F3  e',
    'F3  e',
    'G3  e',
 
    'F3  e',
    'F3  e',
    'E3  e',
    'D3  q',
    'A2  e',

    'D3  q',
    'E3  e',
    'F3  e',
    'F3  e',
    'G3  e',

    'F3  q',
    'E3 e',
    'D3 qs',
    

    'F3  q',
    'G3  e',
    'A3  q',
    'G3  e',

    'F3  q',
    'G3  e',
    'A3  e',
    '-   q',

    'D3  e',
    'E3  e',
    'F3  e',
    'E3  q',
    'E3  e',
    
    'E3  e',
    'F3  e',
    'G3  e',
    'F3  q',
    'D3  e',

    'F3  q',
    'G3  e',
    'A3  q',
    'G3  e',

    'F3  q',
    'G3  e',
    'A3  e',
    '-   q',

    'D3  e',
    'E3  e',
    'F3  e',
    'E3  es',
    'E3  s',
    'G3  e',
    
    'F3  q',
    'E3  e',
    'D3  qs',

    '- hs',
    '- hs'
];

const bass = [
    'Db1 e',
    'E1 s',
    '- s',
    'E1 s',
    '- s',
    'C1 e',
    'D1 s',
    '- s',
    'D1 s',
    '- s',
];

const tempo = 90;

const sequence1 = new Sequence( ac, tempo, lead );
const sequence2 = new Sequence( ac, tempo, bass );

sequence1.createCustomWave([-0.8, 1, 0.8, 0.8, -0.8, -0.8, -1]);

sequence1.staccato = 0.1; 
sequence2.staccato = 0.05;
sequence2.smoothing = 0.1;

sequence1.gain.gain.value = 1.0 / 2;
sequence2.gain.gain.value = 0.2 / 2;

const audio = {
    isPlaying: false,
    play: function () {
        const when = ac.currentTime;
        sequence1.play(when + ( 60 / tempo ) * 6);
        sequence2.play( when);
        this.isPlaying = true;
    },
    stop: function () {
        sequence1.stop();
        sequence2.stop();
        this.isPlaying = false;
    }
};

export default audio;
