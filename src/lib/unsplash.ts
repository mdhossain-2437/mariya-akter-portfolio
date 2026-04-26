export function unsplashSrcSet(url: string, widths: number[] = [400, 600, 800, 1200]): string {
  return widths
    .map((w) => `${url.replace(/([?&])w=\d+/, `$1w=${w}`)} ${w}w`)
    .join(", ");
}

export function unsplashSized(url: string, w: number, q = 80): string {
  return url
    .replace(/([?&])w=\d+/, `$1w=${w}`)
    .replace(/([?&])q=\d+/, `$1q=${q}`);
}
