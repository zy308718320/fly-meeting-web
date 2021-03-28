import { expose } from 'threads/worker';
import handleBodyPix from '@/utils/handleBodyPix';

expose(handleBodyPix);
