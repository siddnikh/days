import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';

interface DayCount {
  id: string;
  name: string;
  startDate: string;
  days: number;
}

const DaysApp: React.FC = () => {
  const [dayCounts, setDayCounts] = useState<DayCount[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useEffect(() => {
    const storedData = localStorage.getItem('dayCounts');
    if (storedData) {
      setDayCounts(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dayCounts', JSON.stringify(dayCounts));
  }, [dayCounts]);

  const addNewItem = () => {
    if (newItemName.trim()) {
      const newItem: DayCount = {
        id: Date.now().toString(),
        name: newItemName,
        startDate: new Date().toISOString(),
        days: 0,
      };
      setDayCounts([...dayCounts, newItem]);
      setNewItemName('');
    }
  };

  const deleteItem = (id: string) => {
    setDayCounts(dayCounts.filter(item => item.id !== id));
  };

  const updateDays = () => {
    const updatedCounts = dayCounts.map(item => {
      const startDate = new Date(item.startDate);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return { ...item, days: diffDays };
    });
    setDayCounts(updatedCounts);
  };

  useEffect(() => {
    const interval = setInterval(updateDays, 1000 * 60 * 60); // Update every hour
    return () => clearInterval(interval);
  }, [dayCounts]);

  return (
    <div className="min-h-screen bg-black text-white p-8 font-sans">
      <div className="max-w-md mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-fuchsia-500">Days</h1>
        <div className="mb-6">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Enter a new item"
            className="w-full p-2 bg-gray-800 border border-fuchsia-500 rounded"
          />
          <button
            onClick={addNewItem}
            className="mt-2 w-full bg-fuchsia-500 text-white p-2 rounded flex items-center justify-center"
          >
            <PlusCircle size={20} className="mr-2" />
            Add New Item
          </button>
        </div>
        <div className="space-y-4">
          {dayCounts.map((item) => (
            <div key={item.id} className="bg-gray-900 p-4 rounded-lg shadow-lg">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{item.name}</h2>
                <button onClick={() => deleteItem(item.id)} className="text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
              <p className="text-2xl font-bold mt-2">
                {item.days} day{item.days !== 1 ? 's' : ''}
                {item.days > 1 && ' 🔥'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DaysApp;