export function getOgImageUrl({
  title,
  description,
  type = "website",
}: {
  title?: string;
  description?: string;
  type?: string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://oknum.studio";
  const url = new URL(`${baseUrl}/api/og`);

  if (title) {
    url.searchParams.append("title", title);
  }

  if (description) {
    url.searchParams.append("description", description);
  }

  if (type) {
    url.searchParams.append("type", type);
  }

  return url.toString();
}
