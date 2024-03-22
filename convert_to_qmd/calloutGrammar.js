"use strict";
const segmentSelect = require("./selectFun.js");
module.exports = { callConvertFull: callConvertFull };

function callConvertFull(fullText) {
  // const regex = /^[\t ]*> *?\[!(.+)\][\+\-]{0,1}(.*)\n((?:>.*\n)*)/gm;
  const regex = /^[\t ]*> *?\[!(.+)\]([\+\-]{0,1})(.*)\n((?:>.*\n)*)/gm;
  return segmentSelect(fullText, regex, callConvertPart);
  // return callConvertPart(regex.exec(fullText));
}

function callConvertPart(matchArr) {
  const calloutType = matchArr[1].toLowerCase(); //使用 toLowerCase() 方法将字符串中的大写字母转为小写。该转换非必要，仅为了美观。
  const calloutCollapse = matchArr[2]
  const calloutTitle = matchArr[3].trim();
  const calloutText = matchArr[4];
  const contentArr = [];

  
  // info类的callout是面向教师的组织课堂的建议，todo类是待完善事项，因此不导出到qmd文件中
  const ignoreTypes = ["info", "todo"];
  if (ignoreTypes.includes(calloutType)) {
    return "\n"
  }


  const regex = /^>(.*)$/gm; // 多行模式标志/m来匹配每一行的开头，而不是整个文本的开头
  let match;
  while ((match = regex.exec(calloutText)) !== null) {
    contentArr.push(match[1].trim()); // 使用索引1获取捕获组的内容
  }
  const convertedText = contentArr.join("\n\n"); // 在qmd的callout语法中，换行需要空一行，因此需要两个换行符
  
  
  let convertedHead = `.callout-${calloutType}`;

  if (calloutTitle !== "") {
    convertedHead = convertedHead.concat(` title="${calloutTitle}"`)
  }


  // if (calloutTitle === "") {
  //   convertedHead = `::: {.callout-${calloutType}}\n${convertedText}\n:::\n`;
  // } else {
  //   convertedHead = `::: {.callout-${calloutType} title="${calloutTitle}"}\n${convertedText}\n:::\n`;
  // }
  switch (calloutCollapse) {
    case "+":
      convertedHead = convertedHead.concat(" collapse=false");
      break;
    case "-":
      convertedHead = convertedHead.concat(" collapse=true");
      break;
    default:
      break;
  }

  const convertedTotal = `::: {${convertedHead}}\n${convertedText}\n:::\n`
  return convertedTotal;
}

if (require.main === module) {
  const fs = require("fs");
  let data;
  try {
    //同步读取文件，同步方法会阻塞 Node.js 事件循环，直到文件操作完成
    data = fs.readFileSync("convert_to_qmd/calloutText.md", "utf8");
  } catch (err) {
    console.error(err);
  }
  console.log(callConvertFull(data));
}
