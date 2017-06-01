import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LabStorageService } from '../../lab-storage.service';
import { EditorSnackbarService } from '../editor-snackbar.service';
import { Lab } from '../../models/lab';

@Component({
  selector: 'ml-lab-settings',
  templateUrl: './lab-settings.component.html',
  styleUrls: ['./lab-settings.component.scss']
})
export class LabSettingsComponent implements OnInit {

  @Input() lab = null as Lab;

  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private labStorageService: LabStorageService,
    private editorSnackbar: EditorSnackbarService,
    private router: Router
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: [this.lab.name, Validators.required],
      description: this.lab.description,
      tags: this.lab.tags ? this.lab.tags.join(',') : '',
    });
  }

  submit(data) {
    this.lab.name = data.name;
    this.lab.description = data.description;
    this.lab.tags = data.tags.split(',').filter(tag => tag.trim() !== '');
    this.labStorageService
        .saveLab(this.lab)
        .subscribe(_ => {
          this.router.navigate([this.lab.id], {
            queryParamsHandling: 'preserve'
          });
          this.editorSnackbar.notifyLabUpdated();
        });
  }
}
