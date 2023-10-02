import SidebarDisclosure from "./components/layout/disclosure"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Backstage",
  description: "Upload your music!",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={[inter.className, "h-full"]}>
        <Example>{children}</Example>
      </body>
    </html>
  )
}

function Example({ children }) {
  return (
    <>
      <div className="min-h-full">
        <SidebarDisclosure />

        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8 bg-white">
            {children}
          </div>
        </main>
      </div>
    </>
  )
}
