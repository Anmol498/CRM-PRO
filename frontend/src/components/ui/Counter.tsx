import React, { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

interface CounterProps {
  value: number;
  duration?: number;
}

export const Counter: React.FC<CounterProps> = ({ value, duration = 1 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const controls = animate(0, value, {
      duration,
      onUpdate: (latest) => setCount(Math.floor(latest)),
      ease: [0.16, 1, 0.3, 1], // Standard ease-out
    });

    return () => controls.stop();
  }, [value, duration]);

  return <>{count.toLocaleString()}</>;
};
