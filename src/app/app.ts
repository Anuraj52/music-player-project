import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Song {
  id: number;
  title: string;
  artist: string;
  img: string;
  emoji: string;
  src: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  activeNav = 'home';
  searchText = '';
  liked = false;
  isPlaying = false;
  shuffled = false;
  repeated = false;
  muted = false;
  volume = 0.7;
  progressValue = 0;
  currentTime = '0:00';
  totalTime = '0:00';
  currentSong: Song | null = null;
  currentIndex = -1;
  playlist: Song[] = [];

  private audio = new Audio();

  tracks: Song[] = [
    {
      id: 1,
      title: 'Chill Lofi Beat',
      artist: 'Free Music Archive',
      emoji: '🌙',
      img: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 2,
      title: 'Acoustic Vibes',
      artist: 'SoundHelix',
      emoji: '🌿',
      img: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
    },
    {
      id: 3,
      title: 'Electric Groove',
      artist: 'SoundHelix',
      emoji: '⚡',
      img: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
    },
    {
      id: 4,
      title: 'Ocean Waves',
      artist: 'SoundHelix',
      emoji: '🌊',
      img: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=400',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
    },
  ];

  constructor() {
    // Update progress bar as audio plays
    this.audio.addEventListener('timeupdate', () => {
      if (this.audio.duration) {
        this.progressValue = (this.audio.currentTime / this.audio.duration) * 100;
        this.currentTime = this.formatTime(this.audio.currentTime);
        this.totalTime = this.formatTime(this.audio.duration);
      }
    });

    // Auto next song when current ends
    this.audio.addEventListener('ended', () => {
      if (this.repeated) {
        this.audio.currentTime = 0;
        this.audio.play();
      } else {
        this.nextSong();
      }
    });

    // Update playing state if audio pauses/plays externally
    this.audio.addEventListener('play', () => { this.isPlaying = true; });
    this.audio.addEventListener('pause', () => { this.isPlaying = false; });

    this.audio.volume = this.volume;
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio.src = '';
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  getFilteredTracks(): Song[] {
    const q = this.searchText.toLowerCase();
    return this.tracks.filter(s =>
      s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q)
    );
  }

  onImgError(event: Event) {
    const el = event.target as HTMLImageElement;
    el.style.display = 'none';
  }

  playSong(song: Song) {
    this.currentSong = song;
    this.currentIndex = this.tracks.findIndex(t => t.id === song.id);
    this.liked = false;
    this.progressValue = 0;
    this.currentTime = '0:00';
    this.totalTime = '0:00';

    this.audio.src = song.src;
    this.audio.load();
    this.audio.play().catch(err => {
      console.error('Audio play error:', err);
    });
  }

  togglePlay() {
    if (!this.currentSong) {
      this.playSong(this.tracks[0]);
      return;
    }
    if (this.audio.paused) {
      this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  nextSong() {
    if (this.tracks.length === 0) return;
    const next = this.shuffled
      ? Math.floor(Math.random() * this.tracks.length)
      : (this.currentIndex + 1) % this.tracks.length;
    this.playSong(this.tracks[next]);
  }

  prevSong() {
    // If more than 3 seconds played, restart current song
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }
    const prev = (this.currentIndex - 1 + this.tracks.length) % this.tracks.length;
    this.playSong(this.tracks[prev]);
  }

  seekTo(event: MouseEvent) {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    const pct = (event.clientX - rect.left) / rect.width;
    if (this.audio.duration) {
      this.audio.currentTime = pct * this.audio.duration;
    }
  }

  setVolume(event: MouseEvent) {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    this.volume = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    this.audio.volume = this.volume;
    this.muted = false;
    this.audio.muted = false;
  }

  toggleMute() {
    this.muted = !this.muted;
    this.audio.muted = this.muted;
  }

  toggleLike() { this.liked = !this.liked; }
  toggleShuffle() { this.shuffled = !this.shuffled; }

  toggleRepeat() {
    this.repeated = !this.repeated;
    this.audio.loop = this.repeated;
  }

  addToPlaylist(song: Song) {
    if (!this.playlist.find(s => s.id === song.id)) {
      this.playlist.push(song);
    }
  }

  removeSong(i: number) {
    this.playlist.splice(i, 1);
  }
}
