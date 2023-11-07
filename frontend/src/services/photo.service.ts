import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Rekognition, RekognitionClient } from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: 'sa-east-1',
  credentials: { 
    accessKeyId: 'AKIAXHHLJ3EEWAACTZXS',
    secretAccessKey: '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'
  }
});

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

    const photoUrl = photo.webPath;

    if (photoUrl){
      fetch(photoUrl)
        .then(response => response.blob())
        .then(blob => {
          const reader = new FileReader();
  
          reader.onload = () => {
            const base64Data = reader.result as string; // Converter o resultado para uma string
            console.log(base64Data);

          };
          reader.readAsDataURL(blob);
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      console.error('URL da foto é undefined.');
    }
  }
}
