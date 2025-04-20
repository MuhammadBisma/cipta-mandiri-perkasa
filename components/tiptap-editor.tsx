"use client"

import type React from "react"
import { useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import BulletList from "@tiptap/extension-bullet-list"
import OrderedList from "@tiptap/extension-ordered-list"
import ListItem from "@tiptap/extension-list-item"
import Paragraph from "@tiptap/extension-paragraph"
import { Button } from "@/components/ui/button"
import { List, ListOrdered, Pilcrow } from "lucide-react"

interface TipTapEditorProps {
  initialContent?: string
  onChange: (html: string) => void
}

const TipTapEditor: React.FC<TipTapEditorProps> = ({ initialContent = "<p>Hello World!</p>", onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        paragraph: false,
      }),
      Paragraph,
      BulletList,
      OrderedList,
      ListItem,
    ],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  const handleParagraphClick = useCallback(() => {
    editor?.chain().focus().setParagraph().run()
  }, [editor])

  const handleBulletListClick = useCallback(() => {
    editor?.chain().focus().toggleBulletList().run()
  }, [editor])

  const handleOrderedListClick = useCallback(() => {
    editor?.chain().focus().toggleOrderedList().run()
  }, [editor])

  if (!editor) {
    return null
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 p-2 border-b">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "bg-accent" : ""}
        >
          <Pilcrow className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-accent" : ""}
        >
          <List className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-accent" : ""}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}

export default TipTapEditor
