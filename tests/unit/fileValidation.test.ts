import { describe, it, expect } from 'vitest';
import { isAcceptedTableFile } from '@/utils/fileValidation';

const f = (name: string, type = ''): File => ({ name, type } as unknown as File);

describe('isAcceptedTableFile', () => {
  it('accepts .md regardless of case', () => {
    expect(isAcceptedTableFile(f('table.MD'))).toBe(true);
  });

  it('accepts .markdown and .txt', () => {
    expect(isAcceptedTableFile(f('notes.markdown'))).toBe(true);
    expect(isAcceptedTableFile(f('notes.txt'))).toBe(true);
  });

  it('accepts any text/* mime type regardless of extension', () => {
    expect(isAcceptedTableFile(f('data', 'text/plain'))).toBe(true);
  });

  it('rejects an unsupported extension with no text/* mime type', () => {
    expect(isAcceptedTableFile(f('photo.png', 'image/png'))).toBe(false);
  });

  it('rejects a file with no extension and no mime type', () => {
    expect(isAcceptedTableFile(f('README'))).toBe(false);
  });
});
