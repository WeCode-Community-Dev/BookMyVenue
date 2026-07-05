import { useEffect, useRef } from 'react';

type Props = {
  src: string;
  className?: string;
};

export default function VideoBg({ src }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {});
  }, [src]);

  return (
    <div className='absolute inset-0 w-full h-full'>
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        muted
        playsInline
        loop
        autoPlay
        preload="auto"
        crossOrigin="anonymous"
      />
    </div>
  );
}
