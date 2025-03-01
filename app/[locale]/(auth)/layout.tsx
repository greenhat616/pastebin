import { auth } from '@/libs/auth'
import { Box } from '@chakra-ui/react'
import { useTranslations } from 'next-intl'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Content from './_components/layouts/content'
import GoBackButton from './_components/layouts/go-back-button'
import Logo from './_components/layouts/logo'
import styles from './layout.module.scss'

type Props = {
  children: React.ReactNode
}

function GoBack() {
  const t = useTranslations()

  return (
    <GoBackButton className={styles['go-back-button']} rounded="xl" size="sm">
      {t('auth.buttons.back')}
    </GoBackButton>
  )
}

export default async function AuthLayout(props: Props) {
  // lazyload image
  const header = await headers()
  const session = await auth()
  // console.log(session)
  if (session) {
    // if user is logged in, redirect to callback url or home
    const urlParams = new URLSearchParams(header.get('x-search-params') || '')
    const callbackUrl = urlParams.get('callbackUrl') || '/'
    redirect(callbackUrl)
  }

  return (
    <Box className={styles['auth-layout']}>
      <GoBack />
      <Box className={styles.main}>
        <Logo className={styles.logo} emojiClassName={styles.inner} />
        <Content className={styles.container}>{props.children}</Content>
      </Box>
    </Box>
  )
}
