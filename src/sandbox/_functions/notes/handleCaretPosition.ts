import { useGrid } from "src/sandbox/_providers/GridContextProvider";
import { CaretPosition } from "./getCaretPosition";

export const handleCaretPositionChange = () => {

  const {
    setOffset
  } = useGrid();

  return (position: CaretPosition | null) => {
    if (!position) { return; }

    setOffset(prev => {
      let newY = prev.y;
      const absoluteY = position.absoluteY;
      const windowHeight = window.innerHeight;
      if (absoluteY > windowHeight * 0.75) {
        const remaining = (windowHeight * 0.75) - absoluteY;
        newY = prev.y + remaining;
      } else if (absoluteY < windowHeight * 0.25) {
        const remaining = (windowHeight * 0.25) - absoluteY;
        newY = prev.y + remaining;
      }
      return { ...prev, y: newY };
    })
  }
};