/**
 * Accept-list for the optional "drop/paste a file to import" path (GlobalDropZone).
 * The primary import flow is pasting text into the textarea; dropping a plain-text
 * file with the table in it is a bonus shortcut, so the list is intentionally
 * generous about what counts as "text" (Markdown, plain text, or an unlabeled
 * extension that a browser reports as `text/*`).
 */
const ALLOWED_EXTENSIONS = ['.md', '.markdown', '.txt'];
const ALLOWED_MIME_PREFIX = 'text/';

export function isAcceptedTableFile(file: File): boolean {
  if (file.type && file.type.startsWith(ALLOWED_MIME_PREFIX)) return true;
  const dot = file.name.lastIndexOf('.');
  if (dot < 0) return false;
  return ALLOWED_EXTENSIONS.includes(file.name.slice(dot).toLowerCase());
}
