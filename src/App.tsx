import React from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import { SignedIn, SignedOut, RedirectToSignIn, UserButton } from "@clerk/clerk-react"
import { LineChart, Wallet, BarChart3, Settings, Sun, Moon } from 'lucide-react'
import { useTheme } from "next-themes"
import Dashboard from "./components/Dashboard"
import Markets from "./components/Markets"
import Portfolio from "./components/Portfolio"
import SettingsLayout from "./components/settings/SettingsLayout"
import Security from "./components/settings/Security"
import ProfileSettings from "./components/settings/ProfileSettings"
import { Button } from "./components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu"

const App: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-gray-900 dark:from-gray-900 dark:to-gray-800 dark:text-gray-100">
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60 sticky top-0 z-50">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-6">
                <Link to="/" className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20">
                    <LineChart className="h-5 w-5 m-1.5 text-purple-500" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                    CryptoSync
                  </span>
                </Link>

                <nav className="hidden md:flex items-center space-x-4">
                  <Link to="/markets">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Markets
                    </Button>
                  </Link>
                  <Link to="/portfolio">
                    <Button variant="ghost" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                      <Wallet className="h-4 w-4 mr-2" />
                      Portfolio
                    </Button>
                  </Link>
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/settings/profile">Profile Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings/security">Security</Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <div className="h-8 w-px bg-gray-200 dark:bg-gray-700" />
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <SignedIn>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/markets" element={<Markets />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/settings" element={<SettingsLayout />}>
              <Route path="profile" element={<ProfileSettings />} />
              <Route path="security" element={<Security />} />
            </Route>
          </Routes>
          </SignedIn>
          <SignedOut>
            <RedirectToSignIn />
          </SignedOut>
        </main>

        <footer className="border-t border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/80 dark:supports-[backdrop-filter]:bg-gray-900/60">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600 dark:text-gray-400">&copy; 2025 CryptoSync. Todos los derechos reservados.</p>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Terms
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                  Privacy
                </Button>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App