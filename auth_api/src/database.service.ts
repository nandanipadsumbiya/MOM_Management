import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseService {

  private pool;

  constructor() {
    //console.log("DB HOST:", process.env.DB_HOST);

    this.pool = mysql.createPool({
      host: "mysql-3a0342cd-nandanipadsumbiya-312b.a.aivencloud.com",
      port: 10919,
      user: "avnadmin",
      password: process.env.DB_PASSWORD,
      database:  "defaultdb",
      
      ssl: {
        rejectUnauthorized: true
      },

      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });
  }

  async query(sql: string, params: any[] = []) {
    const [rows] = await this.pool.execute(sql, params);
    return rows;
  }
}