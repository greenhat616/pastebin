'use client'

import { motion } from 'framer-motion'
import React from 'react'

type Props = {
  className?: string
  children: React.ReactNode
}

export default function Content(props: Props) {
  return (
    <motion.div
      className={classNames(props.className)}
      initial={{ scaleX: 0, scaleY: 0.1, scaleZ: 0.2 }}
      animate={{ scaleX: 1, scaleY: 1, scaleZ: 1 }}
    >
      {props.children}
    </motion.div>
  )
}
