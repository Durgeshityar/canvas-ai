import { fabric } from 'fabric'
import { useHotkeys as useGlobalHotkeys } from 'react-hotkeys-hook'

interface UseHotkeysProps {
  canvas: fabric.Canvas | null
  undo: () => void
  redo: () => void
  save: (skip?: boolean) => void
  copy: () => void
  paste: () => void
}

export const useHotkeys = ({
  canvas,
  undo,
  redo,
  save,
  copy,
  paste,
}: UseHotkeysProps) => {
  const isInputElement = (element: Element | null) =>
    element && ['INPUT', 'TEXTAREA'].includes(element.tagName)

  useGlobalHotkeys('ctrl+z, meta+z', (event) => {
    event.preventDefault()
    undo()
  })

  useGlobalHotkeys('ctrl+y, meta+y', (event) => {
    event.preventDefault()
    redo()
  })

  useGlobalHotkeys('ctrl+c, meta+c', (event) => {
    event.preventDefault()
    copy()
  })

  useGlobalHotkeys('ctrl+v, meta+v', (event) => {
    event.preventDefault()
    paste()
  })

  useGlobalHotkeys('ctrl+s, meta+s', (event) => {
    event.preventDefault()
    save(true)
  })

  useGlobalHotkeys('ctrl+a, meta+a', (event) => {
    event.preventDefault()
    canvas?.discardActiveObject()

    const allObjects = canvas
      ?.getObjects()
      .filter((object) => object.selectable)

    if (allObjects && allObjects.length > 0) {
      //@ts-ignore
      const activeSelection = new fabric.ActiveSelection(allObjects, { canvas })
      canvas?.setActiveObject(activeSelection)
    }
    canvas?.renderAll()
  })

  useGlobalHotkeys(
    'backspace',
    (event) => {
      if (isInputElement(document.activeElement)) return
      event.preventDefault()
      canvas?.remove(...canvas.getActiveObjects())
      canvas?.discardActiveObject()
    },
    { enableOnFormTags: true }
  )
}
