export interface DropZoneProps {
  accept: string;
  label: string;
  onFilesSelected: (files: File[]) => void;
  multiple?: boolean;
  helperText?: string;
}
