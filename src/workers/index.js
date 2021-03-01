import { expose } from 'threads/worker';
import handleBodyPix from '@/utils/handleBodyPix';
import handleFilter from '@/utils/handleFilter';
import handleRippler from '@/utils/handleRippler';

expose({
  handleBodyPix,
  handleFilter,
  handleRippler,
});
