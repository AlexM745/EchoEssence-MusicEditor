import React, { useEffect, useRef, useState } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow';
import {WebMidi} from 'webmidi';
import * as Tone from 'tone';
import { Vex } from "vexflow";

const MusicEditor = () => {

    const containerRef = useRef(null);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const VF = Vex.Flow;
        const div = containerRef.current;
        const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);
        // this is how big the stave or music is going to render on the page
        renderer.resize(500, 200);
        const context = renderer.getContext();
        context.setFont('Arial', 10, '').setBackgroundFillStyle('#eed');

        // This is the treble clef and 4/4 time signature.
        const stave = new VF.Stave(10, 40, 400);
        stave.addClef('treble').addTimeSignature('4/4');
        stave.setContext(context).draw();

        // if there are notes then create the voice
        if (notes.length > 0){
        //  This is the number of notes and value in each measure
        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notes);

        new VF.Formatter().joinVoices([voice]).format([voice], 400);

        voice.draw(context, stave);
        }

        // Setup WebMidi
        WebMidi.enable((err) => {
            if (err) {
                console.error("WebMidi could not be enabled.", err);
            } else {
                console.log("WebMidi enabled!");

                WebMidi.inputs.forEach((input) => {
                    input.addListener('noteon', 'all', (e) => {
                        const note = e.note.name.toLowerCase() + '/' + e.note.octave;
                        addNoteAndPlay(note);
                    });
                });
            }
        });

    }, [notes]);

    // this is so that the user can add and play the note added
    const addNoteAndPlay = (note) => {
        setNotes([...notes, new StaveNote({
            keys: [note],
            duration: 'q',
        })]);
        // for the new notes
        setNotes(prevNotes => [...prevNotes, newNote]);

        playNote(note);
    };
    // this is so that the notes are played 
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
    // for when the user adds notes by mouse click
    const handleMouseClick = (e) => {
        // need to add logic to determine the note based on the click position
        // fixed note as of now
        addNoteAndPlay('c/4');
    };

    return (
        <main >

            <div ref={containerRef} onClick={handleMouseClick}></div>
        </main>

    )
};



export default MusicEditor;