// import { ResponseCode } from '@/enums/response'
// import { Role } from '@/enums/user'
// import client from '@/libs/prisma/client'
// import { createUser } from '@/libs/services/users/user'
// import Joi from 'joi'
// import { NextRequest } from 'next/server'

// const userSignUpSchema = Joi.object<UserSignUp>({
//   email: Joi.string().email().required(),
//   name: Joi.string().min(2).max(32).required(),
//   password: Joi.string().min(8).max(100).required(),
//   passwordConfirm: Joi.string().valid(Joi.ref('password')).required()
// })

// type UserSignUp = {
//   email: string
//   name: string
//   password: string
//   passwordConfirm: string
// }

// export async function POST(req: NextRequest) {
//   const data = (await req.json()) as Partial<UserSignUp>
//   const { error } = userSignUpSchema.validate(data)
//   if (error) {
//     return fail(ResponseCode.ValidationFailed, {
//       data: error.details,
//       status: 400
//     })
//   }
//   const params = <UserSignUp>data // It just a type assertion
//   const user = await client.user.findFirst({
//     where: {
//       email: params.email
//     }
//   })
//   if (user) {
//     return fail(ResponseCode.OperationFailed, {
//       message: 'email already exists'
//     })
//   }
//   const newUser = await createUser(params.email, params.password, {
//     name: params.name,
//     role: Role.User
//   })
//   return success(newUser)
// }
