'use client'
import { submitPasteNormalAction } from '@/actions/paste'
import { codeToHTML, getShikiAllSupportedLanguages } from '@/libs/shiki'
import { ReducerDispatch } from '@/utils/types'
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
  useToast
} from '@chakra-ui/react'
import { useAsyncEffect } from 'ahooks'
import { Select } from 'chakra-react-select'
import { useTranslations } from 'next-intl'
import React, { useReducer, useRef, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { BuiltinLanguage } from 'shikiji/core'
type Props = {
  defaultNickname?: string
  className: string
}

const syntaxes = getShikiAllSupportedLanguages()

// Form states
type FormState = {
  poster: string
  syntax: string | null
  expiration: number | null
  content: string
}

type FormStateActions = 'update' | 'reset'

const initialFormState: FormState = {
  poster: '',
  syntax: 'text',
  expiration: 60 * 30, // 30 minutes
  content: ''
}

const formStateReducer: ReducerDispatch<FormState, FormStateActions> = (
  state,
  action
) => {
  switch (action.type) {
    case 'update':
      return {
        ...state,
        [action.field]: action.value
      }
    case 'reset':
      return initialFormState
    default:
      throw new Error()
  }
}

export function SubmitButton({
  loadingText,
  children
}: {
  loadingText: string
  children: React.ReactNode
}) {
  const { pending } = useFormStatus()
  return (
    <Button
      colorScheme="blue"
      variant="solid"
      type="submit"
      isLoading={pending}
      disabled={pending}
      loadingText={loadingText}
    >
      {children}
    </Button>
  )
}

export default function CodeForm(props: Props) {
  const t = useTranslations()
  const toast = useToast()

  // Generates Options with i18n
  const syntaxOptions = syntaxes.reduce(
    (acc, syntax) => {
      return [...acc, { label: syntax.name || syntax.id, value: syntax.id }]
    },
    [{ label: t('components.code_form.form.syntax.plain_text'), value: 'text' }]
  )
  const expirationOptions = [
    {
      label: t('components.code_form.form.expiration.options.none'),
      value: -1
    },
    {
      label: t('components.code_form.form.expiration.options.thirty_minutes'),
      value: 60 * 30
    },
    {
      label: t('components.code_form.form.expiration.options.one_hour'),
      value: 60 * 60
    },
    {
      label: t('components.code_form.form.expiration.options.one_day'),
      value: 60 * 60 * 24
    },
    {
      label: t('components.code_form.form.expiration.options.one_week'),
      value: 60 * 60 * 24 * 7
    },
    {
      label: t('components.code_form.form.expiration.options.one_month'),
      value: 60 * 60 * 24 * 30
    },
    {
      label: t('components.code_form.form.expiration.options.one_year'),
      value: 60 * 60 * 24 * 365
    }
  ]

  const [isPreview, setPreview] = useState(false)
  const [contentPreview, setContentPreview] = useState('')
  const [formState, formStateDispatch] = useReducer(formStateReducer, {
    ...initialFormState,
    poster: props.defaultNickname || ''
  } as FormState)
  const { state, action } = useSubmitForm(submitPasteNormalAction, {
    onError(state) {
      toast({
        title: t('components.code_form.feedback.fail.title'),
        description: t('components.code_form.feedback.fail.description', {
          error: translateIfKey(t, state.error || 'unknown_error')
        }),
        status: 'error',
        isClosable: true
      })
    }
  })
  const msgs = state?.issues?.reduce(
    (acc, cur) => {
      for (const path of cur.path) {
        if (!acc[path as keyof typeof acc])
          acc[path as keyof typeof acc] = translateIfKey(t, cur.message)
      }
      return acc
    },
    {
      poster: undefined as string | undefined,
      syntax: undefined as string | undefined,
      expiration: undefined as string | undefined,
      content: undefined as string | undefined
    }
  )

  const contentRef = useRef<HTMLTextAreaElement>(null)
  // Reactive Render Preview
  useAsyncEffect(async () => {
    setContentPreview(() => 'Rendering...')
    try {
      const result = await codeToHTML(formState.content, {
        lang: formState.syntax as BuiltinLanguage
      })
      setContentPreview(() => result)
    } catch (err) {
      console.error(err)
      setContentPreview(
        () =>
          `Rendering Error: ${(err as Error)
            ?.message}. You can see the error in the console.`
      )
    }
  }, [formState.content, formState.syntax])

  return (
    <Box className={props.className} as="form" action={action}>
      <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
        <FormControl
          w={{ base: '100%', md: '33.3333%' }}
          isInvalid={!!msgs?.poster}
        >
          <FormLabel>{t('components.code_form.form.poster.label')}</FormLabel>
          <Input
            name="poster"
            type="text"
            placeholder={t('components.code_form.form.poster.placeholder')}
            value={formState.poster}
            onChange={(e) =>
              formStateDispatch({
                type: 'update',
                field: 'poster',
                value: e.target.value
              })
            }
          />
          {!!msgs?.poster ? (
            <FormErrorMessage>{msgs.poster}</FormErrorMessage>
          ) : (
            <FormHelperText>
              {t('components.code_form.form.poster.helper_text')}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl
          w={{ base: '100%', md: '33.3333%' }}
          isInvalid={!!msgs?.syntax}
        >
          <FormLabel>{t('components.code_form.form.syntax.label')}</FormLabel>
          <Select
            instanceId="syntax"
            name="syntax"
            className="cursor-text"
            useBasicStyles
            options={syntaxOptions}
            placeholder={t('components.code_form.form.syntax.placeholder')}
            value={syntaxOptions.find((o) => o.value === formState.syntax)}
            onChange={(e) => {
              formStateDispatch({
                type: 'update',
                field: 'syntax',
                value: e ? e.value : e
              })
            }}
          ></Select>
          {!!msgs?.syntax && <FormErrorMessage>{msgs.syntax}</FormErrorMessage>}
        </FormControl>
        <FormControl
          w={{ base: '100%', md: '33.3333%' }}
          isInvalid={!!msgs?.expiration}
        >
          <FormLabel>
            {t('components.code_form.form.expiration.label')}
          </FormLabel>
          <Select
            instanceId="expiration"
            name="expiration"
            className="cursor-text"
            useBasicStyles
            options={expirationOptions}
            placeholder={t('components.code_form.form.expiration.placeholder')}
            value={expirationOptions.find(
              (o) => o.value === formState.expiration
            )}
            onChange={(e) => {
              formStateDispatch({
                type: 'update',
                field: 'expiration',
                value: e ? e.value : e
              })
            }}
          ></Select>

          {!!msgs?.expiration ? (
            <FormErrorMessage>{msgs.expiration}</FormErrorMessage>
          ) : (
            <FormHelperText>
              {t('components.code_form.form.expiration.helper_text')}
            </FormHelperText>
          )}
        </FormControl>
      </Flex>

      <Box className="mt-sm">
        <FormControl isInvalid={!!msgs?.content}>
          <FormLabel>{t('components.code_form.form.content.label')}</FormLabel>
          {isPreview ? (
            <Card variant="outline" height="md" p={0}>
              <CardBody
                paddingX="1em"
                paddingY="0.5em"
                lineHeight="short"
                dangerouslySetInnerHTML={{ __html: contentPreview }}
                className="overflow-y-auto"
                onClick={() => {
                  setPreview((s) => !s)
                  contentRef?.current?.focus()
                }}
              />
            </Card>
          ) : (
            <Textarea
              ref={contentRef}
              name="content"
              placeholder={t('components.code_form.form.content.placeholder')}
              height="md"
              value={formState.content}
              onChange={(e) =>
                formStateDispatch({
                  type: 'update',
                  field: 'content',
                  value: e.target.value
                })
              }
              className="font-mono"
              resize="none"
            ></Textarea>
          )}
          {!!msgs?.content && (
            <FormErrorMessage>{msgs.content}</FormErrorMessage>
          )}
        </FormControl>
      </Box>
      <Flex className="mt-sm md:mt-3xl" justify="flex-end" gap={4}>
        <SubmitButton loadingText={t('components.code_form.form.submitting')}>
          {t('components.code_form.form.actions.submit')}
        </SubmitButton>
        <Button variant="outline" onClick={() => setPreview((s) => !s)}>
          {t('components.code_form.form.actions.preview')}
        </Button>
      </Flex>
    </Box>
  )
}
