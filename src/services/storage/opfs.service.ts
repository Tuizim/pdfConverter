import { OPFS_SESSION_DIR_NAME } from '@/constants/storage.constants';

async function getSessionDirectory(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return root.getDirectoryHandle(OPFS_SESSION_DIR_NAME, { create: true });
}

export async function writeFileToOpfs(fileName: string, source: File): Promise<void> {
  try {
    const dir = await getSessionDirectory();
    const handle = await dir.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    await source.stream().pipeTo(writable);
  } catch (error) {
    console.error('[opfs.service] falha ao gravar arquivo temporário', error);
    throw new Error('Não foi possível preparar o arquivo grande para processamento.');
  }
}

export async function readFileFromOpfs(fileName: string): Promise<File> {
  try {
    const dir = await getSessionDirectory();
    const handle = await dir.getFileHandle(fileName);
    return await handle.getFile();
  } catch (error) {
    console.error('[opfs.service] falha ao ler arquivo temporário', error);
    throw new Error('Não foi possível recuperar o arquivo temporário processado.');
  }
}

export async function removeFileFromOpfs(fileName: string): Promise<void> {
  const dir = await getSessionDirectory();
  await dir.removeEntry(fileName).catch(() => undefined);
}

export async function clearOpfsSession(): Promise<void> {
  const root = await navigator.storage.getDirectory();
  await root.removeEntry(OPFS_SESSION_DIR_NAME, { recursive: true }).catch(() => undefined);
}
