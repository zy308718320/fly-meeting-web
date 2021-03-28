import { expose } from 'threads/worker';
import handleFilter from '@/utils/handleFilter';

expose(handleFilter);
