import type { SplitBySizeWarningInfo } from '@/models/split.model';

export interface SizeWarningsBannerProps {
  warnings: SplitBySizeWarningInfo[];
  limitMB: number;
}
