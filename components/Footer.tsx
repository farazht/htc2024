import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from './theme-switcher'

export const Footer = () => {
  return (
    <footer className="bg-background text-foreground border-t-2 border-foreground p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
          <Image 
            src="/placeholder.svg?height=32&width=32" 
            width={32} 
            height={32} 
            className="h-8" 
            alt="Logo" 
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap">
            BillBoard
          </span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 sm:mt-0">
          <ul className="flex flex-wrap items-center mb-4 sm:mb-0 text-sm font-medium">
            {['About', 'Services', 'Projects', 'Blog', 'Contact'].map((item, index) => (
              <li key={item}>
                <Link 
                  href={`/${item.toLowerCase()}`} 
                  className={`hover:underline ${index !== 4 ? 'me-4 md:me-6' : ''}`}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeSwitcher />
        </div>
      </div>
      <hr className="my-6 border-border sm:mx-auto lg:my-8" />
      <span className="block text-sm text-muted-foreground sm:text-center">
        Brought to you by BillBoard, the policies of today — All Rights Reserved. © {new Date().getFullYear()}. 
      </span>
    </footer>
  )
}