import NavigationLink from '@/components/NavigationLink'
import { providers } from '@/libs/auth/providers'
import {
  AbsoluteCenter,
  Box,
  Divider,
  Grid,
  GridItem,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import { pick } from 'lodash-es'
import { Metadata } from 'next'
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  useTranslations,
  type AbstractIntlMessages
} from 'next-intl'
import { getTranslator } from 'next-intl/server'
import Credentials from './_components/Credentials'
import OAuthProvider from './_components/OAuthProvider'
export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslator(locale)

  return {
    title: `${t('auth.signin.title')} - ${t('app.name')}`
  }
}

function IntlProviders({ children }: { children: React.ReactNode }) {
  const messages = useMessages()
  const locale = useLocale()

  return (
    <NextIntlClientProvider
      messages={pick(messages, 'auth.signin') as AbstractIntlMessages}
      locale={locale}
    >
      {children}
    </NextIntlClientProvider>
  )
}

function PageInner({ children }: { children: React.ReactNode }) {
  const t = useTranslations()
  return (
    <>
      <Grid gap={4} templateColumns="repeat(2, 1fr)">
        <GridItem>
          <Text fontSize="sm">
            <Link
              as={NavigationLink}
              href="/auth/password/reset"
              className="!hover:underline"
            >
              {t('auth.signin.forgot')}
            </Link>
          </Text>
        </GridItem>
        <GridItem>
          <Text fontSize="sm" textAlign="right">
            <Link
              as={NavigationLink}
              href="/auth/signup"
              className="!hover:underline"
            >
              {t('auth.signin.signup')}
            </Link>
          </Text>
        </GridItem>
      </Grid>
      {/* Social Login */}
      <Box position="relative" paddingY="4">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          {t('auth.signin.divider')}
        </AbsoluteCenter>
      </Box>
      {children}
    </>
  )
}

type Props = {
  params: { locale: string }
}

export default async function SignInPage(props: Props) {
  return (
    <IntlProviders>
      <Stack gap={4}>
        {/* Credentials Login */}
        <Credentials />
        <PageInner>
          <OAuthProvider providers={providers} />
        </PageInner>
      </Stack>
    </IntlProviders>
  )
}
