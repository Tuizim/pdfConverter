export interface ProgressBarProps {
  label: string;
  current: number;
  total: number;
  onCancel?: () => void;
}
