import { Sequelize, DataTypes, Model } from 'sequelize';

// 数据库配置
const config = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'rap_db',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
};

// 创建 Sequelize 实例 - 延迟初始化
let sequelize: Sequelize | null = null;

function getSequelize(): Sequelize {
  if (!sequelize) {
    sequelize = new Sequelize(
      config.database,
      config.user,
      config.password,
      {
        host: config.host,
        port: config.port,
        dialect: 'mysql',
        dialectModule: require('mysql2'),
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
        define: {
          freezeTableName: true,
          timestamps: false,
        },
      }
    );
  }
  return sequelize;
}

// Word 模型接口
interface WordAttributes {
  id?: number;
  word: string;
  rate: number;
  initial: string;
  final_with_tone: string;
  final_without_tone: string;
  type_with_tone: string;
  type_without_tone: string;
  length: number;
}

// Word 模型
export class WordModel extends Model<WordAttributes> implements WordAttributes {
  public id!: number;
  public word!: string;
  public rate!: number;
  public initial!: string;
  public final_with_tone!: string;
  public final_without_tone!: string;
  public type_with_tone!: string;
  public type_without_tone!: string;
  public length!: number;
}

// 延迟初始化模型
let modelInitialized = false;

function initializeModel() {
  if (!modelInitialized) {
    const seq = getSequelize();
    
    WordModel.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        word: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        rate: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        initial: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        final_with_tone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        final_without_tone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type_with_tone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        type_without_tone: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        length: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize: seq,
        tableName: 'word',
        modelName: 'Word',
      }
    );
    
    modelInitialized = true;
  }
}

// 数据库连接函数
export async function connectDatabase(): Promise<boolean> {
  try {
    const seq = getSequelize();
    await seq.authenticate();
    console.log('数据库连接成功...');
    
    // 初始化模型
    initializeModel();
    
    return true;
  } catch (error) {
    console.error('数据库连接失败...', error);
    return false;
  }
}

// 同步数据库模型
export async function syncDatabase(): Promise<boolean> {
  try {
    const seq = getSequelize();
    initializeModel();
    await seq.sync({ alter: false });
    console.log('数据库模型同步成功...');
    return true;
  } catch (error) {
    console.error('数据库模型同步失败...', error);
    return false;
  }
}

// 获取 WordModel 实例
export function getWordModel(): typeof WordModel {
  initializeModel();
  return WordModel;
}

export { getSequelize };
export default getSequelize;