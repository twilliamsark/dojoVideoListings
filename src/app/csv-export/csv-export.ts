import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { VideoStore } from '../services/video-store.service';
import { AuthService } from '../services/auth.service';
import { Video } from '../models/video.model';

import * as Papa from 'papaparse';

@Component({
  selector: 'app-csv-export',
  imports: [MatButtonModule],
  templateUrl: './csv-export.html',
  styleUrl: './csv-export.scss',
})
export class CsvExport {
  private videoStore = inject(VideoStore);
  private authService = inject(AuthService);

  exportCsv() {
    if (!this.authService.isAdmin()) {
      alert('Admin access required');
      return;
    }

    try {
      const videos: Video[] = this.videoStore.allVideos();
      if (videos.length === 0) {
        alert('No videos to export');
        return;
      }

      const csv = Papa.unparse(videos.map(({ id, ...rest }) => rest));
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `videos_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Error exporting CSV: ' + (error as Error).message);
    }
  }
}
