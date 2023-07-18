import { Client } from "@notionhq/client";
import { BlogPage as BP } from "./types";
import { parsePageContent } from "./parser";

export type BlogPage = BP;

export class NotionApi {
  private notion: Client;

  constructor() {
    this.notion = new Client({
      auth: process.env.NOTION_API_SECRET,
    });
  }

  async getDatabase(databaseId: string, filter: any = undefined) {
    const response = await this.notion.databases.query({
      database_id: databaseId,
      filter: filter,
    });
    return response.results;
  }

  async getPostById(postID: string) {
    const response = await this.notion.pages.retrieve({ page_id: postID });
    return response;
  }

  async getAllPosts() {
    return this.getDatabase(process.env.POSTS_DATABASE_ID!);
  }

  async getActivePosts() {
    const filterByActivePosts = {
      property: "active",
      checkbox: {
        equals: true,
      },
    };

    return this.getDatabase(
      process.env.POSTS_DATABASE_ID!,
      filterByActivePosts
    );
  }

  async getPageContent(pageId: string) {
    const response = await this.notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });
    const parsedContent = parsePageContent(response.results);

    for (let i = 0; i < parsedContent.length; i++) {
      if (parsedContent[i].type === "code") {
        const code = parsedContent[i].text;
        parsedContent[i].text = code.replace(/\t/g, " ").replace(/\\n/g, "\n");
      }

      if (parsedContent[i].type === "toggle" && parsedContent[i].has_children) {
        const id = parsedContent[i].id;
        const children = await this.notion.blocks.children.list({
          block_id: id,
          page_size: 50,
        });
        const parsedChildren = parsePageContent(children.results);
        parsedContent[i].children = parsedChildren;
      }

      if (parsedContent[i].type === "table" && parsedContent[i].has_children) {
        const id = parsedContent[i].id;
        const children = await this.notion.blocks.children.list({
          block_id: id,
          page_size: 50,
        });
        const tableRows: any = children.results;
        tableRows.cells = [];
        const parsedRows = tableRows.map((row: any) => {
          const rowContent = row.table_row.cells;
          const rowCells = rowContent.map((cell: any) => cell[0].plain_text);

          return rowCells;
        });
        parsedContent[i].rows = parsedRows;
      }
    }
    return parsedContent;
  }
}
