import Editor from '@monaco-editor/react';
import { theme } from 'antd';
import React, { useCallback, useRef } from 'react';

const { useToken } = theme;

interface MonacoEditorProps {
  language?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number | string;
  readOnly?: boolean;
  style?: React.CSSProperties;
}

const MonacoEditor: React.FC<MonacoEditorProps> = ({
  language = 'javascript',
  value = '',
  onChange,
  placeholder = '请输入代码...',
  height = 200,
  readOnly = false,
  style,
}) => {
  const { token } = useToken();
  const editorRef = useRef<any>(null);

  const handleKeyDownCapture = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // 阻止空格键事件向外层组件传播，避免被拦截
    if (e.key === ' ' || e.code === 'Space') {
      e.stopPropagation();
    }
  }, []);

  const handleKeyUpCapture = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ' || e.code === 'Space') {
      e.stopPropagation();
    }
  }, []);

  const handleScriptChange = useCallback(
    (newScript: string | undefined) => {
      if (onChange) {
        onChange(newScript || '');
      }
    },
    [onChange],
  );

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    // 自定义主题配置，包含当前行高亮
    monaco.editor.defineTheme('custom-theme', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'scrollbar.shadow': 'transparent',
        'scrollbarSlider.background': '#c1c1c1',
        'scrollbarSlider.hoverBackground': '#a8a8a8',
        'scrollbarSlider.activeBackground': '#a8a8a8',
        'editorLineNumber.foreground': '#999999',
        'editorLineNumber.activeForeground': '#1890ff', // 当前行号颜色
        'editor.lineHighlightBackground': '#ffffff', // 当前行背景色设为白色
        'editor.lineHighlightBorder': 'transparent', // 当前行边框色
        'editorCursor.foreground': '#1890ff', // 光标颜色
        'editor.background': '#ffffff', // 编辑器背景色
      },
    });

    monaco.editor.setTheme('custom-theme');
  };

  return (
    <div style={style} onKeyDownCapture={handleKeyDownCapture} onKeyUpCapture={handleKeyUpCapture}>
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleScriptChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          tabSize: 2,
          wordWrap: 'on',
          automaticLayout: true,
          scrollBeyondLastLine: false,
          fontFamily: 'Monaco, Menlo, Consolas, "Courier New", monospace',
          lineNumbers: 'on',
          lineNumbersMinChars: 3,
          glyphMargin: false,
          folding: false,
          lineDecorationsWidth: 5,
          // 当前行配置
          renderLineHighlight: 'none', // 完全禁用当前行高亮
          renderLineHighlightOnlyWhenFocus: false, // 即使失去焦点也显示当前行高亮
          cursorBlinking: 'blink', // 光标闪烁样式: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid'
          cursorStyle: 'line', // 光标样式: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin'
          cursorWidth: 2, // 光标宽度
          scrollbar: {
            vertical: 'auto',
            horizontal: 'auto',
            verticalScrollbarSize: 4,
            horizontalScrollbarSize: 8,
            verticalSliderSize: 4,
            horizontalSliderSize: 8,
          },
        }}
      />
    </div>
  );
};

export default MonacoEditor;
