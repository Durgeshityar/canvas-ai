import { ChromePicker, CirclePicker, Color } from 'react-color'
import { colors } from '@/features/editor/types'
import { rgbaObjectToString } from '@/features/editor/utils'

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formatedValue = rgbaObjectToString(color.rgb)
          onChange(formatedValue)
        }}
        className="rounded-lg border "
      />
      <CirclePicker
        color={value}
        colors={colors}
        onChangeComplete={(color) => {
          const formatedValue = rgbaObjectToString(color.rgb)
          onChange(formatedValue)
        }}
      />
    </div>
  )
}
