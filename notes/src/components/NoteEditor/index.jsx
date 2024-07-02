import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import CodeMirror from "codemirror";
import "codemirror/mode/markdown/markdown";
import "codemirror/lib/codemirror.css";
import "./index.css";

function NoteEditor({ notes, activeNoteId, saveNote }) {
  const currentNote = useMemo(()=>(notes[activeNoteId]), [ activeNoteId]);
  const [curInput, setCurInput] = useState(currentNote.text);
  const textareaRef = useRef();

  useEffect(() => {
    let updated = notes[activeNoteId].text;
    setCurInput(updated)
    console.log("updated:", updated)

    const editor = CodeMirror.fromTextArea(textareaRef.current, {
      mode: "markdown",
      lineWrapping: true,
    });

    editor.setValue(updated)

    editor.on("change", (doc, change) => {
      setCurInput(doc.getValue());
      startTransition(() => {
        if (change.origin !== "setValue") {
          saveNote({ text: doc.getValue() });
        }
      })
    });

    return () => editor.toTextArea();
  }, [activeNoteId]);

  return (
    <div className="note-editor" key={activeNoteId}>
      <textarea
        ref={textareaRef}
        value={curInput}
        autoComplete="off"
      />
    </div>
  );
}

export default NoteEditor;
