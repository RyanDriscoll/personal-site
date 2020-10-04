import React, { useLayoutEffect, useState } from "react";
import calculateBoundingBoxes from "../utils/calculateBoundingBoxes";
import usePrevious from "../utils/usePrevious";

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

export default AnimateCells;
