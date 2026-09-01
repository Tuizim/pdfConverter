import type { CancelToken } from '@/models/cancel-token.model';
import type {
  JpgToPdfProgress,
  JpgToPdfWorkerInput,
  JpgToPdfWorkerResult,
} from '@/models/jpg-to-pdf.model';
import type { MergeProgress, MergeWorkerInput, MergeWorkerResult } from '@/models/merge.model';
import type {
  PageGroupRequest,
  SplitByPagesProgress,
  SplitBySizeProgress,
  SplitBySizeRunResult,
  SplitOutputFile,
  SplitWorkerInput,
} from '@/models/split.model';

export interface PdfWorkerApi {
  mergePdfs(
    inputs: MergeWorkerInput[],
    onProgress: (progress: MergeProgress) => void,
    cancelToken: CancelToken,
  ): Promise<MergeWorkerResult>;

  extractPageGroups(
    input: SplitWorkerInput,
    groups: PageGroupRequest[],
    onProgress: (progress: SplitByPagesProgress) => void,
    cancelToken: CancelToken,
  ): Promise<SplitOutputFile[]>;

  splitBySize(
    input: SplitWorkerInput,
    limitBytes: number,
    onProgress: (progress: SplitBySizeProgress) => void,
    cancelToken: CancelToken,
  ): Promise<SplitBySizeRunResult>;

  jpgsToPdf(
    inputs: JpgToPdfWorkerInput[],
    onProgress: (progress: JpgToPdfProgress) => void,
    cancelToken: CancelToken,
  ): Promise<JpgToPdfWorkerResult>;
}
