import { useEffect, useRef } from "react";
import { Renderer, Stave, StaveNote, Voice, Formatter } from "vexflow";
import * as Tone from 'tone';
import { Vex } from "vexflow";

const MusicEditor = () => {

    const containerRef = useRef(null);

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

        // This is the notes one the staves and how long they are.
        const notes = [
            new VF.StaveNote({ keys: ['c/4'], duration: 'q' }),
            new VF.StaveNote({ keys: ['d/4'], duration: 'q' }),
            new VF.StaveNote({ keys: ['e/4'], duration: 'q' }),
            new VF.StaveNote({ keys: ['f/4'], duration: 'q' }),
        ];
        //  This is the number of notes and value in each measure
        const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
        voice.addTickables(notes);

        new VF.Formatter().joinVoices([voice]).format([voice], 400);

        voice.draw(context, stave);
    }, []);

    return (
    <main >
    
    <div ref={containerRef}></div>
    </main>

)};



export default MusicEditor;