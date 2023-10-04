import FileItem from "./item"

export default function FileList({ files }) {
  return (
    <table className="min-w-full divide-y divide-gray-300">
      <thead>
        <tr>
          <th
            scope="col"
            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
          >
            Name
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Size
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Type
          </th>
          <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Created
          </th>
          {/* <th
            scope="col"
            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
          >
            Status
          </th> */}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {files.map((file) => (
          <FileItem
            key={file.id}
            name={file.name}
            size={file.size}
            type={file.type}
            createdTime={file.createdTime}
            status={file.status}
          />
        ))}
      </tbody>
    </table>
  )
}
