import { useState, useEffect, useCallback } from 'react';
import { audioEngine, type SFXId } from './audioEngine';

export function useAudio() {
  const [isMuted, setIsMuted] = useState(() => audioEngine.getMuted());

  useEffect(() => {
    const unsubscribe = audioEngine.subscribe(() => {
      setIsMuted(audioEngine.getMuted());
    });
    return unsubscribe;
  }, []);

  const playSFX = useCallback((sfxId: SFXId, customVolume?: number) => {
    audioEngine.playSFX(sfxId, customVolume);
  }, []);

  const toggleMute = useCallback(() => {
    return audioEngine.toggleMute();
  }, []);

  const unlockAudio = useCallback(() => {
    audioEngine.unlockAudio();
  }, []);

  return {
    isMuted,
    playSFX,
    toggleMute,
    unlockAudio,
  };
}
