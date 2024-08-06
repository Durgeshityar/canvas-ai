import { auth } from '@/auth'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .middleware(async ({ req }) => {
      // todo : replace with next-auth
      const session = await auth()

      if (!session) throw new UploadThingError('Unauthorized')

      return { userId: session.user?.id }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // store  file in the DB with userid -> metadata.userId

      return { url: file.url }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
