import { motion } from "framer-motion";

function AnimatedWaveText({ text, className = "", gradient = true, delayPerChar = 0.06 }) {
    const letters = Array.from(text);

    return (
        <h1 className={className}>
            {letters.map((ch, i) => (
                <motion.span
                    key={i}
                    className={[
                        "inline-block will-change-transform",
                        gradient ? "bg-gradient-to-r from-[hsl(var(--brand))] to-[hsl(var(--accent))] bg-clip-text text-transparent" : ""
                    ].join(" ")}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: [0, -6, 0, 6, 0] }}
                    transition={{
                        duration: 2.6,
                        ease: "easeInOut",
                        delay: i * delayPerChar,
                        repeat: Infinity,
                        repeatDelay: 0.4,
                    }}
                >
                    {ch === " " ? "\u00A0" : ch}
                </motion.span>
            ))}
        </h1>
    );
}

export default AnimatedWaveText;
