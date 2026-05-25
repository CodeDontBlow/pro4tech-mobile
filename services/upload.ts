import api from './api';
import { Platform } from 'react-native';

export type UploadedAttachment = {
  url: string;
  key: string;
  originalName: string;
  mimeType: string;
  size: number;
};

export type LocalAttachment = {
  uri: string;
  name: string;
  mimeType?: string | null;
  file?: File | null;
};

export async function uploadChatAttachments(
  ticketId: string,
  files: LocalAttachment[],
): Promise<UploadedAttachment[]> {
  const formData = new FormData();
  files.forEach((file) => {
    if (Platform.OS === 'web' && file.file) {
      formData.append('files', file.file, file.name);
      return;
    }

    formData.append('files', {
      uri: file.uri,
      name: file.name,
      type: file.mimeType ?? 'application/octet-stream',
    } as any);
  });

  const response = await api.post(`/chat/${ticketId}/attachments`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.attachments ?? [];
}
