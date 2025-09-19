'use client';

import AnimatedBackground from '@/components/AnimatedBackground';
import AuthCallbackHandler from '@/components/AuthCallbackHandler';
import { Button } from '@/components/ui/button';
import { useFloatingAnimation, useHoverAnimation, useStaggerAnimation } from '@/hooks/useGSAPAnimations';
import { FilloutPopupEmbed } from '@fillout/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  Check,
  Clock,
  DollarSign,
  Globe,
  Instagram,
  Mail,
  MonitorSpeaker,
  QrCode,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useStaggerAnimation(0.08, {}, '.feature-card');
  const processStepsRef = useStaggerAnimation(0.15, {}, '.process-step');
  const benefitCardsRef = useStaggerAnimation(0.12, {}, '.benefit-card');
  const floatingQrRef = useFloatingAnimation(12, 3);
  const ctaButtonRef = useHoverAnimation<HTMLButtonElement>({ scale: 1.1, rotate: 2 }, { scale: 1, rotate: 0 });

  const handleJoinWaitlist = () => {
    setShowForm(true);
  };

  useEffect(() => {
    const hasAnimated = sessionStorage.getItem('landingAnimated');

    const ctx = gsap.context(() => {
      if (!hasAnimated) {
        gsap.fromTo(
          navRef.current,
          { y: -100, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            delay: 0.2,
          },
        );

        if (heroContentRef.current) {
          const elements = heroContentRef.current.children;
          gsap.fromTo(
            elements,
            {
              opacity: 0,
              y: 50,
              scale: 0.95,
            },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.15,
              ease: 'power3.out',
              delay: 0.5,
            },
          );
        }

        if (heroImageRef.current) {
          gsap.fromTo(
            heroImageRef.current,
            {
              opacity: 0,
              scale: 0.8,
              rotate: -5,
            },
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.5,
              ease: 'elastic.out(1, 0.8)',
              delay: 0.8,
              onComplete: () => {
                sessionStorage.setItem('landingAnimated', 'true');
              },
            },
          );
        }
      } else {
        gsap.set(navRef.current, { y: 0, opacity: 1 });
        if (heroContentRef.current) {
          gsap.set(heroContentRef.current.children, {
            opacity: 1,
            y: 0,
            scale: 1,
          });
        }
        if (heroImageRef.current) {
          gsap.set(heroImageRef.current, { opacity: 1, scale: 1, rotate: 0 });
        }
      }

      // Continuous animations
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          y: 15,
          duration: 4,
          ease: 'power1.inOut',
          repeat: -1,
          yoyo: true,
        });
      }

      const sparkles = document.querySelectorAll('.sparkle-icon');
      sparkles.forEach((sparkle, index) => {
        gsap.to(sparkle, {
          rotate: 360,
          duration: 3 + index * 0.5,
          ease: 'none',
          repeat: -1,
        });
      });

      // Process step animations
      const processSteps = document.querySelectorAll('.process-step');
      const animatedArrows = document.querySelectorAll('.animated-arrow');

      // Set initial states to prevent flicker
      gsap.set('.process-step', { opacity: 0, y: 30, scale: 0.9 });
      gsap.set('.step-number', { scale: 0, rotate: -180 });
      gsap.set('.animated-arrow', { x: -20, opacity: 0 });

      processSteps.forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 80%',
          once: true,
          onEnter: () => {
            gsap.to(step, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.15,
              ease: 'power3.out',
            });

            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
              gsap.to(stepNumber, {
                scale: 1,
                rotate: 0,
                duration: 0.6,
                delay: index * 0.15 + 0.3,
                ease: 'back.out(1.7)',
              });
            }

            // Animate arrows after steps appear
            if (index < animatedArrows.length) {
              gsap.to(animatedArrows[index], {
                x: 0,
                opacity: 1,
                duration: 0.6,
                delay: index * 0.15 + 0.8,
                ease: 'power2.out',
              });
            }
          },
        });
      });

      // Continuous arrow pulse animation
      gsap.to('.animated-arrow', {
        scale: 1.1,
        duration: 1.5,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
      });

      // Celebration box animation with floating confetti
      ScrollTrigger.create({
        trigger: '.celebration-box',
        start: 'top 85%',
        once: true,
        onEnter: () => {
          // Animate the celebration box entrance
          gsap.fromTo(
            '.celebration-box',
            { scale: 0.8, opacity: 0, y: 30 },
            {
              scale: 1,
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: 'back.out(1.7)',
              onComplete: () => {
                // Animate confetti falling inside the box
                gsap.to('.confetti-piece', {
                  y: '400px',
                  rotation: 720,
                  opacity: 0,
                  duration: 4,
                  stagger: {
                    each: 0.5,
                    repeat: -1,
                    repeatDelay: 0,
                  },
                  ease: 'power1.in',
                });

                // Add a swaying motion
                gsap.to('.confetti-piece', {
                  x: '+=30',
                  duration: 2,
                  stagger: 0.2,
                  yoyo: true,
                  repeat: -1,
                  ease: 'sine.inOut',
                });
              },
            },
          );
        },
      });

      // Hover animations for feature cards only
      gsap.utils.toArray('.feature-card').forEach((card: any) => {
        // Set initial state
        gsap.set(card, { y: 0, boxShadow: 'none' });
        gsap.set(card.querySelector('.card-icon'), { scale: 1, rotate: 0 });

        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -6,
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            duration: 0.1,
            ease: 'power2.out',
          });
          gsap.to(card.querySelector('.card-icon'), {
            scale: 1.1,
            rotate: 5,
            duration: 0.1,
            ease: 'power2.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            boxShadow: 'none',
            duration: 0.1,
            ease: 'power2.out',
          });
          gsap.to(card.querySelector('.card-icon'), {
            scale: 1,
            rotate: 0,
            duration: 0.1,
            ease: 'power2.out',
          });
        });
      });

      // Payment logo hover animations
      gsap.utils.toArray('.payment-logo').forEach((logo: any) => {
        logo.addEventListener('mouseenter', () => {
          gsap.to(logo, {
            scale: 1.05,
            y: -2,
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            duration: 0.2,
            ease: 'power2.out',
          });
        });
        logo.addEventListener('mouseleave', () => {
          gsap.to(logo, {
            scale: 1,
            y: 0,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            duration: 0.2,
            ease: 'power2.out',
          });
        });
      });

      // Button hover animations
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        button.addEventListener('mouseenter', () => {
          gsap.to(button, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        button.addEventListener('mouseleave', () => {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });

      // Animated background grid
      gsap.to('.grid-background', {
        backgroundPosition: '100% 100%',
        duration: 60,
        ease: 'none',
        repeat: -1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Easy Picsy - Cashless Payment System for dslrBooth',
    description:
      'Add cashless payments to your existing dslrBooth setup. Accept GCash, Maya, and 30+ Philippine banks and e-wallets through the official QRPh standard without replacing your current photobooth system.',
    url: 'https://www.easypicsybooths.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Windows',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'PHP',
      availability: 'https://schema.org/PreOrder',
    },
    provider: {
      '@type': 'Organization',
      name: 'Easy Picsy',
      url: 'https://www.easypicsybooths.com',
      logo: 'https://www.easypicsybooths.com/logo.svg',
      sameAs: ['https://instagram.com/easypicsybooths'],
    },
    featureList: [
      'Works with existing dslrBooth installations',
      'Official QRPh standard with 30+ payment options',
      'GCash, Maya, and all major Philippine banks',
      'Automatic booth unlock and control',
      'Real-time payment processing',
      'BSP-supervised secure payment system',
      'Simple desktop app integration',
      'No hardware changes required',
    ],
    audience: {
      '@type': 'BusinessAudience',
      audienceType: 'dslrBooth users, photobooth rental businesses, wedding photographers, event suppliers',
    },
  };

  return (
    <div className="min-h-screen relative" ref={heroRef}>
      <Suspense fallback={null}>
        <AuthCallbackHandler />
      </Suspense>
      <AnimatedBackground />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

      <nav ref={navRef} className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-50">
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image src="/logo.svg" alt="Easy Picsy" width={32} height={32} className="h-8 w-auto transition-all duration-300 cursor-pointer" />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="#features" className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium">
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium"
              >
                How it Works
              </a>
              <a href="#benefits" className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium">
                Benefits
              </a>
              <a
                href="#waitlist"
                className="bg-easy-yellow text-easy-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-easy-yellow/90 transition-all duration-300"
              >
                Join Waitlist
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-4 bg-[#f9fafb] relative overflow-hidden">
        <div
          className="absolute inset-0 z-0 grid-background"
          style={{
            backgroundImage: `
              linear-gradient(to right, #d1d5db 1px, transparent 1px),
              linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
            maskImage: 'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div ref={heroContentRef}>
              <div className="inline-block bg-easy-yellow/20 px-4 py-2 rounded-full mb-6">
                <span className="text-sm font-semibold text-easy-black flex items-center gap-2">
                  ⚡ Official QRPh Standard - Works with Your Existing dslrBooth
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Add Cashless Payments
                <br />
                <span className="text-easy-yellow bg-gradient-to-r from-easy-yellow to-yellow-400 bg-clip-text text-transparent">
                  to Your dslrBooth
                </span>
              </h1>

              <p className="text-xl text-gray-600 mb-8">
                Keep your existing dslrBooth setup and{' '}
                <span className="font-semibold text-gray-800">add QR code payments in minutes</span>. Accept GCash,
                Maya, and 30+ other Philippine banks and e-wallets without replacing any hardware.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button
                  ref={ctaButtonRef}
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold bg-easy-yellow text-easy-black hover:bg-easy-yellow/90 hover:shadow-lg transition-all duration-300 rounded-2xl"
                  onClick={handleJoinWaitlist}
                >
                  <span>Join Waitlist</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg font-semibold rounded-2xl"
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span>See How It Works</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-easy-yellow sparkle-icon" />
                  <Sparkles className="w-4 h-4 text-easy-yellow sparkle-icon" />
                  <span className="text-sm font-medium text-gray-600 ml-2">
                    <span className="font-bold text-gray-800">No equipment replacement needed!</span> Works with your
                    current setup
                  </span>
                  <Sparkles className="w-4 h-4 text-easy-yellow sparkle-icon" />
                  <Sparkles className="w-4 h-4 text-easy-yellow sparkle-icon" />
                </div>
              </div>
            </div>

            <div ref={heroImageRef} className="relative">
              <div className="relative">
                <div className="bg-white rounded-3xl p-8 shadow-xl">
                  <div className="aspect-square bg-gradient-to-br from-easy-yellow/20 to-easy-yellow/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <MonitorSpeaker className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                        <div className="absolute -top-2 -right-2">
                          <div ref={floatingQrRef} className="bg-easy-yellow rounded-lg p-2">
                            <QrCode className="w-8 h-8 text-easy-black" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-3 h-3 bg-easy-yellow rounded-full animate-pulse"></div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <Smartphone className="w-6 h-6 text-easy-yellow" />
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <DollarSign className="w-6 h-6 text-green-500" />
                      </div>

                      <p className="text-sm text-gray-600 font-medium">Scan → Pay → Booth Unlocks</p>
                    </div>
                  </div>
                </div>

                <div className="absolute -top-6 -right-6 w-16 h-16 bg-easy-yellow/20 rounded-2xl blur-xl"></div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-easy-yellow/15 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Supported Payment Methods Section */}
      {/* <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-easy-black mb-4">
              Accepts All Major Philippine Payment Methods
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Your customers can pay with their preferred method using QRPh - the official Philippine QR code standard
              supervised by BSP
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 flex-wrap max-w-4xl mx-auto">
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-blue-600 font-bold text-xl">GCash</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-green-600 font-bold text-xl">Maya</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-blue-500 font-bold text-lg">BPI</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-orange-600 font-bold text-lg">BDO</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-red-600 font-bold text-lg">UnionBank</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-purple-600 font-bold text-lg">MetroBank</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-indigo-600 font-bold text-lg">RCBC</span>
            </div>
            <div className="payment-logo bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-center min-w-[100px] h-16 hover:shadow-md transition-all duration-200">
              <span className="text-teal-600 font-bold text-lg">PNB</span>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              And 22+ more banks and e-wallets through the official QRPh payment network
            </p>
          </div>
        </div>
      </section> */}

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">Setup in Just 4 Simple Steps</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From setup to earning - watch how easy it is to add cashless payments to your dslrBooth
            </p>
          </div>

          <div ref={processStepsRef} className="relative">
            {/* Desktop arrows - hidden on mobile */}
            <div className="hidden lg:block absolute top-20 left-0 right-0 h-1 pointer-events-none">
              <div className="flex justify-between items-center h-full max-w-5xl mx-auto px-16">
                <div className="animated-arrow flex-1 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-easy-yellow/60" />
                </div>
                <div className="animated-arrow flex-1 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-easy-yellow/60" />
                </div>
                <div className="animated-arrow flex-1 flex items-center justify-center">
                  <ArrowRight className="w-8 h-8 text-easy-yellow/60" />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <div className="process-step text-center relative">
                <div className="step-number w-16 h-16 bg-easy-yellow rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-easy-black">1</span>
                </div>
                <div className="card-icon mb-4">
                  <Globe className="w-12 h-12 text-easy-yellow mx-auto" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">Create Event Online</h3>
                <p className="text-gray-600">Log into our web app and create your event with pricing details</p>
              </div>

              <div className="process-step text-center relative">
                <div className="step-number w-16 h-16 bg-easy-yellow rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-easy-black">2</span>
                </div>
                <div className="card-icon mb-4">
                  <MonitorSpeaker className="w-12 h-12 text-easy-yellow mx-auto" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">Start Our Desktop App</h3>
                <p className="text-gray-600">Run our app on your dslrBooth computer and select your event</p>
              </div>

              <div className="process-step text-center relative">
                <div className="step-number w-16 h-16 bg-easy-yellow rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-easy-black">3</span>
                </div>
                <div className="card-icon mb-4">
                  <Smartphone className="w-12 h-12 text-easy-yellow mx-auto" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">Guest Pays with Phone</h3>
                <p className="text-gray-600">
                  Guest scans QR code and pays instantly with GCash, Maya, or any Philippine bank app
                </p>
              </div>

              <div className="process-step text-center relative">
                <div className="step-number w-16 h-16 bg-easy-yellow rounded-full flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="text-2xl font-bold text-easy-black">4</span>
                </div>
                <div className="card-icon mb-4">
                  <Zap className="w-12 h-12 text-easy-yellow mx-auto" />
                </div>
                <h3 className="text-lg font-bold mb-3 text-gray-800">Everything is Automatic</h3>
                <p className="text-gray-600">Our app handles booth unlock, session management, and locking</p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <div className="celebration-box inline-block bg-gradient-to-br from-easy-yellow/20 via-yellow-100/30 to-easy-yellow/10 border-2 border-easy-yellow/30 rounded-3xl p-8 relative overflow-hidden">
              {/* Floating confetti inside the box */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Top layer confetti - will float down */}
                <div className="confetti-container absolute inset-0">
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-easy-yellow rounded-full"
                    style={{ left: '10%', top: '-10px', animationDelay: '0s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-3 h-3 bg-red-400 rounded-sm rotate-45"
                    style={{ left: '20%', top: '-10px', animationDelay: '0.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-3 bg-blue-400"
                    style={{ left: '30%', top: '-10px', animationDelay: '1s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-green-400 rounded-full"
                    style={{ left: '40%', top: '-10px', animationDelay: '1.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-3 h-2 bg-purple-400 rotate-12"
                    style={{ left: '50%', top: '-10px', animationDelay: '2s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-pink-400 rounded-full"
                    style={{ left: '60%', top: '-10px', animationDelay: '2.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-3 bg-orange-400"
                    style={{ left: '70%', top: '-10px', animationDelay: '3s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-3 h-3 bg-teal-400 rounded-sm rotate-45"
                    style={{ left: '80%', top: '-10px', animationDelay: '3.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-yellow-300 rounded-full"
                    style={{ left: '90%', top: '-10px', animationDelay: '4s' }}
                  ></div>

                  {/* Second wave */}
                  <div
                    className="confetti-piece absolute w-3 h-3 bg-indigo-400 rounded-sm"
                    style={{ left: '15%', top: '-10px', animationDelay: '4.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-rose-400 rounded-full"
                    style={{ left: '25%', top: '-10px', animationDelay: '5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-3 bg-cyan-400 rotate-45"
                    style={{ left: '35%', top: '-10px', animationDelay: '5.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-3 h-2 bg-lime-400"
                    style={{ left: '45%', top: '-10px', animationDelay: '6s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-amber-400 rounded-full"
                    style={{ left: '55%', top: '-10px', animationDelay: '6.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-3 h-3 bg-violet-400 rotate-12"
                    style={{ left: '65%', top: '-10px', animationDelay: '7s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-3 bg-emerald-400"
                    style={{ left: '75%', top: '-10px', animationDelay: '7.5s' }}
                  ></div>
                  <div
                    className="confetti-piece absolute w-2 h-2 bg-easy-yellow rounded-full"
                    style={{ left: '85%', top: '-10px', animationDelay: '8s' }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center text-center text-easy-black relative z-10">
                <div className="celebration-emoji text-5xl mb-4">🎉</div>
                <div className="mb-2">
                  <span className="text-xl font-bold">
                    That&apos;s it! Your dslrBooth now accepts cashless payments
                  </span>
                </div>
                <p className="text-sm text-gray-600 font-medium">Start earning more money from every event! 💰</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">Why Business Owners Love This</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real benefits that make your photobooth business more profitable and easier to run
            </p>
          </div>

          <div ref={featureCardsRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
              <div className="card-icon w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Guarantee Payment Before Use</h3>
              <p className="text-gray-600 leading-relaxed">
                Every person who uses your booth has paid first through the secure, BSP-supervised QRPh system. No more
                guests skipping payment
              </p>
            </div>

            <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
              <div className="card-icon w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">No More Cash Handling</h3>
              <p className="text-gray-600 leading-relaxed">
                Stop counting money, making change, or worrying about theft. Everything is digital and automatic
              </p>
            </div>

            <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
              <div className="card-icon w-16 h-16 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mb-6">
                <MonitorSpeaker className="w-8 h-8 text-easy-yellow" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Keep Your Current Setup</h3>
              <p className="text-gray-600 leading-relaxed">
                No need to replace dslrBooth or buy new hardware. Works with what you already have
              </p>
            </div>

            <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
              <div className="card-icon w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Automatic Booth Control</h3>
              <p className="text-gray-600 leading-relaxed">
                Payment unlocks booth, session ends and locks again. No manual intervention needed
              </p>
            </div>

            <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
              <div className="card-icon w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                <QrCode className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Automatic QR Code Display</h3>
              <p className="text-gray-600 leading-relaxed">
                Our app automatically generates and displays QR codes on your booth screen - no printing needed!
              </p>
            </div>

            <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
              <div className="card-icon w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Government-Standard Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Trust the official QRPh payment standard supervised by BSP. Secure, tamper-proof payments with instant
                confirmation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">Everyone Wins</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Benefits for you, your guests, and your events</p>
          </div>

          <div ref={benefitCardsRef} className="grid md:grid-cols-3 gap-8">
            <div className="benefit-card ">
              <div className="bg-easy-yellow/10 rounded-3xl p-8 hover:bg-easy-yellow/20 transition-all duration-300 hover:shadow-lg">
                <div className="card-icon w-20 h-20 bg-easy-yellow rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">👑</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">For Business Owners</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    More revenue per event
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Less work and worry
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Professional modern image
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Real-time earnings tracking
                  </li>
                </ul>
              </div>
            </div>

            <div className="benefit-card ">
              <div className="bg-blue-50 rounded-3xl p-8 hover:bg-blue-100 transition-all duration-300 hover:shadow-lg">
                <div className="card-icon w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">😊</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">For Your Guests</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Quick, easy payments
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    No need for exact change
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Use any Philippine bank or e-wallet app
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Modern, convenient experience
                  </li>
                </ul>
              </div>
            </div>

            <div className="benefit-card ">
              <div className="bg-purple-50 rounded-3xl p-8 hover:bg-purple-100 transition-all duration-300 hover:shadow-lg">
                <div className="card-icon w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800 text-center">For Your Events</h3>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Faster moving lines
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Happier, satisfied guests
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    More photos taken
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                    Professional event experience
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="waitlist" className="py-20 bg-[#f8fafc] relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '20px 30px',
            WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
          }}
        />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="mb-12">
            <div className="inline-block bg-easy-yellow/20 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-easy-black flex items-center gap-2">⚡ Ready to Launch</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-easy-black mb-6 leading-tight">
              Transform Your dslrBooth
              <br />
              <span className="text-easy-yellow bg-gradient-to-r from-easy-yellow to-yellow-400 bg-clip-text text-transparent">
                Into a Money Machine
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Be among the first dslrBooth owners to add cashless payments to your business
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">Priority Access</h3>
              <p className="text-sm text-gray-600">Be first to add cashless payments</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-800 mb-2">Special Pricing</h3>
              <p className="text-sm text-gray-600">Exclusive launch discounts</p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="text-2xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-800 mb-2">Priority Support</h3>
              <p className="text-sm text-gray-600">Direct access to our team</p>
            </div>
          </div>

          <div>
            <Button
              size="lg"
              className="px-10 py-4 text-xl font-bold bg-easy-yellow text-easy-black hover:bg-easy-yellow/90 transition-all duration-300 rounded-2xl shadow-lg"
              onClick={handleJoinWaitlist}
            >
              <span>Join Waitlist Now</span>
              <ArrowRight className="w-6 h-6 ml-2" />
            </Button>
            <p className="text-sm text-gray-500 mt-4">Join the waitlist and start earning more from your dslrBooth</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-easy-black text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="mb-4">
              <Image
                src="/logo.svg"
                alt="Easy Picsy"
                width={32}
                height={32}
                className="h-8 w-auto brightness-0 invert mx-auto transition-all duration-300"
              />
            </div>
            <p className="text-gray-400 mb-4">Cashless payments for your dslrBooth. More revenue, less work.</p>
            <div className="flex justify-center space-x-6 mb-4">
              <a
                href="https://instagram.com/easypicsybooths"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://easypicsybooths.com" className="text-gray-400 hover:text-easy-yellow transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@easypicsybooths.com"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500">&copy; 2025 Easy Picsy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {showForm && <FilloutPopupEmbed filloutId="3CDJbwoL6aus" inheritParameters onClose={() => setShowForm(false)} />}
    </div>
  );
}
