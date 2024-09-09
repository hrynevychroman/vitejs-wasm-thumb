// / <reference lib="webworker" />

import { expose } from 'comlink';
import onetime from 'onetime';
import Vips, { type Blob } from 'wasm-vips';

const getVips = onetime(async () =>
  Vips({
    // Optimize startup time by disabling the dynamic modules
    dynamicLibraries: [],
  })
);

async function getThumbnail(
  file: Blob,
  opt?: { width?: number; height?: number }
): Promise<string> {
  const { width = 320, height = 320 } = opt ?? {};

  const vips = await getVips();

  const im = vips.Image.thumbnailBuffer(file, width, {
    height,
    no_rotate: true,
    crop: vips.Interesting.none,
  });

  console.log('im', im);
  

  const outBuffer = im.webpsaveBuffer({ Q: 80 });
  const blob = new Blob([outBuffer], { type: `image/webp` });
  return URL.createObjectURL(blob);
}

const workerInterface = {
  getThumbnail,
};

expose(workerInterface);

export type ExposedInterface = typeof workerInterface;
