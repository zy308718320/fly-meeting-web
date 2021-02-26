import { expose } from 'threads/worker';
import handleBodyPix from '@/utils/handleBodyPix';
import handleFilter from '@/utils/handleFilter';

expose({
  handleBodyPix,
  handleFilter,
});
