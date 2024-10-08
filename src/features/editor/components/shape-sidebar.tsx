import { FaCircle, FaSquare, FaSquareFull } from 'react-icons/fa'
import { FaDiamond } from 'react-icons/fa6'
import { IoTriangle } from 'react-icons/io5'

import { cn } from '@/lib/utils'

import { ActiveTool, Editor } from '@/features/editor/types'
import { ScrollArea } from '@/components/ui/scroll-area'

import { ToolSidebarHeader } from './tool-sidebar-header'
import { ToolSidebarClose } from './tools-sidebar-close'
import ShapeTool from './shape-tool'

interface ShapeSidebarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const ShapeSidebar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: ShapeSidebarProps) => {
  const onClose = () => {
    onChangeActiveTool('select')
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'shapes' ? 'visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader
        title="Shapes"
        description="Add shapes to your canvas"
      />
      <ScrollArea>
        <div className="grid grid-cols-3 gap-4 p-4">
          <ShapeTool onClick={() => editor?.addCircle()} icon={FaCircle} />
          <ShapeTool
            onClick={() => {
              editor?.addSoftRectangle()
            }}
            icon={FaSquare}
          />
          <ShapeTool
            onClick={() => {
              editor?.addRectangle()
            }}
            icon={FaSquareFull}
          />
          <ShapeTool
            onClick={() => {
              editor?.addDiamond()
            }}
            icon={FaDiamond}
          />
          <ShapeTool
            onClick={() => {
              editor?.addTriangle()
            }}
            icon={IoTriangle}
          />
          <ShapeTool
            onClick={() => {
              editor?.addInverseTriangle()
            }}
            icon={IoTriangle}
            iconClassname="rotate-180"
          />
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default ShapeSidebar
