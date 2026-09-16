'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface FileUploadProps {
  label: string;
  acceptTypes: string; // e.g., ".stl,.obj,.3mf"
  maxSizeMb: number; // e.g., 25
  allowedExtensionsText: string;
  onFileSelect: (file: File | null) => void;
}

export default function FileUpload({
  label,
  acceptTypes,
  maxSizeMb,
  allowedExtensionsText,
  onFileSelect,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateAndSetFile = (selectedFile: File) => {
    setError(null);

    // Check size
    if (selectedFile.size > maxSizeMb * 1024 * 1024) {
      setError(`File size exceeds maximum limit of ${maxSizeMb}MB.`);
      return;
    }

    // Check extension
    const ext = '.' + selectedFile.name.split('.').pop()?.toLowerCase();
    const allowedArr = acceptTypes.split(',').map((t) => t.trim().toLowerCase());
    if (!allowedArr.includes(ext)) {
      setError(`Invalid file format. Please upload ${allowedExtensionsText}.`);
      return;
    }

    setFile(selectedFile);
    onFileSelect(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-slate-300 font-semibold">{label}</label>

      {file ? (
        <div className="p-3.5 bg-tech-bg border border-tech-accent/40 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded bg-tech-accent/10 border border-tech-accent/30 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-tech-accent" />
            </div>
            <div className="truncate text-xs">
              <p className="font-semibold text-white truncate">{file.name}</p>
              <p className="text-slate-400 font-mono text-[10px]">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 rounded hover:bg-tech-card text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-tech-accent bg-tech-accent/10'
              : 'border-tech-border hover:border-tech-accent/50 bg-tech-bg/50'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={acceptTypes}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                validateAndSetFile(e.target.files[0]);
              }
            }}
          />
          <div className="w-10 h-10 mx-auto rounded-full bg-tech-card border border-tech-border flex items-center justify-center mb-2">
            <Upload className="w-5 h-5 text-tech-accent" />
          </div>
          <p className="text-xs text-slate-200 font-semibold font-sans">
            Drag & Drop or <span className="text-tech-accent underline">Browse File</span>
          </p>
          <p className="text-[11px] text-slate-400 font-mono mt-1">
            Supported: {allowedExtensionsText} (Max {maxSizeMb}MB)
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-mono mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
