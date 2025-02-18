import { DateUtils } from './DateUtils.ts';

export class BonkDonk
{
  bonk()
  {
    return 'BONK DONK! ' + DateUtils.to('YYYY-MM-DD HH:mm:ss');
  }

  donk()
  {
    return 'DONK BONK! ' + DateUtils.to('YYYY-MM-DD HH:mm:ss');
  }
}
