"use client";
import React, { useCallback } from "react";
// => Tiptap packages
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import Heading from "@tiptap/extension-heading";
import { Color } from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import HardBreak from "@tiptap/extension-hard-break";
// Custom
import { cn } from "@/lib/utils";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  BoldIcon,
  Braces,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Link2,
  Link2Off,
  LucideItalic,
  RotateCcw,
  RotateCw,
  Strikethrough,
  UnderlineIcon,
  WrapTextIcon,
} from "lucide-react";
import { Hint } from "./hint";
import useCreateJob from "@/store/useCreateJob";
import { Separator } from "./ui/separator";

const Tiptap = () => {
  const setdescription = useCreateJob((state) => state.setDescription);
  const content = useCreateJob((state) => state.job_description);
  const editor = useEditor({
    extensions: [
      Document,
      Text,
      TextStyle,
      History,
      Paragraph,
      Color,

      Link.configure({
        openOnClick: true,
        autolink: true,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Highlight.configure({ multicolor: true }),
      Bold,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder:
          "Describe the job in detail, including qualifications, role overview, and benefits . . .",
      }),
      Italic,
      Strike,
      HardBreak,
      Code,
    ],
    content,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setdescription(html);
    },
  }) as Editor;

  const saveLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);
    if (url) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url, target: "_blank" })
        .run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
  }, [editor]);

  const removeLink = useCallback(() => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  }, [editor]);

  const toggleBold = useCallback(() => {
    editor.chain().focus().toggleBold().run();
  }, [editor]);

  const toggleUnderline = useCallback(() => {
    editor.chain().focus().toggleUnderline().run();
  }, [editor]);

  const toggleItalic = useCallback(() => {
    editor.chain().focus().toggleItalic().run();
  }, [editor]);

  const toggleStrike = useCallback(() => {
    editor.chain().focus().toggleStrike().run();
  }, [editor]);

  const toggleCode = useCallback(() => {
    editor.chain().focus().toggleCode().run();
  }, [editor]);

  const toggleHighlight = useCallback(() => {
    editor.chain().focus().toggleHighlight({ color: "#8ce99a" }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div
      className="editor"
      style={{
        borderStyle: "solid",
        borderColor: "#16a34a",
        borderWidth: "2px",
        borderRadius: "10px",
      }}
    >
      <div className="border-green-600 w-full flex flex-wrap justify-start items-center mr-4 border-2 gap-2 p-1 border-x-0 border-t-0 ">
        <Hint asChild label="Undo">
          <button
            className="menu-button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <RotateCcw />
          </button>
        </Hint>

        <Hint asChild label="Redo">
          <button
            className={cn("menu-button", {
              disabled: !editor.isActive("link"),
            })}
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <RotateCw />
          </button>
        </Hint>

        <input
          type="color"
          onInput={(event) =>
            editor
              .chain()
              .focus()
              .setColor((event.target as HTMLInputElement).value)
              .run()
          }
          value={editor.getAttributes("textStyle").color}
          data-testid="setColor"
        />

        <Separator className="h-[32px]" orientation="vertical" />
        <Hint asChild label="Bold">
          <button
            className={cn("menu-button", {
              "is-active": editor.isActive("bold"),
            })}
            onClick={toggleBold}
          >
            <BoldIcon />
          </button>
        </Hint>
        <Hint asChild label="Underline">
          <button
            className={cn("menu-button", {
              "is-active": editor.isActive("underline"),
            })}
            onClick={toggleUnderline}
          >
            <UnderlineIcon />
          </button>
        </Hint>
        <Hint asChild label="Italic">
          <button
            className={cn("menu-button", {
              "is-active": editor.isActive("intalic"),
            })}
            onClick={toggleItalic}
          >
            <LucideItalic />
          </button>
        </Hint>

        <Separator className="h-[32px]" orientation="vertical" />
        <Hint asChild label="Line-Break">
          <button
            className="menu-button"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <WrapTextIcon />
          </button>
        </Hint>
        <Hint asChild label="Highlight">
          <button
            onClick={toggleHighlight}
            className={cn("menu-button", {
              "is-active": editor.isActive("highlight"),
            })}
          >
            <Highlighter />
          </button>
        </Hint>
        <Hint asChild label="Strike">
          <button
            className={cn("menu-button", {
              "is-active": editor.isActive("strike"),
            })}
            onClick={toggleStrike}
          >
            <Strikethrough />
          </button>
        </Hint>
        <Hint asChild label="Code">
          <button
            className={cn("menu-button", {
              "is-active": editor.isActive("code"),
            })}
            onClick={toggleCode}
          >
            <Braces />
          </button>
        </Hint>

        <Separator className="h-[32px]" orientation="vertical" />
        <Hint asChild label="H1">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={cn("menu-button", {
              "is-active": editor.isActive("heading", { level: 1 }),
            })}
          >
            <Heading1 />
          </button>
        </Hint>
        <Hint asChild label="H2">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={cn("menu-button", {
              "is-active": editor.isActive("heading", { level: 2 }),
            })}
          >
            <Heading2 />
          </button>
        </Hint>
        <Hint asChild label="H3">
          <button
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={cn("menu-button", {
              "is-active": editor.isActive("heading", { level: 3 }),
            })}
          >
            <Heading3 />
          </button>
        </Hint>

        <Separator className="h-[32px]" orientation="vertical" />
        <Hint asChild label="Link">
          <button
            onClick={saveLink}
            className={cn("menu-button", {
              "is-active": editor.isActive("link"),
            })}
          >
            <Link2 />
          </button>
        </Hint>
        <button
          className={cn("menu-button", {
            "is-active": editor.isActive("link"),
            disabled: !editor.isActive("link"),
          })}
          onClick={removeLink}
          disabled={!editor.isActive("link")}
        >
          <Link2Off />
        </button>

        <Separator className="h-[32px]" orientation="vertical" />
        <Hint asChild label="Left-Align">
          <button
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={cn("menu-button", {
              "is-active": editor.isActive({ textAlign: "left" }),
            })}
          >
            <AlignLeft />
          </button>
        </Hint>
        <Hint asChild label="Center">
          <button
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={cn("menu-button", {
              "is-active": editor.isActive({ textAlign: "center" }),
            })}
          >
            <AlignCenter />
          </button>
        </Hint>
        <Hint asChild label="Right-Align">
          <button
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={cn("menu-button", {
              "is-active": editor.isActive({ textAlign: "right" }),
            })}
          >
            <AlignRight />
          </button>
        </Hint>

        <Hint asChild label="Justify">
          <button
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={cn("menu-button", {
              "is-active": editor.isActive({ textAlign: "justify" }),
            })}
          >
            <AlignJustify />
          </button>
        </Hint>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
