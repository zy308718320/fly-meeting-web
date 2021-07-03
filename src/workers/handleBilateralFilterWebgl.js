import { expose } from 'threads/worker';
import handleBilateralFilterWebgl from '@/utils/handleBilateralFilterWebgl';

expose(handleBilateralFilterWebgl);
