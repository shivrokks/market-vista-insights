
import React, { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { Search, Menu, X, UserCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              MarketVista
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/") ? "text-primary" : "text-gray-600"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/market"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/market") ? "text-primary" : "text-gray-600"
              }`}
            >
              Market
            </Link>
            <Link
              to="/watchlist"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/watchlist") ? "text-primary" : "text-gray-600"
              }`}
            >
              Watchlist
            </Link>
          </nav>

          {/* Search form - desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center max-w-sm flex-1 mx-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search stocks..."
                className="w-full rounded-full bg-gray-100 pl-9 pr-4 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>

          {/* Auth buttons / User menu - desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <UserCircle className="h-5 w-5 mr-2" />
                    <span className="font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => navigate("/profile")}>
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => navigate("/settings")}>
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={logout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/login")}>
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile menu and search */}
        {isMenuOpen && (
          <div className="pt-4 pb-3 space-y-4 md:hidden">
            <form onSubmit={handleSearch} className="flex items-center">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search stocks..."
                  className="w-full rounded-full bg-gray-100 pl-9 pr-4 focus:bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </form>
            
            <nav className="flex flex-col space-y-2">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/") ? "bg-gray-100 text-primary" : "text-gray-600"
                }`}
                onClick={toggleMenu}
              >
                Dashboard
              </Link>
              <Link
                to="/market"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/market") ? "bg-gray-100 text-primary" : "text-gray-600"
                }`}
                onClick={toggleMenu}
              >
                Market
              </Link>
              <Link
                to="/watchlist"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActive("/watchlist") ? "bg-gray-100 text-primary" : "text-gray-600"
                }`}
                onClick={toggleMenu}
              >
                Watchlist
              </Link>
              
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600"
                    onClick={toggleMenu}
                  >
                    Settings
                  </Link>
                  <button
                    className="px-3 py-2 rounded-md text-sm font-medium text-red-600 text-left"
                    onClick={() => {
                      logout();
                      toggleMenu();
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex space-x-2 pt-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      navigate("/login");
                      toggleMenu();
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate("/register");
                      toggleMenu();
                    }}
                  >
                    Register
                  </Button>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
