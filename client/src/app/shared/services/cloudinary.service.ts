import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../core/config/environment';

@Injectable({ providedIn: 'root' })
export class CloudinaryService {
  private readonly uploadUrl = `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/image/upload`;

  upload(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', environment.cloudinary.uploadPreset);

    return from(
      fetch(this.uploadUrl, { method: 'POST', body: formData }).then((res) => res.json()),
    ).pipe(map((res: any) => res.secure_url as string));
  }
}
