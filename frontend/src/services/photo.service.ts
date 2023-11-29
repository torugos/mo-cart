import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { RekognitionClient } from "@aws-sdk/client-rekognition";
import { UserPhoto } from 'src/app/models/user-photo.model';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Observable, from, switchMap } from 'rxjs';

const client = new RekognitionClient({
  region: 'us-west-2', 
  credentials: { 
    accessKeyId: environment.ACCESS_KEY_ID,
    secretAccessKey: environment.SECRET_ACCESS_KEY
  }
});

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: UserPhoto[] = [];
  public photo: string = '';
  public photoUrl: any;

  constructor() { }

  public base64ToArrayBuffer(base64: string) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

  // public async takePicture() {
  //   //Take photo
  //   const photo = await Camera.getPhoto({
  //     resultType: CameraResultType.Uri,
  //     source: CameraSource.Camera,
  //     quality: 100
  //   });

  //   this.photoUrl = photo.webPath;

  //   // if (photoUrl){
  //   //   fetch(photoUrl)
  //   //     .then(response => response.blob())
  //   //     .then(blob => {
  //   //       const reader = new FileReader();
  
  //   //       reader.onload = () => {
  //   //         const base64Data = reader.result as string; // Converter o resultado para uma string
  //   //         this.photo = base64Data;

  //   //         // var teste = this.base64ToArrayBuffer(base64Data)
  //   //         // console.log(teste)
  //   //         // var toUint8Array = require('base64-to-uint8array')
  //   //         // let arr = toUint8Array(base64Data)
  //   //         // console.log(arr) // the bytes for "hello world"


  //   //         // const input : DetectTextCommandInput = {
  //   //         //   Image: {Bytes: arr}
  //   //         // }
  //   //         // const command = new DetectTextCommand(input)
              
  //   //         // try {
  //   //         //   let data = client.send(command);
  //   //         //   console.log(data)
  //   //         // } 
  //   //         // catch (error) {
  //   //         //   console.error(error)
  //   //         // }
  //   //       };
  //   //       reader.readAsDataURL(blob);
  //   //     })
  //   //     .catch(error => {
  //   //       console.error(error);
  //   //     });
  //   // } else {
  //   //   console.error('URL da foto é undefined.');
  //   // }
  // }

  takePicture(): Observable<string | undefined> {
    return from(Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    })).pipe(
      switchMap(image => {
        // 'image.webPath' contém a URL local da imagem
        return [image.webPath];
      })
    );
  }
}
