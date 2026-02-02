import {
  Component,
  inject,
  signal,
  computed,
  OnInit,
  effect,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { VideoStore } from '../services/video-store.service';
import { Video } from '../models/video.model';
import { VideoForm } from '../video-form/video-form';
import { CsvImport } from '../csv-import/csv-import';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-video-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,

    CsvImport,
  ],
  templateUrl: './video-list.html',
  styleUrl: './video-list.scss',
})
export class VideoList implements OnInit, AfterViewInit {
  private videoStore = inject(VideoStore);
  private dialog = inject(MatDialog);
  private authService = inject(AuthService);

  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['name', 'technique', 'direction', 'stance', 'format', 'actions'];

  dataSource = new MatTableDataSource<Video>();

  filters = signal<{
    name?: string;
    technique?: string;
    direction?: string;
    stance?: string;
    format?: string;
  }>({});

  filteredVideos = computed(() =>
    this.videoStore.getFilteredAndSortedVideos('name', this.filters())(),
  );

  isAdmin = computed(() => this.authService.isAdmin());

  filterForm = new FormGroup({
    name: new FormControl(''),
    technique: new FormControl(''),
    direction: new FormControl(''),
    stance: new FormControl(''),
    format: new FormControl(''),
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

  constructor() {
    effect(() => {
      this.dataSource.data = this.filteredVideos();
    });
  }

  ngOnInit() {
    this.filterForm.valueChanges.subscribe((value) => {
      this.filters.set({
        name: value.name || undefined,
        technique: value.technique || undefined,
        direction: value.direction || undefined,
        stance: value.stance || undefined,
        format: value.format || undefined,
      });
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  clearFilters() {
    this.filters.set({
      name: undefined,
      technique: undefined,
      direction: undefined,
      stance: undefined,
      format: undefined,
    });
  }

  addVideo() {
    const dialogRef = this.dialog.open(VideoForm, {
      data: null,
    });
  }

  editVideo(video: Video) {
    const dialogRef = this.dialog.open(VideoForm, {
      data: video,
    });
  }

  async deleteVideo(video: Video) {
    if (confirm('Delete this video?')) {
      try {
        await this.videoStore.deleteVideo(video.id);
      } catch (error) {
        alert('Error deleting video');
      }
    }
  }

  openVideo(url: string) {
    window.open(url, '_blank');
  }
}
