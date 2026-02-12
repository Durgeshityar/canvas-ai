import { cn } from '@/lib/utils'

import { ScrollArea } from '@/components/ui/scroll-area'

import { ActiveTool, Editor, filters } from '@/features/editor/types'
import { ToolSidebarHeader } from '@/features/editor/components/tool-sidebar-header'
import { ToolSidebarClose } from '@/features/editor/components/tools-sidebar-close'
import { Button } from '@/components/ui/button'

interface FilterSideBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const FiltertSideBar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: FilterSideBarProps) => {
  const onClose = () => {
    onChangeActiveTool('select')
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'filter' ? 'visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader
        title="Filters"
        description="Apply a filter to selected image"
      />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={'secondary'}
              size={'lg'}
              className={cn('w-full h-16 justify-start text-left')}
              onClick={() => editor?.changeImageFilter(filter)}
            >
              {filter}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default FiltertSideBar
