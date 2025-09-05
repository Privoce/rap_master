import { Op, QueryTypes } from "sequelize";
import { getWordModel, connectDatabase } from "@/lib/database";
import { paramsInvalid, safeParseInt } from "@/utils/common";
import { paramErr, success, systemErr } from "@/lib/response";
import { getWordInfo } from "@/lib/pinyin";
import type { ApiResponse, Rhythm } from "@/types";
import { Single_Day } from "next/font/google";

interface QueryWordsParams {
  word: string;
  type_with_tone: string;
  type_without_tone: string;
  length: number;
  num: number;
}

export interface WordServiceReturn {
  single: Rhythm[];
  real: Rhythm[][];
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
    tone_type,
    isSearchSingle,
  }: {
    word: string;
    rap_num: string | number;
    tone_type: string | number;
    isSearchSingle: boolean;
  }): Promise<ApiResponse<WordServiceReturn>> {
    // 参数校验
    if (paramsInvalid([word, rap_num, tone_type])) {
      return paramErr() as ApiResponse<WordServiceReturn>;
    }
    // 为空直接返回
    if (word === "") {
      return success({
        single: [],
        real: [],
      });
    }

    await this.ensureConnection();
    const rapNum = safeParseInt(rap_num);
    const rapNum1 = 1;
    const toneType = safeParseInt(tone_type);
    const toneType1 = 1;
    const result = getWordInfo(word); // 获取处理后的单词拼音
    // 获取最终要押韵的无音调韵母
    const typeWithoutTone = result.type_without_tone
      .split("-")
      .slice(-rapNum)
      .join("-");
    const typeWithoutTone1 = result.type_without_tone
      .split("-")
      .slice(-rapNum1)
      .join("-");
    // 获取最终要押韵的有音调韵母
    const typeWithToneArr = result.type_with_tone.split("-");
    const num = toneType > 1 ? rapNum : toneType;
    const num1 = toneType1 > 1 ? rapNum1 : toneType1;
    const typeWithTone = num === 0 ? "" : typeWithToneArr.slice(-num).join("-");
    const typeWithTone1 = typeWithToneArr.slice(-num1).join("-");
    try {
      // 并发查询不同长度的词
      const [words1, words2, words3, words4, words5] = await Promise.all([
        isSearchSingle
          ? this.getWordsFromModelLike({
              word: word.charAt(word.length - 1),
              type_with_tone: typeWithTone1,
              type_without_tone: typeWithoutTone1,
              length: word.length === 1 ? 2 : word.length,
              num: 100,
            })
          : [],
        this.getWordsFromModelLike({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 2,
          num: 100,
        }),
        this.getWordsFromModelLike({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 3,
          num: 50,
        }),
        this.getWordsFromModelLike({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 4,
          num: 50,
        }),
        this.getWordsFromModelLike({
          word,
          type_with_tone: typeWithTone,
          type_without_tone: typeWithoutTone,
          length: 5,
          num: 40,
        }),
        // [],
        // [],
        // [],
      ]);
      return success({
        single: words1,
        real: [words2, words3, words4, words5],
      });
    } catch (err) {
      return systemErr(err) as ApiResponse<WordServiceReturn>;
    }
  }

  /**
   * 获取指定长度的押韵词汇
   */
  async getWords({
    word,
    rap_num,
    tone_type,
    length,
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
    if (word === "") {
      return success([]);
    }

    await this.ensureConnection();

    const rapNum = safeParseInt(rap_num);
    const toneType = safeParseInt(tone_type);
    const wordLength = safeParseInt(length, 2);
    const result = getWordInfo(word); // 获取处理后的单词拼音

    // 获取最终要押韵的无音调韵母
    const typeWithoutTone = result.type_without_tone
      .split("-")
      .slice(-rapNum)
      .join("-");
    // 获取最终要押韵的有音调韵母
    const typeWithToneArr = result.type_with_tone.split("-");
    const num = toneType > 1 ? rapNum : toneType;
    const typeWithTone = num === 0 ? "" : typeWithToneArr.slice(-num).join("-");

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
      order: [["rate", "DESC"]],
    });

    return results.map((item) => item.toJSON() as Rhythm);
  }

  private async getWordsFromModelLike({
    word,
    type_with_tone,
    type_without_tone,
    length,
    num,
  }: QueryWordsParams): Promise<Rhythm[]> {
    const WordModel = getWordModel();

    if (!type_without_tone) {
      return [];
    }

    // 解析搜索词的押韵模式
    const parts = type_with_tone.split("-");
    if (parts.length < 2) {
      // 如果只有一个部分，使用原来的简单匹配
      const results = await WordModel.findAll({
        where: {
          word: { [Op.ne]: word },
          type_without_tone: { [Op.like]: `%${type_without_tone}` },
          type_with_tone: type_with_tone
            ? { [Op.like]: `%${type_with_tone}` }
            : undefined,
          length: length > 5 ? { [Op.gte]: length } : { [Op.eq]: length || 2 },
        },
        offset: 0,
        limit: num || 50,
        order: [["rate", "DESC"]],
      });
      return results.map((item) => item.toJSON() as Rhythm);
    }

    // 获取最后一个部分（必须完全匹配）
    const lastPart = parts[parts.length - 1];
    // 获取倒数第二个部分的小数点后数字
    // const penultimatePart = parts[parts.length - 2];
    // const penultimateMatch = penultimatePart.match(/\.(\d+)$/);
    // const penultimateSuffix = penultimateMatch ? penultimateMatch[1] : "";
    const penultimatePart = parts[parts.length - 2];
    const penultimateSuffix = penultimatePart.includes(".")
      ? penultimatePart.split(".")[1]
      : "";
    const typeLike = `%.${penultimateSuffix}-${lastPart}`;
    // 使用原生 SQL 查询（兼容 MySQL 5.7+）
    const sequelize = WordModel.sequelize;
    if (!sequelize) {
      throw new Error("Sequelize instance not found");
    }

    const query = `
      SELECT * FROM word 
      WHERE word != ?
        AND length ${length > 5 ? ">=" : "="} ?
        ${type_with_tone ? "AND type_with_tone LIKE ?" : ""}
        AND (
          -- 精确的押韵匹配
          (
            -- 最后一个部分完全匹配
            SUBSTRING_INDEX(type_with_tone, '-', -1) = ?
            AND 
            -- 倒数第二个部分的小数点后数字匹配
            SUBSTRING_INDEX(SUBSTRING_INDEX(type_with_tone, '.', -2), '-', 1) = ?
            -- AND 
            -- 确保至少有两个部分
            -- CHAR_LENGTH(type_with_tone) - CHAR_LENGTH(REPLACE(type_with_tone, '-', '')) >= 1
          )
          -- OR 
          -- 兼容原有匹配
          -- type_without_tone LIKE ?
          -- OR 
          -- type_without_tone = ?
        )
      ORDER BY rate DESC
      LIMIT ?
    `;

    const replacements = [
      word,
      length || 2,
      // ...(type_with_tone ? [`%${type_with_tone}`] : []),
      typeLike,
      lastPart,
      penultimateSuffix,
      // `%-${type_without_tone}`,
      // type_without_tone,
      num || 50,
    ];

    // console.log("SQL查询:", { query, replacements });

    const results = await sequelize.query(query, {
      replacements,
      // type: sequelize.QueryTypes.SELECT
      type: QueryTypes.SELECT,
    });
    // console.warn("查询到的结果数:", results);
    return results as Rhythm[];
  }
}

const wordService = new WordService();
export default wordService;
