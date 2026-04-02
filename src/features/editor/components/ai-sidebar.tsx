import { useState } from 'react'
import { cn } from '@/lib/utils'

import { useAiPaywall } from '@/features/ai/hooks/use-ai-paywall'
import { ActiveTool, Editor } from '@/features/editor/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

import { ToolSidebarHeader } from '@/features/editor/components/tool-sidebar-header'
import { ToolSidebarClose } from '@/features/editor/components/tools-sidebar-close'
import { useGenerateImage } from '@/features/ai/api/use-generate-image'

interface AiSideBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const AiSideBar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: AiSideBarProps) => {
  const { shouldBlock, triggerPaywall, isLoading, isError, usage } =
    useAiPaywall()

  const mutation = useGenerateImage()

  const [value, setValue] = useState('')
  const freeCredits = usage?.credits ?? 0

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (isLoading) {
      return
    }

    if (shouldBlock) {
      triggerPaywall()
      return
    }

    mutation.mutate(
      { prompt: value },
      {
        onSuccess: ({ data }) => {
          editor?.addImage(data)
        },
      }
    )
  }

  const onClose = () => {
    onChangeActiveTool('select')
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'ai' ? 'visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="AI" description="Generate an image using AI" />
      <ScrollArea>
        <form onSubmit={onSubmit} className="p-4 space-y-6">
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
          <Textarea
            disabled={mutation.isPending || isLoading}
            value={value}
            placeholder="An astronaut riding a horse on mars, hd, dramatic, lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending || isLoading}
            type="submit"
            className="w-full"
          >
            Generate
          </Button>
        </form>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default AiSideBar
