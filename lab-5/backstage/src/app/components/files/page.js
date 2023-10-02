"use client"

import FilesNone from "./none"
import SidebarForm from "./sidebar-form"
import { useCallback, useState } from "react"
import fetcher from "@/lib/fetcher"
import FileList from "./list"

export default function FilesPage(params) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [files, setFiles] = useState(params.files || [])

  const handleClose = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const handleClick = useCallback(() => {
    setSidebarOpen(true)
  }, [])

  const handleSubmit = useCallback(async ({ name, type, size, filename }) => {
    await fetcher("/api/files", {
      method: "POST",
      body: JSON.stringify({ file: { name, type, size, filename } }),
    })

    const { files } = await fetcher("/api/files")
    setFiles(files)
    setSidebarOpen(false)
  }, [])

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Files
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all the files in your account including their name, size,
            date of creation and status.
          </p>
        </div>

        {files.length > 0 && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              onClick={handleClick}
            >
              Add file
            </button>
          </div>
        )}
      </div>

      {files.length === 0 && <FilesNone onClick={handleClick} />}
      {files.length >= 1 && (
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <FileList files={files} />
            </div>
          </div>
        </div>
      )}

      <SidebarForm
        open={sidebarOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
    </>
  )
}
