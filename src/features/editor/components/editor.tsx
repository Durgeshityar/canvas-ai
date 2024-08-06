'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import debounce from 'lodash.debounce'
import { fabric } from 'fabric'

import { useEditor } from '@/features/editor/hooks/use-editor'
import { useUpdateProjects } from '@/features/projects/api/use-update-projects'
import { ActiveTool, selectionDependentTools } from '@/features/editor/types'

import { ResponseType } from '@/features/projects/api/use-get-projects'

import Navbar from '@/features/editor/components/nav-bar'
import Sidebar from '@/features/editor/components/side-bar'
import Toolbar from '@/features/editor/components/toolbar'
import Footer from '@/features/editor/components/footer'
import ShapeSidebar from '@/features/editor/components/shape-sidebar'
import FillColorSideBar from '@/features/editor/components/fill-color-sidebar'
import StrokeColorSideBar from '@/features/editor/components/stroke-color-sidebar'
import StrokeWidthSideBar from '@/features/editor/components/stroke-width-sidebar'
import OpacitySideBar from '@/features/editor/components/opacity-sidebar'
import TextSideBar from '@/features/editor/components/text-sidebar'
import FontSideBar from '@/features/editor/components/font-sidebar'
import ImageSideBar from '@/features/editor/components/image-sidebar'
import FilterSideBar from '@/features/editor/components/filter-sidebar'
import AiSideBar from '@/features/editor/components/ai-sidebar'
import RemoveBgSideBar from '@/features/editor/components/remove-bg-sidebar'
import DrawSideBar from '@/features/editor/components/draw-sidebar'
import SettingsSidebar from '@/features/editor/components/settings-sidebar'
import TemplateSideBar from '@/features/editor/components/template-sidebar'

interface EditorProps {
  initialData: ResponseType['data']
}

const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateProjects(initialData.id)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSave = useCallback(
    debounce((values: { json: string; height: number; width: number }) => {
      mutate(values)
    }, 500),
    [mutate]
  )

  const [activeTool, setActiveTool] = useState<ActiveTool>('select')

  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool('select')
    }
  }, [activeTool])

  const { init, editor } = useEditor({
    defaultState: initialData.json,
    defaultWidth: initialData.width,
    defaultHeight: initialData.height,
    clearSelectionCallback: onClearSelection,
    saveCallback: debounceSave,
  })

  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === 'draw') {
        editor?.enableDrawingMode()
      }

      if (activeTool === 'draw') {
        editor?.disableDrawingMode()
      }

      if (tool === activeTool) {
        return setActiveTool('select')
      }

      setActiveTool(tool)
    },
    [activeTool, editor]
  )

  // useref -> making canvas responsive
  const canvasRef = useRef(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    })

    init({ initialCanvas: canvas, initialContainer: containerRef.current! })

    return () => {
      canvas.dispose()
    }
  }, [init])

  return (
    <div className="h-full flex flex-col">
      <Navbar
        id={initialData.id}
        editor={editor}
        activeTool={activeTool}
        onChangeActiveTool={onChangeActiveTool}
      />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <FillColorSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeColorSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <StrokeWidthSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <OpacitySideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <TextSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <FontSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <ImageSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <TemplateSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <FilterSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <AiSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <RemoveBgSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <DrawSideBar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <SettingsSidebar
          editor={editor}
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />

        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar
            editor={editor}
            activeTool={activeTool}
            onChangeActiveTool={onChangeActiveTool}
            key={JSON.stringify(editor?.canvas.getActiveObject())}
          />
          <div
            className="flex-1 bg-muted h-[calc(100%-124px)]"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer editor={editor} />
        </main>
      </div>
    </div>
  )
}

export default Editor
