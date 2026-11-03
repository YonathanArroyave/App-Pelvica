'use client';

import React, { useState } from 'react';
import {
  User,
  Lock,
  KeyRound,
  Download,
  Upload,
  Trash2,
  X,
  Check,
  Shield,
  HardDrive,
  Mail,
  Sparkles
} from 'lucide-react';
import { usePatientStore } from '@/core/store/usePatientStore';
import { supabase } from '@/lib/supabase/client';

interface PatientProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PatientProfileModal: React.FC<PatientProfileModalProps> = ({
  isOpen,
  onClose
}) => {
  const profile = usePatientStore((s) => s.profile);
  const assessments = usePatientStore((s) => s.assessments);
  const trainingSessions = usePatientStore((s) => s.trainingSessions);
  const setAlias = usePatientStore((s) => s.setAlias);
  const setPin = usePatientStore((s) => s.setPin);
  const removePin = usePatientStore((s) => s.removePin);
  const lockApp = usePatientStore((s) => s.lockApp);
  const importBackupData = usePatientStore((s) => s.importBackupData);

  const [aliasInput, setAliasInput] = useState(profile.alias);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinMsg, setPinMsg] = useState<string | null>(null);
  const [showPinInput, setShowPinInput] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [backupMsg, setBackupMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveAlias = (e: React.FormEvent) => {
    e.preventDefault();
    if (aliasInput.trim()) {
      setAlias(aliasInput.trim());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  const handleUpdatePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length !== 4) {
      setPinMsg('El PIN debe tener 4 dígitos.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinMsg('Los PIN no coinciden.');
      return;
    }
    await setPin(newPin);
    setPinMsg('PIN actualizado exitosamente.');
    setNewPin('');
    setConfirmPin('');
    setShowPinInput(false);
    setTimeout(() => setPinMsg(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      profile,
      assessments,
      trainingSessions,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pelvic-rehab-progreso-${profile.alias.toLowerCase()}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const success = importBackupData(parsed);
        if (success) {
          setBackupMsg('¡Progreso restaurado con éxito!');
          setTimeout(() => setBackupMsg(null), 3000);
        } else {
          setBackupMsg('Archivo no válido. Asegúrate de usar un respaldo de PelvicRehab.');
          setTimeout(() => setBackupMsg(null), 4000);
        }
      } catch {
        setBackupMsg('Error al leer el archivo JSON.');
        setTimeout(() => setBackupMsg(null), 3000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-sm bg-[#0E121D] border border-[#212838] rounded-3xl p-5 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="flex items-center justify-between pb-2 border-b border-[#212838]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mi Perfil y Privacidad</h3>
              <p className="text-[10px] text-gray-400">Control de datos y seguridad</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white bg-[#181D2B] border border-[#212838]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Editar Nombre / Alias */}
        <form onSubmit={handleSaveAlias} className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <label className="text-xs font-bold text-white block">Nombre o Alias</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              className="flex-1 bg-[#090A0F] border border-[#212838] rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00E5FF]"
              placeholder="Tu nombre o alias..."
              maxLength={25}
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-xl bg-[#00E5FF] text-[#090A0F] font-bold text-xs hover:bg-[#00cce6] transition-colors cursor-pointer"
            >
              Guardar
            </button>
          </div>
          {savedSuccess && (
            <p className="text-[10px] text-[#00E676] font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Nombre actualizado correctamente
            </p>
          )}
        </form>

        {/* 2. Configurar o Eliminar PIN */}
        <div className="oled-card p-3.5 space-y-2.5 border border-[#212838]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#7C4DFF]" />
              <span className="text-xs font-bold text-white">PIN de Bloqueo</span>
            </div>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                profile.pin_hash ? 'bg-[#00E676]/20 text-[#00E676]' : 'bg-gray-800 text-gray-400'
              }`}
            >
              {profile.pin_hash ? 'Activo' : 'No configurado'}
            </span>
          </div>

          {profile.pin_hash ? (
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  lockApp();
                  onClose();
                }}
                className="flex-1 py-1.5 rounded-xl bg-[#7C4DFF]/20 border border-[#7C4DFF]/40 text-[#7C4DFF] text-xs font-bold hover:bg-[#7C4DFF]/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Bloquear Ahora</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  removePin();
                  setPinMsg('PIN eliminado.');
                  setTimeout(() => setPinMsg(null), 2000);
                }}
                className="py-1.5 px-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400 text-xs font-semibold hover:bg-red-900/30 transition-all cursor-pointer"
              >
                Quitar PIN
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPinInput(!showPinInput)}
              className="w-full py-1.5 rounded-xl bg-[#181D2B] border border-[#212838] text-gray-200 text-xs font-semibold hover:text-white hover:border-[#7C4DFF] transition-all cursor-pointer"
            >
              {showPinInput ? 'Cancelar' : '+ Configurar PIN de 4 dígitos'}
            </button>
          )}

          {showPinInput && (
            <form onSubmit={handleUpdatePin} className="space-y-2 pt-2 border-t border-[#212838]">
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Nuevo PIN"
                  className="bg-[#090A0F] border border-[#212838] rounded-xl px-2 py-1.5 text-center text-xs font-mono text-white tracking-widest"
                />
                <input
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Repetir PIN"
                  className="bg-[#090A0F] border border-[#212838] rounded-xl px-2 py-1.5 text-center text-xs font-mono text-white tracking-widest"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 rounded-xl bg-[#7C4DFF] text-white font-bold text-xs hover:bg-[#6b3ff0] cursor-pointer"
              >
                Confirmar PIN
              </button>
            </form>
          )}

          {pinMsg && (
            <p className="text-[10px] text-gray-300 font-semibold">{pinMsg}</p>
          )}
        </div>

        {/* 3. Exportar Respaldo de Progreso */}
        <div className="oled-card p-3.5 space-y-2 border border-[#212838]">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-[#00E676]" />
            <span className="text-xs font-bold text-white">Almacenamiento Local</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Tu historial de {trainingSessions.length} sesiones y {assessments.length} evaluaciones está guardado de forma privada en este dispositivo.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleExportData}
              className="py-2 px-2 rounded-xl bg-[#11141E] border border-[#212838] text-gray-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:border-gray-500 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#00E5FF]" />
              <span>Descargar</span>
            </button>

            <label className="py-2 px-2 rounded-xl bg-[#11141E] border border-[#212838] text-gray-300 hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:border-gray-500 transition-all cursor-pointer">
              <Upload className="w-3.5 h-3.5 text-[#00E676]" />
              <span>Restaurar</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
            </label>
          </div>

          {backupMsg && (
            <p className="text-[10px] text-[#00E676] font-semibold text-center pt-1 animate-fadeIn">
              {backupMsg}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
