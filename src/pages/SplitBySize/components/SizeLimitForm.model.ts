export interface SizeLimitFormProps {
  fileSizeBytes: number;
  onSubmit: (limitMB: number) => void;
}
