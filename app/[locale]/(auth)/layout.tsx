import AnimatedLogo from '@/components/AnimatedLogo'
import { Box, ChakraProvider } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import Content from './_components/layouts/content'
import GoBackButton from './_components/layouts/go-back-button'
import styles from './layout.module.scss'

type Props = {
  children: React.ReactNode
}

export default function AuthLayout(props: Props) {
  // lazyload image

  const t = useTranslations()

  return (
    <ChakraProvider>
      <Box className={styles['auth-layout']}>
        <GoBackButton
          className={styles['go-back-button']}
          rounded="xl"
          size="sm"
        >
          {t('auth.buttons.back')}
        </GoBackButton>
        <Box className={styles.main}>
          <AnimatedLogo className={styles.logo} emojiClassName={styles.inner} />
          <Content className={styles.container}>{props.children}</Content>
        </Box>
      </Box>
    </ChakraProvider>
  )
}
