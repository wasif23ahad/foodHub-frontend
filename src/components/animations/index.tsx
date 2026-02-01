import { motion, HTMLMotionProps, Variants } from "framer-motion";

export const fadeIn: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.4, ease: "easeIn" }
    }
};

export const staggerContainer: Variants = {
    initial: {},
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export const hoverScale = {
    whileHover: { scale: 1.02, transition: { duration: 0.2 } },
    whileTap: { scale: 0.98 }
};

export function FadeIn({ children, delay = 0, ...props }: { children: React.ReactNode, delay?: number } & HTMLMotionProps<"div">) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children, ...props }: { children: React.ReactNode } & HTMLMotionProps<"div">) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            {...props}
        >
            {children}
        </motion.div>
    );
}
