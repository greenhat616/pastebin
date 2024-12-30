import {
  confirmTwiceAction,
  requestTwiceConfirmationTokenAction
} from '@/actions/user'
import { CredentialsAuthType } from '@/enums/app'
import { ResponseCode } from '@/enums/response'
import { Input } from '@chakra-ui/react'
import { Field } from './ui/field'
import { Button } from './ui/button'
import { startAuthentication } from '@simplewebauthn/browser'
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/types'
import { useLatest, useMemoizedFn } from 'ahooks'
import { useState, useTransition } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { toaster } from './ui/toaster'

export function TwiceConfirmation({ onSuccess }: { onSuccess: () => void }) {
  const [token, setToken] = useState('')
  const latestToken = useLatest(token)
  const [pending, startTransition] = useTransition()
  const [authType, setAuthType] = useState(CredentialsAuthType.WebAuthn)
  const [password, setPassword] = useState('')
  const latestAuthType = useLatest(authType)

  const requestTwiceConfirmation = useMemoizedFn(() => {
    latestToken.current = uuidV4() // Generate a new token
    setToken(latestToken.current)
    startTransition(async () => {
      // 1. Request twice confirmation token
      // 2. If no authenticator found, set needPassword to true, otherwise, continue
      const requestRes = await requestTwiceConfirmationTokenAction({
        token: latestToken.current
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
        toaster.create({
          title: wrapTranslationKey(
            'actions.user.request_twice_confirmation.failed'
          ),
          description: requestRes.error,
          type: 'error',
          duration: 5000
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
        toaster.create({
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

          type: 'error',
          duration: 5000
        })
        return
      }
      // 3. finish authentication
      // console.log(token)
      const finishRes = await confirmTwiceAction({
        authType: latestAuthType.current,
        token: latestToken.current,
        ctx: authResp
      })
      if (finishRes.status !== ResponseCode.OK) {
        toaster.create({
          title: wrapTranslationKey(
            'actions.user.request_twice_confirmation.failed'
          ),
          description: finishRes.error || 'Unknown Error',
          type: 'error',
          duration: 5000
        })
        return
      }
      onSuccess()
    })
  })

  const onPasswordConfirm = useMemoizedFn(() =>
    startTransition(async () => {
      const finishRes = await confirmTwiceAction({
        authType: latestAuthType.current,
        token: latestToken.current,
        password: password
      })
      if (finishRes.status !== ResponseCode.OK) {
        toaster.create({
          title: wrapTranslationKey(
            'actions.user.request_twice_confirmation.failed'
          ),
          description: finishRes.error || 'Unknown Error',
          type: 'error',
          duration: 5000
        })
        return
      }
      onSuccess()
    })
  )

  return authType === CredentialsAuthType.WebAuthn ? (
    <div className="flex flex-col gap-8 py-5 items-center w-full justify-center">
      <ISolarShieldUserBold className="w-20 h-20" />
      <h1 className="text-lg font-medium">Confirm Your identity</h1>
      <Button
        width="100%"
        loading={pending}
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
        <Field>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button
          onClick={onPasswordConfirm}
          width="100%"
          loading={pending}
          disabled={pending}
          loadingText="Confirming"
        >
          Confirm
        </Button>
      </div>
    </div>
  )
}
