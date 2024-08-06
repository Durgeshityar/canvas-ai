import { useState } from 'react'
import { cn } from '@/lib/utils'

import { usePaywall } from '@/features/subscriptions/hooks/use-paywall'
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
  const { shouldBlock, triggerPaywall } = usePaywall()

  const mutation = useGenerateImage()

  const [value, setValue] = useState('')

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

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
          <Textarea
            disabled={mutation.isPending}
            value={value}
            placeholder="An astronaut riding a horse on mars, hd, dramatic, lighting"
            cols={30}
            rows={10}
            required
            minLength={3}
            onChange={(e) => setValue(e.target.value)}
          />
          <Button
            disabled={mutation.isPending}
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
