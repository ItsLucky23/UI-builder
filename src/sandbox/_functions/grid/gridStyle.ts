export const getGridStyle = (zoom: number, offset: { x: number; y: number }) => {
  let spacing = 50;
  let opacity = 0.15;
  let isLineGrid = true;


  if (zoom > 1) {
    spacing = 50;
    opacity = 0.2;
    isLineGrid = true;
  } else {
    spacing = 100;
    opacity = 0.2;
    isLineGrid = false;
  }

  if (isLineGrid) {
    return {
      backgroundImage: `
        linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)
      `,
      backgroundSize: `${spacing * zoom}px ${spacing * zoom}px`,
      backgroundPosition: `${offset.x}px ${offset.y}px`,
    };
  } else {
    return {
      backgroundImage: `
        radial-gradient(circle, rgba(255,255,255,${opacity}) 1px, transparent 1px)
      `,
      backgroundSize: `${spacing * zoom}px ${spacing * zoom}px`,
      backgroundPosition: `${offset.x}px ${offset.y}px`,
    };
  }
}