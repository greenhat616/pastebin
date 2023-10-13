import { PasteType } from '@/enum/paste'
import Joi from 'joi'
import { notFound } from 'next/navigation'
import CodePreview from './_components/CodePreview'
import CodePreviewIntlProvider from './_components/CodePreviewIntlProvider'

function checkUUIDValidation(uuid?: string): boolean {
  if (!uuid) return false
  try {
    Joi.attempt(uuid, Joi.string().uuid())
  } catch (e) {
    return false
  }
  return true
}

type PasteData = {
  uuid: string
  type: PasteType
  content: Array<{
    name: string // With extension
    content: string
    syntax: string
  }>
  poster: string
  expiration: number
  deletedAt: number | null
  updatedAt: number
  createdAt: number
}

async function getPasteData(uuid: string): Promise<PasteData> {
  return {
    uuid,
    type: PasteType.Normal,
    content: [
      {
        name: `types.tsx`,
        content: `// expands object types one level deep
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never

// expands object types recursively
export type ExpandRecursively<T> = T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T
// distributive conditional types
// ref: https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DistributiveOmit<T, K extends keyof any> = T extends any
  ? Omit<T, K>
  : never

// Another implementation of Distributive Pick
// Ref https://dev.to/safareli/pick-omit-and-union-types-in-typescript-4nd9
export type Keys<T> = keyof T
export type DistributiveKeys<T> = T extends unknown ? Keys<T> : never
export type DistributivePick<
  T,
  K extends DistributiveKeys<T>
> = T extends unknown ? Pick<T, Extract<keyof T, K>> : never

// export type DistributiveOmit<
//   T,
//   K extends DistributiveKeys<T>
// > = T extends unknown ? Omit<T, Extract<keyof T, K>> : never

// React related types

export type ReducerAction<O, U extends string> = {
  [K in keyof O]: {
    type: U
    field: K
    value: O[K]
  }
}[keyof O]

export type ReducerActionBatch<O, U extends string> = {
  type: U
  state: Partial<O>
}

export type ReducerDispatch<
  O,
  U extends string,
  Batch extends boolean = false
> = (
  state: O,
  action: Batch extends true ? ReducerActionBatch<O, U> : ReducerAction<O, U>
) => O`,
        syntax: 'typescript'
      }
    ],
    poster: 'test',
    expiration: 60 * 60 * 24 * 7,
    deletedAt: null,
    updatedAt: Date.now(),
    createdAt: Date.now()
  }
}

type Props = {
  params: { uuid: string }
}

export default async function View(props: Props) {
  if (!checkUUIDValidation(props.params.uuid)) return notFound()
  const uuid = props.params.uuid
  const data = await getPasteData(uuid)

  return (
    <div>
      <h1>View {uuid}</h1>
      <CodePreviewIntlProvider>
        <CodePreview
          content={data.content[0].content}
          language={data.content[0].syntax}
        />
      </CodePreviewIntlProvider>
    </div>
  )
}
