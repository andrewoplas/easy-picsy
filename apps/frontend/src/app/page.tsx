'use client';

import AnimatedBackground from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import {
  useFloatingAnimation,
  useHoverAnimation,
  useStaggerAnimation,
} from '@/hooks/useGSAPAnimations';
import { FilloutPopupEmbed } from '@fillout/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  BarChart3,
  Camera,
  Check,
  DollarSign,
  Globe,
  Instagram,
  Mail,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const [showForm, setShowForm] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const heroImageRef = useRef<HTMLDivElement>(null);
  const featureCardsRef = useStaggerAnimation(0.08, {}, '.feature-card');
  const timelineRef = useRef<HTMLDivElement>(null);
  const guestStepsRef = useStaggerAnimation(0.15, {}, 'children');
  const resourceCardsRef = useStaggerAnimation(0.12, {}, 'children');
  const floatingCameraRef = useFloatingAnimation(15, 4);
  const ctaButtonRef = useHoverAnimation<HTMLButtonElement>(
    { scale: 1.1, rotate: 2 },
    { scale: 1, rotate: 0 }
  );

  const handleJoinWaitlist = () => {
    setShowForm(true);
  };

  useEffect(() => {
    // Check if animations have already run
    const hasAnimated = sessionStorage.getItem('landingAnimated');

    const ctx = gsap.context(() => {
      // Only run entrance animations if not already animated
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
          }
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
            }
          );
        }

        if (heroImageRef.current) {
          gsap.fromTo(
            heroImageRef.current,
            {
              opacity: 0,
              scale: 0.8,
              rotate: -10,
            },
            {
              opacity: 1,
              scale: 1,
              rotate: 0,
              duration: 1.5,
              ease: 'elastic.out(1, 0.8)',
              delay: 0.8,
              onComplete: () => {
                // Mark animations as completed
                sessionStorage.setItem('landingAnimated', 'true');
              },
            }
          );
        }
      } else {
        // If already animated, just set elements to their final state
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

      // Continuous animations (these should always run)
      if (heroImageRef.current) {
        gsap.to(heroImageRef.current, {
          y: 20,
          duration: 3,
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

      if (timelineRef.current) {
        const timelineItems =
          timelineRef.current.querySelectorAll('.timeline-item');

        ScrollTrigger.create({
          trigger: timelineRef.current,
          start: 'top 70%',
          once: true, // Only trigger once
          onEnter: () => {
            gsap.fromTo(
              '.timeline-line',
              { scaleY: 0 },
              {
                scaleY: 1,
                duration: 1.5,
                ease: 'power2.inOut',
                transformOrigin: 'top',
              }
            );

            timelineItems.forEach((item, index) => {
              const isLeft = index % 2 === 0;
              gsap.fromTo(
                item,
                {
                  opacity: 0,
                  x: isLeft ? -100 : 100,
                  scale: 0.8,
                },
                {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.8,
                  delay: index * 0.2,
                  ease: 'power3.out',
                }
              );

              const dot = item.querySelector('.timeline-dot');
              if (dot) {
                gsap.fromTo(
                  dot,
                  { scale: 0 },
                  {
                    scale: 1,
                    duration: 0.5,
                    delay: index * 0.2 + 0.3,
                    ease: 'back.out(1.7)',
                  }
                );
              }
            });
          },
        });
      }

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

      gsap.utils.toArray('.feature-card').forEach((card: any) => {
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            y: -4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(card.querySelector('.feature-icon'), {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            y: 0,
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            duration: 0.3,
            ease: 'power2.out',
          });
          gsap.to(card.querySelector('.feature-icon'), {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      });

      gsap.to('.grid-background', {
        backgroundPosition: '100% 100%',
        duration: 60, // Slowed down from 20 to 60 seconds
        ease: 'none',
        repeat: -1,
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Easy Picsy',
    description:
      'Professional photobooth management software with GCash payments, real-time analytics, and white-label branding for rental businesses in the Philippines.',
    url: 'https://easypicsy.com',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'PHP',
      availability: 'https://schema.org/PreOrder',
    },
    provider: {
      '@type': 'Organization',
      name: 'Easy Picsy',
      url: 'https://easypicsy.com',
      logo: 'https://easypicsy.com/logo.svg',
      sameAs: ['https://instagram.com/easypicsybooths'],
    },
    featureList: [
      'GCash and QRPh payment integration',
      'Real-time analytics dashboard',
      'Cloud-based event management',
      'White-label branding tools',
      'Compatible with existing hardware',
      'Drag-and-drop customization',
    ],
    audience: {
      '@type': 'BusinessAudience',
      audienceType:
        'Photobooth rental businesses, wedding photographers, event suppliers',
    },
  };

  return (
    <div className="min-h-screen relative" ref={heroRef}>
      <AnimatedBackground />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <nav
        ref={navRef}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 z-50"
      >
        <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/logo.svg"
                alt="Easy Picsy"
                className="h-8 w-auto transition-all duration-300 cursor-pointer"
              />
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="#why-easy-picsy"
                className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-easy-black transition-colors text-sm font-medium"
              >
                How it Works
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

      <section className="pt-32 pb-24 px-4 bg-[#f9fafb] relative overflow-hidden">
        {/* Diagonal Fade Grid Background - Top Right */}
        <div
          className="absolute inset-0 z-0 grid-background"
          style={{
            backgroundImage: `
              linear-gradient(to right, #d1d5db 1px, transparent 1px),
              linear-gradient(to bottom, #d1d5db 1px, transparent 1px)
            `,
            backgroundSize: '32px 32px',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
            maskImage:
              'radial-gradient(ellipse 80% 80% at 100% 0%, #000 50%, transparent 90%)',
          }}
        />

        <div className="container mx-auto max-w-6xl relative z-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div ref={heroContentRef}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Professional Photobooth Software
                <br />
                <span className="text-easy-yellow bg-gradient-to-r from-easy-yellow to-yellow-400 bg-clip-text text-transparent">
                  with Cashless Payments
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Easy Picsy is the modern photobooth management software that{' '}
                <span className="font-semibold text-gray-800">
                  automates GCash payments, event branding, and real-time
                  analytics
                </span>{' '}
                for photobooth rental businesses in the Philippines.
              </p>

              <div className="mb-8">
                <Button
                  ref={ctaButtonRef}
                  size="lg"
                  className="w-full sm:w-auto px-8 py-4 text-lg font-semibold bg-easy-yellow text-easy-black hover:bg-easy-yellow/90 hover:shadow-lg transition-all duration-300 rounded-2xl group"
                  onClick={handleJoinWaitlist}
                >
                  <span>Join the waitlist</span>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4 text-easy-yellow sparkle-icon" />
                  <Sparkles className="w-4 h-4 text-easy-yellow sparkle-icon" />
                  <span className="text-sm font-medium text-gray-600 ml-2">
                    Exclusive to the{' '}
                    <span className="font-bold text-gray-800">
                      first 100 suppliers only!
                    </span>
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
                      <div ref={floatingCameraRef}>
                        <Camera className="w-24 h-24 text-easy-yellow mx-auto mb-4" />
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-8">
                        <div className="w-8 h-8 bg-easy-yellow/30 rounded-lg animate-pulse"></div>
                        <div
                          className="w-8 h-8 bg-easy-yellow/40 rounded-lg animate-pulse"
                          style={{ animationDelay: '0.5s' }}
                        ></div>
                        <div
                          className="w-8 h-8 bg-easy-yellow/30 rounded-lg animate-pulse"
                          style={{ animationDelay: '1s' }}
                        ></div>
                      </div>
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

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">
              Complete Photobooth Business Solution
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything photobooth suppliers need to streamline operations,
              increase revenue, and deliver exceptional guest experiences at
              weddings, parties, and corporate events.
            </p>
          </div>

          <div ref={featureCardsRef} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
                <div className="feature-icon w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-8 h-8 text-easy-black" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Fast Photobooth Setup
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Launch your photobooth rental in minutes with our
                  drag-and-drop interface. Perfect for wedding photobooths and
                  event photography businesses.
                </p>
              </div>
              <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
                <div className="feature-icon w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mb-6">
                  <DollarSign className="w-8 h-8 text-easy-black" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  GCash & QRPh Integration
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Accept cashless payments seamlessly with built-in GCash and
                  QRPh support. Increase revenue by 40% with contactless
                  photobooth payments.
                </p>
              </div>
              <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
                <div className="feature-icon w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mb-6">
                  <Globe className="w-8 h-8 text-easy-black" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Cloud-Based Management
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Manage multiple photobooth events remotely through any web
                  browser. Monitor live bookings and update settings from
                  anywhere.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
                <div className="feature-icon w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-easy-black" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Business Analytics Dashboard
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Track photobooth usage, revenue metrics, and guest engagement
                  in real-time. Make data-driven decisions for your rental
                  business growth.
                </p>
              </div>
              <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
                <div className="feature-icon w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mb-6">
                  <Camera className="w-8 h-8 text-easy-black" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  Compatible Hardware Support
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Works with your existing DSLR cameras, photo printers, and
                  tablets. No expensive equipment upgrades needed for your
                  photobooth business.
                </p>
              </div>
              <div className="feature-card bg-white rounded-3xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border">
                <div className="feature-icon w-16 h-16 bg-easy-yellow rounded-2xl flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-easy-black" />
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-800">
                  White-Label Branding
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Create custom branded photobooth experiences for weddings and
                  corporate events. Drag-and-drop editor makes client
                  customization effortless.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">
              Cashless Photobooth Payment System
            </h2>
            <p className="text-lg text-gray-600">
              Streamlined QR code payments for modern photobooth rentals in the
              Philippines
            </p>
          </div>

          <div className="mb-20">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-easy-yellow to-transparent w-24"></div>
                <div className="px-6">
                  <div className="bg-white border-2 border-easy-yellow/20 px-6 py-3 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-easy-black flex items-center gap-2">
                      <span className="text-easy-yellow">👑</span>
                      For Photobooth Owners
                    </h3>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-easy-yellow to-transparent w-24"></div>
              </div>
            </div>

            <div ref={timelineRef} className="relative">
              <div className="timeline-line absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-easy-yellow/30 hidden lg:block"></div>

              <div className="space-y-12 lg:space-y-16">
                <div className="timeline-item relative flex flex-col lg:flex-row items-center">
                  <div className="lg:w-1/2 lg:pr-12 mb-6 lg:mb-0">
                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-easy-yellow rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-easy-black">
                            1
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Add Bank Details Once
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        Link your preferred bank or payout details in your
                        account. One-time setup for seamless transactions.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-dot hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-easy-yellow rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-12">
                    <div className="w-24 h-24 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mx-auto">
                      <DollarSign className="w-12 h-12 text-easy-yellow" />
                    </div>
                  </div>
                </div>

                <div className="timeline-item relative flex flex-col lg:flex-row-reverse items-center">
                  <div className="lg:w-1/2 lg:pl-12 mb-6 lg:mb-0">
                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-easy-yellow rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-easy-black">
                            2
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Enable Cashless
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        Toggle cashless payments on and set your per-use price.
                        Simple switch to modern payments.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-dot hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-easy-yellow rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="lg:w-1/2 lg:pr-12">
                    <div className="w-24 h-24 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Zap className="w-12 h-12 text-easy-yellow" />
                    </div>
                  </div>
                </div>

                <div className="timeline-item relative flex flex-col lg:flex-row items-center">
                  <div className="lg:w-1/2 lg:pr-12 mb-6 lg:mb-0">
                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-easy-yellow rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-easy-black">
                            3
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          It&apos;s Event Day!
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        Payments flow automatically to your dashboard. Real-time
                        tracking of all transactions.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-dot hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-easy-yellow rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="lg:w-1/2 lg:pl-12">
                    <div className="w-24 h-24 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mx-auto">
                      <BarChart3 className="w-12 h-12 text-easy-yellow" />
                    </div>
                  </div>
                </div>

                <div className="timeline-item relative flex flex-col lg:flex-row-reverse items-center">
                  <div className="lg:w-1/2 lg:pl-12 mb-6 lg:mb-0">
                    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-easy-yellow rounded-full flex items-center justify-center mr-4">
                          <span className="text-xl font-bold text-easy-black">
                            4
                          </span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-800">
                          Collect Earnings
                        </h4>
                      </div>
                      <p className="text-gray-600">
                        Withdraw funds anytime, straight to your bank. Instant
                        access to your earnings.
                      </p>
                    </div>
                  </div>
                  <div className="timeline-dot hidden lg:block absolute left-1/2 transform -translate-x-1/2">
                    <div className="w-6 h-6 bg-easy-yellow rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="lg:w-1/2 lg:pr-12">
                    <div className="w-24 h-24 bg-easy-yellow/20 rounded-2xl flex items-center justify-center mx-auto">
                      <Check className="w-12 h-12 text-easy-yellow" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="h-px bg-gradient-to-r from-transparent via-easy-black/30 to-transparent w-24"></div>
                <div className="px-6">
                  <div className="bg-easy-black border-2 border-easy-black/10 px-6 py-3 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <span>📸</span>
                      For Photobooth Guests
                    </h3>
                  </div>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-easy-black/30 to-transparent w-24"></div>
              </div>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="hidden md:block absolute top-20 left-0 right-0 h-1 bg-easy-black/20"></div>

              <div ref={guestStepsRef} className="grid md:grid-cols-3 gap-8">
                <div className="text-center relative">
                  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                    <div className="w-16 h-16 bg-easy-black rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-2xl font-bold text-white">1</span>
                    </div>
                    <div className="hidden md:block absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-easy-black rounded-full border-4 border-white z-20"></div>
                    <h4 className="text-lg font-bold mb-3 text-gray-800">
                      Scan the QR
                    </h4>
                    <p className="text-gray-600">
                      Open your e-wallet, scan, and confirm payment instantly.
                    </p>
                  </div>
                </div>

                <div className="text-center relative">
                  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                    <div className="w-16 h-16 bg-easy-black rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-2xl font-bold text-white">2</span>
                    </div>
                    <div className="hidden md:block absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-easy-black rounded-full border-4 border-white z-20"></div>
                    <h4 className="text-lg font-bold mb-3 text-gray-800">
                      Booth Unlocks
                    </h4>
                    <p className="text-gray-600">
                      Payment verified instantly. Start taking photos!
                    </p>
                  </div>
                </div>

                <div className="text-center relative">
                  <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
                    <div className="w-16 h-16 bg-easy-black rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                      <span className="text-2xl font-bold text-white">3</span>
                    </div>
                    <div className="hidden md:block absolute top-20 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-easy-black rounded-full border-4 border-white z-20"></div>
                    <h4 className="text-lg font-bold mb-3 text-gray-800">
                      Snap & Download
                    </h4>
                    <p className="text-gray-600">
                      Enjoy the booth! Print instantly and download digitally.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="waitlist"
        className="py-20 bg-[#f8fafc] relative overflow-hidden"
      >
        {/* Bottom Fade Grid Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '20px 30px',
            WebkitMaskImage:
              'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
            maskImage:
              'radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)',
          }}
        />

        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="mb-12">
            <div className="inline-block bg-easy-yellow/20 px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-semibold text-easy-black flex items-center gap-2">
                ⚡ Launching Soon
              </span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-easy-black mb-6 leading-tight">
              Transform Your
              <br />
              <span className="text-easy-yellow bg-gradient-to-r from-easy-yellow to-yellow-400 bg-clip-text text-transparent">
                Photobooth Rental Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join 200+ wedding photographers and event suppliers already using
              Easy Picsy
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="font-semibold text-gray-800 mb-2">Early Access</h3>
              <p className="text-sm text-gray-600">
                Be first to try new features
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="text-2xl mb-3">💰</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Special Pricing
              </h3>
              <p className="text-sm text-gray-600">
                Exclusive launch discounts
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="text-2xl mb-3">🏆</div>
              <h3 className="font-semibold text-gray-800 mb-2">
                Priority Support
              </h3>
              <p className="text-sm text-gray-600">Direct access to our team</p>
            </div>
          </div>

          <div>
            <Button
              size="lg"
              className="px-10 py-4 text-xl font-bold bg-easy-yellow text-easy-black hover:bg-easy-yellow/90 transition-all duration-300 rounded-2xl shadow-lg"
              onClick={handleJoinWaitlist}
            >
              <span>Join the Waitlist</span>
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              No spam, just updates on our launch progress
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-easy-black mb-4">
              Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tips, guides, and insights for photobooth business owners
            </p>
          </div>

          <div ref={resourceCardsRef} className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
                <Camera className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Setting Up Your First Event
              </h3>
              <p className="text-gray-600 mb-4">
                A complete guide to getting your photobooth ready for events,
                from hardware setup to guest experience optimization.
              </p>
              <div className="text-sm text-gray-500">Coming Soon</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Maximizing Revenue with Cashless Payments
              </h3>
              <p className="text-gray-600 mb-4">
                Learn how cashless payment integration can increase your revenue
                by 40% and improve guest satisfaction.
              </p>
              <div className="text-sm text-gray-500">Coming Soon</div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border">
              <div className="w-full h-48 bg-gray-100 rounded-xl mb-6 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">
                Using Analytics to Grow Your Business
              </h3>
              <p className="text-gray-600 mb-4">
                Discover which metrics matter most and how to use real-time data
                to make better business decisions.
              </p>
              <div className="text-sm text-gray-500">Coming Soon</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 bg-easy-black text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center">
            <div className="mb-4">
              <img
                src="/logo.svg"
                alt="Easy Picsy"
                className="h-8 w-auto brightness-0 invert mx-auto transition-all duration-300"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Made for owners. Loved by guests.
            </p>
            <div className="flex justify-center space-x-6 mb-4">
              <a
                href="https://instagram.com/easypicsybooths"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://easypicsybooths.com"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="mailto:hello@easypicsybooths.com"
                className="text-gray-400 hover:text-easy-yellow transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <p className="text-sm text-gray-500">
              &copy; 2025 Easy Picsy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {showForm && (
        <FilloutPopupEmbed
          filloutId="3CDJbwoL6aus"
          inheritParameters
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
