"use strict";
const segmentSelect = require("./selectFun.js");
/**
 * 自定义匹配Multi-Column Markdown插件分栏语法块的正则表达式，调用写好的 segmentSelect 函数找出这些语法块，分别传递给 colConvertPart 进行处理
 * @param {string} fullText 处理前的文本（全文）
 * @returns 处理后的文本（全文）
 */
function colConvertFull(fullText) {
  const reg = /---\s*start-multi-column([\s\S]*?)---\s*end-multi-column\.*/g; //TODO:
  const convertedText = segmentSelect(fullText, reg, colConvertPart);
  return convertedText;
}

/**
 * 对Multi-Column Markdown插件的分栏语法块进行操作，将其转换为qmd文件的分栏语法块
 * @param {string} matchArr colConvertFull 中的正则表达式匹配结果
 * @returns {string} qmd文件的分栏语法块
 */
function colConvertPart(matchArr) {
  //用于匹配 Multi-Column Markdown插件分栏语法的正则表达式
  const partText = matchArr[0]; // partText是正则表达式的匹配结果，partText[0]是匹配组，区别于捕获组
  const regexStart =
    /---\s*start-multi-column: *?(.*)\n```column-settings.*?\n([\s\S]*?)\n``` *?\n/;
  const regexBreak = /((?:.|[\r\n])*?)\n *?--- *?column-break *?--- *?/;
  const regexEnd = /((?:.|[\r\n])*?)\n *?--- *?end-multi-column.*?/;

  // 从文本中提取分栏属性并以键值对的形式存储
  const colProp = {};
  const colProp_ = {};
  const colNumList = ["number_of_columns", "num_of_cols", "col_count"];
  const colSizeList = [
    "column_size",
    "col_size",
    "column_width",
    "col_width",
    "largest_column",
  ];
  const matches = partText.match(regexStart);

  // 使用正则表达式匹配包含属性的部分，0为匹配文本，1、2是关于分栏ID和其他属性的捕获组
  if (matches) {
    colProp["ID"] = matches[1].trim();
    const columnSettings = matches[2].split("\n").map((line) => line.trim());
    columnSettings.forEach((line) => {
      const [key, value] = line.split(":");
      //把分栏属性名中的空格" "替换成下划线"_"，将属性名和属性值一键值对的形式存入mcProp_
      colProp_[key.trim().replace(/\s/g, "_").toLowerCase()] = value.trim();
    });
    for (let i in colNumList) {
      if (colProp_.hasOwnProperty(colNumList[i])) {
        colProp["colNum"] = parseInt(colProp_[colNumList[i]]);
        break;
      }
    }
    for (let i in colSizeList) {
      if (colProp_.hasOwnProperty(colSizeList[i])) {
        colProp["colSize"] = colProp_[colSizeList[i]];
        break;
      }
    }
  }
  //调用 Regex.source 属性将正则表达式转成字符串，便于拼接
  const regexList = [regexStart, regexBreak, regexEnd].map((ele) => ele.source);
  const regexTotalStr =
    regexList[0] + repeatStr(regexList[1], colProp.colNum - 1) + regexList[2];
  const regexTotal = new RegExp(regexTotalStr);
  //从.match()方法的返回值中读取所需的捕获组，数组中的第0项为匹配文本，1、2是关于分栏ID和其他属性的捕获组，从第3项开始是文本信息
  const segments = partText.match(regexTotal).slice(3);

  //读取控制分栏比例的属性（形如[50%,50%]的字符串），依次存入数组colRatios中
  const colRatios = colProp.colSize
    .slice(1, -1)
    .split(",")
    .map((value) => value.trim());

  //（该功能非必要）计算colRatios除最后一项之和，更新数组中的最后一项，确保了调整后的百分比数值之和为100%。
  const sumOfPreviousItems = colRatios
    .slice(0, colProp.colNum - 1)
    .reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue);
    }, 0);
  const adjustedLastValue = 100 - sumOfPreviousItems; // 将最后一项的值调整为100减去前面项之和
  colRatios[colProp.colNum - 1] = `${adjustedLastValue}%`; // 更新数组中的最后一项

  const breaks = [
    `\n:::: {.columns}\n\n::: {.column width="${colRatios[0]}"}\n`,
  ];
  for (let i = 1; i < colProp.colNum; i++) {
    breaks.push(`\n:::\n\n::: {.column width="${colRatios[i]}"}`);
  }
  breaks.push("\n:::\n::::\n");

  //qmd的分栏语法和分栏文本交错排布，拼接成新的字符串
  const NewText = interleaveArrays(breaks, segments).join("");
  return NewText;
}

//两个数组元素交错排布组成一个新的数组
function interleaveArrays(arr1, arr2) {
  let result = [];
  let maxLength = Math.max(arr1.length, arr2.length);

  for (let i = 0; i < maxLength; i++) {
    if (i < arr1.length) {
      result.push(arr1[i]);
    }
    if (i < arr2.length) {
      result.push(arr2[i]);
    }
  }
  return result;
}

// 将字符串 str 重复指定的次数并合并在一起。
function repeatStr(str, repeatTimes) {
  let res = "";
  for (let i = 0; i < repeatTimes; i++) {
    res = res + str;
  }
  return res;
}

//测试代码1
// if (require.main === module) {
//   // 这个模块是主模块
//   // 执行你的代码
//   const fs = require("fs");
//   let data;
//   try {
//     //同步读取文件，同步方法会阻塞 Node.js 事件循环，直到文件操作完成
//     data = fs.readFileSync("待处理文本copy.md", "utf8");
//   } catch (err) {
//     console.error(err);
//   }
//   console.log(colConvertPart(data));
// }

//测试代码2
if (require.main === module) {
  const fs = require("fs");
  let data;
  try {
    //同步读取文件，同步方法会阻塞 Node.js 事件循环，直到文件操作完成
    data = fs.readFileSync("convert_to_qmd/待处理文本.md", "utf8");
  } catch (err) {
    console.error(err);
  }
  const segmentedText = colConvertFull(data);
  console.log(segmentedText);
  fs.writeFile("testQmd.qmd", segmentedText, (err) => {
    if (err) {
      console.error("写入文件时发生错误：", err);
      return;
    }
    console.log("文件已成功写入");
  });
}
