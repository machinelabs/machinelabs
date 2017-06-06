import { Component, OnInit, Input } from '@angular/core';
import { LabConfigService } from '../lab-config.service';
import { Lab } from '../../models/lab';
import { PublicLabConfiguration } from '../../models/lab-configuration';

@Component({
  selector: 'ml-lab-settings',
  templateUrl: './lab-settings.component.html',
  styleUrls: ['./lab-settings.component.scss']
})
export class LabSettingsComponent implements OnInit {

  @Input() lab = null as Lab;

  configuration: PublicLabConfiguration;

  constructor(private labConfigService: LabConfigService) { }

  ngOnInit() {
    this.configuration = this.labConfigService.readConfig(this.lab);
  }
}
