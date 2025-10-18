import { useScroll, useSpring, useTransform } from "framer-motion";

export function useScrollFriction({ stiffness = 120, damping = 28 } = {}) {
    const { scrollYProgress } = useScroll();
    const smooth = useSpring(scrollYProgress, { stiffness, damping });

    const ySlow = useTransform(smooth, [0, 1], [0, -120]);           // subtle upward drift
    const yParallax = useTransform(smooth, [0, 1], [0, -300]);       // stronger parallax
    const opacityIn = useTransform(smooth, [0, 0.15], [0, 1]);       // fade in top content
    const scaleIn = useTransform(smooth, [0, 0.1], [0.98, 1]);       // gentle scale

    return { progress: smooth, ySlow, yParallax, opacityIn, scaleIn };
}
