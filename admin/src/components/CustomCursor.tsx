import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Lazily show custom cursor only when mouse actually moves
      if (!visible) setVisible(true);

      // Audit if current target or parents are interactive elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive =
          target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.closest('a') ||
          target.closest('button') ||
          target.closest('.cursor-pointer') ||
          target.closest('[role="button"]') ||
          target.closest('select');

        setHovering(!!isInteractive);
      }
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    const onMouseEnter = () => {
      setVisible(true);
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <>
      <div
        className={`cursor-dot ${hovering ? 'hovering' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
      <div
        className={`cursor-ring ${hovering ? 'hovering' : ''}`}
        style={{ left: `${position.x}px`, top: `${position.y}px` }}
      />
    </>
  );
};
export default CustomCursor;
