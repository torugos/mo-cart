import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'marketNull'
})
export class MarketNullPipe implements PipeTransform {

  transform(value: any) {
    if(value)
      return value

    return 'Não Comprado';
  }
}
