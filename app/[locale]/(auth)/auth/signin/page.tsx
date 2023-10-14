import NavigationLink from '@/components/NavigationLink'
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  Link,
  Stack,
  Text
} from '@chakra-ui/react'
import { Props } from 'chakra-react-select'
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
import Credentials from './_components/credentials'

export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  const t = await getTranslator(locale)

  return {
    title: `${t('auth.signin.title')} - ${t('app.name')}`
  }
}

type Props = {
  params: { locale: string }
}

export default function SignInPage(props: Props) {
  const t = useTranslations()
  const messages = useMessages()
  const locale = useLocale()
  return (
    <Stack gap={4}>
      {/* Credentials Login */}
      <NextIntlClientProvider
        messages={
          pick(messages, 'auth.signin.credentials') as AbstractIntlMessages
        }
        locale={locale}
      >
        <Credentials />
      </NextIntlClientProvider>
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
      <Stack gap={4}>
        <Button
          leftIcon={<IMdiGoogle />}
          colorScheme="gray"
          size="lg"
          rounded="xl"
        >
          {t('auth.signin.sso', {
            provider: 'Google'
          })}
        </Button>
        <Button
          leftIcon={<IMdiGithub />}
          colorScheme="gray"
          size="lg"
          rounded="xl"
        >
          {t('auth.signin.sso', {
            provider: 'Github'
          })}
        </Button>
      </Stack>
    </Stack>
  )
}
