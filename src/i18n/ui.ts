/**
 * Preact アイランド（クライアント UI）の文言。ロケール別。
 * ページレベル content (`en.ts` / `ja.ts`) とは別に、インタラクティブな
 * アイランドが表示する文字列をここに集約する。
 *
 * 重要: アイランドは locale を PROP で受け取り（SSR 時に存在）、
 * `document` 等から読まない。SSR とクライアントで同一文字列を描画して
 * hydration mismatch を防ぐ。
 *
 * 補間文字列は `{name}` / `{n}` のテンプレートを持ち、
 * アイランド側で `.replace('{name}', x)` する。
 */
export const ui = {
  en: {
    // MarkdownTableEditor — import
    importHeading: 'Import a Markdown table',
    importSubtitle:
      'Paste a GFM Markdown table and click Import to load it into the grid below — this replaces the current table. Or just start typing in the grid.',
    importPlaceholder: '| Column A | Column B |\n| --- | --- |\n| value | value |',
    importButton: 'Import',
    clearImport: 'Clear',
    errImportInvalid:
      "Couldn't find a valid table. It needs a header row followed by a separator row, e.g. | --- | --- |",
    errUnsupportedImportFile: '{name} is not a Markdown or text file.',

    // MarkdownTableEditor — grid
    gridHeading: 'Table',
    gridSubtitle: 'Click a cell to edit it. Tab/Enter/arrow keys move between cells.',
    gridAria: 'Markdown table editor',
    rowControlsHeader: 'Row controls',
    headerCellAria: 'Column {n} header',
    cellAria: 'Row {row}, column {col}',
    alignLabel: 'Alignment for column {n}',
    alignLeft: 'Left',
    alignCenter: 'Center',
    alignRight: 'Right',
    removeColumnAria: 'Remove column {n}',
    removeRowAria: 'Remove row {n}',
    addRow: 'Add row',
    addColumn: 'Add column',
    startOver: 'Start over',

    // MarkdownTableEditor — output
    outputHeading: 'Markdown',
    outputHint: 'Always re-aligned to a clean, pipe-aligned GFM table.',
    copyMarkdown: 'Copy Markdown',
    copied: 'Copied!',
    copyFailed: 'Could not copy — select the text above and copy it manually.',
    downloadMd: 'Download .md',
    notificationsAria: 'Notifications',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // GlobalDropZone
    dzProcessing: 'Adding {count} file(s)...',
    dzPleaseWait: 'Please wait',
    dzDropTitle: 'Drop a Markdown or text file to import it',
    dzDropSub: 'It will replace the current table',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    close: 'Close',
    required: 'Required',
  },
  ja: {
    // MarkdownTableEditor — import
    importHeading: 'Markdown テーブルを読み込む',
    importSubtitle:
      'GFM Markdown のテーブルを貼り付けて「読み込む」を押すと、下のグリッドに反映されます（現在の内容は置き換わります）。もちろんグリッドに直接入力して作り始めても構いません。',
    importPlaceholder: '| 列A | 列B |\n| --- | --- |\n| 値 | 値 |',
    importButton: '読み込む',
    clearImport: 'クリア',
    errImportInvalid:
      '有効なテーブルが見つかりませんでした。ヘッダー行の次に区切り行（例: | --- | --- |）が必要です。',
    errUnsupportedImportFile: '{name} は Markdown/テキストファイルではありません。',

    // MarkdownTableEditor — grid
    gridHeading: 'テーブル',
    gridSubtitle: 'セルをクリックして編集します。Tab / Enter / 矢印キーでセル間を移動できます。',
    gridAria: 'Markdown テーブルエディタ',
    rowControlsHeader: '行の操作',
    headerCellAria: '{n} 列目の見出し',
    cellAria: '{row} 行目、{col} 列目',
    alignLabel: '{n} 列目の配置',
    alignLeft: '左揃え',
    alignCenter: '中央揃え',
    alignRight: '右揃え',
    removeColumnAria: '{n} 列目を削除',
    removeRowAria: '{n} 行目を削除',
    addRow: '行を追加',
    addColumn: '列を追加',
    startOver: '最初からやり直す',

    // MarkdownTableEditor — output
    outputHeading: 'Markdown',
    outputHint: '常にパイプの位置が揃った、整形済みの GFM テーブルとして出力されます。',
    copyMarkdown: 'Markdown をコピー',
    copied: 'コピーしました！',
    copyFailed: 'コピーできませんでした。上のテキストを選択して手動でコピーしてください。',
    downloadMd: '.md をダウンロード',
    notificationsAria: '通知',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // GlobalDropZone
    dzProcessing: '{count} 件のファイルを追加中…',
    dzPleaseWait: 'お待ちください',
    dzDropTitle: 'Markdown/テキストファイルをドロップして読み込む',
    dzDropSub: '現在のテーブルは置き換わります',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    close: '閉じる',
    required: '必須',
  },
  zh: {
    // MarkdownTableEditor — import
    importHeading: '导入 Markdown 表格',
    importSubtitle: '粘贴 GFM Markdown 表格并点击“导入”，即可加载到下方的表格中（会替换当前内容）。你也可以直接在表格中输入来从零开始。',
    importPlaceholder: '| 列A | 列B |\n| --- | --- |\n| 值 | 值 |',
    importButton: '导入',
    clearImport: '清除',
    errImportInvalid: '未找到有效的表格。需要一行表头，紧接着一行分隔符，例如 | --- | --- |',
    errUnsupportedImportFile: '{name} 不是 Markdown 或文本文件。',

    // MarkdownTableEditor — grid
    gridHeading: '表格',
    gridSubtitle: '点击单元格进行编辑。使用 Tab / Enter / 方向键在单元格之间移动。',
    gridAria: 'Markdown 表格编辑器',
    rowControlsHeader: '行操作',
    headerCellAria: '第 {n} 列表头',
    cellAria: '第 {row} 行，第 {col} 列',
    alignLabel: '第 {n} 列对齐方式',
    alignLeft: '左对齐',
    alignCenter: '居中',
    alignRight: '右对齐',
    removeColumnAria: '删除第 {n} 列',
    removeRowAria: '删除第 {n} 行',
    addRow: '添加行',
    addColumn: '添加列',
    startOver: '重新开始',

    // MarkdownTableEditor — output
    outputHeading: 'Markdown',
    outputHint: '始终输出对齐整齐、竖线对齐的 GFM 表格。',
    copyMarkdown: '复制 Markdown',
    copied: '已复制！',
    copyFailed: '无法复制——请手动选择上方文本并复制。',
    downloadMd: '下载 .md',
    notificationsAria: '通知',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // GlobalDropZone
    dzProcessing: '正在添加 {count} 个文件…',
    dzPleaseWait: '请稍候',
    dzDropTitle: '拖放 Markdown 或文本文件以导入',
    dzDropSub: '将替换当前表格',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    close: '关闭',
    required: '必填',
  },
  de: {
    // MarkdownTableEditor — import
    importHeading: 'Markdown-Tabelle importieren',
    importSubtitle:
      'Füge eine GFM-Markdown-Tabelle ein und klicke auf "Importieren", um sie in das Raster unten zu laden — das ersetzt die aktuelle Tabelle. Oder beginne einfach direkt im Raster zu tippen.',
    importPlaceholder: '| Spalte A | Spalte B |\n| --- | --- |\n| Wert | Wert |',
    importButton: 'Importieren',
    clearImport: 'Leeren',
    errImportInvalid:
      'Keine gültige Tabelle gefunden. Es braucht eine Kopfzeile, gefolgt von einer Trennzeile, z. B. | --- | --- |',
    errUnsupportedImportFile: '{name} ist keine Markdown- oder Textdatei.',

    // MarkdownTableEditor — grid
    gridHeading: 'Tabelle',
    gridSubtitle: 'Klicke eine Zelle an, um sie zu bearbeiten. Tab/Enter/Pfeiltasten bewegen zwischen Zellen.',
    gridAria: 'Markdown-Tabelleneditor',
    rowControlsHeader: 'Zeilensteuerung',
    headerCellAria: 'Kopfzeile Spalte {n}',
    cellAria: 'Zeile {row}, Spalte {col}',
    alignLabel: 'Ausrichtung für Spalte {n}',
    alignLeft: 'Links',
    alignCenter: 'Zentriert',
    alignRight: 'Rechts',
    removeColumnAria: 'Spalte {n} entfernen',
    removeRowAria: 'Zeile {n} entfernen',
    addRow: 'Zeile hinzufügen',
    addColumn: 'Spalte hinzufügen',
    startOver: 'Neu beginnen',

    // MarkdownTableEditor — output
    outputHeading: 'Markdown',
    outputHint: 'Immer als sauber ausgerichtete GFM-Tabelle mit bündigen Pipes ausgegeben.',
    copyMarkdown: 'Markdown kopieren',
    copied: 'Kopiert!',
    copyFailed: 'Konnte nicht kopiert werden — markiere den Text oben und kopiere ihn manuell.',
    downloadMd: '.md herunterladen',
    notificationsAria: 'Benachrichtigungen',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // GlobalDropZone
    dzProcessing: '{count} Datei(en) werden hinzugefügt …',
    dzPleaseWait: 'Bitte warten',
    dzDropTitle: 'Markdown- oder Textdatei zum Importieren ablegen',
    dzDropSub: 'Ersetzt die aktuelle Tabelle',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    close: 'Schließen',
    required: 'Erforderlich',
  },
  es: {
    // MarkdownTableEditor — import
    importHeading: 'Importar una tabla Markdown',
    importSubtitle:
      'Pega una tabla Markdown GFM y haz clic en "Importar" para cargarla en la cuadrícula de abajo — esto reemplaza la tabla actual. O simplemente empieza a escribir en la cuadrícula.',
    importPlaceholder: '| Columna A | Columna B |\n| --- | --- |\n| valor | valor |',
    importButton: 'Importar',
    clearImport: 'Borrar',
    errImportInvalid:
      'No se encontró una tabla válida. Se necesita una fila de encabezado seguida de una fila separadora, p. ej. | --- | --- |',
    errUnsupportedImportFile: '{name} no es un archivo Markdown o de texto.',

    // MarkdownTableEditor — grid
    gridHeading: 'Tabla',
    gridSubtitle: 'Haz clic en una celda para editarla. Tab/Intro/flechas mueven entre celdas.',
    gridAria: 'Editor de tablas Markdown',
    rowControlsHeader: 'Controles de fila',
    headerCellAria: 'Encabezado de columna {n}',
    cellAria: 'Fila {row}, columna {col}',
    alignLabel: 'Alineación de la columna {n}',
    alignLeft: 'Izquierda',
    alignCenter: 'Centro',
    alignRight: 'Derecha',
    removeColumnAria: 'Eliminar columna {n}',
    removeRowAria: 'Eliminar fila {n}',
    addRow: 'Añadir fila',
    addColumn: 'Añadir columna',
    startOver: 'Empezar de nuevo',

    // MarkdownTableEditor — output
    outputHeading: 'Markdown',
    outputHint: 'Siempre se reordena a una tabla GFM limpia y con las barras alineadas.',
    copyMarkdown: 'Copiar Markdown',
    copied: '¡Copiado!',
    copyFailed: 'No se pudo copiar — selecciona el texto de arriba y cópialo manualmente.',
    downloadMd: 'Descargar .md',
    notificationsAria: 'Notificaciones',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // GlobalDropZone
    dzProcessing: 'Añadiendo {count} archivo(s)...',
    dzPleaseWait: 'Espera un momento',
    dzDropTitle: 'Suelta un archivo Markdown o de texto para importarlo',
    dzDropSub: 'Reemplazará la tabla actual',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    close: 'Cerrar',
    required: 'Obligatorio',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
