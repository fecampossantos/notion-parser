export type ObjectType = "page" | "user";

export type BlogDatabaseProperties = {
  Tags?: {
    id: string;
    type: "multi_select";
    multi_select: {
      id: string;
      name: string;
      color: string;
    }[];
  };
  active: {
    id: string;
    type: "checkbox";
    checkbox: boolean;
  };
  "post title": {
    id: "title";
    type: "title";
    title: {
      type: "text";
      text: {
        content: string;
        link: null;
      };
      annotations: {
        bold: boolean;
        italic: boolean;
        strikethrough: boolean;
        underline: boolean;
        code: boolean;
        color: string;
      };
      plain_text: string;
      href: null;
    }[];
  };
};

export type BlogPage = {
  object: ObjectType;
  id: string;
  created_time: string;
  last_edited_time: string;
  created_by: { object: ObjectType; id: string };
  last_edited_by: { object: ObjectType; id: string };
  cover?: {
    type: string;
    external: {
      url: string;
    };
  };
  icon?: {
    type: string;
    external: {
      url: string;
    };
  };
  parent: {
    type: string;
    database_id: string;
  };
  archived: boolean;
  properties: BlogDatabaseProperties;
  url: string;
  public_url: string | null;
};
