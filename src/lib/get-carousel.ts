import { Carousel } from "../types/entities";

export async function getCarousel() {
  const res = await fetch(
    `/api/web/dataset/call_kw/notacool_gm.totem_carousel/search_read`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "call",
        params: {
          model: "notacool_gm.totem_carousel",
          method: "search_read",
          args: [[["active", "=", true]]],
          kwargs: {},
        },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch totem carousel: ${res.statusText}`);
  }
  const { result } = await res.json();
  if (!result) {
    throw new Error("No totem carousel data found");
  }
  return result[0] as Carousel;
}
