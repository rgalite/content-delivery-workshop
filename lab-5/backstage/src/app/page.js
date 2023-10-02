import { getAllFiles } from "@/lib/db"
import FilesPage from "./components/files/page"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const files = await getAllFiles()

  return (
    <div className="px-4 sm:px-0">
      <FilesPage files={files} />
    </div>
  )
}
