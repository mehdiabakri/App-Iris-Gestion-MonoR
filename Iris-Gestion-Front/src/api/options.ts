import { customFetch } from './customFetch'; 

import type { Option } from '../types/Types';

export const fetchOptions = async (): Promise<Option[]> => {
  const data = await customFetch('/api/options');
  return data?.['hydra:member'] || data?.member || [];
};