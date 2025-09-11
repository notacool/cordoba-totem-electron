import { Attachment } from "../types/entities";

export async function getAttachment(attachmentId: number) {
  const res = await fetch(`/api/web/dataset/call_kw/ir.attachment/read`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      jsonrpc: "2.0",
      method: "call",
      params: {
        model: "ir.attachment",
        method: "read",
        args: [[attachmentId]],
        kwargs: {
          fields: ["id", "name"],
        },
      },
    }),
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch totem carousel: ${res.statusText}`);
  }
  const { result } = await res.json();
  if (!result) {
    throw new Error("No totem carousel data found");
  }
  const name = result[0]?.name.split(".").slice(0, -1).join(".");

  return { ...result[0], name } as Attachment;
}
