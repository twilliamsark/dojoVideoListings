import { Injectable, signal, computed, effect } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  orderBy,
} from '@angular/fire/firestore';

import { Video } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class VideoStore {
  private videos = signal<Video[]>([]);

  constructor(private firestore: Firestore) {
    this.loadFromFirestore();
  }

  private async loadFromFirestore() {
    try {
      const videosRef = collection(this.firestore, 'videos');
      const q = query(videosRef, orderBy('name'));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Video);
      this.videos.set(videos);

      // If no videos in Firestore, migrate from localStorage
      if (videos.length === 0) {
        this.migrateFromLocalStorage();
      }
    } catch (error) {
      console.error('Error loading videos from Firestore', error);
      // Fallback to localStorage
      this.loadFromStorage();
    }
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

  private async migrateFromLocalStorage() {
    const stored = localStorage.getItem('videos');
    if (stored) {
      try {
        const localVideos: Video[] = JSON.parse(stored);
        for (const video of localVideos) {
          await addDoc(collection(this.firestore, 'videos'), { ...video, id: undefined });
        }
        this.videos.set(localVideos);
        localStorage.removeItem('videos'); // Clean up
      } catch (e) {
        console.error('Error migrating videos to Firestore', e);
      }
    }
  }

  async addVideo(video: Omit<Video, 'id'>) {
    try {
      video.direction = video.direction === undefined ? '' : video.direction;
      video.stance = video.stance === undefined ? '' : video.stance;
      console.log('Adding video to Firestore', video);
      const docRef = await addDoc(collection(this.firestore, 'videos'), video);
      const newVideo: Video = { ...video, id: docRef.id };
      this.videos.update((list) => [...list, newVideo]);
    } catch (error) {
      throw error;
    }
  }

  async updateVideo(id: string, updates: Partial<Omit<Video, 'id'>>) {
    try {
      const videoDoc = doc(this.firestore, 'videos', id);
      await updateDoc(videoDoc, updates);
      this.videos.update((list) => list.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    } catch (error) {
      throw error;
    }
  }

  async deleteVideo(id: string) {
    try {
      const videoDoc = doc(this.firestore, 'videos', id);
      await deleteDoc(videoDoc);
      this.videos.update((list) => list.filter((v) => v.id !== id));
    } catch (error) {
      throw error;
    }
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

  // No longer saving to localStorage, data is in Firestore
}
