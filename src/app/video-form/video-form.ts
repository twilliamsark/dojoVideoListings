import { Component, inject } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';

import { VideoStore } from '../services/video-store.service';
import { Video } from '../models/video.model';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-video-form',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './video-form.html',
  styleUrl: './video-form.scss',
})
export class VideoForm {
  private videoStore = inject(VideoStore);
  private dialogRef = inject(MatDialogRef<VideoForm>);
  private authService = inject(AuthService);

  private data = inject<Video | null>(MAT_DIALOG_DATA);

  isEdit = !!this.data;

  form = new FormGroup({
    name: new FormControl(this.data?.name || '', Validators.required),
    url: new FormControl(this.data?.url || '', Validators.required),
    technique: new FormControl(this.data?.technique || '', Validators.required),
    direction: new FormControl(this.data?.direction || ''),
    stance: new FormControl(this.data?.stance || ''),
    format: new FormControl(this.data?.format || '', Validators.required),
  });

  techniques = [
    'Bokken Suburi',
    'General Exercise',
    'Gokyo',
    'Hiji Kata',
    'Iaido Only',
    'Ikkyo',
    'Iriminage',
    'Jo Kata',
    'Kaitennage',
    'Kokyuho',
    'Kokyunage',
    'Kotegaeshi',
    'Nikyo',
    'Sankyo',
    'Shihonage',
    'Udekimenage',
  ];

  directions = ['Omote', 'Ura'];

  stances = ['Aihanmi', 'Gyakuhanmi'];

  formats = [
    'Aiki Toho',
    'Jo no Tebiki',
    'Ken no Tebiki',
    'Ken ti Jo',
    'Ken ti Ken',
    'Other',
    'Oyo',
    'Suwariwaza',
    'Tiado',
  ];

  async save() {
    if (!this.authService.isAdmin()) {
      alert('Admin access required');
      return;
    }

    if (this.form.valid) {
      const videoData = this.form.value as Omit<Video, 'id'>;

      try {
        if (this.isEdit && this.data) {
          await this.videoStore.updateVideo(this.data.id, videoData);
        } else {
          await this.videoStore.addVideo(videoData);
        }

        this.dialogRef.close();
      } catch (error) {
        alert('Error saving video');
      }
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
