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
import Credentials from './_components/credentials'

export default async function SignInPage() {
  return (
    <Stack gap={4}>
      {/* Credentials Login */}
      <Credentials />
      <Grid gap={4} templateColumns="repeat(2, 1fr)">
        <GridItem>
          <Text fontSize="sm">
            <Link
              as={NavigationLink}
              href="/auth/password/reset"
              className="!hover:underline"
            >
              Forgot Password?
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
              Register Now
            </Link>
          </Text>
        </GridItem>
      </Grid>
      {/* Social Login */}
      <Box position="relative" paddingY="4">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          OR
        </AbsoluteCenter>
      </Box>
      <Stack gap={4}>
        <Button
          leftIcon={<IMdiGoogle />}
          colorScheme="gray"
          size="lg"
          rounded="xl"
        >
          Sign In with Google
        </Button>
        <Button
          leftIcon={<IMdiGithub />}
          colorScheme="gray"
          size="lg"
          rounded="xl"
        >
          Sign In with Github
        </Button>
      </Stack>
    </Stack>
  )
}
