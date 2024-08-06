import { cn } from '@/lib/utils'

import { ScrollArea } from '@/components/ui/scroll-area'

import { ActiveTool, Editor, fonts } from '@/features/editor/types'
import { ToolSidebarHeader } from '@/features/editor/components/tool-sidebar-header'
import { ToolSidebarClose } from '@/features/editor/components/tools-sidebar-close'
import { Button } from '@/components/ui/button'

interface FontSideBarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
  editor: Editor | undefined
}

const FontSideBar = ({
  activeTool,
  onChangeActiveTool,
  editor,
}: FontSideBarProps) => {
  const value = editor?.getActiveFontFamily()

  const onClose = () => {
    onChangeActiveTool('select')
  }

  return (
    <aside
      className={cn(
        'bg-white relative border-r z-[40] w-[360px] h-full flex flex-col',
        activeTool === 'font' ? 'visible' : 'hidden'
      )}
    >
      <ToolSidebarHeader title="Font" description="Modify the font" />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          {fonts.map((font) => (
            <Button
              key={font}
              variant={'secondary'}
              size={'lg'}
              className={cn(
                'w-full h-16 justify-start text-left',
                value === font && 'border-2 border-blue-500'
              )}
              style={{
                fontFamily: font,
                fontSize: '16px',
                padding: '8px 16px',
              }}
              onClick={() => editor?.changeFontFamily(font)}
            >
              {font}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  )
}

export default FontSideBar
