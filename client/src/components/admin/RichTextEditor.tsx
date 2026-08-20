import { useCallback, useEffect, useRef } from "react";
import { plainTextToHtml } from "../../features/news/sanitize";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  onUploadImage?: (file: File) => Promise<string>;
  dir?: "ltr" | "rtl";
}

function ToolbarButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border border-neutral-300 bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-700 hover:border-neutral-900"
    >
      {label}
    </button>
  );
}

export function RichTextEditor({ value, onChange, onUploadImage, dir = "ltr" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const lastValueRef = useRef("");

  const syncFromEditor = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? "";
    lastValueRef.current = html;
    onChange(html);
  }, [onChange]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const html = plainTextToHtml(value);
    if (html !== lastValueRef.current && html !== editor.innerHTML) {
      editor.innerHTML = html;
      lastValueRef.current = html;
    }
  }, [value]);

  function exec(command: string, arg?: string) {
    editorRef.current?.focus();
    document.execCommand(command, false, arg);
    syncFromEditor();
  }

  function addLink() {
    const url = window.prompt("Link URL");
    if (!url) return;
    exec("createLink", url);
  }

  async function handleImagePick(file: File | undefined) {
    if (!file || !onUploadImage) return;
    try {
      const url = await onUploadImage(file);
      editorRef.current?.focus();
      document.execCommand("insertImage", false, url);
      syncFromEditor();
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Image upload failed.");
    }
  }

  return (
    <div className="border border-neutral-300 bg-white">
      <div className="flex flex-wrap gap-2 border-b border-neutral-200 bg-neutral-50 p-2">
        <ToolbarButton label="Bold" onClick={() => exec("bold")} />
        <ToolbarButton label="Italic" onClick={() => exec("italic")} />
        <ToolbarButton label="H2" onClick={() => exec("formatBlock", "h2")} />
        <ToolbarButton label="List" onClick={() => exec("insertUnorderedList")} />
        <ToolbarButton label="Link" onClick={addLink} />
        {onUploadImage ? (
          <>
            <ToolbarButton label="Image" onClick={() => fileRef.current?.click()} />
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                void handleImagePick(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </>
        ) : null}
      </div>
      <div
        ref={editorRef}
        dir={dir}
        contentEditable
        suppressContentEditableWarning
        onInput={syncFromEditor}
        className="j-rich-editor min-h-[220px] px-3 py-3 text-sm leading-relaxed text-neutral-900 outline-none"
      />
    </div>
  );
}
