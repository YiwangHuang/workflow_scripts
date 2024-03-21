module.exports = segmentSelect

/**
 * 把插件Multi-Column Markdown的语法块找出来。将文本根据特定的分段特征进行切割，将处理过的分段文本依次存入数组segments，最后返回数组元素的拼接结果。使用正则表达式的 `exec` 方法来遍历匹配项，而不是使用 `match` 方法一次性获取所有匹配项。这样可以更加灵活地控制匹配过程。在循环中，每次匹配完成后更新 `lastIndex`，以便下一次匹配从正确的位置开始。最后，如果还有剩余的文本，也将其添加到数组末尾。
 * @param {string} text - 原文本
 * @param {*} regex - 正则表达式，匹配需要处理的特征段落
 * @param {*} operateFun - 对匹配出来的特征段落进行操作的函数，函数的参数为匹配项 match
 * @returns 无需处理的段落和处理过的特征段落按原文顺序依次放入数组，返回该数组
 */
function segmentSelect(text, regex, operateFun) {
  let segments = []; // 储存分段文本的数组
  let match;
  let lastIndex = 0; // 上一个匹配项的结束位置

  // 使用 exec 方法逐个获取匹配项，将返回值赋给 match，match[0]为匹配文本，match[1]为捕获组
  while ((match = regex.exec(text)) !== null) {
    const matchIndex = match.index; // 当前匹配项的起始位置
    const precedingText = text.substring(lastIndex, matchIndex); // 当前匹配项之前的文本
    if (precedingText !== "") {
      segments.push(precedingText); // 将文本添加到数组中
    }

    //可以在此处对匹配文本match[0]和捕获组match[1]进行操作
    segments.push(operateFun(match));

    lastIndex = matchIndex + match[0].length; // 更新上一个匹配项的结束位置
  }
  // 获取剩余的文本，并将其添加到数组中
  const remainingText = text.substring(lastIndex);
  if (remainingText !== "") {
    segments.push(remainingText);
  }
  return segments.join(""); // 返回分段后的数组
}
