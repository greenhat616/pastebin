'use client'

import { Box, Card, CardBody } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'
import styles from './CodePreview.module.scss'
import ShikiHeader from './shiki/Header'
import LineNumbers from './shiki/LineNumbers'
import './shiki/shiki.scss'

type Props = {
  content: string
  language: string
  children?: React.ReactNode
}

const calcLineNumbersWidth = (lineCount: number) => {
  const lineNumbersWidth = (String(lineCount).length * 0.7 + 1.4).toFixed(2)
  return `${lineNumbersWidth}em`
}

export default function CodePreview(props: Props) {
  const { content, language } = props
  // Utils and i18n
  const t = useTranslations('code-preview')

  // States
  // const [transformedCode, setTransformedCode] = useState('')
  const lines = useMemo(() => getLines(content), [content])

  // const BoxRef = useRef<HTMLDivElement>(null)
  // useAsyncEffect(async () => {
  //   const code = await codeToHTMLWithTransformers(content, {
  //     lang: language
  //   })
  //   setTransformedCode(() => code)
  // }, [content, language])

  // Copy content to clipboard
  const onCopyButtonClick = useToastFeedback({
    fn: (e: MouseEvent | PointerEvent | TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      const code = content
      return navigator.clipboard.writeText(code)
    },
    messages: {
      success: {
        title: t('feedback.copy.success.title'),
        description: t('feedback.copy.success.description')
      },
      error: (e) => ({
        title: t('feedback.copy.fail.title'),
        description: t('feedback.copy.fail.description', {
          error: e.message
        })
      })
    }
  })

  // Copy Share Link to clipboard
  const onShareButtonClick = useToastFeedback({
    fn: (e: MouseEvent | PointerEvent | TouchEvent) => {
      e.preventDefault()
      e.stopPropagation()
      return navigator.clipboard.writeText(window.location.href)
    },
    messages: {
      success: {
        title: t('feedback.share.success.title'),
        description: t('feedback.share.success.description')
      },
      error: (e) => ({
        title: t('feedback.share.fail.title'),
        description: t('feedback.share.fail.description', {
          error: e.message
        })
      })
    }
  })

  return (
    <Card variant="outline" p={0} rounded="3xl" overflow="hidden">
      <CardBody p={0}>
        {/* {transformedCode !== '' ? (
          <Box
            className={classNames(styles['code-preview'], 'code-preview')}
            as="div"
            style={{
              // Disable line because of this line is work
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore ts(2322)
              '--line-numbers-width': calcLineNumbersWidth(lines || 1)
            }}
            // ref={BoxRef}
          >
            <LineNumbers lines={lines} />
            <Box as="div" className={styles['shiki-container']}>
              <ShikiHeader
                lang={language}
                onCopyClick={onCopyButtonClick}
                onShareClick={onShareButtonClick}
              />
              <Box
                as="div"
                dangerouslySetInnerHTML={{ __html: transformedCode }}
              />
            </Box>
          </Box>
        ) : (
          <Stack px="1.5em" py="1em">
            <SkeletonText noOfLines={30} spacing="4" skeletonHeight="2" />
          </Stack>
        )} */}
        <Box
          className={classNames(styles['code-preview'], 'code-preview')}
          as="div"
          style={{
            // Disable line because of this line is work
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore ts(2322)
            '--line-numbers-width': calcLineNumbersWidth(lines || 1)
          }}
          // ref={BoxRef}
        >
          <LineNumbers lines={lines} />
          <Box as="div" className={styles['shiki-container']}>
            <ShikiHeader
              lang={language}
              onCopyClick={onCopyButtonClick}
              onShareClick={onShareButtonClick}
            />
            <Box as="div" className={styles.content}>
              {props.children}
            </Box>
          </Box>
        </Box>
      </CardBody>
    </Card>
  )
}
