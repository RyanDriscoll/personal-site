import React, { useState, createRef, useLayoutEffect, forwardRef } from "react";
import calculateBoundingBoxes from "../utils/calculateBoundingBoxes";
import Github from "./Github";
import LinkedIn from "./LinkedIn";
import useDebounce from "../utils/useDebounce";
import usePrevious from "../utils/usePrevious";

const shuffle = arr => {
  const newArr = [...arr];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = newArr[i];
    newArr[i] = newArr[j];
    newArr[j] = temp;
  }
  return newArr;
};

const text =
  "🆁,🆈,🅰,🅽, , , , , ,🅳,🆁,🅸,🆂,🅲,🅾,🅻,🅻, ,🅸, ,🅼,🅰,🅺,🅴, , , , ,🅽,🅴,🅰,🆃, , , ,https://www.linkedin.com/in/rpdriscoll/, , ,🆂,🆃,🆄,🅵,🅵, ,https://github.com/RyanDriscoll";

const INITIAL_CELLS = text
  .split(",")
  .map((char, index) => ({ id: index, text: char }));

const Cell = forwardRef(({ text, id }, ref) => {
  if (text.toLowerCase().includes("github")) {
    return (
      <div className="cell" ref={ref}>
        <Github />
      </div>
    );
  }
  if (text.toLowerCase().includes("linkedin")) {
    return (
      <div className="cell" ref={ref}>
        <LinkedIn />
      </div>
    );
  }

  return (
    <div className="cell" ref={ref}>
      <p>{text}</p>
    </div>
  );
});

const AnimateCells = ({ children }) => {
  const [boundingBox, setBoundingBox] = useState({});
  const [prevBoundingBox, setPrevBoundingBox] = useState({});
  const prevChildren = usePrevious(children);

  useLayoutEffect(() => {
    const newBoundingBox = calculateBoundingBoxes(children);
    setBoundingBox(newBoundingBox);
  }, [children]);

  useLayoutEffect(() => {
    const prevBoundingBox = calculateBoundingBoxes(prevChildren);
    setPrevBoundingBox(prevBoundingBox);
  }, [prevChildren]);

  useLayoutEffect(() => {
    const hasPrevBoundingBox = Object.keys(prevBoundingBox).length;

    if (hasPrevBoundingBox) {
      React.Children.forEach(children, child => {
        const domNode = child.ref.current;
        const firstBox = prevBoundingBox[child.key];
        const lastBox = boundingBox[child.key];
        const changeInX = firstBox.left - lastBox.left;
        const changeInY = firstBox.top - lastBox.top;

        if (changeInX || changeInY) {
          requestAnimationFrame(() => {
            // Before the DOM paints, invert child to old position
            domNode.style.transform = `translate(${changeInX}px, ${changeInY}px)`;
            domNode.style.transition = "transform 0s";

            requestAnimationFrame(() => {
              // After the previous frame, remove
              // the transition to play the animation
              domNode.style.transform = "";
              domNode.style.transition = "transform 500ms";
            });
          });
        }
      });
    }
  }, [boundingBox, prevBoundingBox, children]);

  return children;
};

const NameGrid = () => {
  const [cells, setCells] = useState(shuffle(INITIAL_CELLS));

  const debouncedCells = useDebounce(cells, 200);

  const sortCells = () => {
    setCells(prevCells => {
      const sorted = prevCells.every((cell, index) => cell.id === index);
      if (sorted) {
        return shuffle(prevCells);
      } else {
        return [...prevCells].sort((a, b) => a.id - b.id);
      }
    });
  };

  return (
    <main>
      <div className="container">
        <div
          className="cells-container"
          onMouseEnter={sortCells}
          onMouseLeave={sortCells}
        >
          <AnimateCells>
            {debouncedCells.map(({ id, text }) => (
              <Cell key={id} id={id} text={text} ref={createRef()} />
            ))}
          </AnimateCells>
        </div>
      </div>
    </main>
  );
};

export default NameGrid;
