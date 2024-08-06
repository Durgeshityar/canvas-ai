import Image from 'next/image'
import { AlertTriangle, Loader, Crown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { useConfirm } from '@/hooks/use-confirm'

import { usePaywall } from '@/features/subscriptions/hooks/use-paywall'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ActiveTool, Editor } from '@/features/editor/types'
import { ToolSidebarHeader } from '@/features/editor/components/tool-sidebar-header'
import { ToolSidebarClose } from '@/features/editor/components/tools-sidebar-close'
import {
  ResponseType,
  useGetTemplates,
} from '@/features/projects/api/use-get-templates'

interface TemplateSideBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const TemplateSideBar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: TemplateSideBarProps) => {
  const { shouldBlock, triggerPaywall } = usePaywall()
  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are going to replace the current project with this template'
  )

  const { data, isError, isLoading } = useGetTemplates({
    limit: '20',
    page: '1',
  })

  const onClose = () => {
    onChangeActiveTool('select')
  }

  const onClick = async (template: ResponseType['data'][0]) => {
    if (template.isPro && shouldBlock) {
      triggerPaywall()
      return
    }

    const ok = await confirm()
    if (ok) {
      editor?.loadJson(template.json)
    }
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'templates' ? 'visible' : 'hidden'
      )}
    >
      <ConfirmationDialog />
      <ToolSidebarHeader
        title="Templates"
        description="Choose from a variety of templates to get started"
      />

      {isLoading && (
        <div className="flex items-center justify-center flex-1">
          <Loader className="size-4 text-muted-foreground animate-spin" />
        </div>
      )}

      {isError && (
        <div className="flex flex-col gap-y-4 items-center justify-center flex-1">
          <AlertTriangle className="size-4 text-muted-foreground " />
          <p className=" text-muted-foreground text-xs">
            Failed to fetch templates
          </p>
        </div>
      )}

      <ScrollArea>
        <div className="p-4 ">
          <div className="grid grid-cols-2 gap-4">
            {data &&
              data.map((template) => {
                return (
                  <button
                    style={{
                      aspectRatio: `${template.width}/${template.height}`,
                    }}
                    onClick={() => onClick(template)}
                    key={template.id}
                    className="relative w-full  group hover:opacity-75 transition bg-muted rounded-sm border overflow-hidden "
                  >
                    <Image
                      fill
                      src={template.thumbnailUrl || ''}
                      alt={template.name || 'template'}
                      className="object-cover"
                    />
                    {template.isPro && (
                      <div className="absolute top-2 right-2 size-8 items-center justify-center flex bg-black/50 rounded-full">
                        <Crown className="size-4 fill-yellow-500 text-yellow-500" />
                      </div>
                    )}
                    <div className="opacity-0 group-hover:opacity-100 absolute left-0 bottom-0 w-full text-[10px] truncate text-white p-1 bg-black/50 text-left">
                      {template.name}
                    </div>
                  </button>
                )
              })}
          </div>
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default TemplateSideBar
