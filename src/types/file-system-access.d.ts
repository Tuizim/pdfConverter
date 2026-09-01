export {};

// TypeScript's lib.dom.d.ts (5.9) still doesn't ship the File System Access
// picker APIs, only the OPFS/FileSystemFileHandle parts they share. This
// declares just the surface this project actually calls.
declare global {
  interface SaveFilePickerOptions {
    suggestedName?: string;
    types?: Array<{
      description?: string;
      accept: Record<string, string[]>;
    }>;
  }

  interface Window {
    showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>;
  }
}
