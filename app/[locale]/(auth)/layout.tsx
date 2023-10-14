import AnimatedLogo from '@/components/AnimatedLogo'
import { Box, ChakraProvider } from '@chakra-ui/react'
import Content from './_components/layouts/content'
import styles from './layout.module.scss'

type Props = {
  children: React.ReactNode
}

export default async function AuthLayout(props: Props) {
  // lazyload image

  return (
    <ChakraProvider>
      <Box className={styles['auth-layout']}>
        <Box className={styles.main}>
          <AnimatedLogo className={styles.logo} emojiClassName={styles.inner} />
          <Content className={styles.container}>{props.children}</Content>
        </Box>
      </Box>
    </ChakraProvider>
  )
}
