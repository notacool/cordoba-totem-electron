export type RelationField = [number, string];
export interface Totem {
  id: number;
  url: string;
  attachment_ids: number[];
  create_date: string;
  create_uid: number | RelationField;
}

export interface Attachment {
  id: string;
  name: string;
}

export type Carousel = {
  name: string;
  active: Boolean;
  attachment_ids: number[];
};

export type Content = {
  url: string;
  type: "image" | "video" | "unknown";
};

export type ContentWithId = Content & { id: number };