import fs from 'fs';
import path from 'path';
import { connectDatabase, syncDatabase, WordModel } from '@/lib/database';
import { getWordInfo } from '@/lib/pinyin';

/**
 * 从老项目的数据文件导入词汇
 */
async function importWords() {
  try {
    console.log('开始导入词汇数据...');
    
    // 连接数据库
    await connectDatabase();
    await syncDatabase();
    
    // 读取老项目的数据文件
    const dataDir = path.join(process.cwd(), 'old_project', 'data');
    const files = [
      'THUOCL_animal.txt',
      'THUOCL_caijing.txt',
      'THUOCL_car.txt',
      'THUOCL_chengyu.txt',
      'THUOCL_food.txt',
      'THUOCL_it.txt',
      'THUOCL_law.txt',
      'THUOCL_lishimingren.txt',
      'THUOCL_medical.txt',
      'THUOCL_place.txt',
      'THUOCL_poem.txt',
    ];
    
    let totalImported = 0;
    
    for (const fileName of files) {
      const filePath = path.join(dataDir, fileName);
      
      if (fs.existsSync(filePath)) {
        console.log(`正在处理文件: ${fileName}`);
        
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(line => line.trim());
        
        const words = [];
        for (const line of lines) {
          const parts = line.trim().split('\t');
          if (parts.length >= 2) {
            const word = parts[0].trim();
            const rate = parseInt(parts[1]) || 0;
            
            if (word && word.length >= 2 && word.length <= 6) {
              const wordInfo = getWordInfo(word, rate);
              words.push(wordInfo);
            }
          }
          
          // 批量插入，每1000条处理一次
          if (words.length >= 1000) {
            await WordModel.bulkCreate(words, { 
              ignoreDuplicates: true,
              updateOnDuplicate: ['rate'] 
            });
            totalImported += words.length;
            console.log(`已导入 ${totalImported} 条数据`);
            words.length = 0; // 清空数组
          }
        }
        
        // 处理剩余的数据
        if (words.length > 0) {
          await WordModel.bulkCreate(words, { 
            ignoreDuplicates: true,
            updateOnDuplicate: ['rate'] 
          });
          totalImported += words.length;
        }
        
        console.log(`文件 ${fileName} 处理完成`);
      }
    }
    
    console.log(`词汇数据导入完成，总计导入 ${totalImported} 条数据`);
  } catch (error) {
    console.error('导入词汇数据失败:', error);
  }
}

// 运行导入
if (require.main === module) {
  importWords();
}

export { importWords };
