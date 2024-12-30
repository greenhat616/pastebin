'use client'

import { PasteType } from '@/enums/paste'
import { getDisplayNameByLanguageID } from '@/libs/shiki'
import { Card, Flex } from '@chakra-ui/react'
import { Tag } from '@/components/ui/tag'
import { type Paste } from '@prisma/client'

import { Link } from '@/libs/navigation'
import { motion } from 'framer-motion'
import styles from './snippet.module.scss'

export type SnippetProps = {
  locale: string
  timeZone: string
  snippet: Paste
}

export default function Snippet({ locale, timeZone, snippet }: SnippetProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Link href={`/v/${snippet.id}` as any}>
        <Card.Root
          key={snippet.id}
          variant="outline"
          rounded="2xl"
          className={styles.snippet}
        >
          <Card.Header>
            <Flex>
              <h2 className="font-medium text-lg flex-1">
                {snippet.title || 'Untitled Snippet'}
              </h2>
              <div className="flex gap-2">
                <Tag>{formatPasteType(snippet.type as PasteType)}</Tag>
                {(snippet.type as PasteType) === PasteType.Normal && (
                  <Tag>
                    {getDisplayNameByLanguageID(snippet.syntax || 'text')}
                  </Tag>
                )}
              </div>
            </Flex>
          </Card.Header>
          <Card.Body pt="0">
            <p className="text-sm font-italic">
              {snippet.description || 'No description provided.'}
            </p>
            <div className="flex gap-3 mt-5">
              <p className="truncate flex-1 text-sm">
                Posted on:{' '}
                {newDayjs(snippet.createdAt, {
                  timeZone,
                  locale
                }).fromNow()}
              </p>

              {!!snippet.expiredAt && (
                <Tag>
                  Expired{' '}
                  {newDayjs(snippet.expiredAt, {
                    timeZone,
                    locale
                  }).fromNow()}
                </Tag>
              )}
            </div>
          </Card.Body>
        </Card.Root>
      </Link>
    </motion.div>
  )
}
