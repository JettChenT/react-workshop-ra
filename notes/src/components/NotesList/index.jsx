import { startTransition, useMemo, useState } from "react";
import { Button, ButtonGroup } from "@mui/material";
import { FixedSizeList as List } from 'react-window';
import FilterInput from "../FilterInput";
import NoteButton from "../NoteButton";
import "./index.css";

function NotesList({
  notes,
  activeNoteId,
  onNoteActivated,
  onNewNotesRequested,
  onDeleteAllRequested,
}) {
  const [filter, setFilter] = useState("");
  const [filterInput, setFilterInput] = useState("")

  let noteBtns = useMemo(() => {
    return Object.values(notes)
          .sort((a, b) => b.date.getTime() - a.date.getTime())
          .filter(({ text }) => {
            if (!filter) {
              return true;
            }

            return text.toLowerCase().includes(filter.toLowerCase());
          })
  }, [notes, filter, activeNoteId, onNoteActivated])

  return (
    <div className="notes-list" style={{ position: "relative" }}>
      <div className="notes-list__filter">
        <FilterInput
          filter={filterInput}
          onChange={(val) => {
            setFilterInput(val);
            startTransition(() => {setFilter(val)})
          }}
          noteCount={Object.keys(notes).length}
        />
      </div>

      <div className="notes-list__notes">
        <List
          // hacky but works as an upper bound
          height={window.innerHeight} 
          itemCount={noteBtns.length}
          itemSize={100}
        >
          {({ index, style }) => {
            let { id, text, date } = noteBtns[index]
            return <NoteButton
              key={id}
              id={id}
              isActive={activeNoteId === id}
              onNoteActivated={onNoteActivated}
              text={text}
              filterText={filter}
              date={date}
              style={style}
            />
          }}
        </List>
      </div>

      <div className="notes-list__controls">
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 1 })}
          >
            + Note
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 1, paragraphs: 300 })}
          >
            + Huge
          </Button>
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onNewNotesRequested({ count: 100, paragraphs: 1 })}
          >
            + 100
          </Button>
        </ButtonGroup>
        <ButtonGroup size="small">
          <Button
            classes={{ root: "notes-list__control" }}
            onClick={() => onDeleteAllRequested()}
          >
            Delete all
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}

export default NotesList;
