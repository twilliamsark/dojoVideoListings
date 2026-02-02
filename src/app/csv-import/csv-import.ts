import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';

import { CsvImportService } from '../services/csv-import.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-csv-import',

  imports: [MatButtonModule],

  templateUrl: './csv-import.html',

  styleUrl: './csv-import.scss',
})
export class CsvImport {
  private csvImportService = inject(CsvImportService);
  private authService = inject(AuthService);

  onFileSelected(event: Event) {
    if (!this.authService.isAdmin()) {
      alert('Admin access required');
      return;
    }

    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const file = input.files[0];

      this.csvImportService
        .importCsv(file)
        .then(() => {
          alert('CSV imported successfully!');
        })
        .catch((error) => {
          alert('Error importing CSV: ' + error.message);
        });
    }
  }
}
