module.exports = toMarkdownLink;
/**
 * 用 templater 脚本实现图片引用格式转换
 * @param {*} text
 * @returns
 */
function toMarkdownLink(text) {
  // TODO: 调用 obsidian 的 API 获取附件默认存放路径，而不是直接添加 "./attachments/"
  text = text.replace(/!\[\[([^\|]+?\.(?:png|jpg))\]\]/g, "![](./assets/$1)");
  text = text.replace(
    /!\[\[([^\|]+?\.(?:png|jpg))\|(.+?)\]\]/g,
    "![$2](./assets/$1)"
  );
  return text;
}
/**两种格式相互转换的正则表达式
 * WikiLink to MarkdownLink:
 * "!\[\[([^\|]+?\.(?:png|jpg))\]\]"->"![]($1)"
 * "!\[\[([^\|]+?\.(?:png|jpg))\|(.+?)\]\]"->"![$2]($1)"
 *
 * MarkdownLink to WikiLink:
 * "!\[\]\(([^\|]+?\.(?:png|jpg))\)"->"![[$1]]"
 * "!\[(.+?)\]\(([^\|]+?\.(?:png|jpg))\)"->"![[$2|$1]]"
 */
if (require.main === module) {
  const fs = require("fs");
  let data;
  try {
    //同步读取文件，同步方法会阻塞 Node.js 事件循环，直到文件操作完成
    data = fs.readFileSync("convert_to_qmd\\toMarkdownLinksText.md", "utf8");
  } catch (err) {
    console.error(err);
  }
  console.log(toMarkdownLink(data));
}
