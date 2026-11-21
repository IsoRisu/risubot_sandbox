/**
 * @file js/audio.js
 * @description Web Audio API manager for synthesized retro sound effects and ambient/UI sounds.
 */

import { SOUND_EFFECTS } from './constants.js';

export class AudioManager {
    constructor() {
        this.audioCtx = null;
        this.soundEnabled = true;
        this.masterVolume = 0.3;
        this._initAudioContext = this._initAudioContext.bind(this);
        
        // Listen for user interaction to unlock AudioContext
        ['click', 'keydown', 'touchstart'].forEach(event => {
            window.addEventListener(event, this._initAudioContext, { once: true });
        });
    }

    _initAudioContext() {
        if (!this.audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.audioCtx = new AudioContext();
            }
        }
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    play(soundName) {
        if (!this.soundEnabled) return;
        this._initAudioContext();
        if (!this.audioCtx) return;

        try {
            switch (soundName) {
                case SOUND_EFFECTS.EAT:
                    this._playTone(440, 0.08, 'sine', 600);
                    break;
                case SOUND_EFFECTS.POWERUP:
                    this._playArpeggio([300, 450, 600, 750], 0.06);
                    break;
                case SOUND_EFFECTS.GAMEOVER:
                    this._playDescendingTone(300, 100, 0.4);
                    break;
                case SOUND_EFFECTS.MOVE:
                    this._playTone(180, 0.03, 'triangle');
                    break;
                case SOUND_EFFECTS.CLICK:
                    this._playTone(500, 0.04, 'square');
                    break;
                case SOUND_EFFECTS.ACHIEVEMENT:
                    this._playArpeggio([523, 659, 784, 1046], 0.08);
                    break;
                case SOUND_EFFECTS.SKIN_UNLOCK:
                    this._playArpeggio([440, 554, 659, 880], 0.08);
                    break;
                default:
                    this._playTone(350, 0.05, 'sine');
                    break;
            }
        } catch (e) {
            console.warn('Audio playback error:', e);
        }
    }

    _playTone(freq, duration, type = 'sine', endFreq = null) {
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (endFreq !== null) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
        }

        gain.gain.setValueAtTime(this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    _playArpeggio(frequencies, noteDuration) {
        if (!this.audioCtx) return;
        frequencies.forEach((freq, index) => {
            const now = this.audioCtx.currentTime + (index * noteDuration);
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now);

            gain.gain.setValueAtTime(this.masterVolume, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + noteDuration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start(now);
            osc.stop(now + noteDuration);
        });
    }

    _playDescendingTone(startFreq, endFreq, duration) {
        if (!this.audioCtx) return;
        const now = this.audioCtx.currentTime;
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(startFreq, now);
        osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

        gain.gain.setValueAtTime(this.masterVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }
}
