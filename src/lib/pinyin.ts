import { pinyin } from "pinyin-pro";
import { initialList, finalList } from "./pinyin-data";
import type { WordInfo } from "@/types";

const vList = ["ü", "ǖ", "ǘ", "ǚ", "ǜ"];
const vWords = [
  "居",
  "拘",
  "驹",
  "狙",
  "踞",
  "蛆",
  "驱",
  "躯",
  "迂",
  "嘘",
  "余",
  "渔",
  "于",
  "榆",
  "舆",
  "愉",
  "局",
  "菊",
  "橘",
  "徐",
  "女",
  "举",
  "矩",
  "取",
  "曲",
  "许",
  "语",
  "雨",
  "宇",
  "去",
  "巨",
  "句",
  "拒",
  "据",
  "惧",
  "聚",
  "玉",
  "育",
  "预",
  "御",
  "裕",
  "域",
  "遇",
  "疽",
  "琚",
  "趄",
  "裾",
  "焗",
  "锔",
  "龃",
  "莒",
  "筥",
  "剧",
  "锯",
  "距",
  "具",
  "俱",
  "岖",
  "趋",
  "渠",
  "蕖",
  "磲",
  "璩",
  "氍",
  "癯",
  "娶",
  "龋",
  "苣",
  "趣",
  "觑",
  "虚",
  "须",
  "需",
  "墟",
  "胥",
  "戌",
  "盱",
  "栩",
  "诩",
  "浒",
  "呴",
  "序",
  "叙",
  "绪",
  "续",
  "蓄",
  "恤",
  "旭",
  "钕",
  "籹",
  "驴",
  "闾",
  "榈",
  "吕",
  "侣",
  "铝",
  "旅",
  "屡",
  "缕",
  "履",
  "褛",
  "律",
  "率",
  "绿",
  "氯",
  "虑",
  "纡",
  "淤",
  "瘀",
  "鱼",
  "娱",
  "隅",
  "愚",
  "虞",
  "与",
  "予",
  "羽",
  "禹",
  "圉",
  "圄",
  "浴",
  "欲",
  "喻",
  "誉",
  "豫",
  "寓",
  "狱",
  "愈",
  "鬻",
];

/**
 * 获取词语的拼音信息
 * @param word 输入的词语
 * @param rate 词语频率，默认为0
 * @returns 返回词语的详细拼音信息
 */
export function getWordInfo(word = "", rate = 0): WordInfo {
  const length = word.length;
  const initialArr = pinyin(word, { type: "array", pattern: "initial" }); // 声母
  const finalWithToneArr = pinyin(word, { type: "array", pattern: "final" }); // 带拼音韵母

  const finalWithoutToneArr = pinyin(word, {
    type: "array",
    toneType: "none",
    pattern: "final",
  }); // 不带拼音韵母
  const toneArr = pinyin(word, {
    type: "array",
    toneType: "num",
    pattern: "num",
  }); // 音调列表
  // 遍历toneArr如果有值为'0'则改为'1'
  toneArr.forEach((item, index) => {
    if (item === "0") {
      toneArr[index] = "1";
    }
  });

  let index = 0;
  finalWithoutToneArr.forEach((item) => {
    let singleWordList = word.split("");

    if (item === "u" && vWords.includes(singleWordList[index])) {
      finalWithoutToneArr[index] = "ü";
      switch (toneArr[index]) {
        case "1":
          finalWithToneArr[index] = "ǖ";
          break;
        case "2":
          finalWithToneArr[index] = "ǘ";
          break;
        case "3":
          finalWithToneArr[index] = "ǚ";
          break;
        case "4":
          finalWithToneArr[index] = "ǜ";
          break;
        default:
          break;
      }
    }
    index++;
  });
  const typeWithToneArr: string[] = [];
  const typeWithoutToneArr: string[] = [];

  for (let index = 0; index < length; index++) {
    let typeWithTone: string, typeWithoutTone: string;

    // 对每个字遍历
    for (let typeIndex = 0; typeIndex < finalList.length; typeIndex++) {
      // 对final列表遍历
      const currentFinal = finalList[typeIndex];
      if (currentFinal.includes(finalWithoutToneArr[index])) {
        // 五支和七齐
        if (typeIndex === 4 && initialList[1].includes(initialArr[index])) {
          typeWithTone = `7.${toneArr[index]}`;
          typeWithoutTone = "7";
        } else {
          typeWithTone = `${typeIndex + 1}.${toneArr[index]}`;
          typeWithoutTone = String(typeIndex + 1);
        }
        break;
      }
    }

    typeWithToneArr.push(typeWithTone!);
    typeWithoutToneArr.push(typeWithoutTone!);
  }

  return {
    word,
    rate,
    length,
    initial: Array.isArray(initialArr) ? initialArr.join("-") : "",
    final_with_tone: Array.isArray(finalWithToneArr)
      ? finalWithToneArr.join("-")
      : "",
    final_without_tone: Array.isArray(finalWithoutToneArr)
      ? finalWithoutToneArr.join("-")
      : "",
    type_with_tone: typeWithToneArr.join("-"),
    type_without_tone: typeWithoutToneArr.join("-"),
  };
}
