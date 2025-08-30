'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blobRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const blobs = blobRefs.current.filter(Boolean);
    
    blobs.forEach((blob, index) => {
      if (!blob) return;
      
      const tl = gsap.timeline({ repeat: -1 });
      
      tl.to(blob, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.8, 1.2)',
        duration: 'random(15, 25)',
        ease: 'power1.inOut',
      })
      .to(blob, {
        x: 'random(-100, 100)',
        y: 'random(-100, 100)',
        scale: 'random(0.9, 1.1)',
        duration: 'random(15, 25)',
        ease: 'power1.inOut',
      })
      .to(blob, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 'random(15, 25)',
        ease: 'power1.inOut',
      });

      gsap.to(blob, {
        rotate: 'random(-180, 180)',
        duration: 'random(20, 30)',
        repeat: -1,
        ease: 'none',
        yoyo: true,
      });

      gsap.to(blob, {
        opacity: 'random(0.1, 0.3)',
        duration: 'random(3, 5)',
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut',
        delay: index * 0.5,
      });
    });

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 50;
      const y = (clientY / innerHeight - 0.5) * 50;

      gsap.to(blobs, {
        x: `+=${x * 0.5}`,
        y: `+=${y * 0.5}`,
        duration: 1,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
    >
      <div className="absolute inset-0 opacity-50">
        <div
          ref={el => { blobRefs.current[0] = el }}
          className="absolute w-96 h-96 bg-gradient-to-br from-easy-yellow/20 to-transparent rounded-full blur-3xl"
          style={{ top: '10%', left: '10%' }}
        />
        
        <div
          ref={el => { blobRefs.current[1] = el }}
          className="absolute w-80 h-80 bg-gradient-to-br from-easy-yellow/15 to-transparent rounded-full blur-3xl"
          style={{ top: '60%', right: '15%' }}
        />
        
        <div
          ref={el => { blobRefs.current[2] = el }}
          className="absolute w-72 h-72 bg-gradient-to-br from-easy-yellow/10 to-transparent rounded-full blur-3xl"
          style={{ bottom: '20%', left: '30%' }}
        />
        
        <div
          ref={el => { blobRefs.current[3] = el }}
          className="absolute w-64 h-64 bg-gradient-to-br from-easy-yellow/25 to-transparent rounded-full blur-3xl"
          style={{ top: '30%', right: '40%' }}
        />

        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <filter id="goo">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
                result="goo"
              />
              <feBlend in="SourceGraphic" in2="goo" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  );
}