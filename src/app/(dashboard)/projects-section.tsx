'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  CopyIcon,
  FileIcon,
  Loader,
  MoreHorizontal,
  Search,
  Trash,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

import { Table, TableRow, TableBody, TableCell } from '@/components/ui/table'
import { useGetAllProject } from '@/features/projects/api/use-get-AllProjects'
import { useDuplicateProjects } from '@/features/projects/api/use-duplicate-projects'

import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { useDeleteProjects } from '@/features/projects/api/use-delete-projects'
import { useConfirm } from '@/hooks/use-confirm'

const ProjectsSection = () => {
  const [ConfirmationDialog, confirm] = useConfirm(
    'Are you sure?',
    'You are about to delete the project.'
  )
  const duplicateMutation = useDuplicateProjects()
  const removeMutation = useDeleteProjects()
  const router = useRouter()

  const onCopy = (id: string) => {
    duplicateMutation.mutate({ id })
  }

  const onDelete = async (id: string) => {
    const ok = await confirm()

    if (ok) removeMutation.mutate({ id })
  }

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useGetAllProject()

  if (status === 'pending') {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Loader className="size-6 text-muted-foreground animate-spin" />
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <AlertTriangle className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            Failed to load projects
          </p>
        </div>
      </div>
    )
  }

  if (!data.pages.length || !data.pages[0].data.length) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Recent Projects</h3>
        <div className="flex flex-col gap-y-4 items-center justify-center h-32">
          <Search className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">No project found</p>
        </div>
      </div>
    )
  }

  return (
    <div className=" space-y-4">
      <ConfirmationDialog />
      <h3 className="font-semibold text-lg">Recent Projects</h3>
      <Table>
        <TableBody>
          {data.pages.map((group, i) => (
            <React.Fragment key={i}>
              {group.data.map((project) => (
                <TableRow key={project.id}>
                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="font-medium flex items-center gap-x-2 cursor-pointer"
                  >
                    <FileIcon className="size-6" />
                    {project.name}
                  </TableCell>

                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="hidden md:table-cell cursor-pointer"
                  >
                    {project.width} x {project.height} px
                  </TableCell>

                  <TableCell
                    onClick={() => router.push(`/editor/${project.id}`)}
                    className="hidden md:table-cell cursor-pointer"
                  >
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </TableCell>

                  <TableCell className=" flex items-center justify-end">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button size={'icon'} variant={'ghost'}>
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-60">
                        <DropdownMenuItem
                          className=" h-10 cursor-pointer"
                          disabled={duplicateMutation.isPending}
                          onClick={() => onCopy(project.id)}
                        >
                          <CopyIcon className="size-4 mr-2 " />
                          Make a copy
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          className=" h-10 cursor-pointer"
                          disabled={removeMutation.isPending}
                          onClick={() => onDelete(project.id)}
                        >
                          <Trash className="size-4 mr-2 " />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>

      {hasNextPage && (
        <div className="w-full flex items-center justify-center pt-4">
          <Button
            variant={'ghost'}
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

export default ProjectsSection
