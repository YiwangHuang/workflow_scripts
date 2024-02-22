module.exports = toMarkdownLink;
/**
 * 用 templater 脚本实现图片引用格式转换
 * @param {*} text
 * @returns
 */
function toMarkdownLink(text) {
  text.replace(/!\[\[([^\|]+?\.(?:png|jpg))\]\]/, "![]($1)");
  text.replace(/!\[\[([^\|]+?\.(?:png|jpg))\|(.+?)\]\]/, "![$2]($1)");
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
