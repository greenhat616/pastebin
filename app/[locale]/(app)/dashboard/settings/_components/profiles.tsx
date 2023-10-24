'use client'
import { providers } from '@/libs/auth/providers'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  Heading,
  Input,
  Stack,
  Textarea
} from '@chakra-ui/react'
import type { User } from '@prisma/client'
type ProfilesProps = {
  user: User
  ssos: ((typeof providers)[0] & { connected: boolean })[]
}

export default function Profiles({ user, ssos }: ProfilesProps) {
  return (
    <Card variant="outline" rounded="16px">
      <CardHeader>
        <Heading size="md">Profiles</Heading>
      </CardHeader>
      <CardBody pt="0">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Grid gap={4}>
            <FormControl>
              <FormLabel>Nickname</FormLabel>
              <Input type="text" defaultValue={user.name || undefined} />
              <FormHelperText>
                This is how your name will be displayed in the account.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" disabled value={user.email} />
              <FormHelperText>
                We&apos;ll never share your email with anyone else.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Website</FormLabel>
              <Input
                type="text"
                placeholder="https://"
                defaultValue={user.website || undefined}
              />
              <FormHelperText>
                Your personal website, blog, or portfolio.
              </FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Bio</FormLabel>
              <Textarea
                placeholder="Bio..."
                defaultValue={user.bio || undefined}
              />
              <FormHelperText>
                Tell us a little bit about yourself.
              </FormHelperText>
            </FormControl>
            <div className="flex justify-start">
              <Button colorScheme="blue">Save</Button>
            </div>
          </Grid>
          <div className="grid content-start gap-4">
            <div className="flex items-center justify-center mt-0 md:-mt-10">
              <Avatar
                size="xl"
                name={user!.name || ''}
                src={getUserAvatar(user)}
                draggable={false}
              />
            </div>
            <Stack gap={3}>
              <Button>Change Avatar</Button>
              <Button>Change Email</Button>
              <Button>Change Password</Button>
            </Stack>
            <h4 className="mt-2 font-medium text-xl">SSO</h4>
            {ssos.map((sso) => (
              <Button
                key={sso.id}
                colorScheme={sso.connected ? 'blue' : 'gray'}
                className="flex gap-3"
              >
                {sso.icon} Link with {sso.name}
              </Button>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
