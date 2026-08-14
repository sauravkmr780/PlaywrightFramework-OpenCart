import fs from 'fs';
import { parse } from 'csv-parse/sync';

export class DataProvider {
  // Read Json Data
  static getTestdataFromJson(filepath: string) {
    const data = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    return data;
  }

  // Read CSV Data
  static getTestdataFromCsv(filepath: string):any[] {
    const data = parse(fs.readFileSync(filepath, 'utf8'), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });
    return data;
  }
}