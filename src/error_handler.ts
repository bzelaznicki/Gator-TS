export function errorHandler(err: unknown) {
  console.error(
    `Cannot scrape feed: ${err instanceof Error ? err.message : err}`,
  );
}
