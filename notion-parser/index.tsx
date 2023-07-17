import React from "react";

export const getComponent = (block: any) => {
  switch (block.type) {
    case "heading_1":
      return <h1>{block.text}</h1>;
    case "heading_2":
      return <h2>{block.text}</h2>;
    case "heading_3":
      return <h3>{block.text}</h3>;
    case "empty_line":
      return <br />;
    case "paragraph":
      const { bold, code, italic, strikethrough, underline } = block.props;

      // the below will return color options like "default", "gray_background", etc.
      // const colorProps = block.props.color.split("_");

      let textBlock;
      if (bold) textBlock = <strong>{block.text}</strong>;
      else if (code) textBlock = <code>{block.text}</code>;
      else if (italic) textBlock = <em>{block.text}</em>;
      else if (strikethrough) textBlock = <del>{block.text}</del>;
      else if (underline) textBlock = <u>{block.text}</u>;
      else textBlock = <>{block.text}</>;

      return <p>{textBlock}</p>;
    case "text_list":
      return (
        <div>
          {block.text.map((item: any, i: number) => {
            const { type, text, href } = item;
            if (type === "link")
              return (
                <span key={i}>
                  <a href={href} target="_blank" rel="noreferrer">
                    {text}
                  </a>
                </span>
              );
            return <span key={i}>{text}</span>;
          })}
        </div>
      );
    case "numbered_list_item":
      if (block.list.length > 1)
        return (
          <ol>
            {block.list.map((li: string, i: number) => (
              <li key={i}>{li}</li>
            ))}
          </ol>
        );
      return <></>;
    case "bulleted_list_item":
      return <li>{block.text}</li>;
    case "to_do":
      return (
        <div>
          {block.checked ? "✅" : "⬜"}
          <span>{block.text}</span>
        </div>
      );
    case "table":
      return createTable(block);
    case "quote":
      return <q>{block.text}</q>;

    case "divider":
      return <hr />;
    case "callout":
      return (
        <div>
          {block.icon.type === "emoji" ? (
            <span>{block.icon.emoji}</span>
          ) : (
            <img src={block.icon.file.url} alt={block.icon.file.name} />
          )}

          {block.text}
        </div>
      );

    case "code":
      return (
        <div>
          <div className="code_language">{block.language}</div>
          <div className="code_content">
            <button
              className="code_copy_button"
              onClick={() => {
                navigator.clipboard.writeText(block.text);
                alert("Code copied to clipboard!");
              }}
            >
              copy
            </button>
            {block.text}
          </div>
        </div>
      );
    case "equation":
      return <div>{block.text}</div>;
    default:
      console.warn(`This block (${block.type}) type is not supported.`);
      return <></>;
  }
};

const createTable: any = (block: any) => {
  const { rows } = block;

  return (
    <table>
      {rows.map((row: any, i: number) => {
        return (
          <tr key={i}>
            {row.map((cell: any, j: number) => {
              return <td key={j}>{cell}</td>;
            })}
          </tr>
        );
      })}
    </table>
  );
};
