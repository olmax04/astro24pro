'use client'

import React from 'react'
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { HeadingNode, QuoteNode } from '@lexical/rich-text'
import { ListItemNode, ListNode } from '@lexical/list'
// 1. ДОБАВЛЯЕМ ИМПОРТЫ ЗДЕСЬ:
import { FORMAT_TEXT_COMMAND, UNDO_COMMAND, REDO_COMMAND } from 'lexical'
import { Bold, Italic, Undo, Redo } from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const editorTheme = {
  paragraph: 'mb-2 text-slate-300',
  list: {
    ul: 'list-disc ml-4 mb-2 text-slate-300',
    ol: 'list-decimal ml-4 mb-2 text-slate-300',
    listitem: 'pl-1',
  },
  text: {
    bold: 'font-bold text-white',
    italic: 'italic text-amber-200',
    underline: 'underline',
  },
}

const Toolbar = () => {
  const [editor] = useLexicalComposerContext()

  const formatText = (format: 'bold' | 'italic') => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)
  }

  return (
    <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-slate-900/50">
      <ToolbarBtn onClick={() => formatText('bold')} icon={<Bold size={16} />} />
      <ToolbarBtn onClick={() => formatText('italic')} icon={<Italic size={16} />} />
      <div className="w-px h-4 bg-white/10 mx-1" />

      {/* 2. ИСПРАВЛЯЕМ ИСПОЛЬЗОВАНИЕ ЗДЕСЬ (Убрали require): */}
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
        icon={<Undo size={14} />}
      />
      <ToolbarBtn
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
        icon={<Redo size={14} />}
      />
    </div>
  )
}

const ToolbarBtn = ({ onClick, icon }: any) => (
  <button
    type="button"
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
  >
    {icon}
  </button>
)

interface LexicalEditorProps {
  value: any
  onChange: (editorState: any) => void
}

export const LexicalEditor = ({ value, onChange }: LexicalEditorProps) => {
  // Безопасная фильтрация узлов (как мы обсуждали ранее)
  const safeNodes = [HeadingNode, QuoteNode, ListNode, ListItemNode].filter(
    (node) => node !== undefined,
  )

  const initialConfig = {
    namespace: 'ProfileEditor',
    theme: editorTheme,
    onError: (e: any) => console.error(e),
    editorState: value && Object.keys(value).length > 0 ? JSON.stringify(value) : undefined,
    nodes: safeNodes,
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-950 focus-within:border-amber-500/50 transition-colors relative">
      <LexicalComposer initialConfig={initialConfig}>
        <Toolbar />

        <div className="relative min-h-[150px]">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="px-4 py-3 min-h-[150px] outline-none text-sm text-slate-300" />
            }
            placeholder={
              <div className="absolute top-3 left-4 text-slate-600 pointer-events-none text-sm">
                Расскажите о себе...
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />

          {/* Рендерим плагин списка ТОЛЬКО если узлы списка загрузились */}
          {ListNode && ListItemNode && <ListPlugin />}

          <OnChangePlugin
            onChange={(editorState) => {
              const json = editorState.toJSON()
              onChange(json)
            }}
          />
        </div>
      </LexicalComposer>
    </div>
  )
}
