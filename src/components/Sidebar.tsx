import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  User, 
  LogOut,
  Activity,
  Zap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const { role, logout } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const adminLinks = [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/clients', icon: Users, label: 'API Clients' },
    { to: '/admin/logs', icon: FileText, label: 'Logs' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const clientLinks = [
    { to: '/client', icon: Activity, label: 'Dashboard' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const links = role === 'admin' ? adminLinks : clientLinks;

  const isActive = (path: string) => {
    if (path === '/admin' || path === '/client') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-sidebar flex flex-col transition-all duration-300 z-50 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-sidebar-foreground">RateLimiter</span>
          )}
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/70 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/admin' || link.to === '/client'}
            className={`sidebar-link ${isActive(link.to) ? 'sidebar-link-active' : ''}`}
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <User className="w-5 h-5 text-sidebar-foreground" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {role === 'admin' ? 'Administrator' : 'API Client'}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{role}</p>
            </div>
          )}
        </div>
        <button
          onClick={logout}
          className={`mt-4 w-full sidebar-link text-destructive hover:bg-destructive/10 ${
            collapsed ? 'justify-center px-0' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
