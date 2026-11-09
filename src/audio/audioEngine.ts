/**
 * AUDIO ENGINE SSOT
 * Quản lý Nhạc nền Vivaldi Winter & 28 SFX chuẩn hóa từ 0-rules-and-knowledge
 */

export type SFXId =
  | 'click_ui'
  | 'whoosh_fast'
  | 'card_slide'
  | 'pop_soft'
  | 'pop_mouth'
  | 'marker_swipe'
  | 'cat_huh'
  | 'ding_correct'
  | 'wrong_buzzer'
  | 'coin_reward'
  | 'ding_bell'
  | 'vine_boom'
  | 'bonk'
  | 'dry_fart'
  | 'mac_quack'
  | 'rizz_sound'
  | 'dun_dun_dun'
  | 'among_us_role'
  | 'record_scratch'
  | 'punch_sound'
  | 'bone_crack'
  | 'loading_lost'
  | 'windows_error'
  | 'glitch'
  | 'camera_shutter'
  | 'piuw'
  | 'throwing_sound'
  | 'keyboard_tap';

export interface SFXMeta {
  file: string;
  defaultVolume: number;
}

export const SFX_REGISTRY: Record<SFXId, SFXMeta> = {
  click_ui: { file: '/audio/sfx/click_ui.mp3', defaultVolume: 0.25 },
  whoosh_fast: { file: '/audio/sfx/whoosh_fast.mp3', defaultVolume: 0.22 },
  card_slide: { file: '/audio/sfx/card_slide.mp3', defaultVolume: 0.20 },
  pop_soft: { file: '/audio/sfx/pop_soft.mp3', defaultVolume: 0.25 },
  pop_mouth: { file: '/audio/sfx/pop_mouth.mp3', defaultVolume: 0.30 },
  marker_swipe: { file: '/audio/sfx/marker_swipe.mp3', defaultVolume: 0.20 },
  cat_huh: { file: '/audio/sfx/cat_huh.mp3', defaultVolume: 0.35 },
  ding_correct: { file: '/audio/sfx/ding_correct.mp3', defaultVolume: 0.25 },
  wrong_buzzer: { file: '/audio/sfx/wrong_buzzer.mp3', defaultVolume: 0.22 },
  coin_reward: { file: '/audio/sfx/coin_reward.mp3', defaultVolume: 0.22 },
  ding_bell: { file: '/audio/sfx/ding_bell.mp3', defaultVolume: 0.20 },
  vine_boom: { file: '/audio/sfx/vine_boom.mp3', defaultVolume: 0.30 },
  bonk: { file: '/audio/sfx/bonk.mp3', defaultVolume: 0.30 },
  dry_fart: { file: '/audio/sfx/dry_fart.mp3', defaultVolume: 0.30 },
  mac_quack: { file: '/audio/sfx/mac_quack.mp3', defaultVolume: 0.28 },
  rizz_sound: { file: '/audio/sfx/rizz_sound.mp3', defaultVolume: 0.28 },
  dun_dun_dun: { file: '/audio/sfx/dun_dun_dun.mp3', defaultVolume: 0.22 },
  among_us_role: { file: '/audio/sfx/among_us_role.mp3', defaultVolume: 0.24 },
  record_scratch: { file: '/audio/sfx/record_scratch.mp3', defaultVolume: 0.25 },
  punch_sound: { file: '/audio/sfx/punch_sound.mp3', defaultVolume: 0.28 },
  bone_crack: { file: '/audio/sfx/bone_crack.mp3', defaultVolume: 0.25 },
  loading_lost: { file: '/audio/sfx/loading_lost.mp3', defaultVolume: 0.22 },
  windows_error: { file: '/audio/sfx/windows_error.mp3', defaultVolume: 0.22 },
  glitch: { file: '/audio/sfx/glitch.mp3', defaultVolume: 0.18 },
  camera_shutter: { file: '/audio/sfx/camera_shutter.mp3', defaultVolume: 0.22 },
  piuw: { file: '/audio/sfx/piuw.mp3', defaultVolume: 0.25 },
  throwing_sound: { file: '/audio/sfx/throwing_sound.mp3', defaultVolume: 0.22 },
  keyboard_tap: { file: '/audio/sfx/keyboard_tap.mp3', defaultVolume: 0.18 },
};

