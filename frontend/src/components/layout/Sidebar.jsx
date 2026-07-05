import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Bug,
  LayoutDashboard,
  Users,
  UserCheck,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';
import bugsyLogo from '/bugsy logo.png';

function Sidebar({
  currentView,
  onViewChange,
  user,
  onLogout,
  isCollapsed,
  onToggleCollapse,
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsMobile(mediaQuery.matches);
    update();
    mediaQuery.addEventListener('change', update);
    return () => mediaQuery.removeEventListener('change', update);
  }, []);

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'my', label: 'My Bugs', icon: Bug },
    { id: 'team', label: 'Team Bugs', icon: Users },
    { id: 'assigned', label: 'Assigned to Me', icon: UserCheck },
    { id: 'create', label: 'Create Bug', icon: Plus, isAction: true },
  ];

  const navigate = useNavigate();

  const handleNavClick = (viewId) => {
    if (viewId === 'create') {
      navigate('/dashboard/create-bug');
    } else {
      onViewChange(viewId);
    }
    if (isMobile) setIsMobileOpen(false);
  };

  const handleToggleClick = () => {
    if (isMobile) {
      setIsMobileOpen(false);
    } else {
      onToggleCollapse();
    }
  };

  return (
    <>
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={`
          fixed left-0 top-0 h-full bg-surface/80 backdrop-blur-xl
          border-r border-border z-50
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-3 min-w-0"
              >
                <img src={bugsyLogo} alt="Bugsy" className="h-8 w-8 object-contain shrink-0" />
                <span className="text-lg font-bold text-content-primary truncate">Bugsy</span>
              </motion.div>
            )}
            <button
              type="button"
              onClick={handleToggleClick}
              className="ml-auto p-2 rounded-lg hover:bg-white/[0.04] text-content-secondary hover:text-content-primary transition-colors"
              aria-label={isMobile ? 'Close menu' : isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isMobile && isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : isCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              const isActionItem = item.isAction;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                    transition-all duration-200
                    ${isActionItem
                      ? 'bg-gradient-to-r from-primary to-primary-hover text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 mt-2'
                      : isActive
                      ? 'bg-background text-content-primary shadow-card'
                      : 'text-content-secondary hover:text-content-primary hover:bg-white/[0.04]'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 shrink-0 ${!isActionItem && isActive ? 'text-primary' : ''}`} />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                        className="font-medium text-sm truncate"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            <AnimatePresence mode="wait">
              {!isCollapsed ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative p-3 rounded-xl bg-background-secondary/50"
                >
                  <div className="flex items-center gap-3 min-w-0 pr-10">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <span className="text-sm font-semibold text-primary">
                        {user?.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-content-primary truncate">
                        {user?.username || 'User'}
                      </p>
                      <p className="text-xs text-content-muted truncate">
                        {user?.email || ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={onLogout}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-white/[0.04] text-content-secondary hover:text-red-400 transition-colors shrink-0"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={onLogout}
                    className="p-2 rounded-lg hover:bg-white/[0.04] text-content-secondary hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-lg bg-surface/80 backdrop-blur-xl border border-border text-content-primary hover:bg-white/[0.04] transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>
    </>
  );
}

export default Sidebar;
