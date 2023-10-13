import { attrsToLines } from '@/libs/shiki'
import { Box } from '@chakra-ui/react'
import styles from '../CodePreview.module.scss'
type Props = {
  lines: number
  highlightLines?: string
}

export default function LineNumbers(props: Props) {
  const { lines, highlightLines: linesAttrs } = props
  const highlightLines = linesAttrs ? attrsToLines(linesAttrs) : undefined
  const linesArray = Array.from({ length: lines }, (_, i) => i + 1)
  return (
    <Box as="div" className={styles['line-numbers-container']}>
      {linesArray.map((line) => (
        <Box
          as="span"
          className={classNames(
            styles['line-number'],
            highlightLines?.includes(line) && styles['highlight']
          )}
          key={line}
        >
          {line}
        </Box>
      ))}
    </Box>
  )
}
