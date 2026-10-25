"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Check, ImagePlus, Lock, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { initialsOf } from "@/lib/qabiltoo/types";
import { cn } from "@/lib/utils";
import { StepNav } from "../kit";
import { LocalPhoto } from "../preview-card";
import type { StepProps } from "../onboarding";

/** Step 6 — Photograph (upload stays on-device; initials avatar as the elegant default) */
export function StepPhoto({ data, update, onNext, onBack }: StepProps) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = initialsOf(data.fullName) || "QT";
  const hasUpload = data.photoOption === "upload" && !!data.photoDataUrl;

  function loadFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({
        title: "That file is not an image",
        description: "Please choose a JPG, PNG or WebP photograph.",
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        update({ photoDataUrl: reader.result, photoOption: "upload" });
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <section aria-labelledby="step-photo-h">
      <h2 id="step-photo-h" className="font-display text-2xl font-bold sm:text-3xl">
        Your photograph
      </h2>
      <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
        A photo helps serious families connect — yet your modesty is respected: photos stay
        private and blurred until you accept a proposal.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {/* (a) Upload with drag & drop */}
        <div
          className={cn(
            "flex flex-col rounded-3xl border-2 bg-card p-5 transition-colors",
            hasUpload ? "border-gold-500 shadow-[0_0_0_3px_rgba(212,175,55,0.14)]" : "border-border"
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display text-base font-semibold">Upload a photo</h3>
            {hasUpload && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-medium text-gold-700 dark:text-gold-300">
                <Check className="h-3 w-3" aria-hidden /> Chosen
              </span>
            )}
          </div>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A clear, modest photograph works best. It never leaves your device in this demo.
          </p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              loadFile(e.dataTransfer.files?.[0]);
            }}
            aria-label="Upload a photograph — click to browse or drop an image"
            className={cn(
              "mt-4 flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-6 transition-colors",
              dragging
                ? "border-gold-500 bg-gold-500/10"
                : "border-border hover:border-gold-500/50 hover:bg-gold-500/5"
            )}
          >
            {data.photoOption === "upload" && data.photoDataUrl ? (
              <span className="relative">
                <span className="block h-24 w-24 overflow-hidden rounded-full border-2 border-gold-500/60 shadow-md">
                  <LocalPhoto
                    src={data.photoDataUrl}
                    alt="Your selected photograph preview"
                    className="h-full w-full object-cover object-center"
                  />
                </span>
                <span
                  role="button"
                  tabIndex={0}
                  aria-label="Remove selected photograph"
                  onClick={(e) => {
                    e.stopPropagation();
                    update({ photoDataUrl: "", photoOption: "initials" });
                    if (fileRef.current) fileRef.current.value = "";
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.stopPropagation();
                      update({ photoDataUrl: "", photoOption: "initials" });
                      if (fileRef.current) fileRef.current.value = "";
                    }
                  }}
                  className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm transition-colors hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" aria-hidden />
                </span>
              </span>
            ) : (
              <>
                <ImagePlus className="h-7 w-7 text-gold-600 dark:text-gold-300" aria-hidden />
                <span className="text-center text-sm">
                  <span className="font-medium">Tap to browse</span>
                  <span className="text-muted-foreground"> or drop a photo here</span>
                </span>
                <span className="text-[11px] text-muted-foreground">JPG, PNG or WebP</span>
              </>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => loadFile(e.target.files?.[0])}
          />
        </div>

        {/* (b) Elegant initials avatar */}
        <button
          type="button"
          onClick={() => update({ photoOption: "initials" })}
          aria-pressed={data.photoOption === "initials"}
          className={cn(
            "flex flex-col rounded-3xl border-2 bg-card p-5 text-left transition-colors",
            data.photoOption === "initials"
              ? "border-gold-500 shadow-[0_0_0_3px_rgba(212,175,55,0.14)]"
              : "border-border hover:border-gold-500/40"
          )}
        >
          <span className="flex items-center justify-between gap-2">
            <span className="font-display text-base font-semibold">Initials avatar</span>
            {data.photoOption === "initials" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-gold-500/15 px-2 py-0.5 text-[11px] font-medium text-gold-700 dark:text-gold-300">
                <Check className="h-3 w-3" aria-hidden /> Chosen
              </span>
            )}
          </span>
          <span className="mt-1 text-xs leading-relaxed text-muted-foreground">
            A refined gold emblem with your initials — elegant, private and always appropriate.
          </span>
          <span className="mt-4 flex flex-1 items-center justify-center">
            <span className="relative block h-24 w-24 overflow-hidden rounded-2xl border-2 border-gold-500/50 shadow-md shadow-gold-500/10">
              <Image
                src={`/api/avatar/${encodeURIComponent(initials)}`}
                alt="Initials avatar preview"
                fill
                sizes="96px"
                className="object-cover"
              />
            </span>
          </span>
        </button>
      </div>

      <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600 dark:text-gold-300" aria-hidden />
        Photos remain private — blurred to other members until you accept a proposal. Uploaded
        images are used for on-screen preview only and are not stored.
      </p>

      <StepNav
        onNext={onNext}
        onBack={onBack}
        nextLabel={hasUpload ? "Keep this photo" : "Continue"}
      />
    </section>
  );
}
