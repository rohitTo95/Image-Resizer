import { useRef, useCallback } from 'react';

export function useImageWorker() {
  const workerRef = useRef(null);

  const getWorker = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL('../workers/imageProcessor.worker.js', import.meta.url),
      );
    }
    return workerRef.current;
  }, []);

  const terminate = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
  }, []);

  const processBatch = useCallback(
    (images, targetWidth, targetHeight, settings, onProgress) => {
      return new Promise(async (resolve, reject) => {
        const worker = getWorker();

        const items = await Promise.all(
          images.map(async (img) => {
            const arrayBuffer = await img.file.arrayBuffer();
            return {
              id: img.id,
              buffer: arrayBuffer,
              mimeType: img.type || 'image/jpeg',
              name: img.name,
              targetWidth,
              targetHeight,
            };
          }),
        );

        const transferables = items.map((item) => item.buffer);

        worker.onmessage = ({ data }) => {
          if (data.type === 'PROGRESS') {
            onProgress?.(data.payload.current, data.payload.total);
          } else if (data.type === 'COMPLETE') {
            const results = data.payload.results.map((r) => ({
              ...r,
              success: r.success,
            }));
            resolve(results);
          }
        };

        worker.onerror = (err) => {
          reject(new Error(err.message));
        };

        worker.postMessage(
          { type: 'PROCESS_BATCH', payload: { items, settings } },
          transferables,
        );
      });
    },
    [getWorker],
  );

  return { processBatch, terminate };
}
