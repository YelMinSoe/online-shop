import { motion } from "motion/react"
import type { ReactNode } from "react"

type RevealProps = {
  children: ReactNode
  delay?: number
}

export default function Reveal({ children, delay = 0 }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{
        duration: 1,
        delay,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  )
}
