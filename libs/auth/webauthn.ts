import { env } from '@/env.mjs'
import { getCookie, setCookie } from '@/utils/cookies'
import { type User } from '@prisma/client'
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type GenerateRegistrationOptionsOpts
} from '@simplewebauthn/server'
import type { AttestationFormat } from '@simplewebauthn/server/script/helpers/decodeAttestationObject'
import type {
  AuthenticationResponseJSON,
  AuthenticatorTransportFuture,
  CredentialDeviceType,
  RegistrationResponseJSON
} from '@simplewebauthn/types'
import { randomBytes } from 'crypto'
import client from '../prisma/client'
import { createUser } from '../services/users/user'

import 'server-only'

const appURL = new URL(env.NEXT_PUBLIC_APP_URL)

export type Authenticator = {
  // SQL: Encode to base64url then store as `TEXT`. Index this column
  credentialID: string // Base64URLString
  // SQL: Store raw bytes as `BYTEA`/`BLOB`/etc...
  credentialPublicKey: Uint8Array
  // SQL: Consider `BIGINT` since some authenticators return atomic timestamps as counters
  counter: number
  // SQL: `VARCHAR(32)` or similar, longest possible value is currently 12 characters
  // Ex: 'singleDevice' | 'multiDevice'
  credentialDeviceType: CredentialDeviceType
  // SQL: `BOOL` or whatever similar type is supported
  credentialBackedUp: boolean
  // SQL: `VARCHAR(255)` and store string array as a CSV string
  // Ex: ['usb' | 'ble' | 'nfc' | 'internal']
  transports?: AuthenticatorTransportFuture[]
  fmt: AttestationFormat
}

export const baseConfig = {
  rpName: 'PasteBin',
  rpID: `${appURL.hostname}`,
  // Don't prompt users for additional information about the authenticator
  attestationType: 'none'
} satisfies Omit<GenerateRegistrationOptionsOpts, 'userID' | 'userName'>

export async function getUserRegisterOptions(
  user: User | { name: string | null; email: string }
) {
  const authenticators =
    'id' in user
      ? await client.authenticator.findMany({
          where: { userId: user.id }
        })
      : []
  const options = await generateRegistrationOptions({
    ...baseConfig,
    userID: 'id' in user ? new TextEncoder().encode(user.id) : randomBytes(16),
    userName: user.email,
    userDisplayName: (user as User)?.name || user.email,
    excludeCredentials: authenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',
      // Optional
      transports:
        (authenticator.transports?.split(
          ','
        ) as AuthenticatorTransportFuture[]) || []
    }))
  })
  setCookie('next-auth.challenge', options.challenge, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    sign: true,
    maxAge: 60 * 5 // 5 minutes
  })
  return options
}

export type VerifyUserResult =
  | { verified: false }
  | {
      verified: true
      authenticator: Authenticator
      userID: string
    }

export async function verifyUserRegistration(
  user: User | { email: string; name: string },
  ctx: RegistrationResponseJSON
): Promise<VerifyUserResult> {
  const challenge = getCookie('next-auth.challenge', { signed: true }) // Must be signed
  if (!challenge) throw new Error('No challenge found')
  const verification = await verifyRegistrationResponse({
    response: ctx,
    expectedChallenge: challenge.value,
    expectedOrigin: env.NEXT_PUBLIC_APP_URL,
    expectedRPID: baseConfig.rpID
  })
  if (!verification.verified || !verification.registrationInfo)
    return {
      verified: false
    }
  const authenticator: Authenticator = {
    credentialID: verification.registrationInfo.credentialID,
    credentialPublicKey: verification.registrationInfo.credentialPublicKey,
    counter: verification.registrationInfo.counter,
    credentialDeviceType: verification.registrationInfo.credentialDeviceType,
    credentialBackedUp: verification.registrationInfo.credentialBackedUp,
    fmt: verification.registrationInfo.fmt,
    transports: ctx.response.transports
  }
  let userID = 'id' in user ? user.id : null
  if (!userID) {
    const newUser = await createUser(
      user.email,
      randomBytes(16).toString('hex'),
      {
        name: user.name
      }
    )
    userID = newUser.id
  }
  await client.authenticator.create({
    data: {
      credentialID: Buffer.from(authenticator.credentialID).toString(
        'base64url'
      ),
      credentialPublicKey: Buffer.from(authenticator.credentialPublicKey),
      counter: authenticator.counter,
      credentialDeviceType: authenticator.credentialDeviceType,
      credentialBackedUp: authenticator.credentialBackedUp,
      fmt: authenticator.fmt,
      userId: userID as string,
      transports: authenticator.transports?.join(',') || null
    }
  })
  return {
    verified: true,
    authenticator,
    userID: userID as string
  }
}

export class NoAuthenticatorFoundError extends Error {
  constructor() {
    super('No authenticator found')
  }
}

export async function getUserAuthenticationOptions(user: { id: string }) {
  const authenticators = await client.authenticator.findMany({
    where: { userId: user.id }
  })
  if (authenticators.length === 0) throw new NoAuthenticatorFoundError()
  const options = await generateAuthenticationOptions({
    userVerification: 'preferred',
    allowCredentials: authenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: 'public-key',
      // Optional
      transports: authenticator.transports
        ? (authenticator.transports.split(
            ','
          ) as AuthenticatorTransportFuture[])
        : undefined
    })),
    rpID: baseConfig.rpID
  })
  setCookie('next-auth.challenge', options.challenge, {
    httpOnly: true,
    sameSite: 'strict',
    path: '/',
    sign: true,
    maxAge: 60 * 5 // 5 minutes
  })
  return options
}

export async function verifyUserAuthentication(
  user: { id: string },
  ctx: AuthenticationResponseJSON
): Promise<VerifyUserResult> {
  const challenge = getCookie('next-auth.challenge', { signed: true }) // Must be signed
  if (!challenge) throw new Error('No challenge found')
  const authenticator = await client.authenticator.findFirst({
    where: {
      credentialID: ctx.id,
      userId: user.id
    }
  })
  if (!authenticator)
    return {
      verified: false
    }

  const verification = await verifyAuthenticationResponse({
    response: ctx,
    expectedChallenge: challenge.value,
    expectedOrigin: env.NEXT_PUBLIC_APP_URL,
    expectedRPID: baseConfig.rpID,
    authenticator: {
      credentialID: authenticator.credentialID,
      credentialPublicKey: authenticator.credentialPublicKey,
      counter: authenticator.counter,
      transports: authenticator.transports?.split(
        ','
      ) as AuthenticatorTransportFuture[]
    }
  })
  if (!verification.verified || !verification.authenticationInfo)
    return {
      verified: false
    }
  await client.authenticator.update({
    where: { id: authenticator.id },
    data: {
      counter: verification.authenticationInfo.newCounter
    }
  })
  return {
    verified: true,
    authenticator: {
      credentialID: verification.authenticationInfo.credentialID,
      credentialPublicKey: authenticator.credentialPublicKey,
      counter: verification.authenticationInfo.newCounter,
      credentialDeviceType:
        verification.authenticationInfo.credentialDeviceType,
      credentialBackedUp: verification.authenticationInfo.credentialBackedUp,
      fmt: authenticator.fmt as AttestationFormat,
      transports: authenticator.transports
        ? (authenticator.transports.split(
            ','
          ) as AuthenticatorTransportFuture[])
        : undefined
    },
    userID: user.id
  }
}
