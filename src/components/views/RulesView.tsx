import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ScrollText, Plus, Trash2, ShieldCheck, Lock } from 'lucide-react';

export const RulesView: React.FC = () => {
  const { rules, addRule, deleteRule } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await addRule({
      title: newTitle.trim(),
      description: newDesc.trim(),
    });
    setNewTitle('');
    setNewDesc('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="bg-[#121215] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-sans text-white flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-amber-400" />
            WINTER ARC CORE RULES
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-0.5">
            Non-negotiable personal code of conduct.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-mono font-bold text-xs rounded-xl flex items-center gap-1.5 shadow"
        >
          <Plus className="w-4 h-4" /> Add Rule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className="bg-[#121215] border border-zinc-800/90 rounded-2xl p-5 flex flex-col justify-between space-y-3 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                {rule.isDefault ? (
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                <h3 className="font-bold text-base text-white">{rule.title}</h3>
              </div>
              {!rule.isDefault && (
                <button
                  onClick={() => deleteRule(rule.id)}
                  className="p-1 text-zinc-500 hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <p className="text-xs text-zinc-300 font-mono leading-relaxed">{rule.description}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreate}
            className="bg-[#121215] border border-zinc-800 rounded-3xl p-6 max-w-md w-full space-y-4"
          >
            <h3 className="text-base font-bold font-mono text-white">Add Custom Rule</h3>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Rule Title</label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. 9. No Cold Calls During Lock-In"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Description</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Explain why this rule exists..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-amber-600 text-white font-mono text-xs font-bold rounded-lg"
              >
                Save Rule
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 font-mono text-xs rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
