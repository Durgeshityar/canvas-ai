'use client'

import { useCreateProjects } from '@/features/projects/api/use-create-projects'

import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'

export const Banner = () => {
  const mutation = useCreateProjects()
  const router = useRouter()

  const onClick = () => {
    mutation.mutate(
      {
        name: 'Untitled project',
        json: '',
        width: 900,
        height: 1200,
      },
      {
        onSuccess: ({ data }) => {
          router.push(`/editor/${data.id}`)
        },
      }
    )
  }
  return (
    <div className=" text-white aspect-[5/1] min-h-[248px] flex gap-x-6 p-6 items-center rounded-xl bg-gradient-to-r from-[#2e62cb] via-[#0073ff] to-[#3faff5]">
      <div className="rounded-full size-28  items-center justify-center bg-white/50 hidden md:flex">
        <div className="rounded-full size-20 flex items-center justify-center bg-white">
          <Sparkles className="h-20 text-[#0073ff] fill-[#0073ff]" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className=" text-2xl md:text-3xl font-semibold">
          Visualize your ideas with Canvas AI
        </h1>
        <p className="  text-xs md:text-sm mb-2">
          Turn your inspirations into stunning designs in no time. Simply upload
          an image, and let our AI do the rest. Create professional-grade
          visuals effortlessly!
        </p>
        <Button
          disabled={mutation.isPending}
          onClick={onClick}
          variant={'secondary'}
          className="w-[160px]"
        >
          Start Creating
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
