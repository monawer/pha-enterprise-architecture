
import { useReferenceOptions } from '@/hooks/useReferenceOptions';

export const useDevelopmentTypesOptions = () => {
  // Using ref_technologies as a fallback since ref_development_types might not be in the ReferenceTable type
  // We'll create a custom hook to fetch from ref_development_types table
  return useReferenceOptions('ref_technologies');
};
