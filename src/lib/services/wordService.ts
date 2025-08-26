import { Op } from 'sequelize';
import { getWordModel, connectDatabase } from '@/lib/database';
import { paramsInvalid, safeParseInt } from '@/utils/common';
import { paramErr, success, systemErr } from '@/lib/response';
import { getWordInfo } from '@/lib/pinyin';
import type { ApiResponse, Rhythm } from '@/types';

interface QueryWordsParams {
  word: string;
  type_with_tone: string;
  type_without_tone: string;
  length: number;
  num: number;
}

class WordService {
  private async ensureConnection() {
    await connectDatabase();
  }

  /**
   * 获取押韵词汇摘要（分长度返回）
   */
  async getSummary({ 
    word, 
    rap_num, 
    tone_type 
  }: { 
    word: string; 
    rap_num: string | number; 
    tone_type: string | number; 
  }): Promise<ApiResponse<Rhythm[][]>> {
    // 参数校验
    if (paramsInvalid([word, rap_num, tone_type])) {
      return paramErr() as ApiResponse<Rhythm[][]>;
    }
    
    // 为空直接返回
    if (word === '') {
      return success([]);
    }
    
    await this.ensureConnection();
    
    const rapNum = safeParseInt(rap_num);
    const toneType = safeParseInt(tone_type);
    const result = getWordInfo(word); // 获取处理后的单词拼音
    
    // 获取最终要押韵的无音调韵母
    const typeWithoutTone = result.type_without_tone
      .split('-')
      .slice(-rapNum)
      .join('-');
    
    // 获取最终要押韵的有音调韵母
    const typeWithToneArr = result.type_with_tone.split('-');
    const num = toneType > 1 ? rapNum : toneType;
    const typeWithTone = num === 0 ? '' : typeWithToneArr.slice(-num).join('-');
    
    try {
      // 并发查询不同长度的词
      const [words2, words3, words4, words5] = await Promise.all([
        this.getWordsFromModel({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 2,
          num: 140,
        }),
        this.getWordsFromModel({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 3,
          num: 100,
        }),
        this.getWordsFromModel({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 4,
          num: 80,
        }),
        this.getWordsFromModel({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 5,
          num: 40,
        }),
      ]);
      
      return success([words2, words3, words4, words5]);
    } catch (err) {
      return systemErr(err) as ApiResponse<Rhythm[][]>;
    }
  }

  /**
   * 获取指定长度的押韵词汇
   */
  async getWords({ 
    word, 
    rap_num, 
    tone_type, 
    length 
  }: { 
    word: string; 
    rap_num: string | number; 
    tone_type: string | number; 
    length: string | number; 
  }): Promise<ApiResponse<Rhythm[]>> {
    // 参数校验
    if (paramsInvalid([word, rap_num, tone_type, length])) {
      return paramErr() as ApiResponse<Rhythm[]>;
    }
    
    // 为空直接返回
    if (word === '') {
      return success([]);
    }
    
    await this.ensureConnection();
    
    const rapNum = safeParseInt(rap_num);
    const toneType = safeParseInt(tone_type);
    const wordLength = safeParseInt(length, 2);
    const result = getWordInfo(word); // 获取处理后的单词拼音
    
    // 获取最终要押韵的无音调韵母
    const typeWithoutTone = result.type_without_tone
      .split('-')
      .slice(-rapNum)
      .join('-');
    
    // 获取最终要押韵的有音调韵母
    const typeWithToneArr = result.type_with_tone.split('-');
    const num = toneType > 1 ? rapNum : toneType;
    const typeWithTone = num === 0 ? '' : typeWithToneArr.slice(-num).join('-');
    
    try {
      const data = await this.getWordsFromModel({
        word,
        type_with_tone: typeWithTone,
        type_without_tone: typeWithoutTone,
        length: wordLength,
        num: 100,
      });
      
      return success(data);
    } catch (err) {
      return systemErr(err) as ApiResponse<Rhythm[]>;
    }
  }

  /**
   * 批量添加词汇
   */
  async addWords(words: Rhythm[]): Promise<Rhythm[]> {
    await this.ensureConnection();
    const WordModel = getWordModel();
    return WordModel.bulkCreate(words);
  }

  /**
   * 从数据库模型查询词汇
   */
  private async getWordsFromModel({
    word,
    type_with_tone,
    type_without_tone,
    length,
    num,
  }: QueryWordsParams): Promise<Rhythm[]> {
    const WordModel = getWordModel();
    
    const results = await WordModel.findAll({
      where: {
        word: { [Op.ne]: word },
        [Op.or]: [
          { type_without_tone: { [Op.like]: `%-${type_without_tone}` } },
          { type_without_tone: { [Op.eq]: `${type_without_tone}` } },
        ],
        type_with_tone: { [Op.like]: `%${type_with_tone}` },
        length: length > 5 ? { [Op.gte]: length } : { [Op.eq]: length || 2 },
      },
      offset: 0,
      limit: num || 50,
      order: [['rate', 'DESC']],
    });

    return results.map(item => item.toJSON() as Rhythm);
  }
}

const wordService = new WordService();
export default wordService;