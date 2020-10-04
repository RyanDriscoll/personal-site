import { Children } from "react";

const calculateBoundingBoxes = children => {
  const boundingBoxes = {};

  Children.forEach(children, (child, index) => {
    const domNode = child.ref.current;
    const nodeBoundingBox = domNode.getBoundingClientRect();

    boundingBoxes[child.key] = nodeBoundingBox;
  });

  return boundingBoxes;
};

export default calculateBoundingBoxes;
