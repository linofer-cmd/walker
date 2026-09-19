// Audio and Voice Alert Engine using Web Audio API and Web Speech API

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private voiceEnabled: boolean = true;
  private alarmInterval: number | null = null;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopContinuousAlarm();
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
  }

  // Play single pulse or sequence
  public playTone(freq: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.2) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Tactical security alarm (high-low dual beep)
  public playPatrolAlarm() {
    if (this.isMuted) return;
    this.playTone(880, 0.15, 'sawtooth', 0.25);
    setTimeout(() => {
      this.playTone(660, 0.2, 'sawtooth', 0.25);
    }, 180);
  }

  // CCTV audit chime (digital triple chirp)
  public playDvrAlarm() {
    if (this.isMuted) return;
    this.playTone(1046, 0.1, 'sine', 0.25);
    setTimeout(() => this.playTone(1318, 0.1, 'sine', 0.25), 120);
    setTimeout(() => this.playTone(1567, 0.25, 'sine', 0.25), 240);
  }

  // Start continuous repeating alarm when timer is overdue
  public startOverdueAlarm(type: 'walk' | 'dvr') {
    if (this.isMuted || this.alarmInterval) return;
    
    // Play immediately
    if (type === 'walk') {
      this.playPatrolAlarm();
    } else {
      this.playDvrAlarm();
    }

    // Repeat every 3 seconds until acknowledged
    this.alarmInterval = window.setInterval(() => {
      if (this.isMuted) {
        this.stopContinuousAlarm();
        return;
      }
      if (type === 'walk') {
        this.playPatrolAlarm();
      } else {
        this.playDvrAlarm();
      }
    }, 3200);
  }

  public stopContinuousAlarm() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  // UI action click
  public playClick() {
    this.playTone(600, 0.04, 'triangle', 0.1);
  }

  // Success / Checklist pass
  public playSuccess() {
    this.playTone(523.25, 0.08, 'sine', 0.15);
    setTimeout(() => this.playTone(659.25, 0.12, 'sine', 0.15), 90);
  }

  // Voice announcement via Web Speech API
  public speak(text: string) {
    if (this.isMuted || !this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 0.95;
      utterance.volume = 0.85;

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => (v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'))));
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis may be blocked or restricted
    }
  }

  public alertWalkStarted(minutes: number) {
    this.playTone(587.33, 0.1, 'sine', 0.15);
    this.speak(`Patrol walk commenced. Chronometer set for ${minutes} minutes.`);
  }

  public alertDvrStarted(unitName: string, minutes: number) {
    this.playTone(659.25, 0.1, 'sine', 0.15);
    this.speak(`CCTV DVR integrity check commenced for ${unitName}. Countdown set for ${minutes} minutes.`);
  }

  public alertWalkExpired(guardName?: string) {
    this.playPatrolAlarm();
    const message = guardName 
      ? `Attention control room: Security patrol walk for ${guardName} has expired. Confirm guard return.`
      : "Attention control room: Security patrol walk timer has expired. Confirm guard return.";
    this.speak(message);
  }

  public alertDvrExpired(unitName?: string) {
    this.playDvrAlarm();
    const message = unitName
      ? `Attention operator: CCTV health audit for ${unitName} is complete. Log recorder status.`
      : "Attention operator: CCTV recorder audit countdown has ended. Log recorder status.";
    this.speak(message);
  }

  public alertFatigueWarning(guardName: string) {
    this.playTone(440, 0.3, 'square', 0.2);
    this.speak(`Fatigue warning: Guard ${guardName} has exceeded maximum continuous duty without rest.`);
  }
}

export const soundManager = new SoundController();
