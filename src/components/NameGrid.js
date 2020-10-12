import React, { useState, createRef } from 'react';
import Cell from './Cell';
import AnimateCells from './AnimateCells';
import useDebounce from '../utils/useDebounce';
import shuffle from '../utils/shuffle';

const text =
  '🆁,🆈,🅰,🅽, , , , , ,🅳,🆁,🅸,🆂,🅲,🅾,🅻,🅻, ,🅸, ,🅼,🅰,🅺,🅴, , , , ,🅽,🅴,🅰,🆃, , , ,https://www.linkedin.com/in/rpdriscoll/, , ,🆂,🆃,🆄,🅵,🅵, ,https://github.com/RyanDriscoll';

const INITIAL_CELLS = text
  .split(',')
  .map((char, index) => ({ id: index, text: char }));

const NameGrid = () => {
  const [cells, setCells] = useState(shuffle(INITIAL_CELLS));

  const debouncedCells = useDebounce(cells, 200);

  const sortCells = sortItAnyway => {
    setCells(prevCells => {
      const currentlySorted = prevCells.every(
        (cell, index) => cell.id === index
      );
      if (sortItAnyway || !currentlySorted) {
        return [...prevCells].sort((a, b) => a.id - b.id);
      } else {
        return shuffle(prevCells);
      }
    });
  };

  return (
    <>
      <h1
        className="screen-reader-content"
        tabIndex={1}
        onFocus={() => sortCells(true)}
      >
        Ryan Driscoll. I make neat stuff
      </h1>
      <div className="container">
        <div
          className="cells-container"
          onMouseEnter={() => sortCells()}
          onMouseLeave={() => sortCells()}
        >
          <AnimateCells>
            {debouncedCells.map(({ id, text }) => (
              <Cell key={id} id={id} text={text} ref={createRef()} />
            ))}
          </AnimateCells>
        </div>
      </div>
    </>
  );
};

export default NameGrid;
