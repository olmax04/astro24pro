'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from 'lucide-react'

// Если у тебя нет утилиты cn, удали импорт выше и раскомментируй эту функцию:
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }

interface RichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export const RichEditor = ({ value, onChange, placeholder }: RichEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || 'Начните писать...',
      }),
    ],
    // Важно: настраиваем стили редактора (tailwind typography аналог)
    editorProps: {
      attributes: {
        class:
          'prose prose-invert max-w-none text-white focus:outline-none min-h-[150px] px-4 py-3 text-sm leading-relaxed [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5',
      },
    },
    content: value,
    onUpdate: ({ editor }) => {
      // Сохраняем как HTML строку, чтобы Payload принял это в textarea
      onChange(editor.getHTML())
    },
  })

  if (!editor) {
    return null
  }

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-slate-950 focus-within:border-amber-500/50 transition-colors">
      {/* Тулбар */}
      <div className="flex items-center gap-1 p-2 border-b border-white/5 bg-slate-900/50 flex-wrap">
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon={<Bold size={16} />}
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon={<Italic size={16} />}
        />
        <div className="w-px h-4 bg-white/10 mx-1"></div>
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon={<List size={16} />}
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon={<ListOrdered size={16} />}
        />
        <ToolbarBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon={<Quote size={16} />}
        />
        <div className="ml-auto flex items-center gap-1">
          <ToolbarBtn
            onClick={() => editor.chain().focus().undo().run()}
            icon={<Undo size={14} />}
          />
          <ToolbarBtn
            onClick={() => editor.chain().focus().redo().run()}
            icon={<Redo size={14} />}
          />
        </div>
      </div>

      {/* Поле ввода */}
      <EditorContent editor={editor} />
    </div>
  )
}

const ToolbarBtn = ({
  onClick,
  isActive,
  icon,
}: {
  onClick: () => void
  isActive?: boolean
  icon: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'p-2 rounded-lg transition-colors text-slate-400 hover:text-white hover:bg-white/10',
      isActive && 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 hover:text-amber-400',
    )}
  >
    {icon}
  </button>
)
