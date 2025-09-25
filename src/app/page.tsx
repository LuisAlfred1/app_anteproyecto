'use client';

import { useEffect, useState } from 'react';

// Definir el tipo para el evento de instalación PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Home() {
  const [isOnline, setIsOnline] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Detectar estado de conexión
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Detectar evento de instalación PWA
    const handleBeforeInstallPrompt = (e: Event) => {
      const installEvent = e as BeforeInstallPromptEvent;
      installEvent.preventDefault();
      setInstallPrompt(installEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as EventListener);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    
    const result = await installPrompt.prompt();
    console.log('Install result:', result);
    setInstallPrompt(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🚀 Mi App PWA
        </h1>
        
        <p className="text-gray-600 mb-6">
          ¡Bienvenido a tu nueva Progressive Web App construida con Next.js!
        </p>

        <div className="space-y-4">
          {/* Estado de conexión */}
          <div className={`p-3 rounded-lg ${isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isOnline ? '🟢 En línea' : '🔴 Sin conexión'}
          </div>

          {/* Botón de instalación */}
          {installPrompt && (
            <button
              onClick={handleInstall}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              📱 Instalar App
            </button>
          )}

          {/* Características PWA */}
          <div className="text-left space-y-2">
            <h3 className="font-semibold text-gray-800">✨ Características:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• ⚡ Carga rápida</li>
              <li>• 📱 Instalable</li>
              <li>• 🔄 Funciona offline</li>
              <li>• 🔔 Notificaciones push</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}