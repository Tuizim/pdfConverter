import type { SplitPagesMode } from '../SplitByPages.model';

export interface ModeSwitchProps {
  mode: SplitPagesMode;
  onChange: (mode: SplitPagesMode) => void;
}
