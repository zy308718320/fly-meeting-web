import { expose } from 'threads/worker';
import handleBilateralFilter from '@/utils/handleBilateralFilter';

expose(handleBilateralFilter);
