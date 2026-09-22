import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import * as db from '../../db';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Check,
  AlertCircle
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    postExportVerifiedDownload,
    importBackup,
    needsBackupReminder,
    runIntegrityCheck,
    isLocalMode
  } = useApp();

  const [userName, setUserName] = useState(settings.userName || '');
  const [startDate, setStartDate] = useState(settings.startDate || '');
  const [totalDays, setTotalDays] = useState(settings.totalDays || 90);
  const [sleepTarget, setSleepTarget] = useState(settings.sleepTargetHours || 8);
  const [studyTarget, setStudyTarget] = useState(settings.studyTargetHours || 4);
  const [careerTarget, setCareerTarget] = useState(settings.careerTargetHours || 3);
  const [gymTarget, setGymTarget] = useState(settings.gymTargetSessions || 5);

  const [recordCounts, setRecordCounts] = useState<any>(null);
  const [healthReport, setHealthReport] = useState<db.DatabaseHealthReport | null>(null);
  const [importMode, setImportMode] = useState<'replace' | 'merge'>('merge');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [exportStatus, setExportStatus] = useState<string | null>(null);

  useEffect(() => {
    db.getDatabaseRecordCounts().then(setRecordCounts);
    runIntegrityCheck().then(setHealthReport);
  }, []);

  const handleSaveGeneralSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      userName: userName.trim(),
      startDate,
      totalDays: Number(totalDays),
      sleepTargetHours: Number(sleepTarget),
      studyTargetHours: Number(studyTarget),
      careerTargetHours: Number(careerTarget),
      gymTargetSessions: Number(gymTarget),
    });
  };

  const handleExportBackup = async () => {
    setExportStatus(null);
    const res = await postExportVerifiedDownload();
    if (res.success) {
      setExportStatus(`Verified backup saved as ${res.filename}`);
      db.getDatabaseRecordCounts().then(setRecordCounts);
      runIntegrityCheck().then(setHealthReport);
    } else {
      setExportStatus(`Backup export error: ${res.error}`);
    }
  };

  const handleImportFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const content = evt.target?.result as string;
      if (!content) return;
      const res = await importBackup(content, importMode);
      if (res.success) {
        setImportStatus('Backup restored cleanly after safety snapshot verification.');
        db.getDatabaseRecordCounts().then(setRecordCounts);
        runIntegrityCheck().then(setHealthReport);
      } else {
        setImportStatus(res.error || 'Backup invalid. Current state preserved.');
      }
    };
    reader.readAsText(file);
  };

  const handleIntegrityCheck = async () => {
    const report = await runIntegrityCheck();
    setHealthReport(report);
    const counts = await db.getDatabaseRecordCounts();
    setRecordCounts(counts);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 font-sans text-zinc-100">
      <div className="bg-[#121215] border border-zinc-800 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-zinc-300" />
            Settings & Maintenance
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Parameters, data safety, JSON backup & restore, and IndexedDB status.
          </p>
        </div>
      </div>

      {/* General Settings */}
      <form onSubmit={handleSaveGeneralSettings} className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-4">
        <h3 className="font-mono font-bold text-xs text-zinc-400 uppercase border-b border-zinc-800 pb-3">
          General Parameters
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-zinc-400 font-medium mb-1">Operator Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Winter Arc Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Winter Arc Duration (Days)</label>
            <input
              type="number"
              value={totalDays}
              onChange={(e) => setTotalDays(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Target Sleep (Hours/Day)</label>
            <input
              type="number"
              value={sleepTarget}
              onChange={(e) => setSleepTarget(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Target Study (Hours/Day)</label>
            <input
              type="number"
              value={studyTarget}
              onChange={(e) => setStudyTarget(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>

          <div>
            <label className="block text-zinc-400 font-medium mb-1">Target Coding (Hours/Day)</label>
            <input
              type="number"
              value={careerTarget}
              onChange={(e) => setCareerTarget(Number(e.target.value))}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-xs rounded-xl shadow transition"
        >
          Save Parameters
        </button>
      </form>

      {/* Maintenance & Backup Center */}
      <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <h3 className="font-mono font-bold text-xs text-zinc-400 uppercase flex items-center gap-2">
            <Database className="w-4 h-4 text-zinc-300" /> Data Safety & Database Health
          </h3>
          <div className="flex items-center gap-2 font-mono text-xs">
            {healthReport?.status === 'Healthy' && (
              <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 rounded-full font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
              </span>
            )}
            {healthReport?.status === 'Warning' && (
              <span className="px-2.5 py-1 bg-amber-950/80 text-amber-400 border border-amber-800/60 rounded-full font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Warning
              </span>
            )}
            {healthReport?.status === 'Error' && (
              <span className="px-2.5 py-1 bg-red-950/80 text-red-400 border border-red-800/60 rounded-full font-bold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Error
              </span>
            )}
            <span className="px-2 py-1 bg-sky-950/60 text-sky-400 border border-sky-800/60 rounded-full text-[11px]">
              LOCAL MODE
            </span>
          </div>
        </div>

        {/* Database Stats Info */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-zinc-500 text-[10px] block">SCHEMA / APP VERSION</span>
            <span className="text-white font-bold text-sm">v{db.CURRENT_SCHEMA_VERSION} ({db.APP_VERSION})</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-zinc-500 text-[10px] block">TOTAL RECORDS LOGGED</span>
            <span className="text-zinc-200 font-bold text-sm">{healthReport?.totalRecords || 0}</span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-zinc-500 text-[10px] block">STORAGE ESTIMATE</span>
            <span className="text-zinc-200 font-bold text-sm">
              {healthReport?.storageEstimate?.usageBytes
                ? `${(healthReport.storageEstimate.usageBytes / 1024 / 1024).toFixed(2)} MB`
                : 'Local IndexedDB'}
            </span>
          </div>
          <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl">
            <span className="text-zinc-500 text-[10px] block">LAST BACKUP</span>
            <span className="text-zinc-300 font-bold text-xs">
              {settings.lastBackupDate
                ? new Date(settings.lastBackupDate).toLocaleDateString()
                : 'Never'}
            </span>
          </div>
        </div>

        {/* Backup Export / Import */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-zinc-800 pt-4">
          {/* Export Card */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3 text-left">
            <h4 className="font-mono font-bold text-xs text-white uppercase flex items-center gap-1.5">
              <Download className="w-4 h-4 text-zinc-300" /> Export Backup
            </h4>
            <p className="text-xs text-zinc-400 font-normal">
              Download your complete ARC OS data to a JSON backup file.
            </p>
            <button
              onClick={handleExportBackup}
              className="w-full py-2.5 bg-zinc-100 hover:bg-white text-zinc-900 font-medium text-xs rounded-xl shadow transition flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Export Backup
            </button>

            {exportStatus && (
              <p className={`text-xs font-mono mt-2 ${exportStatus.includes('saved') ? 'text-emerald-400' : 'text-red-400'}`}>
                {exportStatus}
              </p>
            )}
          </div>

          {/* Import Card */}
          <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl space-y-3 text-left">
            <h4 className="font-mono font-bold text-xs text-white uppercase flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-zinc-300" /> Import Backup
            </h4>
            <p className="text-xs text-zinc-400 font-normal">
              Safely restore complete state from a JSON backup file.
            </p>

            <div className="flex gap-4 text-xs font-mono">
              <label className="flex items-center gap-1 text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                Merge
              </label>
              <label className="flex items-center gap-1 text-zinc-300 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                Replace All
              </label>
            </div>

            <label className="w-full py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-medium text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer border border-zinc-700">
              <Upload className="w-4 h-4" /> Select Backup JSON File
              <input type="file" accept=".json" onChange={handleImportFileSelect} className="hidden" />
            </label>

            {importStatus && (
              <p className={`text-xs font-mono mt-2 ${importStatus.includes('successfully') ? 'text-emerald-400' : 'text-red-400'}`}>
                {importStatus}
              </p>
            )}
          </div>
        </div>

        {/* Maintenance Integrity Check */}
        <div className="pt-2 border-t border-zinc-800 flex items-center justify-between">
          <button
            onClick={handleIntegrityCheck}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono text-xs rounded-xl flex items-center gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Run Integrity Check
          </button>
          {healthReport && (
            <span className="text-xs font-mono text-emerald-400">
              Integrity Check Status: {healthReport.status} ({healthReport.totalRecords} records verified)
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
