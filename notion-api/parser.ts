export const parsePageContent: any = (content: any) => {
  const parsedContent = content.map((block: any) => {
    const {
      type,
      has_children,
      heading_1,
      heading_2,
      heading_3,
      paragraph,
      to_do,
      toggle,
      callout,
      numbered_list_item,
      bulleted_list_item,
      id,
      table,
      quote,
      code,
    } = block;
    switch (type) {
      case "heading_1":
        return {
          type: "heading_1",
          text: heading_1.rich_text[0].text.content,
          color: heading_1.color,
          props: heading_1.rich_text[0].annotations,
        };
      case "heading_2":
        return {
          type: "heading_2",
          text: heading_2.rich_text[0].text.content,
          color: heading_2.color,
          props: heading_2.rich_text[0].annotations,
        };
      case "heading_3":
        return {
          type: "heading_3",
          text: heading_3.rich_text[0].text.content,
          color: heading_3.color,
          props: heading_3.rich_text[0].annotations,
        };
      case "paragraph":
        if (paragraph.rich_text.length === 0) {
          return {
            type: "empty_line",
          };
        } else if (paragraph.rich_text.length === 1) {
          switch (paragraph.rich_text[0].type) {
            case "text":
              return {
                type: "paragraph",
                text: paragraph.rich_text[0].text.content,
                color: paragraph.color,
                props: paragraph.rich_text[0].annotations,
              };
            case "mention":
              return {
                type: "mention",
                text: paragraph.rich_text[0].plain_text,
                color: paragraph.color,
                props: paragraph.rich_text[0].annotations,
              };
            case "equation":
              return {
                type: "equation",
                text: paragraph.rich_text[0].plain_text,
                color: paragraph.color,
                props: paragraph.rich_text[0].annotations,
              };
            case "code":
              return {
                type: "code",
                text: paragraph.rich_text[0].plain_text,
                color: paragraph.color,
                props: paragraph.rich_text[0].annotations,
              };
            default:
              return {
                message:
                  "This block type is not supported. Please contact the developer.",
                type: paragraph.rich_text[0].type,
              };
          }
        } else {
          let textList = [];
          for (let i = 0; i < paragraph.rich_text.length; i++) {
            let { text, href } = paragraph.rich_text[i];
            text = text.content;
            let textObj = {};
            if (href) {
              textObj = {
                type: "link",
                text: text,
                href: href,
              };
            } else {
              textObj = {
                type: "text",
                text: text,
                href: href,
              };
            }
            textList.push(textObj);
          }

          return {
            type: "text_list",
            text: textList,
          };
        }

      case "numbered_list_item":
        return {
          type: "numbered_list_item",
          text: numbered_list_item.rich_text[0].text.content,
          color: numbered_list_item.color,
          props: numbered_list_item.rich_text[0].annotations,
          list: [],
          seen: false,
        };
      case "bulleted_list_item":
        return {
          type: "bulleted_list_item",
          text: bulleted_list_item.rich_text[0].text.content,
          color: bulleted_list_item.color,
          props: bulleted_list_item.rich_text[0].annotations,
        };
      case "to_do":
        return {
          type: "to_do",
          text: to_do.rich_text[0].text.content,
          color: to_do.color,
          props: to_do.rich_text[0].annotations,
          checked: to_do.checked,
        };
      case "table":
        return {
          type: "table",
          id: id,
          has_children: has_children,
          table_width: table.table_width,
          has_column_header: table.has_column_header,
          has_row_header: table.has_row_header,
        };
      case "toggle":
        return {
          type: "toggle",
          id: id,
          has_children: has_children,
          text: toggle.rich_text[0].text.content,
          color: toggle.color,
          props: toggle.rich_text[0].annotations,
        };
      case "quote":
        return {
          type: "quote",
          text: quote.rich_text[0].text.content,
          color: quote.color,
          props: quote.rich_text[0].annotations,
        };
      case "divider":
        return {
          type: "divider",
        };

      case "callout":
        return {
          type: "callout",
          icon: callout.icon,
          text: callout.rich_text[0].text.content,
          color: callout.color,
          props: callout.rich_text[0].annotations,
        };
      case "code":
        return {
          type: "code",
          language: code.language,
          text: code.rich_text[0].text.content,
          props: code.rich_text[0].annotations,
        };
      default:
        return {
          message:
            "This block type is not supported. Please contact the developer.",
          type: type,
        };
    }
  });

  for (let i = 0; i < parsedContent.length; i++) {
    const block = parsedContent[i];
    if (block.type === "numbered_list_item" && !block.seen) {
      block.list.push(block.text);
      for (let j = i + 1; j < parsedContent.length; j++) {
        const nextBlock = parsedContent[j];
        if (nextBlock.type === "numbered_list_item" && !nextBlock.seen) {
          block.list.push(nextBlock.text);
          nextBlock.seen = true;
        } else {
          break;
        }
      }
    }
  }
  return parsedContent;
};
