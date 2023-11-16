import { PrismaClient } from '@prisma/client'
import { createSoftDeleteExtension } from 'prisma-extension-soft-delete'
const client = new PrismaClient()

// use soft delete
client.$extends(
  createSoftDeleteExtension({
    models: {
      User: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date()
          return null
        }
      },
      Announcement: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date()
          return null
        }
      },
      Paste: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date()
          return null
        }
      },
      Comment: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date()
          return null
        }
      },
      Notification: {
        field: 'deletedAt',
        createValue: (deleted) => {
          if (deleted) return new Date()
          return null
        }
      }
    }
  })
)

export default client
