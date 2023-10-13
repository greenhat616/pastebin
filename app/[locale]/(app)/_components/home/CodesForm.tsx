'use client'
import { ReducerDispatch } from '@/utils/types'
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea
} from '@chakra-ui/react'
import { Select } from 'chakra-react-select'
import { useTranslations } from 'next-intl'
import { useEffect, useReducer, useRef, useState } from 'react'
import { BuiltinLanguage } from 'shikiji/core'

type Props = {
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
  syntax: 'plain',
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

export default function CodeForm(props: Props) {
  const t = useTranslations('home')

  // Generates Options with i18n
  const syntaxOptions = syntaxes.reduce(
    (acc, syntax) => {
      return [...acc, { label: syntax.name || syntax.id, value: syntax.id }]
    },
    [{ label: t('form.syntax.plain_text'), value: 'text' }]
  )
  const expirationOptions = [
    { label: t('form.expiration.options.none'), value: -1 },
    { label: t('form.expiration.options.thirty_minutes'), value: 60 * 30 },
    { label: t('form.expiration.options.one_hour'), value: 60 * 60 },
    { label: t('form.expiration.options.one_day'), value: 60 * 60 * 24 },
    { label: t('form.expiration.options.one_week'), value: 60 * 60 * 24 * 7 },
    { label: t('form.expiration.options.one_month'), value: 60 * 60 * 24 * 30 },
    { label: t('form.expiration.options.one_year'), value: 60 * 60 * 24 * 365 }
  ]

  const [isPreview, setPreview] = useState(false)
  const [contentPreview, setContentPreview] = useState('')
  const [formState, formStateDispatch] = useReducer(
    formStateReducer,
    initialFormState
  )
  const contentRef = useRef<HTMLTextAreaElement>(null)

  // Reactive Render Preview
  useEffect(() => {
    setContentPreview(() => 'Rendering...')
    if (formState.syntax === 'plain') {
      setContentPreview(() => formState.content)
      return
    }
    codeToHTML(formState.content, {
      lang: formState.syntax as BuiltinLanguage
    })
      .then((result) => {
        setContentPreview(() => result)
      })
      .catch((err) => {
        setContentPreview(() => err.message)
      })
  }, [formState.content, formState.syntax])

  return (
    <Box className={props.className}>
      <Flex gap={4} direction={{ base: 'column', md: 'row' }}>
        <FormControl w={{ base: '100%', md: '33.3333%' }}>
          <FormLabel>{t('form.poster.label')}</FormLabel>
          <Input
            name="poster"
            type="text"
            placeholder={t('form.poster.placeholder')}
            value={formState.poster}
            onChange={(e) =>
              formStateDispatch({
                type: 'update',
                field: 'poster',
                value: e.target.value
              })
            }
          />
          <FormHelperText>{t('form.poster.helper_text')}</FormHelperText>
        </FormControl>
        <FormControl w={{ base: '100%', md: '33.3333%' }}>
          <FormLabel>{t('form.syntax.label')}</FormLabel>
          <Select
            instanceId="syntax"
            name="syntax"
            className="cursor-text"
            useBasicStyles
            options={syntaxOptions}
            placeholder={t('form.syntax.placeholder')}
            value={syntaxOptions.find((o) => o.value === formState.syntax)}
            onChange={(e) => {
              formStateDispatch({
                type: 'update',
                field: 'syntax',
                value: e ? e.value : e
              })
            }}
          ></Select>
        </FormControl>
        <FormControl w={{ base: '100%', md: '33.3333%' }}>
          <FormLabel>{t('form.expiration.label')}</FormLabel>
          <Select
            instanceId="expiration"
            name="expiration"
            className="cursor-text"
            useBasicStyles
            options={expirationOptions}
            placeholder={t('form.expiration.placeholder')}
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

          <FormHelperText>{t('form.expiration.helper_text')}</FormHelperText>
        </FormControl>
      </Flex>

      <Box className="mt-sm">
        <FormControl>
          <FormLabel>{t('form.content.label')}</FormLabel>
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
                  contentRef.current?.focus()
                }}
              />
            </Card>
          ) : (
            <Textarea
              ref={contentRef}
              name="content"
              placeholder={t('form.content.placeholder')}
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
        </FormControl>
      </Box>
      <Flex className="mt-sm md:mt-3xl" justify="flex-end" gap={4}>
        <Button colorScheme="blue" variant="solid">
          {t('form.actions.submit')}
        </Button>
        <Button variant="outline" onClick={() => setPreview((s) => !s)}>
          {t('form.actions.preview')}
        </Button>
      </Flex>
    </Box>
  )
}
