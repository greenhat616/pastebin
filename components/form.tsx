/* eslint-disable @typescript-eslint/no-explicit-any */
import { submitPasteNormalAction } from '@/actions/paste'
import { codeToHTML, getShikiAllSupportedLanguages } from '@/libs/shiki'
import { CreateNormalSnippetForm } from '@/libs/validation/paste'
import { ReducerDispatcher } from '@/utils/types'
import { Box, Card, Flex, Input, Textarea } from '@chakra-ui/react'
import { Button } from './ui/button'
import { Field } from './ui/field'
import { useAsyncEffect } from 'ahooks'
import { Select } from 'chakra-react-select'
import 'client-only'
import { useTranslations } from 'next-intl'
import React, { useReducer, useRef, useState } from 'react'

import { useFormStatus } from 'react-dom'
import type { BundledLanguage } from 'shiki/bundle/full'
import { toaster } from './ui/toaster'

type Props = {
  defaultNickname?: string
  className?: string
  onSuccess?: (pasteID: string) => void // If it exists,it will prevent auto redirect, and call onSuccess instead.
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

const formStateReducer: ReducerDispatcher<FormState, FormStateActions> = (
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
      loading={pending}
      disabled={pending}
      loadingText={loadingText}
    >
      {children}
    </Button>
  )
}

export function CreateNormalSnippet(props: Props) {
  const t = useTranslations()

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
  const { state, action } = useSubmitForm<
    CreateNormalSnippetForm,
    { id: string }
  >(submitPasteNormalAction, {
    onError(state) {
      toaster.create({
        title: t('components.code_form.feedback.fail.title'),
        description: t('components.code_form.feedback.fail.description', {
          error: translateIfKey(t, state.error || 'unknown_error')
        }),
        type: 'error'
      })
    },
    onSuccess(state) {
      if (props.onSuccess) {
        props.onSuccess(state!.data!.id)
      }
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
        lang: formState.syntax as BundledLanguage
      })
      setContentPreview(() => result)
    } catch (err) {
      console.error(err)
      setContentPreview(
        () =>
          `Rendering Error: ${
            (err as Error)?.message
          }. You can see the error in the console.`
      )
    }
  }, [formState.content, formState.syntax])

  return (
    <form className={props.className} action={action}>
      <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
        <Field
          w={{ base: '100%', md: '33.3333%' }}
          invalid={!!msgs?.poster}
          label={t('components.code_form.form.poster.label')}
          errorText={msgs?.poster}
          helperText={t('components.code_form.form.poster.helper_text')}
        >
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
        </Field>
        <Field
          w={{ base: '100%', md: '33.3333%' }}
          invalid={!!msgs?.syntax}
          label={t('components.code_form.form.syntax.label')}
          errorText={msgs?.syntax}
        >
          <Select
            instanceId="syntax"
            name="syntax"
            className="cursor-text"
            useBasicStyles
            options={syntaxOptions}
            placeholder={t('components.code_form.form.syntax.placeholder')}
            value={syntaxOptions.find((o) => o.value === formState.syntax)}
            onChange={(e: any) => {
              formStateDispatch({
                type: 'update',
                field: 'syntax',
                value: e ? e.value : e
              })
            }}
          ></Select>
        </Field>
        <Field
          w={{ base: '100%', md: '33.3333%' }}
          invalid={!!msgs?.expiration}
          label={t('components.code_form.form.expiration.label')}
          errorText={msgs?.expiration}
          helperText={t('components.code_form.form.expiration.helper_text')}
        >
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
            onChange={(e: any) => {
              formStateDispatch({
                type: 'update',
                field: 'expiration',
                value: e ? e.value : e
              })
            }}
          ></Select>
        </Field>
        <input
          name="redirect"
          className="hidden"
          type="hidden"
          value={!!props.onSuccess ? 0 : 1}
        />
      </Flex>

      <Box className="mt-4">
        <Field
          invalid={!!msgs?.content}
          label={t('components.code_form.form.content.label')}
          errorText={msgs?.content}
        >
          <Card.Root variant="outline" height="md" p={0} hidden={!isPreview}>
            <Card.Body
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
          </Card.Root>

          <Textarea
            ref={contentRef}
            className={classNames('font-mono', isPreview && 'hidden')}
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
            resize="none"
          />
        </Field>
      </Box>
      <Flex className="mt-4 md:mt-6" justify="flex-end" gap={4}>
        <SubmitButton loadingText={t('components.code_form.form.submitting')}>
          {t('components.code_form.form.actions.submit')}
        </SubmitButton>
        <Button variant="outline" onClick={() => setPreview((s) => !s)}>
          {t('components.code_form.form.actions.preview')}
        </Button>
      </Flex>
    </form>
  )
}
