import { filesize } from "filesize"

export default function FileItem({ name, size, type, createdTime, status }) {
  return (
    <tr>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {name}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {filesize(size)}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {type}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {createdTime}
      </td>
      {/* <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {status}
      </td> */}
    </tr>
  )
}
