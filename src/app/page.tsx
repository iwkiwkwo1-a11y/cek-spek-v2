'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import Dashboard from '@/components/game/Dashboard';
import Shop from '@/components/game/Shop';
import RoutePlanner from '@/components/game/RoutePlanner';
import Workshop from '@/components/game/Workshop';
import GameMap from '@/components/game/Map';
import { LayoutDashboard, ShoppingCart, Map as MapIcon, Wrench, Globe } from 'lucide-react';

export default function Home() {
  const { gameTick } = useGameStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'routes' | 'shop' | 'workshop'>('dashboard');

  // Game Loop
  useEffect(() => {
    const interval = setInterval(() => {
      gameTick();
    }, 1000); // Tick every second for map updates
    return () => clearInterval(interval);
  }, [gameTick]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Live Map', icon: Globe },
    { id: 'routes', label: 'Routes', icon: MapIcon },
    { id: 'workshop', label: 'Workshop', icon: Wrench },
    { id: 'shop', label: 'Shop', icon: ShoppingCart },
  ] as const;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">

      {/* Sidebar Navigation */}
      <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
            <Globe className="text-blue-600" />
            Airline Tycoon
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">v1.1</span>
          </h1>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'map' && (
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Live Flight Tracker</h1>
            <GameMap />
          </div>
        )}
        {activeTab === 'routes' && <RoutePlanner />}
        {activeTab === 'workshop' && <Workshop />}
        {activeTab === 'shop' && <Shop />}
      </main>

    </div>
  );
}
