'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import Dashboard from '@/components/game/Dashboard';
import Shop from '@/components/game/Shop';
import RoutePlanner from '@/components/game/RoutePlanner';
import Workshop from '@/components/game/Workshop';
import GameMap from '@/components/game/Map';
import CompanyProfile from '@/components/game/CompanyProfile';
import { LayoutDashboard, ShoppingCart, Map as MapIcon, Wrench, Globe, Building2 } from 'lucide-react';

export default function Home() {
  const { gameTick, playerName, initializeProfile } = useGameStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'routes' | 'shop' | 'workshop' | 'company'>('dashboard');

  const [formName, setFormName] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formSkill, setFormSkill] = useState<'operations' | 'finance' | 'engineering' | 'marketing'>('operations');

  useEffect(() => {
    if (!playerName) return;
    const interval = setInterval(() => {
      gameTick();
    }, 1000);
    return () => clearInterval(interval);
  }, [gameTick, playerName]);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'map', label: 'Live Map', icon: Globe },
    { id: 'routes', label: 'Routes', icon: MapIcon },
    { id: 'workshop', label: 'Workshop', icon: Wrench },
    { id: 'shop', label: 'Shop', icon: ShoppingCart },
  ] as const;

  if (!playerName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 w-full max-w-2xl space-y-5 border border-white/50">
          <h1 className="text-3xl font-black text-gray-900">Airline Tycoon v3.2</h1>
          <p className="text-gray-600">Mulai dari nol dengan modal besar. Atur founder, nama maskapai, dan strategi inti.</p>

          <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Nama kamu" className="w-full border rounded-lg p-3" />
          <input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} placeholder="Nama perusahaan" className="w-full border rounded-lg p-3" />
          <select value={formSkill} onChange={(e) => setFormSkill(e.target.value as 'operations' | 'finance' | 'engineering' | 'marketing')} className="w-full border rounded-lg p-3">
            <option value="operations">Operations</option>
            <option value="finance">Finance</option>
            <option value="engineering">Engineering</option>
            <option value="marketing">Marketing</option>
          </select>

          <button
            onClick={() => {
              if (!formName.trim() || !formCompany.trim()) return;
              initializeProfile(formName.trim(), formCompany.trim(), formSkill);
            }}
            className="w-full bg-blue-600 text-white rounded-lg p-3 font-semibold hover:bg-blue-700"
          >
            Mulai Main
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900">
      <nav className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
            <Globe className="text-blue-600" />
            Airline Tycoon
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">v3.2</span>
          </h1>
        </div>

        <div className="flex-1 py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                activeTab === item.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'company' && <CompanyProfile />}
        {activeTab === 'map' && <div className="p-6"><h1 className="text-3xl font-bold mb-6">Live Flight Tracker</h1><GameMap /></div>}
        {activeTab === 'routes' && <RoutePlanner />}
        {activeTab === 'workshop' && <Workshop />}
        {activeTab === 'shop' && <Shop />}
      </main>
    </div>
  );
}
