import { useState, useEffect } from 'react';

export function useVisitCounter() {
  const [visits, setVisits] = useState(0);
  const [displayVisits, setDisplayVisits] = useState(0);

  useEffect(() => {
    // Get current visits from localStorage
    const storedVisits = localStorage.getItem('site_visits');
    const currentVisits = storedVisits ? parseInt(storedVisits, 10) : 0;

    // Increment and save
    const newVisits = currentVisits + 1;
    localStorage.setItem('site_visits', newVisits.toString());

    setVisits(newVisits);

    // Animate counter
    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function (easeOutExpo)
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

      setDisplayVisits(Math.floor(easeProgress * newVisits));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return { visits, displayVisits };
}
