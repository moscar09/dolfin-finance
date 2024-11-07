import { Injectable } from '@nestjs/common';
import JSZip from 'jszip';

@Injectable()
export class StatementFileUploadParserService {
  private async handleZipFile(file: Express.Multer.File): Promise<string[]> {
    const zipData = await JSZip.loadAsync(file.buffer);
    return Promise.all(
      Object.values(zipData.files).map(async (file) =>
        (await file.async('string')).trim()
      )
    );
  }

  async handleFile(file: Express.Multer.File): Promise<string[]> {
    if (file.mimetype === 'application/zip') {
      return this.handleZipFile(file);
    } else {
      return [file.buffer.toString('utf8')];
    }
  }
}
