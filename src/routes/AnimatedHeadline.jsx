import { motion, useReducedMotion } from "framer-motion";

function AnimatedHeadline() {
    const prefersReduced = useReducedMotion();

    const DURATION = 1.05; // per-word animation time (was 0.65)
    const STAGGER = 0.45; // gap between words (was 0.22)
    const DELAY = 0.15; // small initial pause
    const EASE = [0.16, 1, 0.3, 1];

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

export default AnimatedHeadline;