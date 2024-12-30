'use client'
import { providers } from '@/libs/auth/providers'
import { Card, Heading, useDisclosure } from '@chakra-ui/react'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { User } from '@prisma/client'
import { SSOButton } from './button'
import { ProfileForm } from './form'
import { ChangePasswordModal, ManagePasskeysModal } from './modal'
type ProfilesProps = {
  user: User
  ssos: ((typeof providers)[0] & { connected: boolean })[]
}

export default function Profiles({ user, ssos }: ProfilesProps) {
  const {
    open: isManagePasskeysModalOpen,
    onClose: onManagePasskeysModalClose,
    onOpen: onManagePasskeysModalOpen
  } = useDisclosure()
  const {
    open: isChangePasswordModalOpen,
    onClose: onChangePasswordModalClose,
    onOpen: onChangePasswordModalOpen
  } = useDisclosure()

  return (
    <>
      {/* Modals */}
      <ManagePasskeysModal
        key={
          isManagePasskeysModalOpen
            ? 'manage-passkey-open'
            : 'manage-passkey-close'
        }
        isOpen={isManagePasskeysModalOpen}
        onClose={onManagePasskeysModalClose}
      />
      <ChangePasswordModal
        key={
          isChangePasswordModalOpen
            ? 'change-password-open'
            : 'change-password-close'
        }
        isOpen={isChangePasswordModalOpen}
        onClose={onChangePasswordModalClose}
      />
      {/* Profiles */}
      <Card.Root variant="outline" rounded="16px">
        <Card.Header>
          <Heading size="md">Profiles</Heading>
        </Card.Header>
        <Card.Body pt="0">
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
                <Button onClick={onChangePasswordModalOpen}>
                  Change Password
                </Button>
                <Button onClick={onManagePasskeysModalOpen}>
                  Manage Passkeys
                </Button>
              </div>
              <h4 className="mt-2 font-medium text-xl">SSO</h4>
              <div className="flex flex-col gap-3">
                {ssos.map((sso) => (
                  <SSOButton key={sso.id} sso={sso} />
                ))}
              </div>
            </div>
          </div>
        </Card.Body>
      </Card.Root>
    </>
  )
}
