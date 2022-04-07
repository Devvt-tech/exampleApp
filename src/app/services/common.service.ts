import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import * as moment from 'moment';
import { TYPE_OF_JOB } from 'src/constants';
import { ToastService } from './toast.service';
import { PreviewAnyFile } from '@ionic-native/preview-any-file/ngx';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private file: File,
    private previewAnyFile: PreviewAnyFile
  ) { }

  getServerError(errors: string[]) {
    let result: string;
    if (errors && errors.length > 0) {
      result = errors[0];
    }
    return result;
  }

  transformServerError(errors: string[], err?: any) {
    let result= new Map<string, string>();
    if (err?.status === 500) {
      result.set('common', err.statusText);
    } else {
      errors.forEach(val => {
        const spl = val.split(':');
        if (spl.length === 2) {
          const key = spl[0].toLowerCase().trim();
          result.set(key, spl[1])
        } else {
          result.set('common', spl[0])
        }
      });
    }
    return result;
  }

  transformServerErrorV2(errors: any, err?: any) {
    let result: string = '';
    if (err?.status === 500) {
      result = err.statusText;
    } else {
      let array: string[] = [];
      for (let e in errors) {
        const value: string[] = errors[e];
        array = array.concat(value);
      }
      result = array && array.length > 0 ? array[0] : '';
    }
    return result;
  }

  getTextErrorByFieldName(errors: Map<string, string>, fieldName: string) {
    if (errors) {
      return errors.get(fieldName.toLowerCase());
    } else {
      return null
    }
  }

  converterUrlToBase64(url: string){
    if (!url) {return};
    url = url.substr(0, url.indexOf('?'));
    return new Promise<string>((observer) => {
      let canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        const dataURL = canvas.toDataURL('image/jpeg');
        canvas = null;
        observer(dataURL);
      };
    })
  }

  converterUrlToBlob(url: string){
    if (!url) {return};
    //url = url.substr(0, url.indexOf('?'));
    return new Promise<string>((observer) => {
      let canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        ctx.drawImage(img,0,0);
        canvas.toBlob((val) => {
        },'image/jpeg');
        canvas = null;
        //observer(dataURL);
      };
    })
  }



  getBase64(path: string) {
    const newPath = path.split('?')[0];
    const splitPath = path.split('/');
    const imageNameWithLabel = splitPath[splitPath.length - 1];
    const filePath = path.split(imageNameWithLabel)[0];
    const imageName = imageNameWithLabel.split('?')[0];
    return this.file.readAsDataURL(filePath, imageName).then(base64 => {
      return base64;
    })
  }

  async blob(path: string, fileName: string) {
    return await this.file.readAsArrayBuffer(path, fileName).then(buffer => {
      return new Blob([buffer], {type: 'image/jpeg'});
    });
  }

  async getBlobByFullPath(fullPath: string) {
    const checkedFullPath = fullPath.includes('file://') ? fullPath : `file://${fullPath}`;
    const splitPath = checkedFullPath.split('/');
    const imageNameWithLabel = splitPath[splitPath.length - 1];
    const filePath = checkedFullPath.split(imageNameWithLabel)[0];
    const fileName = imageNameWithLabel.split('?')[0];
    return await this.file.readAsArrayBuffer(filePath, fileName).then(buffer => {
      const fileBlob = new Blob([buffer]);
      return fileBlob;
    });
  }

  getDifferentDatesText(from: string, to: string) {
    let result = 'No experience';
    const fromM = moment(from);
    const toM = moment(to);
    if (fromM.isValid() && toM.isValid()) {
      const years = Math.abs(fromM.diff(toM, 'year'));
      const monts = Math.abs(fromM.diff(toM, 'month'));
      result = years > 0 ? `${years} years` : `${monts} monts`;
    }
    return result;
  }

  getTypeOfJobName(id: number) {
    return TYPE_OF_JOB[id];
  }

  getStatusColor(status: string) {
    let result: string;
    switch (status) {
      case 'Active': {
        result = 'success'
        break;
      }
      case 'Canceled': {
        result = 'danger'
        break;
      }
      case 'Archived': {
        result = 'medium'
        break;
      }
      case 'Accepted': {
        result = 'primary'
        break;
      }
      case 'Rejected': {
        result = 'danger'
        break;
      }
      default: {
        result = 'warning'
        break;
      }
    };
    return result;
  }

  imageFullScreen(url: string) {
    this.previewAnyFile.preview(url)
    .then((res: any) => console.log(res))
    .catch((error: any) => console.error(error));
  }

  timeIsFuture(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      
      if (control.value) {
        const dateVal = control.get('date').value;
        const fromTimeVal = control.get('from_time').value;
        const toTimeVal = control.get('to_time').value;
  
        const date = dateVal ? moment(control.get('date').value) : null;
        if (date) {
          const fromTime = fromTimeVal ? moment(control.get('from_time').value) : null;
          const toTime = toTimeVal ? moment(control.get('to_time').value) : null;

          const start = fromTime && moment(`${date.format('DD.MM.YYYY')}T${fromTime.format('HH:mm:ss')}`, 'DD.MM.YYYYTHH:mm:ss');
          const end = toTime && moment(`${date.format('DD.MM.YYYY')}T${toTime.format('HH:mm:ss')}`, 'DD.MM.YYYYTHH:mm:ss');
          if (start && !start.isAfter() ) {
            return { 'startTime': true };
          }
          if (end && !end.isAfter() ) {
            return { 'endTime': true };
          }
          if (start && end && !end.isAfter(start) ) {
            return { 'invalidRange': true };
          }
        }
      }
      return null;
    };
  }

}
