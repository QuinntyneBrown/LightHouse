"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import VideoPlayer from "@/components/playback/VideoPlayer";
import AudioPlayer from "@/components/playback/AudioPlayer";
import PlaylistQueue from "@/components/playback/PlaylistQueue";
import { MOCK_CONTENT } from "@/lib/constants";

export default function PlayPage() {
  const params = useParams();
  const contentId = params.id as string;
  const content = MOCK_CONTENT.find((c) => c.id === contentId) || MOCK_CONTENT[0];
  const queueItems = MOCK_CONTENT.filter((c) => c.id !== contentId).map((c) => ({
    id: c.id,
    title: c.title,
    duration: c.duration,
    type: c.type,
    gradient: c.gradient,
  }));

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="px-4">
        <Link href="/home" data-testid="back-button" className="inline-flex items-center gap-2 text-foreground-secondary hover:text-foreground-primary text-sm mb-3">
          ← Back
        </Link>
      </div>

      <div className="px-4">
        {content.type === "video" ? (
          <VideoPlayer title={content.title} duration={720} />
        ) : (
          <AudioPlayer title={content.title} gradient={`from-accent-purple to-accent-blue`} duration={180} />
        )}
      </div>

      <PlaylistQueue items={queueItems} />
    </div>
  );
}
