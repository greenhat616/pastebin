import { getDisplayNameByLanguageID } from '@/libs/shiki'
import { Box } from '@chakra-ui/react'
import { motion } from 'framer-motion'
import styles from '../CodePreview.module.scss'
type Props = {
  lang: string
  onCopyClick?: (e: MouseEvent | PointerEvent | TouchEvent) => void
  onShareClick?: (e: MouseEvent | PointerEvent | TouchEvent) => void
}

export default function ShikiHeader(props: Props) {
  return (
    <Box as="div" className={styles.header}>
      <Box as="span" className={styles['language-name']}>
        {getDisplayNameByLanguageID(props.lang)}
      </Box>
      <Box as="div" className={styles['actions-group']}>
        <motion.div
          className={styles['share-button']}
          whileHover={{
            scale: 1.1,
            boxShadow: '1px 1px 0 rgba(0, 0, 0, 0.05)',
            transition: { duration: 0.02 }
          }}
          whileTap={{
            scale: 0.8,
            // rotate: -90,
            borderRadius: '100%'
          }}
          onTap={(e) => {
            if (props.onShareClick) props.onShareClick(e)
          }}
        >
          <ISolarShareLinear className="h-7 w-7" />
        </motion.div>
        <motion.div
          className={styles['copy-button']}
          whileHover={{
            scale: 1.1,
            boxShadow: '1px 1px 0 rgba(0, 0, 0, 0.05)',
            transition: { duration: 0.02 }
          }}
          whileTap={{
            scale: 0.8,
            // rotate: -90,
            borderRadius: '100%'
          }}
          onTap={(e) => {
            if (props.onCopyClick) props.onCopyClick(e)
          }}
        >
          <ISolarClipboardBroken className="h-7 w-7" />
        </motion.div>
      </Box>
    </Box>
  )
}
