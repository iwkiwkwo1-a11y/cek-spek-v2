'use client';

import { useGameStore } from '@/store/useGameStore';
import { PLANE_MODELS } from '@/data/planes';
import { ShoppingCart } from 'lucide-react';

export default function Shop() {
  const { money, buyPlane } = useGameStore();

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Aircraft Shop</h1>
        <div className="text-xl font-bold text-green-600">
          Balance: ${money.toLocaleString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLANE_MODELS.map(model => (
          <div key={model.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold">{model.name}</h3>
              <p className="text-gray-500">Speed: {model.baseSpeed} km/h</p>
              <p className="text-gray-500">Capacity: {model.baseCapacity} seats</p>
            </div>

            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100">
              <span className="text-lg font-bold text-gray-800">
                ${model.price.toLocaleString()}
              </span>
              <button
                onClick={() => {
                  if (buyPlane(model.id)) {
                    alert(`Successfully purchased ${model.name}!`);
                  } else {
                    alert('Not enough money!');
                  }
                }}
                disabled={money < model.price}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
              >
                <ShoppingCart size={18} />
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
