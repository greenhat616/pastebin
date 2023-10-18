import { User } from '@prisma/client'
import { hash, verify } from 'argon2'

import prisma from '@/libs/prisma/client'

/**
 * verify Plain Password
 * @param password - plain password
 * @param hash - hashed password
 * @return {Promise<boolean>} - true if password is valid
 */
export function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return verify(hash, password)
}

/**
 * Hash Password
 * @param password - plain password
 * @return {Promise<string>} - hashed password
 */
export function hashPassword(password: string): Promise<string> {
  return hash(password)
}

export class UserIsSuspendedError extends Error {
  constructor() {
    super('User is suspended')
  }
}

/**
 * Login by Email
 * @param email - email
 * @param password - password
 * @returns {Promise<User | null>} - user if login success
 * @throws {UserIsSuspendedError} - if user is suspended
 */
export async function loginByEmail(
  email: string,
  password: string
): Promise<User | null> {
  const user = await prisma.user.findFirst({
    where: {
      email
    }
  })
  if (!user) return null
  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null
  if (user.isSuspend) throw new UserIsSuspendedError()
  return user
}

/**
 * Create User
 * @param email - email
 * @param password - plain password
 * @param others - other fields
 * @return {Promise<User>} - created user
 */
export async function createUser(
  email: string,
  password: string,
  others: Partial<User> = {}
): Promise<User> {
  const hashedPassword = await hashPassword(password)
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      ...others
    }
  })
}

/**
 * Find User By Id
 * @param id - user id
 * @returns {Promise<User | null>} - user if found
 */
export function findUserById(id: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: {
      id
    }
  })
}
