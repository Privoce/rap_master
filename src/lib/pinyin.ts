import { pinyin } from 'pinyin-pro';
import { initialList, finalList } from './pinyin-data';
import type { WordInfo } from '@/types';

/**
 * 获取词语的拼音信息
 * @param word 输入的词语
 * @param rate 词语频率，默认为0
 * @returns 返回词语的详细拼音信息
 */
export function getWordInfo(word = '', rate = 0): WordInfo {
  const length = word.length;
  const initialArr = pinyin(word, { type: 'array', pattern: 'initial' }); // 声母
  const finalWithToneArr = pinyin(word, { type: 'array', pattern: 'final' }); // 带拼音韵母
  const finalWithoutToneArr = pinyin(word, {
    type: 'array',
    toneType: 'none',
    pattern: 'final',
  }); // 不带拼音韵母
  const toneArr = pinyin(word, {
    type: 'array',
    toneType: 'num',
    pattern: 'num',
  }); // 音调列表
  
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
          typeWithoutTone = '7';
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
    initial: Array.isArray(initialArr) ? initialArr.join('-') : '',
    final_with_tone: Array.isArray(finalWithToneArr) ? finalWithToneArr.join('-') : '',
    final_without_tone: Array.isArray(finalWithoutToneArr) ? finalWithoutToneArr.join('-') : '',
    type_with_tone: typeWithToneArr.join('-'),
    type_without_tone: typeWithoutToneArr.join('-'),
  };
}