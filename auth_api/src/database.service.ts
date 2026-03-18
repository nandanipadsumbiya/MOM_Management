import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql2/promise'

@Injectable()
export class DatabaseService {
  pool = mysql.createPool({
    host:"localhost",
    user:"root",
    password:"NP5337@np",
    database:"meetingManegment"
  });
  async query(sql:string,values:any[]){
    const [rows] = await this.pool.execute(sql,values);
    return rows;
  }
}