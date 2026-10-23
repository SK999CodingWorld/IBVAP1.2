import { getAuthenticatedMediaUrl } from '@/api/client';
import { RefreshCw, VideoOff } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface MjpegFeedProps {
  sourceUrl: string;
  alt: string;
  className?: string;
  objectFit?: 'cover' | 'contain';
}

/** Displays authenticated MJPEG streams and makes connection failures visible. */
export const MjpegFeed: React.FC<MjpegFeedProps> = ({
  sourceUrl,
  alt,
  className = 'w-full h-full',
  objectFit = 'cover',
}) => {
  const [failed, setFailed] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const authenticatedUrl = getAuthenticatedMediaUrl(sourceUrl);
  const streamUrl = new URL(authenticatedUrl);
  useEffect(() => {
    setFailed(false);
    setRetryKey(0);
  }, [sourceUrl]);
  if (retryKey > 0) streamUrl.searchParams.set('_retry', String(retryKey));

  if (failed) {
    return (
      <div
        className={`${className} flex flex-col items-center justify-center gap-2 bg-[#070B12] text-amber-300 font-mono text-xs`}
        role="alert"
      >
        <VideoOff size={22} aria-hidden="true" />
        <span>LIVE MJPEG STREAM UNAVAILABLE</span>
        <span className="text-center text-[10px] text-slate-400">
          Check the API connection and camera source, then retry.
        </span>
        <button
          type="button"
          className="mt-1 inline-flex items-center gap-1 rounded border border-cyan-500/40 px-2 py-1 text-cyan-300 hover:bg-cyan-500/10"
          onClick={(event) => {
            event.stopPropagation();
            setFailed(false);
            setRetryKey((key) => key + 1);
          }}
        >
          <RefreshCw size={12} aria-hidden="true" /> Retry stream
        </button>
      </div>
    );
  }

  return (
    <img
      key={retryKey}
      src={streamUrl.toString()}
      alt={alt}
      className={`${className} ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} select-none`}
      onError={() => setFailed(true)}
    />
  );
};
