"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Star, Clock, Sparkles, Leaf } from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { services, testimonials } from "@/lib/data";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const floatAnimation = {
  initial: { y: 0 },
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const rotatingWords = ["Body's Balance", "Inner Peace", "Natural Glow", "Vitality"];

export default function Home() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-primary/20 bg-[#faf9f6] text-[#1f2937]">
      <Navbar />

      <main className="flex-grow pt-24">
        {/* HERO SECTION - 2 Column Layout */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-[#faf9f6]">
          {/* Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-5 pointer-events-none">
            <Image
              src="https://www.transparenttextures.com/patterns/cubes.png"
              alt="Pattern"
              fill
              className="object-cover"
            />
          </div>

          <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8 text-center lg:text-left order-2 lg:order-1"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 rounded-full bg-[#2d5016]/10 px-4 py-1.5 text-sm font-bold text-[#2d5016] mx-auto lg:mx-0">
                <Sparkles className="w-4 h-4" />
                <span>Holistic Healing in Vadodara</span>
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-[#1f2937] leading-[1.1] min-h-[160px]">
                Restore Your <br />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="text-[#2d5016] italic block"
                  >
                    {rotatingWords[index]}
                  </motion.span>
                </AnimatePresence>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl text-[#6b7280] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Dr. Priyanka's Clinic offers authentic Naturopathy, Yoga, and Diet therapy to help you heal naturally and live consistently.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
                <Button variant="default" size="lg" className="h-14 px-8 text-lg rounded-full shadow-[0_4px_14px_rgba(45,80,22,0.3)] hover:shadow-xl transition-all" asChild>
                  <Link href="/book">Book Consultation</Link>
                </Button>
                <Button variant="secondary" size="lg" className="h-14 px-8 text-lg rounded-full border-2 border-[#2d5016] text-[#2d5016] hover:bg-[#2d5016]/5" asChild>
                  <Link href="/services">Explore Treatments</Link>
                </Button>
              </motion.div>

              <motion.div variants={fadeIn} className="flex items-center justify-center lg:justify-start gap-8 pt-8 text-sm text-[#6b7280]">
                <div className="flex items-center gap-2">
                  <div className="bg-[#2d5016]/10 p-2 rounded-full text-[#2d5016]"><Star className="w-4 h-4 fill-current" /></div>
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="bg-[#2d5016]/10 p-2 rounded-full text-[#2d5016]"><Leaf className="w-4 h-4" /></div>
                  <span>100% Natural</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual - Animated Floating Elements */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative h-[600px] hidden lg:block order-1 lg:order-2"
            >
              {/* Breathing Aura Effect - Back Layer */}
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#9caf88]/20 rounded-full blur-3xl z-0"
              />

              {/* Static Organic Blob Wrapper (No Rotation) */}
              <div className="absolute top-10 right-10 w-[450px] h-[550px] z-10 flex items-center justify-center">
                <div className="relative w-full h-full rounded-[40%_60%_70%_30%/40%_50%_60%_50%] overflow-hidden shadow-2xl border-4 border-white bg-white">
                  <Image
                    src="https://cdnl.iconscout.com/lottie/premium/thumb/meditation-animation-gif-download-3570065.gif"
                    alt="Woman Meditating Animation"
                    fill
                    className="object-cover scale-110"
                    unoptimized // Essential for external GIFs to play correctly
                    priority
                  />
                </div>
              </div>

              {/* Floating Leaves Animation - Kept subtle */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-20 left-20 z-20 bg-white p-3 rounded-full shadow-lg"
              >
                <Leaf className="w-8 h-8 text-[#2d5016]" />
              </motion.div>

              <motion.div
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-40 right-10 z-20 bg-white p-4 rounded-full shadow-lg"
              >
                <Sparkles className="w-6 h-6 text-[#e07a5f]" />
              </motion.div>


            </motion.div>
          </div>
        </section>



        {/* CONDITIONS WE TREAT */}
        <section className="py-20 bg-[#faf9f6]">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-[#2d5016] mb-4">Conditions We Treat</h2>
              <p className="text-[#6b7280] max-w-2xl mx-auto">
                Specialized natural treatments for a wide range of chronic and acute ailments.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                "Sinusitis", "Asthma", "Cervical Spondylitis", "Back Pain",
                "Knee Pain", "Frozen Shoulder", "Skin Treatment", "Boost Immunity",
                "General Ailments", "Acidity", "Weight Loss", "Obesity",
                "Face Rejuvination", "General Health"
              ].map((condition, idx) => (
                <div key={idx} className="bg-white border border-[#2d5016]/20 text-[#2d5016] px-6 py-3 rounded-full shadow-sm hover:shadow-md hover:bg-[#2d5016] hover:text-white transition-all cursor-default font-medium">
                  {condition}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES PREVIEW */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-serif font-bold text-[#2d5016]">Our Core Therapies</h2>
              <p className="text-[#6b7280] max-w-2xl mx-auto">
                Comprehensive range of natural treatments designed to restore harmony.
              </p>
            </div>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {services.slice(0, 3).map((service) => (
                <motion.div key={service.id} variants={fadeIn}>
                  <Card hoverEffect className="h-full flex flex-col group cursor-pointer bg-white border-0 shadow-sm hover:shadow-xl transition-shadow">
                    <div className="relative h-64 w-full overflow-hidden rounded-t-2xl">
                      <Image
                        src={service.image}
                        alt={service.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <CardContent className="flex-grow p-8">
                      <div className="mb-3 px-3 py-1 bg-[#2d5016]/10 text-[#2d5016] text-xs font-bold uppercase tracking-wider inline-block rounded-full">
                        {service.category}
                      </div>
                      <h3 className="text-2xl font-serif font-bold mb-3 text-[#1f2937] group-hover:text-[#2d5016] transition-colors">
                        {service.name}
                      </h3>
                      <p className="text-[#6b7280] line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </CardContent>
                    <CardFooter className="p-8 pt-0 flex justify-between items-center mt-auto bg-white">
                      <div className="flex items-center text-sm font-medium text-[#6b7280]">
                        <Clock className="w-4 h-4 mr-2" />
                        {service.duration}
                      </div>
                      <Link href={`/services/${service.id}`} className="inline-flex items-center text-[#2d5016] font-semibold hover:underline">
                        Learn More <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-16">
              <Button variant="outline" size="lg" className="rounded-full h-12 px-8 border-2 border-[#e5e7eb] text-[#1f2937] hover:bg-gray-50" asChild>
                <Link href="/services">View Full Menu</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-[#f2e9e4]/40">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <h2 className="text-4xl font-serif font-bold text-center mb-16 text-[#1f2937]">
              Healing Stories
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((t) => (
                <Card key={t.id} className="bg-white border-none p-8 relative overflow-visible shadow-md">
                  <div className="absolute -top-6 left-8 bg-[#e07a5f] text-white p-3 rounded-xl shadow-lg">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <div className="mt-6 mb-6">
                    <p className="text-lg text-[#1f2937] italic font-serif leading-relaxed">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden relative border border-gray-200">
                      {/* Placeholder avatar if no image */}
                      <div className="absolute inset-0 bg-[#2d5016]/10 flex items-center justify-center font-bold text-[#2d5016]">
                        {t.name[0]}
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[#1f2937]">{t.name}</div>
                      <div className="text-sm text-[#6b7280]">{t.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden bg-[#9caf88] text-white">
          <div className="container relative z-10 px-6 md:px-12 lg:px-24 text-center">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">Begin Your Wellness Journey</h2>
            <p className="text-xl opacity-90 mb-10 max-w-2xl mx-auto text-white/90">
              Ready to restore your natural balance? Schedule your consultation with Dr. Priyanka today.
            </p>
            <Button size="lg" variant="default" className="bg-white text-[#2d5016] hover:bg-white/90 h-16 px-10 text-lg rounded-full font-bold shadow-lg mt-4" asChild>
              <Link href="/book">Booking Available Now</Link>
            </Button>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
