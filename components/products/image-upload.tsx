"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_SIZE } from "@/lib/validations";

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onImageSelect: (file: File) => void;
  onImageRemove: () => void;
  previewUrl?: string | null;
  disabled?: boolean;
}

export function ImageUpload({
  currentImageUrl,
  onImageSelect,
  onImageRemove,
  previewUrl,
  disabled,
}: ImageUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [dragOver, setDragOver] = React.useState(false);

  const displayUrl = previewUrl || currentImageUrl;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSelect(file);
  }

  function validateAndSelect(file: File) {
    setError(null);

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setError("Only JPG, JPEG, PNG, and WebP images are allowed");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setError("Image must be less than 5MB");
      return;
    }

    onImageSelect(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndSelect(file);
  }

  return (
    <div className="space-y-3">
      {displayUrl ? (
        <div className="space-y-4">
          <div className="group relative aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-stone-200/60 bg-stone-50 shadow-sm dark:border-stone-700/60 dark:bg-stone-800/50">
            <img
              src={displayUrl}
              alt="Product preview"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={disabled}
            >
              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              Change
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onImageRemove}
              disabled={disabled}
              className="text-red-500 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950"
            >
              <svg className="h-3.5 w-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`flex aspect-[4/3] w-full max-w-xs cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
            dragOver
              ? "border-stone-400 bg-stone-100 dark:border-stone-500 dark:bg-stone-800"
              : "border-stone-200 bg-stone-50/50 hover:border-stone-300 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-800/30 dark:hover:border-stone-600 dark:hover:bg-stone-800/50"
          }`}
        >
          <svg
            className="mb-3 h-8 w-8 text-stone-300 dark:text-stone-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
            />
          </svg>
          <span className="text-sm font-medium text-stone-500 dark:text-stone-400">
            Upload Product Image
          </span>
          <span className="mt-1.5 text-[11px] text-stone-400 dark:text-stone-500">
            Drag &amp; drop or click &middot; JPG, PNG, WebP &middot; Max 5MB
          </span>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
      />
      {error && (
        <p className="text-sm text-red-500 animate-slide-down">{error}</p>
      )}
    </div>
  );
}
