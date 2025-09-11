export const getContentUrl = (id: number) => {
  return `/api/web/content/${id}`;
};

export const getContentType = async (
  url: string
): Promise<"image" | "video" | "unknown"> => {
  try {
    const res = await fetch(url, { method: "HEAD" });
    const contentType = res.headers.get("content-type");
    if (contentType?.startsWith("image")) return "image";
    if (contentType?.startsWith("video")) return "video";
    return "unknown";
  } catch {
    return "unknown";
  }
};
