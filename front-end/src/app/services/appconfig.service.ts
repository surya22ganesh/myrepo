import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppConfig {
  theme?: string;
  ripple?: boolean;
  // … other config options
}

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  private config: AppConfig = {};
  private configSubject = new BehaviorSubject<AppConfig>(this.config);

  config$ = this.configSubject.asObservable();

  updateConfig(config: AppConfig) {
    this.config = { ...this.config, ...config };
    this.configSubject.next(this.config);
  }

  getConfig(): AppConfig {
    return this.config;
  }

  transitionComplete(): boolean {
    // in PrimeNG templates, this usually tells if theme change is fully applied
    return true;
  }
}
