import {
  confirmTwiceAction,
  requestTwiceConfirmationTokenAction
} from '@/actions/user'
import { CredentialsAuthType } from '@/enums/app'
import { ResponseCode } from '@/enums/response'
import { Button, FormControl, Input, useToast } from '@chakra-ui/react'
import { startAuthentication } from '@simplewebauthn/browser'
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types'
import { useLatest, useMemoizedFn } from 'ahooks'
import { useState, useTransition } from 'react'
import { v4 as uuidV4 } from 'uuid'

export function TwiceConfirmation({ onSuccess }: { onSuccess: () => void }) {
  const toast = useToast()
  let token = ''
  const [pending, startTransition] = useTransition()
  const [authType, setAuthType] = useState(CredentialsAuthType.WebAuthn)
  const latestAuthType = useLatest(authType)

  const requestTwiceConfirmation = useMemoizedFn(() => {
    token = uuidV4() // Generate a new token
    startTransition(async () => {
      // 1. Request twice confirmation token
      // 2. If no authenticator found, set needPassword to true, otherwise, continue
      const requestRes = await requestTwiceConfirmationTokenAction({
        token: token
      })
      if (
        requestRes.status === ResponseCode.OperationFailed &&
        requestRes.error ===
          wrapTranslationKey(
            'actions.user.request_twice_confirmation.no_authenticator_found'
          )
      ) {
        setAuthType(CredentialsAuthType.Password)
        return
      } else if (requestRes.status !== ResponseCode.OK) {
        toast({
          title: wrapTranslationKey(
            'actions.user.request_twice_confirmation.failed'
          ),
          description: requestRes.error,
          status: 'error',
          duration: 5000,
          isClosable: true
        })
        return
      }
      let authResp
      try {
        authResp = await startAuthentication(
          requestRes.data as PublicKeyCredentialCreationOptionsJSON
        )
      } catch (error) {
        console.error(error)
        toast({
          title: wrapTranslationKey(
            'actions.user.request_twice_confirmation.failed'
          ),
          description:
            error instanceof Error
              ? error.name === 'NotAllowedError'
                ? wrapTranslationKey(
                    'actions.user.request_twice_confirmation.not_allowed_error'
                  )
                : 'Unknown Error'
              : 'Unknown Error',

          status: 'error',
          duration: 5000,
          isClosable: true
        })
        return
      }
      // 3. finish authentication
      console.log(token)
      const finishRes = await confirmTwiceAction({
        authType: latestAuthType.current,
        token: token,
        ctx: authResp
      })
      if (finishRes.status !== ResponseCode.OK) {
        toast({
          title: wrapTranslationKey(
            'actions.user.request_twice_confirmation.failed'
          ),
          description: finishRes.error || 'Unknown Error',
          status: 'error',
          duration: 5000,
          isClosable: true
        })
        return
      }
      onSuccess()
    })
  })

  return authType === CredentialsAuthType.WebAuthn ? (
    <div className="flex flex-col gap-8 py-5 items-center w-full justify-center">
      <ISolarShieldUserBold className="w-20 h-20" />
      <h1 className="text-lg font-medium">Confirm Your identity</h1>
      <Button
        width="100%"
        isLoading={pending}
        disabled={pending}
        loadingText="Pending"
        onClick={requestTwiceConfirmation}
      >
        Start
      </Button>
    </div>
  ) : (
    <div>
      <div className="flex flex-col gap-8 pt-5 items-center w-full justify-center">
        <FormControl>
          <Input type="password" placeholder="Password" />
          <Button
            onClick={() =>
              startTransition(async () => {
                const finishRes = await confirmTwiceAction({
                  authType: latestAuthType.current,
                  token: token,
                  ctx: {
                    type: 'password',
                    password: ''
                  }
                })
                if (finishRes.status !== ResponseCode.OK) {
                  toast({
                    title: wrapTranslationKey(
                      'actions.user.request_twice_confirmation.failed'
                    ),
                    description: finishRes.error || 'Unknown Error',
                    status: 'error',
                    duration: 5000,
                    isClosable: true
                  })
                  return
                }
                onSuccess()
              })
            }
          >
            Confirmation
          </Button>
        </FormControl>
      </div>
    </div>
  )
}
