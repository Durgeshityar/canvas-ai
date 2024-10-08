import { cn } from '@/lib/utils'

import { ActiveTool, Editor, FILL_COLOR } from '@/features/editor/types'
import { ScrollArea } from '@/components/ui/scroll-area'

import { ToolSidebarHeader } from './tool-sidebar-header'
import { ToolSidebarClose } from './tools-sidebar-close'
import { ColorPicker } from './color-picker'

interface FillColorSideBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const FillColorSideBar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: FillColorSideBarProps) => {
  const value = editor?.getActiveFillColor() || FILL_COLOR

  const onClose = () => {
    onChangeActiveTool('select')
  }

  const onChange = (value: string) => {
    editor?.changeFillColor(value)
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'fill' ? 'visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader
        title="Fill Color"
        description="Add color to your element"
      />
      <ScrollArea>
        <div className="p-4 space-y-6">
          <ColorPicker value={value} onChange={onChange} />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default FillColorSideBar
