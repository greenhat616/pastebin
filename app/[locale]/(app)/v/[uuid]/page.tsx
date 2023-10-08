import Joi from 'joi'
import { notFound } from 'next/navigation'

type Props = {
  params: { uuid: string }
}

function checkUUIDValidation(uuid?: string): boolean {
  if (!uuid) return false
  try {
    Joi.attempt(uuid, Joi.string().uuid())
  } catch (e) {
    return false
  }
  return true
}

export default function View(props: Props) {
  if (!checkUUIDValidation(props.params.uuid)) return notFound()
  const uuid = props.params.uuid
  return (
    <div>
      <h1>View {uuid}</h1>
    </div>
  )
}
