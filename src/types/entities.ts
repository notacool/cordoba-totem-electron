export type RelationField = [number, string]
export interface Totem {
    id: number;
    url: string;
    attachment_ids: number[];
    create_date: string;
    create_uid: number | RelationField;
}

export interface Attachment {
    id: string,
    name: string,
    mimetype: string;
    datas: string;
    local_url: string;
    index_content: string;
}
