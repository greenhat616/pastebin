import NavigationLink from '@/components/navigation-link'
import { IntlClientProvider } from '@/components/server-provider'
import { providers } from '@/libs/auth/providers'
import {
  AbsoluteCenter,
  Box,
  Grid,
  GridItem,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import { pick } from 'lodash-es'
import { Metadata } from 'next'
import {
  useLocale,
  useMessages,
  useTranslations,
  type AbstractIntlMessages
} from 'next-intl'
import { getTranslations } from 'next-intl/server'
import { headers } from 'next/headers'
import Credentials from './_components/Credentials'
import OAuthProvider from './_components/OAuthProvider'
export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale })

  return {
    title: `${t('auth.signin.title')} - ${t('app.name')}`
  }
}

function SignInPageIntlProviders({ children }: { children: React.ReactNode }) {
  const messages = useMessages()
  const locale = useLocale()
  return (
    <IntlClientProvider
      messages={pick(messages, 'auth.signin') as AbstractIntlMessages}
      locale={locale}
    >
      {children}
    </IntlClientProvider>
  )
}

function PageInner({
  children,
  searchParams
}: {
  children: React.ReactNode
  searchParams: string
}) {
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
              href={`/auth/signup${searchParams}`}
              className="!hover:underline"
            >
              {t('auth.signin.signup')}
            </Link>
          </Text>
        </GridItem>
      </Grid>
      {/* Social Login */}
      <Box position="relative" paddingY="4">
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
  const header = await headers()
  const searchParams = header.get('x-search-params')
    ? `?${header.get('x-search-params')}`
    : ``
  return (
    <SignInPageIntlProviders>
      <Stack gap={4}>
        {/* Credentials Login */}
        <Credentials />
        <PageInner searchParams={searchParams}>
          <OAuthProvider providers={providers} />
        </PageInner>
      </Stack>
    </SignInPageIntlProviders>
  )
}
