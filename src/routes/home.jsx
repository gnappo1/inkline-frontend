import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router";
import { useScrollFriction } from "../hooks/useScrollFriction.js";

// replace later with your asset
const heroUrl =
    "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=80";


function AnimatedHeadline() {
    const prefersReduced = useReducedMotion();

    // timings
    const DURATION = 1.05; // per-word animation time (was 0.65)
    const STAGGER = 0.45; // gap between words (was 0.22)
    const DELAY = 0.15; // small initial pause
    const EASE = [0.16, 1, 0.3, 1];

    // if user prefers reduced motion, just render the text
    if (prefersReduced) {
        return (
            <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                Write. Share. <span className="text-brand">Connect</span>.
            </h1>
        );
    }

    const container = {
        hidden: {},
        show: {
            transition: {
                delayChildren: DELAY,
                staggerChildren: STAGGER,
            },
        },
    };

    const word = {
        hidden: { y: "0.8em", opacity: 0 },
        show: {
            y: "0em",
            opacity: 1,
            transition: { duration: DURATION, ease: EASE },
        },
    };

    return (
        <motion.h1
            className="text-4xl md:text-5xl font-semibold leading-tight"
            variants={container}
            initial="hidden"
            animate="show"
        >
            <motion.span
                variants={word}
                className="inline-block will-change-transform"
            >
                Write.
            </motion.span>

            <motion.span
                variants={word}
                className="inline-block will-change-transform"
            >
                Share.
            </motion.span>

            <motion.span
                variants={word}
                className="inline-block will-change-transform text-brand"
            >
                Connect.
            </motion.span>
        </motion.h1>
    );
}

