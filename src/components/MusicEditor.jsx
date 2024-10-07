import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import { WebMidi } from 'webmidi';
import * as Tone from 'tone';
import { Vex } from "vexflow";

const MusicEditor = () => {

    // This hooks  managees the notes, context, stave so that they can be updated and accessed
    const containerRef = useRef(null);
    const [notes, setNotes] = useState([]);
    const [context, setContext] = useState(null);
    const [staves, setStaves] = useState([]);


    useEffect(() => {

        const VF = Vex.Flow;
        const div = containerRef.current;
        // initializes the vexflow renderer to draw and svg
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        // this is how big the stave or music is going to render on the page
        renderer.resize(500, 200);
        // used to draw on the canvas or svg using basic font and background
        const context = renderer.getContext();
        context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

        // This is for various staves
        const newStaves = [];
        staves.forEach((_, index) => {
            const stave = new VF.Stave(10 + 500 * index, 40, 400); // Adjust x position based on index
            stave.addClef('treble').addTimeSignature('4/4');
            stave.setContext(context).draw();
            newStaves.push(stave);
    
            if (notes[index] && notes[index].length > 0) {
                const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
                voice.addTickables(notes[index]);
    
                new VF.Formatter().joinVoices([voice]).format([voice], 400);
                voice.draw(context, stave);
            }
        });
    
        setContext(context);
        setStaves(newStaves);

        // if there are notes then create the voice
        if (notes.length > 0) {
            //  This is the number of notes and value in each measure
            const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
            voice.addTickables(notes);

            new VF.Formatter().joinVoices([voice]).format([voice], 400);

            voice.draw(context, stave);
        }

        // Setup WebMidi to be able to use MIDI input devices

        WebMidi.enable((err) => {
            if (err) {
                console.error("WebMidi could not be enabled.", err);
            } else {
                console.log("WebMidi enabled!");

                WebMidi.inputs.forEach((input) => {
                    input.addListener('noteon', 'all', (e) => {
                        // when MIDI notes is received the number of the key is passed to playnote
                        // tp correctly map the note and play it.
                        playNote(e.note.number);
                    });
                });
            }
        });
    }, []);

    // this is so that the user can add and play the note added
    const addNoteAndPlay = (note) => {
        const newNote = new StaveNote({
            keys: [note],
            duration: 'q',
        });
        // for the new notes
        setNotes(prevNotes => [...prevNotes, newNote]);
        // uses Tone js to map the note 
        playNote(note);
    };
    // these are all the notes which thier corresponding pitch by key number.
    const midiNoteToPitch = {
        21: 'A0', 22: 'A#0', 23: 'B0',
        24: 'C1', 25: 'C#1', 26: 'D1', 27: 'D#1', 28: 'E1', 29: 'F1', 30: 'F#1', 31: 'G1', 32: 'G#1',
        33: 'A1', 34: 'A#1', 35: 'B1',
        36: 'C2', 37: 'C#2', 38: 'D2', 39: 'D#2', 40: 'E2', 41: 'F2', 42: 'F#2', 43: 'G2', 44: 'G#2',
        45: 'A2', 46: 'A#2', 47: 'B2',
        48: 'C3', 49: 'C#3', 50: 'D3', 51: 'D#3', 52: 'E3', 53: 'F3', 54: 'F#3', 55: 'G3', 56: 'G#3',
        57: 'A3', 58: 'A#3', 59: 'B3',
        60: 'C4', 61: 'C#4', 62: 'D4', 63: 'D#4', 64: 'E4', 65: 'F4', 66: 'F#4', 67: 'G4', 68: 'G#4',
        69: 'A4', 70: 'A#4', 71: 'B4',
        72: 'C5', 73: 'C#5', 74: 'D5', 75: 'D#5', 76: 'E5', 77: 'F5', 78: 'F#5', 79: 'G5', 80: 'G#5',
        81: 'A5', 82: 'A#5', 83: 'B5',
        84: 'C6', 85: 'C#6', 86: 'D6', 87: 'D#6', 88: 'E6', 89: 'F6', 90: 'F#6', 91: 'G6', 92: 'G#6',
        93: 'A6', 94: 'A#6', 95: 'B6',
        96: 'C7', 97: 'C#7', 98: 'D7', 99: 'D#7', 100: 'E7', 101: 'F7', 102: 'F#7', 103: 'G7', 104: 'G#7',
        105: 'A7', 106: 'A#7', 107: 'B7',
        108: 'C8'
    };

    // this is so that the notes are played with tone.js
    const playNote = (noteNumber) => {
        const synth = new Tone.Synth().toDestination();
        const pitch = midiNoteToPitch[noteNumber];

        if (pitch) {
            console.log(`Playing pitch: ${pitch}`);
            synth.triggerAttackRelease(pitch, '8n');
        } else {
            console.error(`Note number ${noteNumber} is not mapped.`);
        }
    };
    // for when the user adds notes by mouse click by capturing the y corrdinate of the click
    const handleMouseClick = (e) => {
        const rect = containerRef.current.getBoundingClientRect();
        const y = e.clientY - rect.top; // checking where the y coordinate is relative to the stave 
        const note = getNoteFromY(y); // note is  y cordinate 
        // if a note is identified then it is added
        if (note) {
            addNoteAndPlay(note);
        }
    };


    const getNoteFromY = (y) => {
        const staveTop = 40; // The y-coordinate where the stave starts
        const noteHeight = 10; // Approximate height of a note step on the stave

        // Map y-coordinate to note
        if (y >= staveTop && y < staveTop + 5 * noteHeight) {
            const notePositions = ['f/4', 'e/4', 'd/4', 'c/4', 'b/3'];
            const index = Math.floor((y - staveTop) / noteHeight);
            return notePositions[index];
        }
        return null;
    };

    return (
        <main >

            <div ref={containerRef} onClick={handleMouseClick}></div>
        </main>

    )
};



export default MusicEditor;