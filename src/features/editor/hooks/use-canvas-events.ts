import { fabric } from 'fabric'
import { useEffect } from 'react'

interface UseCanvasEventsProps {
  save: () => void
  canvas: fabric.Canvas | null
  setSelectedObjects: (objects: fabric.Object[]) => void
  clearSelectionCallback?: () => void
}

export const useCanvasEvents = ({
  save,
  canvas,
  setSelectedObjects,
  clearSelectionCallback,
}: UseCanvasEventsProps) => {
  useEffect(() => {
    if (canvas) {
      canvas.on('object:added', () => save())
      canvas.on('object:removed', () => save())
      canvas.on('object:modified', () => save())

      canvas.on('selection:created', (e) => {
        setSelectedObjects(e.selected || [])
      })
      canvas.on('selection:updated', (e) => {
        setSelectedObjects(e.selected || [])
      })
      canvas.on('selection:cleared', () => {
        setSelectedObjects([])
        clearSelectionCallback?.()
      })
    }

    return () => {
      if (canvas) {
        canvas.off('canvas:added')
        canvas.off('canvas:removed')
        canvas.off('canvas:modified')
        canvas.off('selection:created')
        canvas.off('selection:updated')
        canvas.off('selection:cleared')
      }
    }
  }, [
    save,
    canvas,
    setSelectedObjects, // no need for this , this is from setState -> added this cause linter is giving error
    clearSelectionCallback,
  ])
}