function Home() {
    const { yParallax } = useScrollFriction();

    return (
        <div className="space-y-24">
            {/* HERO */}
            <section className="relative overflow-hidden rounded-2xl border border-black/5 dark:border-white/10">
                <div className="grid md:grid-cols-2 gap-0 relative">
                    {/* Copy first on mobile */}
                    <div className="relative p-8 md:p-12 flex flex-col justify-center z-10 order-1 md:order-none">
                        <AnimatedHeadline />

                        <motion.p
                            className="mt-4 text-mute max-w-prose"
                            initial={{ y: 18, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
                        >
                            Inkline is a focused place to capture ideas, publish public notes,
                            and follow friends. It’s fast, clean, and built with care.
                        </motion.p>

                        {/* CTAs: full-width blocks on mobile; compact on md+ */}
                        <motion.div
                            className="mt-6 flex flex-col md:flex-row gap-3 md:items-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Link
                                to="/signup"
                                className="w-full md:w-auto text-center rounded-xl md:rounded-xl
                           px-4 py-3 md:py-2.5 text-sm font-medium
                           bg-[hsl(var(--brand))] text-white ring-1 ring-black/5 dark:ring-white/10
                           hover:brightness-110 active:scale-95 transition"
                            >
                                Get started
                            </Link>

                            <Link
                                to="/feed"
                                className="w-full md:w-auto text-center rounded-xl md:rounded-xl
                           px-4 py-3 md:py-2.5 text-sm font-medium
                           bg-transparent text-[hsl(var(--brand))] ring-1 ring-[hsl(var(--brand))]/25
                           hover:bg-[hsl(var(--brand))/0.08] active:scale-95 transition"
                            >
                                Explore feed
                            </Link>
                        </motion.div>

                        {/* Feature chips — always visible, below CTAs */}
                        <div className="mt-6 flex flex-wrap gap-2 z-10 relative">
                            <span className="badge">Rich editor</span>
                            <span className="badge">Public feed</span>
                            <span className="badge">Friendships</span>
                            <span className="badge">Categories</span>
                            <span className="badge">Keyset pagination</span>
                        </div>
                    </div>

                    {/* Image second on mobile; absolute ONLY on md+ to prevent overlap */}
                    <div className="relative order-2 md:order-none md:relative min-h-[220px] sm:min-h-[300px]">
                        <motion.img
                            src={heroUrl}
                            alt="Notebook and UI preview"
                            className="w-full h-64 sm:h-72 object-cover rounded-b-2xl md:rounded-none
                         md:absolute md:inset-0 md:h-full" // absolute only md+
                            style={{ y: yParallax }}
                            initial={{ scale: 1.05, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        />
                        {/* subtle mask on mobile */}
                        <div
                            className="absolute inset-0 pointer-events-none md:hidden rounded-b-2xl"
                            style={{
                                background:
                                    "linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.08) 55%, rgba(0,0,0,0.22) 100%)",
                            }}
                        />
                    </div>
                </div>
            </section>

            {/* PHILOSOPHY */}
            <section className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        title: "Speed over clutter",
                        body: "Minimal UI, major speed. Every interaction is designed to feel instant and intentional.",
                    },
                    {
                        title: "Own your words",
                        body: "Your notes are yours. Publish publicly when you want, keep private when you don’t.",
                    },
                    {
                        title: "Social, not noisy",
                        body: "Follow friends, accept requests, and browse a clean public feed—no ads, no fluff.",
                    },
                ].map((c) => (
                    <motion.article
                        key={c.title}
                        className="card will-change-transform"
                        initial={{ y: 24, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ type: "spring", stiffness: 180, damping: 24 }}
                        whileHover={{
                            y: -6,
                            rotate: -0.2,
                            boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                        }}
                    >
                        <h3 className="text-lg font-semibold">{c.title}</h3>
                        <p className="mt-2 opacity-80">{c.body}</p>
                    </motion.article>
                ))}
            </section>

            {/* HOW IT WORKS */}
            <section className="grid md:grid-cols-3 gap-6">
                {[
                    {
                        step: "1",
                        title: "Create your account",
                        body: "Sign up with your email—simple validation, nothing fancy.",
                    },
                    {
                        step: "2",
                        title: "Write a note",
                        body: "Use the rich editor to compose. Toggle public/private.",
                    },
                    {
                        step: "3",
                        title: "Share & connect",
                        body: "Publish to the feed and manage friendships with clean actions.",
                    },
                ].map((s, idx) => (
                    <motion.div
                        key={s.step}
                        className="card will-change-transform"
                        initial={{ y: 40, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{
                            delay: idx * 0.05,
                            type: "spring",
                            stiffness: 200,
                            damping: 26,
                        }}
                        whileHover={{
                            y: -6,
                            rotate: 0.2,
                            boxShadow: "0 10px 24px rgba(0,0,0,.08)",
                        }}
                    >
                        <div className="text-brand text-sm font-semibold">
                            Step {s.step}
                        </div>
                        <h3 className="text-lg font-semibold">{s.title}</h3>
                        <p className="mt-2 opacity-80">{s.body}</p>
                    </motion.div>
                ))}
            </section>

            {/* CTA */}
            <section className="card text-center py-12">
                <h2 className="text-2xl md:text-3xl font-semibold">
                    Ready to start? <span className="text-brand">Join now</span>.
                </h2>
                <p className="mt-2 opacity-80">
                    Create your first note in under 30 seconds.
                </p>
                <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-3">
                    <Link
                        to="/signup"
                        className="w-full md:w-auto text-center rounded-xl px-4 py-3 md:py-2.5 text-sm font-medium
                       bg-[hsl(var(--brand))] text-white ring-1 ring-black/5 dark:ring-white/10
                       hover:brightness-110 active:scale-95 transition"
                    >
                        Sign up
                    </Link>
                    <Link
                        to="/login"
                        className="w-full md:w-auto text-center rounded-xl px-4 py-3 md:py-2.5 text-sm font-medium
                       bg-transparent text-[hsl(var(--brand))] ring-1 ring-[hsl(var(--brand))]/25
                       hover:bg-[hsl(var(--brand))/0.08] active:scale-95 transition"
                    >
                        Log in
                    </Link>
                </div>
            </section>
        </div>
    );
}

export default Home;
