'use client';

import { motion, Variants } from 'framer-motion';
import { useState, FormEvent } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './lib/firebase';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut', staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { ease: 'easeOut' } },
  };

  const navLinkVariants: Variants = {
    hover: {
      scale: 1.15,
      color: '#A3E635',
      transition: { type: 'spring', stiffness: 400, damping: 20 },
    },
  };

  interface Feature {
    title: string;
    desc: string;
    color: string;
    icon: string;
  }

  const features: Feature[] = [
    {
      title: 'Savage Motivation',
      desc: 'Get roasted into action with customizable taunts',
      color: 'border-lime-400',
      icon: '🔥',
    },
    {
      title: 'Grind Tracker',
      desc: 'Flex your stats with streaks and progress bars',
      color: 'border-red-500',
      icon: '📊',
    },
    {
      title: 'Focus Sprints',
      desc: 'Lock in with 25-min Pomodoro power sessions',
      color: 'border-purple-500',
      icon: '⏱️',
    },
  ];

  // Email validation
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!validateEmail(email)) {
      setErrorMessage('Enter a valid email, you slacker!');
      return;
    }

    setStatus('submitting');

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, 'waitlist'), {
        email: email,
        joinedAt: serverTimestamp(), // Firebase timestamp
        source: 'prelaunch-website', // Track where they signed up
        status: 'pending', // For future use (e.g., confirmed, invited)
      });

      console.log('User added with ID:', docRef.id); // For debugging
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 5000); // Reset after 5s
    } catch (error) {
      console.error('Error adding user:', error);
      setStatus('error');
      setErrorMessage('Failed to join the waitlist. Try again, champ!');
      setTimeout(() => setStatus('idle'), 3000); // Reset after 3s
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-lime-400/30 z-50 py-4 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <motion.h1
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-extrabold text-lime-400 italic tracking-tight drop-shadow-md"
          >
            ToxicGrind
          </motion.h1>
          <div className="hidden md:flex space-x-10">
            {['Features', 'Register'].map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                variants={navLinkVariants}
                whileHover="hover"
                className="text-lg font-semibold text-gray-200 hover:shadow-lime-400/20 transition-all duration-200"
              >
                {link}
              </motion.a>
            ))}
          </div>
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <motion.svg
              className="w-8 h-8 text-lime-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.4 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </motion.svg>
          </button>
        </div>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-gray-900/95 px-6 py-4 border-t border-lime-400/20"
          >
            {['Features', 'Register'].map((link) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase()}`}
                variants={itemVariants}
                whileHover={{ x: 10 }}
                className="block py-3 text-lg font-semibold text-gray-200 hover:text-lime-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link}
              </motion.a>
            ))}
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-screen flex items-center justify-center pt-24 pb-12 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-lime-400/10 via-transparent to-transparent"
      >
        <div className="text-center px-6 max-w-4xl">
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-lime-400 to-purple-500"
          >
            Grind Hard or <br /> Get Roasted
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl mb-10 text-gray-200 font-medium max-w-2xl mx-auto"
          >
            Join the waitlist to be the first to crush it with ToxicGrind
          </motion.p>
          <motion.a
            href="#register"
            variants={itemVariants}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(163, 230, 53, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-lime-400 text-gray-900 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-lime-300 transition-all duration-300"
          >
            Join the Waitlist
          </motion.a>
        </div>
      </motion.section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-800/50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-lime-400 tracking-wide"
          >
            What’s Coming to Kick Your Ass
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature: Feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{ y: -10, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)' }}
                className={`border-l-4 ${feature.color} p-6 bg-gray-900/50 rounded-xl backdrop-blur-sm hover:bg-gray-900/70 transition-colors`}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Register Section */}
      <section id="register" className="py-24 bg-gray-800/50">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="max-w-7xl mx-auto px-6 text-center"
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl md:text-5xl font-extrabold mb-8 text-lime-400 tracking-wide"
          >
            Get in Before the Grind Begins
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-gray-200 mb-10 font-medium max-w-2xl mx-auto"
          >
            Drop your email to secure your spot on the waitlist
          </motion.p>
          <motion.form
            variants={itemVariants}
            onSubmit={handleSubmit}
            className="max-w-md mx-auto flex flex-col sm:flex-row gap-4"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email, grinder"
              required
              disabled={status === 'submitting'}
              className="flex-1 px-6 py-4 bg-gray-900/50 border border-gray-700 rounded-full text-gray-200 placeholder-gray-500 focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/30 transition-all duration-200 disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={status === 'submitting'}
              whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(163, 230, 53, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="bg-lime-400 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-lime-300 transition-all duration-300 shadow-md disabled:bg-lime-600 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Joining...' : 'Join Now'}
            </motion.button>
          </motion.form>
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-lime-400 font-medium"
            >
              You’re on the waitlist! Get ready to dominate.
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-red-400 font-medium"
            >
              {errorMessage}
            </motion.p>
          )}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-gray-400 text-sm max-w-lg mx-auto"
          >
            We’ll only email you about the launch. No spam, just savage updates.
          </motion.p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-900 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} ToxicGrind. All rights reserved.
          </p>
          <div className="mt-4 flex justify-center gap-6">
            {['Twitter', 'Instagram', 'Discord'].map((social) => (
              <a
                key={social}
                href={`#${social.toLowerCase()}`}
                className="text-gray-400 hover:text-lime-400 transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}