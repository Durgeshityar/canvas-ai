import { cn } from '@/lib/utils'
import Image from 'next/image'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'

import { useAiPaywall } from '@/features/ai/hooks/use-ai-paywall'
import { ActiveTool, Editor } from '@/features/editor/types'
import { ToolSidebarHeader } from '@/features/editor/components/tool-sidebar-header'
import { ToolSidebarClose } from '@/features/editor/components/tools-sidebar-close'
import { AlertTriangle } from 'lucide-react'
import { useRemoveBg } from '@/features/ai/api/use-remove-bg'

interface RemoveBgSideBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const RemoveBgSideBar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: RemoveBgSideBarProps) => {
  const { shouldBlock, triggerPaywall, isLoading, isError, usage } =
    useAiPaywall()
  const mutation = useRemoveBg()
  const freeCredits = usage?.credits ?? 0

  const selectedObject = editor?.selectedObjects[0]

  //@ts-ignore
  const imageSrc = selectedObject?._originalElement?.currentSrc

  const onClose = () => {
    onChangeActiveTool('select')
  }

  const onClick = () => {
    if (isLoading) {
      return
    }

    if (shouldBlock) {
      triggerPaywall()
      return
    }

    mutation.mutate(
      {
        image: imageSrc,
      },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data)
        },
      }
    )
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'remove-bg' ? 'visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader
        title="Background removal"
        description="Remove background from image using AI"
      />
      <div className="px-4 pt-4">
        <div className="rounded-md border bg-muted/40 p-3">
          <p className="text-xs text-muted-foreground">
            {isLoading && 'Checking AI credits...'}
            {!isLoading &&
              !isError &&
              (usage?.active
                ? 'Pro plan active: unlimited AI usage.'
                : `Free AI credits left: ${freeCredits}/1`)}
            {!isLoading &&
              isError &&
              'Could not load credit balance. Access will be verified on submit.'}
          </p>
        </div>
      </div>

      {!imageSrc && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1 ">
          <AlertTriangle className="size-4 text-muted-foreground" />
          <p className="text-muted-foreground text-xs">
            Feature not available for this object
          </p>
        </div>
      )}

      {imageSrc && (
        <ScrollArea>
          <div className="p-4 space-y-4">
            <div
              className={cn(
                'relative aspect-square rounded-md overflow-hidden transition bg bg-muted',
                mutation.isPending && 'opacity-50'
              )}
            >
              <Image src={imageSrc} fill alt="image" className="object-cover" />
            </div>
            <Button
              disabled={mutation.isPending || isLoading}
              className=" w-full"
              onClick={onClick}
            >
              Remove background
            </Button>
          </div>
        </ScrollArea>
      )}

      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default RemoveBgSideBar
