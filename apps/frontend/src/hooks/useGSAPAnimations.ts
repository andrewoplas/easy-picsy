import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useScrollAnimation = (
  animationConfig: gsap.TweenVars,
  scrollConfig?: ScrollTrigger.Vars
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    
    const animation = gsap.fromTo(
      element,
      {
        opacity: 0,
        y: 50,
        ...animationConfig
      },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: element,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none none', // Play once, don't reverse
          once: true, // Only trigger once
          ...scrollConfig
        },
        ...animationConfig
      }
    );

    return () => {
      animation.kill();
    };
  }, []);

  return ref;
};

export const useParallaxEffect = (speed: number = 0.5) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.to(element, {
      yPercent: -100 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });
  }, [speed]);

  return ref;
};

export const useStaggerAnimation = (
  staggerAmount: number = 0.1,
  animationConfig?: gsap.TweenVars,
  selector: string = '.feature-card'
) => {
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current || hasAnimated.current) return;

    // Get all matching elements within the container
    const elements = selector === 'children' 
      ? ref.current.children 
      : ref.current.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    // Set initial state immediately to prevent flashing
    gsap.set(elements, {
      opacity: 0,
      y: 30,
      scale: 0.95,
    });
    
    // Animate with smoother settings
    gsap.to(
      elements,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        ease: 'power2.out',
        stagger: {
          each: staggerAmount,
          from: 'start',
        },
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          once: true,
          onEnter: () => {
            hasAnimated.current = true;
          }
        },
        ...animationConfig,
      }
    );
  }, [staggerAmount, selector]);

  return ref;
};

export const useMorphAnimation = () => {
  const ref = useRef<SVGPathElement>(null);

  const morph = (newPath: string, duration: number = 1) => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      attr: { d: newPath },
      duration,
      ease: 'power2.inOut',
    });
  };

  return { ref, morph };
};

export const useHoverAnimation = <T extends HTMLElement = HTMLElement>(
  hoverConfig?: gsap.TweenVars,
  leaveConfig?: gsap.TweenVars
) => {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
        ...hoverConfig,
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out',
        ...leaveConfig,
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return ref;
};

export const useTextSplitAnimation = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const text = ref.current.innerText;
    const chars = text.split('');
    
    ref.current.innerHTML = chars
      .map(char => `<span class="char">${char === ' ' ? '&nbsp;' : char}</span>`)
      .join('');

    const charElements = ref.current.querySelectorAll('.char');

    gsap.fromTo(
      charElements,
      {
        opacity: 0,
        y: 50,
        rotateX: -90,
      },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'back.out(1.7)',
        stagger: 0.02,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return ref;
};

export const useFloatingAnimation = (
  amplitude: number = 20,
  duration: number = 3
) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    gsap.to(ref.current, {
      y: amplitude,
      duration,
      ease: 'power1.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, [amplitude, duration]);

  return ref;
};

export const useRevealAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;

    gsap.fromTo(
      element,
      {
        clipPath: 'inset(100% 0 0 0)',
        opacity: 0,
      },
      {
        clipPath: 'inset(0% 0 0 0)',
        opacity: 1,
        duration: 1.2,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: element,
          start: 'top 75%',
          toggleActions: 'play none none none', // Play once only
          once: true,
        },
      }
    );
  }, []);

  return ref;
};