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
    const [stave, setStave] = useState(null);


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

        // This is the treble clef and 4/4 time signature.
        const stave = new VF.Stave(10, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        setContext(context);
        setStave(stave);

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
                // When a note is played on a MIDI it calls the addNotePlay function
                WebMidi.inputs.forEach((input) => {
                    input.addListener('noteon', 'all', (e) => {
                        const note = e.note.name.toLowerCase() + '/' + e.note.octave;
                        addNoteAndPlay(note);
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
    // this is so that the notes are played with tone.js
    const playNote = (note) => {
        const synth = new Tone.Synth().toDestination();
        const noteMap = {
            'c/4': 'C4',
            'd/4': 'D4',
            'e/4': 'E4',
            'f/4': 'F4',
            'g/4': 'G4',
            'a/4': 'A4',
            'b/4': 'B4',
        };
        const pitch = noteMap[note];
        if (pitch) {
            synth.triggerAttackRelease(pitch, '8n');
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