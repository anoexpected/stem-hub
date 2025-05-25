"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu, X, ChevronDown } from "lucide-react"
import { useSupabase } from "./supabase-provider"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion } from "framer-motion"
import { ThemeToggle } from "./theme-toggle"

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, signOut } = useSupabase()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  const navItems = [
    {
      name: "Subjects",
      dropdown: true,
      items: [
        { name: "CAIE", href: "/subjects/caie" },
        { name: "ZIMSEC", href: "/subjects/zimsec" },
      ],
    },
    { name: "Uni Guide", href: "/uni-guide" },
    { name: "About Us", href: "/about" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <motion.span
              className="text-xl font-bold text-primary"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              STEM Hub
            </motion.span>
          </Link>

          <nav className="hidden md:flex gap-6">
            {navItems.map((item) =>
              item.dropdown ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 nav-link-hover">
                      {item.name} <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-card border-border/40">
                    <DropdownMenuLabel className="text-secondary">Curriculum</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/40" />
                    {item.items?.map((subItem) => (
                      <DropdownMenuItem key={subItem.name} asChild>
                        <Link href={subItem.href} className="text-foreground hover:text-primary transition-colors">
                          {subItem.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary nav-link-hover",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                </Link>
              ),
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border border-primary/30">
                    <AvatarImage src={user.user_metadata.avatar_url || ""} alt={user.user_metadata.name || "User"} />
                    <AvatarFallback className="bg-card text-primary">
                      {user.user_metadata.name?.charAt(0) || user.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card border-border/40" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.user_metadata.name || user.email}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="text-foreground hover:text-primary transition-colors">
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="text-foreground hover:text-primary transition-colors">
                    My Bookmarks
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/40" />
                <DropdownMenuItem
                  onClick={() => signOut()}
                  className="text-foreground hover:text-primary transition-colors"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="nav-link-hover">
                  Log In
                </Button>
              </Link>
              <Link href="/signup">
                <AnimatedButton variant="tertiary">Sign Up</AnimatedButton>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center md:hidden gap-2">
          <ThemeToggle />
          <button className="flex items-center justify-center rounded-md p-2 text-foreground" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          className="container py-4 md:hidden bg-card rounded-b-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) =>
              item.dropdown ? (
                <div key={item.name} className="space-y-2">
                  <div className="font-medium text-secondary">{item.name}</div>
                  <div className="ml-4 flex flex-col space-y-2">
                    {item.items?.map((subItem) => (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className="text-muted-foreground hover:text-primary transition-colors"
                        onClick={closeMenu}
                      >
                        {subItem.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.name}
                  href={item.href || "#"}
                  className={cn(
                    "font-medium hover:text-primary transition-colors",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  )}
                  onClick={closeMenu}
                >
                  {item.name}
                </Link>
              ),
            )}
            {user ? (
              <>
                <Link
                  href="/profile"
                  onClick={closeMenu}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Profile
                </Link>
                <Link
                  href="/bookmarks"
                  onClick={closeMenu}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  My Bookmarks
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    signOut()
                    closeMenu()
                  }}
                  className="justify-start px-0 hover:text-primary hover:bg-transparent"
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full justify-start">
                    Log In
                  </Button>
                </Link>
                <Link href="/signup" onClick={closeMenu}>
                  <Button variant="tertiary" className="w-full bg-tertiary hover:bg-tertiary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  )
}
