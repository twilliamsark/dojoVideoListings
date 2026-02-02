import { Injectable } from '@angular/core';

import * as Papa from 'papaparse';

import { VideoStore } from './video-store.service';

import { Video } from '../models/video.model';

@Injectable({
  providedIn: 'root',
})
export class CsvImportService {
  constructor(private videoStore: VideoStore) {}

  async importCsv(file: File): Promise<void> {
    return new Promise((resolve, reject) => {
      Papa.parse(file as any, {
        header: true,

        skipEmptyLines: true,

        complete: async (results: Papa.ParseResult<any>) => {
          try {
            const videos: Omit<Video, 'id'>[] = results.data
              .filter((row: any) => row.name && row.url && row.technique && row.format) // basic validation
              .map((row: any) => ({
                name: row.name.trim(),
                url: row.url.trim(),
                technique: row.technique.trim(),
                direction: row.direction?.trim() || undefined,
                stance: row.stance?.trim() || undefined,
                format: row.format.trim(),
              }));
            console.log(`Importing ${videos.length} videos from CSV`);
            for (const video of videos) {
              await this.videoStore.addVideo(video);
            }

            resolve();
          } catch (e) {
            reject(e);
          }
        },
      });
    });
  }
}
