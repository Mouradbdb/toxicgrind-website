'use client';

import { motion, Variants } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.25 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut', duration: 0.5 } },
  };

  interface Feature {
    title: string;
    desc: string;
    icon: string;
  }

  const features: Feature[] = [
    { title: 'Set Study Goals', desc: 'Plan your week with custom hours', icon: '📝' },
    { title: 'Pomodoro Focus', desc: '25-minute sessions for max focus', icon: '⏲️' },
    { title: 'Track Progress', desc: 'Monitor hours and streaks', icon: '📈' },
  ];

  interface Screenshot {
    src: string;
    alt: string;
    caption: string;
  }

  const screenshots: Screenshot[] = [
    { src: '/screenshots/set-goals.jpg', alt: 'Set subjects and goals in StudyFlow', caption: 'Set Goals with Ease' },
    { src: '/screenshots/pomodoro-timer.jpg', alt: 'Pomodoro timer in StudyFlow', caption: 'Master Focus Time' },
    { src: '/screenshots/stats-tracking.jpg', alt: 'Track stats and streaks in StudyFlow', caption: 'Track Your Wins' },
    { src: '/screenshots/subject-progress.jpg', alt: 'Subject progress and trends in StudyFlow', caption: 'See Your Growth' },
  ];

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email!');
      return;
    }

    setStatus('submitting');
    try {
      const docRef = await addDoc(collection(db, 'waitlist'), {
        email,
        joinedAt: serverTimestamp(),
        source: 'prelaunch-website',
        status: 'pending',
      });
      console.log('User added with ID:', docRef.id);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error adding user:', error);
      setStatus('error');
      setErrorMessage('Oops! Something went wrong. Try again.');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#181D27] to-[#2A3240] text-[#FAFAFA] font-sans">
      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-12 sm:py-16 md:py-20 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#574AE2_0%,transparent_70%)] opacity-20 pointer-events-none z-0"></div>
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-[#574AE2] relative z-10 py-2 sm:py-4"
          style={{ background: 'linear-gradient(to right, #574AE2, #F1D302)', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}
        >
          StudyFlow
        </motion.h1>
        <motion.p
          variants={itemVariants}
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-2xl text-[#E0E0E0] max-w-xl relative z-10"
        >
          Master your study routine with smart goals, focused timers, and real-time progress.
        </motion.p>
        <motion.div variants={itemVariants} className="mt-6 sm:mt-10 relative z-10">
          <a
            href="#join"
            className="inline-block bg-[#574AE2] text-[#FAFAFA] px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg shadow-lg hover:bg-[#F1D302] hover:text-[#181D27] transition-all duration-300"
          >
            Join the Waitlist
          </a>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#181D27]/90">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#574AE2] mb-10 sm:mb-12 md:mb-16"
          >
            Your Study Superpowers
          </motion.h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(87, 74, 226, 0.2)' }}
                className="flex-1 p-4 sm:p-6 bg-[#222831] rounded-xl shadow-md border border-[#574AE2]/20"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 text-[#F1D302]">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-[#FAFAFA]">{feature.title}</h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-[#E0E0E0]">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Premium Screenshots Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-[#1E252F] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#574AE2_0%,transparent_70%)] opacity-15 pointer-events-none"></div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 text-center relative z-10"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#574AE2] mb-10 sm:mb-12 md:mb-12 tracking-wide"
          >
            Experience StudyFlow
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {screenshots.map((screenshot) => (
              <motion.div
                key={screenshot.src}
                variants={itemVariants}
                whileHover={{ scale: 1.03, boxShadow: '0 12px 24px rgba(87, 74, 226, 0.3)' }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex flex-col items-center bg-[#181D27]/50 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg border border-[#574AE2]/20 will-change-transform"
              >
                <div className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px]">
                  <img
                    src={screenshot.src}
                    alt={screenshot.alt}
                    className="w-full h-auto object-contain rounded-lg"
                    onError={() => console.error(`Failed to load ${screenshot.src}`)}
                  />
                </div>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl font-semibold text-[#FAFAFA] tracking-tight">{screenshot.caption}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={itemVariants} className="mt-10 sm:mt-12 md:mt-16">
            <a
              href="#join"
              className="inline-block bg-gradient-to-r from-[#574AE2] to-[#F1D302] text-[#181D27] px-6 py-3 sm:px-8 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-[0_0_15px_rgba(241,211,2,0.5)] transition-all duration-300"
            >
              Begin Your Journey
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* Waitlist Section */}
      <section id="join" className="py-12 sm:py-16 md:py-24 bg-[#181D27] border-t border-[#574AE2]/30">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#574AE2] mb-6 sm:mb-8"
          >
            Unlock StudyFlow Early
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-lg text-[#E0E0E0] mb-8 sm:mb-10 md:mb-12 max-w-lg mx-auto"
          >
            Join the waitlist for early access to StudyFlow’s game-changing tools.
          </motion.p>
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 sm:flex-row sm:gap-6 max-w-xl mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={status === 'submitting'}
              className="flex-1 px-4 py-3 sm:px-6 sm:py-4 bg-[#1E252F] border border-[#574AE2]/30 rounded-lg text-[#FAFAFA] placeholder-[#B0B0B0] text-sm sm:text-base focus:outline-none focus:border-[#574AE2] focus:shadow-[0_0_8px_rgba(87,74,226,0.4)] transition-all duration-300"
            />
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              whileHover={{ scale: 1.05, boxShadow: '0 0 10px rgba(87, 74, 226, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#574AE2] text-[#FAFAFA] px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-sm sm:text-lg hover:bg-[#6A5BFF] transition-all duration-300 disabled:bg-[#574AE2]/50 disabled:cursor-not-allowed shadow-md"
            >
              {status === 'submitting' ? 'Joining...' : 'Join Now'}
            </motion.button>
          </motion.form>
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 sm:mt-6 text-[#574AE2] font-medium text-sm sm:text-base"
            >
              You’re in! Get ready to flow.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 sm:mt-6 text-[#F05252] font-medium text-sm sm:text-base"
            >
              {errorMessage}
            </motion.p>
          )}
          <motion.p
            variants={itemVariants}
            className="mt-6 sm:mt-8 text-xs sm:text-sm text-[#A0A0A0]"
          >
            © {new Date().getFullYear()} StudyFlow. All rights reserved.
          </motion.p>
        </motion.div>
      </section>
    </div>
  );
}