class AudioEngineClass {
  private bgmAudio: HTMLAudioElement | null = null;
  private isMuted: boolean = false;
  private isUnlocked: boolean = false;
  private defaultBGMVolume: number = 0.08; // -22dB theo chuẩn hiến pháp
  private duckTimer: ReturnType<typeof setTimeout> | null = null;
  private listeners: Set<() => void> = new Set();
  private sfxCache: Map<string, HTMLAudioElement> = new Map();

  constructor() {
    // Chỉ khởi tạo trên môi trường trình duyệt
    if (typeof window !== 'undefined') {
      this.initBGM();
      this.preloadCoreSFX();
    }
  }

  private initBGM() {
    try {
      this.bgmAudio = new Audio('/audio/bg_music/bg_vivaldi_winter.mp3');
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.defaultBGMVolume;
    } catch {
      // Audio element not supported
    }
  }

  private preloadCoreSFX() {
    const coreKeys: SFXId[] = [
      'click_ui',
      'whoosh_fast',
      'pop_soft',
      'card_slide',
      'marker_swipe',
      'ding_correct',
      'wrong_buzzer',
      'coin_reward',
      'ding_bell',
      'cat_huh',
      'vine_boom',
    ];

    coreKeys.forEach((key) => {
      try {
        const audio = new Audio(SFX_REGISTRY[key].file);
        audio.preload = 'auto';
        this.sfxCache.set(key, audio);
      } catch {
        // Ignore preload errors in SSR/headless
      }
    });
  }

  /**
   * Mở khóa AudioContext và bắt đầu BGM sau tương tác người dùng đầu tiên
   */
  public unlockAudio() {
    if (this.isUnlocked) return;
    this.isUnlocked = true;

    if (this.bgmAudio && !this.isMuted) {
      this.bgmAudio.play().catch(() => {
        // Autoplay policy prevented playback
      });
    }
    this.notify();
  }

  /**
   * Phát hiệu ứng âm thanh SFX tức thì
   */
  public playSFX(sfxId: SFXId, customVolume?: number) {
    if (this.isMuted) return;
    this.unlockAudio();

    const meta = SFX_REGISTRY[sfxId];
    if (!meta) return;

    try {
      // Sử dụng clone để phát nhiều âm cùng lúc (concurrency friendly)
      const audio = new Audio(meta.file);
      audio.volume = customVolume !== undefined ? customVolume : meta.defaultVolume;
      audio.play().catch(() => {
        // Autoplay prevented
      });
    } catch {
      // Audio error
    }
  }

  /**
   * Tự động giảm âm lượng BGM tạm thời khi có hiệu ứng kịch tính (Auto-Ducking)
   */
  public duckBGM(targetVolume: number = 0.02, durationMs: number = 1400) {
    if (!this.bgmAudio || this.isMuted) return;

    if (this.duckTimer) {
      clearTimeout(this.duckTimer);
    }

    this.bgmAudio.volume = targetVolume;

    this.duckTimer = setTimeout(() => {
      if (this.bgmAudio && !this.isMuted) {
        this.bgmAudio.volume = this.defaultBGMVolume;
      }
      this.duckTimer = null;
    }, durationMs);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (this.bgmAudio) {
      if (this.isMuted) {
        this.bgmAudio.pause();
      } else {
        this.bgmAudio.volume = this.defaultBGMVolume;
        this.bgmAudio.play().catch(() => {});
      }
    }

    this.notify();
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }
}

export const audioEngine = new AudioEngineClass();
