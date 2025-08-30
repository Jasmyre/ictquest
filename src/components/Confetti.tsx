"use client"

import confetti from "canvas-confetti";
import { useEffect, useState } from 'react';

const Confetti = () => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        setShowConfetti(true);
      }, []);
      
    useEffect(() => {
      if (showConfetti) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    }, [showConfetti]);
    return(
        <span className="sr-only" aria-label="Confetti">Confetti</span>
    )
}

export default Confetti