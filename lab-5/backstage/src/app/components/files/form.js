"use client"

import { useState } from "react"
import { Dialog } from "@headlessui/react"
import { PhotoIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import fetcher from "@/lib/fetcher"

export default function FileForm({ onClose, onSubmit }) {
  const [currentFile, setCurrentFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const submitEnabled = currentFile && currentFile.ready && !submitting

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach(async (file) => {
      setCurrentFile({
        name: file.name,
        type: file.type,
        size: file.size,
        ready: false,
      })

      const { upload } = await fetcher("/api/uploads", {
        method: "POST",
        body: JSON.stringify({
          content_type: file.type,
          filename: file.name,
        }),
      })

      const reader = new FileReader()
      reader.onload = async () => {
        await fetch(upload.url, {
          method: "put",
          headers: {
            "Content-Type": upload.content_type,
          },
          body: reader.result,
        })

        setCurrentFile((thisFile) => ({
          ...thisFile,
          filename: upload.filename,
          ready: true,
        }))
      }

      reader.readAsArrayBuffer(file)
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault()
    setSubmitting(true)

    onSubmit({
      name: currentFile.name,
      type: currentFile.type,
      size: currentFile.size,
      filename: currentFile.filename,
    })
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "audio/flac": [".flac"],
    },
  })

  return (
    <form
      className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl"
      onSubmit={handleSubmit}
    >
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gray-50 px-4 py-6 sm:px-6">
          <div className="flex items-start justify-between space-x-3">
            <div className="space-y-1">
              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                New file
              </Dialog.Title>
            </div>
            <div className="flex h-7 items-center">
              <button
                type="button"
                className="relative text-gray-400 hover:text-gray-500"
                onClick={onClose}
              >
                <span className="absolute -inset-2.5" />
                <span className="sr-only">Close panel</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider container */}
        <div className="space-y-6 py-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
          {/* file */}
          <div className="space-y-2 px-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:space-y-0 sm:px-6 sm:py-5">
            <div className="sm:col-span-3">
              {!currentFile && (
                <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                  <div className="text-center">
                    <PhotoIcon
                      className="mx-auto h-12 w-12 text-gray-300"
                      aria-hidden="true"
                    />
                    <div
                      {...getRootProps()}
                      className="mt-4 flex text-sm leading-6 text-gray-600"
                    >
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          {...getInputProps()}
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                  </div>
                </div>
              )}

              {currentFile && (
                <div>
                  {!currentFile.ready && <span>Uploading</span>}{" "}
                  {currentFile.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex-shrink-0 border-t border-gray-200 px-4 py-5 sm:px-6">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
            disabled={!submitEnabled}
          >
            Create
          </button>
        </div>
      </div>
    </form>
  )
}
