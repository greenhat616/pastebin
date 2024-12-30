import {
  requestAddWebAuthnAction,
  verifyAddWebAuthnAction
} from '@/actions/auth'
import {
  modifyAuthenticatorName,
  modifyPasswordAction,
  removeAuthenticatorAction
} from '@/actions/user'
import { TwiceConfirmation } from '@/components/confirmation'
import { EmptyPlaceholder } from '@/components/status'
import { ResponseCode } from '@/enums/response'
import { useUserAuthenticatorsQuery } from '@/hooks/requests/user'
import { ChangePasswordSchema } from '@/libs/validation/user'
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogHeader,
  Editable,
  Flex,
  Input
} from '@chakra-ui/react'
import { Tooltip } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'
import { DialogRoot } from '@/components/ui/dialog'

import { startRegistration } from '@simplewebauthn/browser'
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types'
import { useBoolean, useMemoizedFn } from 'ahooks'
import { useState, useTransition } from 'react'
import { ZodError } from 'zod'
import { BlockButtonSkeleton } from '../../_components/skeleton'
import { toaster } from '@/components/ui/toaster'
import { CloseButton } from '@/components/ui/close-button'
import { Field } from '@/components/ui/field'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function ManagePasskeysModal({ isOpen, onClose }: ModalProps) {
  function EditableAuthenticatorName({
    name,
    credentialID,
    onSuccessfulChange
  }: {
    name: string
    credentialID: string
    onSuccessfulChange?: () => void
  }) {
    const [nameState, setNameState] = useState(name)
    const [preName, setPreName] = useState(name)

    const [pending, startTransition] = useTransition()
    if (preName !== name) {
      setPreName(name)
      setNameState(name)
    }

    const onSubmit = useMemoizedFn((nextName) => {
      if (nextName === preName) return
      startTransition(async () => {
        try {
          const res = await modifyAuthenticatorName({
            name: nextName,
            credential_id: credentialID
          })
          if (res.status !== ResponseCode.OK) {
            throw new Error(res.error || 'Unknown error')
          }
          toaster.success({
            title: 'Passkey name changed.',
            description: 'Your passkey name has been changed.',
            duration: 5000
          })
          onSuccessfulChange?.()
        } catch (e) {
          toaster.error({
            title: 'Failed to change passkey name.',
            description: (e as Error).message,
            duration: 5000
          })
        }
      })
    })
    return (
      <Editable.Root
        as={Flex}
        defaultValue={name || 'Unnamed passkey'}
        m="0"
        p="0"
        onSubmit={onSubmit}
        value={nameState}
        disabled={pending}
        onValueChange={(e) => setNameState(e.value)}
      >
        <Editable.Preview className="!py-0 !text-sm !font-medium !truncate" />
        <Editable.Input
          className="!text-xs !font-medium !truncate"
          px="1"
          py="0.5"
          outline="none"
        />
      </Editable.Root>
    )
  }

  function DeleteButton({
    credentialID,
    onSuccessfulDelete
  }: {
    credentialID: string
    onSuccessfulDelete?: () => void
  }) {
    const [pending, startTransition] = useTransition()
    const onDelete = useMemoizedFn(() => {
      startTransition(async () => {
        try {
          const result = await removeAuthenticatorAction({
            credentialID: credentialID
          })
          if (result.status !== ResponseCode.OK)
            throw new Error(result.error || 'Unknown error')
          toaster.success({
            title: 'Passkey removed.',
            description: 'Your passkey has been removed.',
            duration: 5000
          })
          onSuccessfulDelete?.()
        } catch (e) {
          toaster.error({
            title: 'Failed to remove passkey.',
            description: (e as Error).message,
            duration: 5000
          })
        }
      })
    })
    return (
      <Button
        size="sm"
        loading={pending}
        loadingText="Removing"
        disabled={pending}
        onClick={onDelete}
      >
        Remove
      </Button>
    )
  }

  const [finishTwiceConfirmation, { setTrue: setFinishTwiceConfirmationTrue }] =
    useBoolean(false)
  const {
    data: authenticators,
    status: fetchAuthenticatorsStatus,
    isPending: isPendingAuthenticators,
    refetch: refetchAuthenticators
  } = useUserAuthenticatorsQuery({
    enabled: false
  })
  const onTwiceConfirmationSuccess = useMemoizedFn(() => {
    setFinishTwiceConfirmationTrue()
    refetchAuthenticators() // Start fetching
  })

  const [addAuthenticatorPending, startAddAuthenticatorTransition] =
    useTransition()
  const onAddAuthenticator = useMemoizedFn(() => {
    startAddAuthenticatorTransition(async () => {
      // 1. request challenge
      let options
      try {
        const result = await requestAddWebAuthnAction()
        if (result.status !== ResponseCode.OK)
          throw new Error(result.error || 'Unknown error')
        options = result.data
      } catch (e) {
        toaster.error({
          title: 'Failed to request challenge.',
          description: (e as Error).message,
          duration: 5000
        })
        return
      }

      // 2. request authenticator
      let authResp
      try {
        authResp = await startRegistration(
          options as PublicKeyCredentialCreationOptionsJSON
        )
      } catch (e) {
        toaster.error({
          title: 'Failed to request authenticator.',
          description:
            e instanceof Error
              ? e.name === 'NotAllowedError'
                ? 'User cancelled or timeout'
                : e.message
              : 'Unknown error',
          duration: 5000
        })
        return
      }

      // 3. verify and add authenticator
      try {
        const result = await verifyAddWebAuthnAction({
          ctx: authResp
        })
        if (result.status !== ResponseCode.OK)
          throw new Error(result.error || 'Unknown error')
        toaster.success({
          title: 'Passkey added.',
          description: 'Your passkey has been added.',
          duration: 5000
        })
        // 4. refetch authenticators
        refetchAuthenticators()
      } catch (e) {
        toaster.error({
          title: 'Failed to add passkey.',
          description: (e as Error).message,
          duration: 5000
        })
      }
    })
  })

  return (
    <DialogRoot
      onOpenChange={(e) => {
        if (!e) onClose()
      }}
      open={isOpen}
      motionPreset="slide-in-bottom"
    >
      <DialogContent rounded="16px" py="5">
        <DialogHeader>Manage Passkeys</DialogHeader>
        <DialogCloseTrigger>
          <CloseButton />
        </DialogCloseTrigger>
        <DialogBody>
          {!finishTwiceConfirmation ? (
            <TwiceConfirmation onSuccess={onTwiceConfirmationSuccess} />
          ) : (
            <div className="flex flex-col gap-3">
              <Button
                width="100%"
                onClick={onAddAuthenticator}
                loading={addAuthenticatorPending}
                loadingText="Adding Passkey"
                disabled={addAuthenticatorPending}
              >
                Add Passkey
              </Button>
              {isPendingAuthenticators ? (
                <div className="flex mt-2 flex-col gap-4">
                  <BlockButtonSkeleton />
                  <BlockButtonSkeleton />
                  <BlockButtonSkeleton />
                </div>
              ) : fetchAuthenticatorsStatus === 'error' ? (
                'Error'
              ) : !authenticators || !authenticators.data?.length ? (
                <EmptyPlaceholder className="pb-10" text="No passkey found." />
              ) : (
                <div className="flex flex-col mt-2">
                  {authenticators.data.map((authenticator) => (
                    <div
                      key={authenticator.credentialID}
                      className="py-3 flex gap-4 w-full items-center"
                    >
                      <div className="flex flex-1 min-w-[33.6%] items-center gap-3">
                        <ISolarShieldKeyholeBold className="w-8 h-8" />
                        <div className="flex-1 flex flex-col gap-1">
                          <EditableAuthenticatorName
                            name={authenticator.name || 'Unnamed passkey'}
                            credentialID={authenticator.credentialID}
                            onSuccessfulChange={() => refetchAuthenticators()}
                          />
                          {/* <h2 className="text-sm font-medium truncate">
                            {authenticator.name || 'Unnamed passkey'}
                          </h2> */}
                          <Tooltip
                            content={`Created at: ${formatDateTime(
                              authenticator.createdAt
                            )}`}
                          >
                            <p className="text-xs">
                              Last used:{' '}
                              {newDayjs(authenticator.updatedAt).fromNow()}
                            </p>
                          </Tooltip>
                        </div>
                      </div>

                      <DeleteButton
                        credentialID={authenticator.credentialID}
                        onSuccessfulDelete={() => refetchAuthenticators()}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}

export function ChangePasswordModal({ isOpen, onClose }: ModalProps) {
  const [finishTwiceConfirmation, { setTrue: setFinishTwiceConfirmationTrue }] =
    useBoolean(false)
  const onTwiceConfirmationSuccess = useMemoizedFn(() => {
    setFinishTwiceConfirmationTrue()
  })
  const [changePasswordPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<{
    password: string | undefined
    password_confirmation: string | undefined
  }>({
    password: undefined,
    password_confirmation: undefined
  })
  const [msgs, setMsgs] = useState<{
    password: string | undefined
    password_confirmation: string | undefined
  }>({
    password: undefined,
    password_confirmation: undefined
  })

  const onChangePassword = useMemoizedFn(() => {
    let data: {
      password: string
      password_confirmation: string
    }
    try {
      data = ChangePasswordSchema.parse(formState)
    } catch (e) {
      if (e instanceof ZodError) {
        const msgs = e.issues.reduce(
          (acc, issue) => {
            for (const path of issue.path) {
              if (!acc[path as keyof typeof acc])
                acc[path as keyof typeof acc] = issue.message // translateIfKey(t, issue.message)
            }
            return acc
          },
          {
            password: undefined as string | undefined,
            password_confirmation: undefined as string | undefined
          }
        )
        setMsgs(msgs)
      }
      return
    }
    startTransition(async () => {
      try {
        const result = await modifyPasswordAction(data)
        if (result.status !== ResponseCode.OK)
          throw new Error(result.error || 'Unknown error')
        toaster.success({
          title: 'Password changed.',
          description: 'Your password has been changed.',
          duration: 5000
        })
        onClose()
      } catch (e) {
        toaster.error({
          title: 'Failed to change password.',
          description: (e as Error).message,
          duration: 5000
        })
      }
    })
  })
  return (
    <DialogRoot
      onOpenChange={(e) => {
        if (!e) onClose()
      }}
      open={isOpen}
      motionPreset="slide-in-bottom"
    >
      <DialogContent rounded="16px" py="5">
        <DialogHeader>Change Password</DialogHeader>
        <DialogCloseTrigger>
          <CloseButton />
        </DialogCloseTrigger>
        <DialogBody pt="0">
          {!finishTwiceConfirmation ? (
            <TwiceConfirmation onSuccess={onTwiceConfirmationSuccess} />
          ) : (
            <div className="flex flex-col gap-3">
              <Field
                invalid={!!msgs.password}
                label="New password"
                errorText={msgs.password}
              >
                <Input
                  type="password"
                  placeholder="New password"
                  name="password"
                  value={formState.password}
                  onChange={(e) => {
                    setFormState((state) => ({
                      ...state,
                      password: e.target.value
                    }))
                  }}
                />
              </Field>
              <Field
                invalid={!!msgs.password_confirmation}
                label="Confirm password"
                errorText={msgs.password_confirmation}
              >
                <Input
                  type="password"
                  placeholder="Confirm new password"
                  name="password_confirmation"
                  value={formState.password_confirmation}
                  onChange={(e) => {
                    setFormState((state) => ({
                      ...state,
                      password_confirmation: e.target.value
                    }))
                  }}
                />
              </Field>
              <Button
                className="mt-3"
                onClick={onChangePassword}
                loading={changePasswordPending}
                loadingText="Applying"
                disabled={changePasswordPending}
              >
                Apply
              </Button>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  )
}
