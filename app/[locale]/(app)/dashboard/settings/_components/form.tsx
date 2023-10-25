import { modifyProfileAction } from '@/actions/user'
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Grid,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore ts(2305)
import { experimental_useFormStatus as useFormStatus } from 'react-dom'

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
      isLoading={pending}
    >
      Save
    </Button>
  )
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const toast = useToast()

  const { state, action } = useSubmitForm(modifyProfileAction, {
    onSuccess: () => {
      toast({
        title: 'Profile updated.',
        status: 'success',
        duration: 5000,
        isClosable: true
      })
    },
    onError: (state) => {
      toast({
        title: 'Profile update failed.',
        description: state.error!,
        status: 'error',
        duration: 5000,
        isClosable: true
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
    <Grid as="form" gap={4} action={action}>
      <FormControl isInvalid={!!msgs?.nickname}>
        <FormLabel>Nickname</FormLabel>
        <Input
          type="text"
          defaultValue={defaultValues.nickname}
          name="nickname"
        />
        {!!msgs?.nickname ? (
          <FormErrorMessage>{msgs?.nickname}</FormErrorMessage>
        ) : (
          <FormHelperText>
            This is how your name will be displayed in the account.
          </FormHelperText>
        )}
      </FormControl>
      <FormControl>
        <FormLabel>Email address</FormLabel>
        <Input type="email" disabled value={defaultValues.email} />
        <FormHelperText>
          We&apos;ll never share your email with anyone else.
        </FormHelperText>
      </FormControl>
      <FormControl isInvalid={!!msgs?.website}>
        <FormLabel>Website</FormLabel>
        <Input
          name="website"
          type="text"
          placeholder="https://"
          defaultValue={defaultValues.website || undefined}
        />
        {!!msgs?.website ? (
          <FormErrorMessage>{msgs?.website}</FormErrorMessage>
        ) : (
          <FormHelperText>
            Your personal website, blog, or portfolio.
          </FormHelperText>
        )}
      </FormControl>
      <FormControl isInvalid={!!msgs?.bio}>
        <FormLabel>Bio</FormLabel>
        <Textarea
          name="bio"
          placeholder="Bio..."
          defaultValue={defaultValues.bio || undefined}
        />
        {!!msgs?.bio ? (
          <FormErrorMessage>{msgs?.bio}</FormErrorMessage>
        ) : (
          <FormHelperText>Tell us a little bit about yourself.</FormHelperText>
        )}
      </FormControl>
      <div className="flex justify-start">
        <ProfileSubmitButton />
      </div>
    </Grid>
  )
}
