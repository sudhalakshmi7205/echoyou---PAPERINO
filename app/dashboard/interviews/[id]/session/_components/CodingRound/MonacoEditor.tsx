import Editor from "@monaco-editor/react"

export default function MonacoEditor({
  language,
  code,
  onChange
}: {
  language: string
  code: string
  onChange: (value: string | undefined) => void
}) {
  return (
    <div className="flex-1 overflow-hidden">
      <Editor
        height="100%"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "var(--font-mono), monospace",
          lineHeight: 24,
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
        }}
      />
    </div>
  )
}
