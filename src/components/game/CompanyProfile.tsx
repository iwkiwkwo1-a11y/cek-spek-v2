'use client';

import { useMemo } from 'react';
import { useGameStore } from '@/store/useGameStore';

export default function CompanyProfile() {
  const { playerName, companyName, playerSkill, reputation, completedFlights, emergencyFund, money, planes, logs, gameHoursElapsed, resetAccount } = useGameStore();

  const avgCondition = useMemo(() => {
    if (!planes.length) return 0;
    return planes.reduce((s, p) => s + p.condition, 0) / planes.length;
  }, [planes]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Company Tycoon Detail</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5"><p className="text-sm text-gray-500">Founder</p><p className="text-xl font-semibold">{playerName || '-'}</p></div>
        <div className="bg-white border rounded-xl p-5"><p className="text-sm text-gray-500">Company Name</p><p className="text-xl font-semibold">{companyName}</p></div>
        <div className="bg-white border rounded-xl p-5"><p className="text-sm text-gray-500">Core Skill</p><p className="text-xl font-semibold capitalize">{playerSkill || '-'} </p><p className="text-xs text-gray-500 mt-1">Skill Effect: operations=fuel efficiency, finance/marketing=revenue boost, engineering=maintenance savings.</p></div>
        <div className="bg-white border rounded-xl p-5"><p className="text-sm text-gray-500">Reputation</p><p className="text-xl font-semibold">{reputation.toFixed(1)}</p></div>
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-3">Operational Snapshot</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div><p className="text-gray-500">Balance</p><p className="font-semibold">${money.toLocaleString()}</p></div>
          <div><p className="text-gray-500">Fleet</p><p className="font-semibold">{planes.length} aircraft</p></div>
          <div><p className="text-gray-500">Completed Flights</p><p className="font-semibold">{completedFlights}</p></div>
          <div><p className="text-gray-500">Emergency Fund</p><p className="font-semibold">${emergencyFund.toLocaleString()}</p></div>
          <div><p className="text-gray-500">Avg Condition</p><p className="font-semibold">{avgCondition.toFixed(1)}%</p></div>
          <div><p className="text-gray-500">Game Hours</p><p className="font-semibold">{gameHoursElapsed.toFixed(1)} jam</p></div>
          <div><p className="text-gray-500">Recent Logs</p><p className="font-semibold">{logs.length}</p></div>
        </div>
      </div>

      <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
        <p className="font-semibold text-rose-700">Danger Zone</p>
        <p className="text-sm text-rose-600 mb-3">Hapus akun akan reset seluruh progres ke awal.</p>
        <button onClick={() => { if (confirm("Yakin reset akun?")) resetAccount(); }} className="px-4 py-2 rounded bg-rose-600 text-white">Hapus Akun / Reset</button>
      </div>
    </div>
  );
}
