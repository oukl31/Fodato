import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Info, MapPin, Radio, BarChart3, Map, Users } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/schedule', label: 'Schedule', icon: Calendar },
  { path: '/stadiums', label: 'Stadiums', icon: MapPin },
  { path: '/teams', label: 'Teams', icon: Users },
  { path: '/broadcasts', label: 'Broadcasts', icon: Radio },
  { path: '/stats', label: 'Statistics', icon: BarChart3 },
  { path: '/regions', label: 'Regions', icon: Map }
];

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-white border-b-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-black text-primary">⚾ KBO Match Info</h1>
        </div>
      </header>
      
      <nav className="bg-primary border-b-4 border-black sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 py-3 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 
                    border-2 border-black rounded-sm
                    transition-all whitespace-nowrap
                    ${isActive 
                      ? 'bg-accent text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-[-2px] translate-y-[-2px]' 
                      : 'bg-white text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px]'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
      
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-black text-white border-t-4 border-black mt-16">
        <div className="container mx-auto px-4 py-8 text-center">
          <p>© 2025 KBO Match Information System - Created with ❤️</p>
        </div>
      </footer>
    </div>
  );
}