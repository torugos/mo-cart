import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { UserPhoto } from 'src/app/models/user-photo.model';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  constructor() { }

  public async takePicture() {
    // Take a photo
    const photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    console.log(photo)
  }
}
