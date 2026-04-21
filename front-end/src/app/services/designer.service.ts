import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DesignerService {
  // holds the current preset (theme/layout) as a signal
  private _preset = signal<string | null>(null);

  constructor() {
    // You could load the default preset from localStorage or environment
    this._preset.set('default'); 
  }

  // --- Getter for components ---
  preset(): string | null {
    return this._preset();
  }

  // --- Setter to update preset ---
  setPreset(p: string) {
    this._preset.set(p);
  }

  // --- Reset to default ---
  resetPreset() {
    this._preset.set('default');
  }
}
