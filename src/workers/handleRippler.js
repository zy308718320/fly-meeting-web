import { expose } from 'threads/worker';
import handleRippler from '@/utils/handleRippler';

expose(handleRippler);
