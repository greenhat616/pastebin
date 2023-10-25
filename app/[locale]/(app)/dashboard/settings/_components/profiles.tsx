'use client'
import { providers } from '@/libs/auth/providers'
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading
} from '@chakra-ui/react'
import type { User } from '@prisma/client'
import { signIn } from 'next-auth/react'
import { ProfileForm } from './form'
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
          <ProfileForm
            defaultValues={{
              nickname: user.name!,
              email: user.email!,
              website: user.website || undefined,
              bio: user.bio || undefined
            }}
          />
          <div className="grid content-start gap-4">
            <div className="flex items-center justify-center mt-0 md:-mt-10">
              <Avatar
                size="xl"
                name={user!.name || ''}
                src={getUserAvatar(user)}
                draggable={false}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Button>Change Email</Button>
              <Button>Change Password</Button>
              <Button>Manage Passkeys</Button>
            </div>
            <h4 className="mt-2 font-medium text-xl">SSO</h4>
            <div className="flex flex-col gap-3">
              {ssos.map((sso) => (
                <Button
                  key={sso.id}
                  colorScheme={sso.connected ? 'blue' : 'gray'}
                  className="flex gap-3"
                  onClick={() => signIn(sso.id)}
                >
                  {sso.icon} Link with {sso.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
