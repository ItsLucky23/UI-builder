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

  // Snap to whole pixels to avoid sub-pixel rendering inconsistencies
  const snappedSize = Math.round(spacing * zoom);
  const snappedOffsetX = Math.round(offset.x);
  const snappedOffsetY = Math.round(offset.y);

  if (isLineGrid) {
    return {
      backgroundImage: `
        linear-gradient(rgba(255,255,255,${opacity}) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,${opacity}) 1px, transparent 1px)
      `,
      backgroundSize: `${snappedSize}px ${snappedSize}px`,
      backgroundPosition: `${snappedOffsetX}px ${snappedOffsetY}px`,
    };
  } else {
    // Scale dot size based on zoom - smaller when zoomed out, with min 1px and max 2px
    const dotSize = Math.max(1, Math.min(2, zoom * 2));
    return {
      backgroundImage: `
        radial-gradient(circle, rgba(255,255,255,${opacity}) ${dotSize}px, transparent ${dotSize}px)
      `,
      backgroundSize: `${snappedSize}px ${snappedSize}px`,
      backgroundPosition: `${snappedOffsetX}px ${snappedOffsetY}px`,
    };
  }
}