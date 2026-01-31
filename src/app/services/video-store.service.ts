import { Injectable, signal, computed, effect } from '@angular/core';

import { Video } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoStore {
  private videos = signal<Video[]>([]);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem('videos');

    if (stored) {
      try {
        this.videos.set(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading videos from localStorage', e);
      }
    }
  }

  addVideo(video: Omit<Video, 'id'>) {
    const newVideo: Video = { ...video, id: crypto.randomUUID() };

    this.videos.update((list) => [...list, newVideo]);
  }

  updateVideo(id: string, updates: Partial<Omit<Video, 'id'>>) {
    this.videos.update((list) => list.map((v) => (v.id === id ? { ...v, ...updates } : v)));
  }

  deleteVideo(id: string) {
    this.videos.update((list) => list.filter((v) => v.id !== id));
  }

  getFilteredAndSortedVideos(
    sortBy: keyof Video,
    filters: {
      name?: string;
      technique?: string;
      direction?: string;
      stance?: string;
      format?: string;
    },
  ) {
    return computed(() => {
      let list = this.videos();

      // Filter

      if (filters.name) {
        list = list.filter((v) => v.name.toLowerCase().includes(filters.name!.toLowerCase()));
      }

      if (filters.technique) {
        list = list.filter((v) => v.technique === filters.technique);
      }

      if (filters.direction) {
        list = list.filter((v) => v.direction === filters.direction);
      }

      if (filters.stance) {
        list = list.filter((v) => v.stance === filters.stance);
      }

      if (filters.format) {
        list = list.filter((v) => v.format === filters.format);
      }

      // Sort

      list = [...list].sort((a, b) => {
        const aVal = a[sortBy] || '';

        const bVal = b[sortBy] || '';

        return aVal.toString().localeCompare(bVal.toString());
      });

      return list;
    });
  }

  getVideoById(id: string) {
    return this.videos().find((v) => v.id === id);
  }

  // Effect to save to localStorage

  private saveEffect = effect(() => {
    localStorage.setItem('videos', JSON.stringify(this.videos()));
  });
}
