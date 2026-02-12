'use client'

import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
} from 'lucide-react'

import { ActiveTool } from '@/features/editor/types'

import { SidebarItems } from './sidebar-items'

interface SidebarProps {
  activeTool: ActiveTool
  onChangeActiveTool: (tool: ActiveTool) => void
}

const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className=" flex flex-col">
        <SidebarItems
          icon={LayoutTemplate}
          label="Design"
          isActive={activeTool === 'templates'}
          onClick={() => onChangeActiveTool('templates')}
        />
        <SidebarItems
          icon={ImageIcon}
          label="Image"
          isActive={activeTool === 'images'}
          onClick={() => onChangeActiveTool('images')}
        />
        <SidebarItems
          icon={Type}
          label="Text"
          isActive={activeTool === 'text'}
          onClick={() => onChangeActiveTool('text')}
        />
        <SidebarItems
          icon={Shapes}
          label="Shapes"
          isActive={activeTool === 'shapes'}
          onClick={() => onChangeActiveTool('shapes')}
        />
        <SidebarItems
          icon={Pencil}
          label="Draw"
          isActive={activeTool === 'draw'}
          onClick={() => onChangeActiveTool('draw')}
        />
        <SidebarItems
          icon={Sparkles}
          label="AI"
          isActive={activeTool === 'ai'}
          onClick={() => onChangeActiveTool('ai')}
        />
        <SidebarItems
          icon={Settings}
          label="Settings"
          isActive={activeTool === 'settings'}
          onClick={() => onChangeActiveTool('settings')}
        />
      </ul>
    </aside>
  )
}

export default Sidebar
