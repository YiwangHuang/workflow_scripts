"use strict";
const segmentSelect = require("./selectFun.js");
module.exports = { callConvertFull: callConvertFull };

function callConvertFull(fullText) {
  const regex = /^[\t ]*> *?\[!(.+)\][\+\-]{0,1}(.*)\n((?:>.*\n)*)/gm;
  return segmentSelect(fullText, regex, callConvertPart);
  // return callConvertPart(regex.exec(fullText));
}

function callConvertPart(matchArr) {
  const calloutType = matchArr[1].toLowerCase(); //使用 toLowerCase() 方法将字符串中的大写字母转为小写。该转换非必要，仅为了美观。
  const calloutTitle = matchArr[2].trim();
  const calloutText = matchArr[3];
  const contentArr = [];

  // info类的callout是面向教师的组织课堂的建议，因此不导出到qmd文件中
  if (calloutType == "info") {
    return "\n";
  }

  const regex = /^>(.*)$/gm; // 多行模式标志/m来匹配每一行的开头，而不是整个文本的开头
  let match;
  while ((match = regex.exec(calloutText)) !== null) {
    contentArr.push(match[1].trim()); // 使用索引1获取捕获组的内容
  }
  const contentText = contentArr.join("\n\n"); // 在qmd的callout语法中，换行需要空一行，因此需要两个换行符
  let convertedText = "";
  if (calloutTitle === "") {
    convertedText = `::: {.callout-${calloutType}}\n${contentText}\n:::\n`;
  } else {
    convertedText = `::: {.callout-${calloutType} title="${calloutTitle}"}\n${contentText}\n:::\n`;
  }
  return convertedText;
}

if (require.main === module) {
  const fs = require("fs");
  let data;
  try {
    //同步读取文件，同步方法会阻塞 Node.js 事件循环，直到文件操作完成
    data = fs.readFileSync("calloutText.md", "utf8");
  } catch (err) {
    console.error(err);
  }
  console.log(callConvertFull(data));
}
