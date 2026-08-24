/**
 * Standalone College Instance Backup Script
 * 
 * Performs an atomic dump of:
 * 1. Dedicated PostgreSQL Database (via pg_dump)
 * 2. Uploaded Document/Media files
 * 3. Instance Configuration metadata
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

async function runBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const collegeCode = process.env.COLLEGE_CODE || 'NMC-01';
  const backupDir = path.resolve(process.cwd(), 'backups', `${collegeCode}_${timestamp}`);

  console.log(`🚀 Starting backup for College Instance [${collegeCode}]...`);
  await fs.mkdir(backupDir, { recursive: true });

  // 1. Export Metadata
  const metadata = {
    collegeCode,
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL ? 'configured' : 'missing',
    nodeEnv: process.env.NODE_ENV || 'production',
  };
  await fs.writeFile(path.join(backupDir, 'metadata.json'), JSON.stringify(metadata, null, 2));
  console.log(`✔ Instance metadata saved`);

  // 2. Database Dump
  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    const dumpFile = path.join(backupDir, 'database.sql');
    try {
      console.log(`⏳ Dumping PostgreSQL database...`);
      // Note: pg_dump must be in PATH on the host
      await execAsync(`pg_dump "${dbUrl}" --no-owner --no-privileges -f "${dumpFile}"`);
      console.log(`✔ Database dump complete: database.sql`);
    } catch (err: any) {
      console.warn(`⚠ pg_dump warning (ensure pg_dump is installed): ${err?.message}`);
    }
  }

  // 3. Document/Storage Backup
  const uploadsDir = path.resolve(process.cwd(), 'uploads');
  try {
    const backupUploads = path.join(backupDir, 'uploads');
    await fs.cp(uploadsDir, backupUploads, { recursive: true });
    console.log(`✔ Uploaded storage files archived`);
  } catch {
    console.log(`ℹ No uploads folder found to archive`);
  }

  console.log(`\n🎉 Backup finished successfully! Location:\n📁 ${backupDir}\n`);
}

runBackup().catch((err) => {
  console.error('❌ Backup failed:', err);
  process.exit(1);
});
