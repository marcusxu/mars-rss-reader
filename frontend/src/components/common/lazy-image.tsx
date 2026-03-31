import { useState, useEffect, useRef } from 'react';
import { Box, Skeleton } from '@mui/material';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
}

export function LazyImage({
  src,
  alt,
  width = '100%',
  height = 200,
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.01 },
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Box ref={imgRef} sx={{ width, height, position: 'relative' }}>
      {!isLoaded && (
        <Skeleton variant="rectangular" width="100%" height="100%" />
      )}
      {isInView && (
        <Box
          component="img"
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: isLoaded ? 'block' : 'none',
          }}
        />
      )}
    </Box>
  );
}
