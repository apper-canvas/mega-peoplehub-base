import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Dashboard", icon: "LayoutDashboard" },
    { path: "/leave", label: "Leave", icon: "Calendar" },
    { path: "/profile", label: "Profile", icon: "User" },
    { path: "/documents", label: "Documents", icon: "FileText" },
    { path: "/attendance", label: "Attendance", icon: "Clock" },
    { path: "/directory", label: "Directory", icon: "Users" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-primary shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-white">PeopleHub</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200",
                  isActive(item.path)
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <ApperIcon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Profile */}
<div className="hidden lg:block relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 px-3 py-2 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-medium">John Doe</span>
              <ApperIcon name="ChevronDown" className="w-4 h-4" />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
                >
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <ApperIcon name="User" className="w-4 h-4" />
                    <span>View Profile</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <ApperIcon name="Settings" className="w-4 h-4" />
                    <span>Settings</span>
                  </Link>
                  <hr className="my-1" />
                  <button 
                    onClick={async () => {
                      try {
                        const { ApperUI } = window.ApperSDK;
                        await ApperUI.logout();
                        window.location.href = "/login";
                      } catch (error) {
                        console.error("Logout failed:", error);
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 text-sm text-error hover:bg-gray-100 w-full text-left"
                  >
                    <ApperIcon name="LogOut" className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-md transition-colors duration-200"
          >
            <ApperIcon name={isMenuOpen ? "X" : "Menu"} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden bg-primary-dark border-t border-white/10"
          >
            <nav className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200",
                    isActive(item.path)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <ApperIcon name={item.icon} className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center space-x-3 px-4 py-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <ApperIcon name="User" className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-white/70">john.doe@company.com</p>
                  </div>
                </div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;