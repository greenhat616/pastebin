import { modifyProfileAction } from '@/actions/user'
import { Input, Textarea } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'

import { useFormStatus } from 'react-dom'
import { toaster } from '@/components/ui/toaster'

export type ProfileFormProps = {
  defaultValues: {
    nickname: string
    email: string
    website?: string
    bio?: string
  }
}

function ProfileSubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      colorScheme="blue"
      type="submit"
      disabled={pending}
      loadingText="Saving"
      loading={pending}
    >
      Save
    </Button>
  )
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const { state, action } = useSubmitForm(modifyProfileAction, {
    onSuccess: () => {
      toaster.create({
        title: 'Profile updated.',
        type: 'success',
        duration: 5000
      })
    },
    onError: (state) => {
      toaster.create({
        title: 'Profile update failed.',
        description: state.error!,
        type: 'error',
        duration: 5000
      })
    }
  })

  const msgs = state.issues?.reduce(
    (acc, issue) => {
      for (const path of issue.path) {
        if (!acc[path as keyof typeof acc])
          acc[path as keyof typeof acc] = issue.message
        // acc[path as keyof typeof acc] = translateIfKey(t, issue.message)
      }
      return acc
    },
    {
      nickname: undefined as string | undefined,
      website: undefined as string | undefined,
      bio: undefined as string | undefined
    }
  )
  return (
    <form className='grid gap-4' action={action}>
      <Field
        label="Nickname"
        helperText="This is how your name will be displayed in the account."
        invalid={!!msgs?.nickname}
      >
        <Input
          type="text"
          defaultValue={defaultValues.nickname}
          name="nickname"
        />
      </Field>
      <Field
        label="Email address"
        helperText="We&apos;ll never share your email with anyone else."
      >
        <Input type="email" disabled value={defaultValues.email} />
      </Field>
      <Field
        label="Website"
        helperText="Your personal website, blog, or portfolio."
        invalid={!!msgs?.website}
      >
        <Input
          name="website"
          type="text"
          placeholder="https://"
          defaultValue={defaultValues.website || undefined}
        />
      </Field>
      <Field
        label="Bio"
        helperText="Tell us a little bit about yourself."
        invalid={!!msgs?.bio}
      >
        <Textarea
          name="bio"
          placeholder="Bio..."
          defaultValue={defaultValues.bio || undefined}
        />
      </Field>
      <div className="flex justify-start">
        <ProfileSubmitButton />
      </div>
    </form>
  )
}
