import type { IconType } from 'react-icons'
import type { LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'

interface ShapeToolProps {
  onClick: () => void
  icon: LucideIcon | IconType
  iconClassname?: string
}

const ShapeTool = ({ onClick, icon: Icon, iconClassname }: ShapeToolProps) => {
  return (
    <button onClick={onClick} className="aspect-square border rounded-md p-5 ">
      <Icon className={cn('h-full w-full', iconClassname)} />
    </button>
  )
}

export default ShapeTool