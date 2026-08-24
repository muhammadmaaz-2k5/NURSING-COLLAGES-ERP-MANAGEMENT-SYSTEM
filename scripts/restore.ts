/**
 * Standalone College Instance Restore Script
 * 
 * Restores:
 * 1. Dedicated PostgreSQL Database (via psql)
 * 2. Uploaded Storage files
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';

const execAsync = promisify(exec);

async function runRestore() {
  const targetFolder = process.argv[2];
  if (!targetFolder) {
    console.error('❌ Usage: npm run restore <path_to_backup_folder>');
    process.exit(1);
  }

  const backupDir = path.resolve(process.cwd(), targetFolder);
  console.log(`🚀 Restoring College Instance from: ${backupDir}...`);

  // 1. Restore Database Dump
  const dumpFile = path.join(backupDir, 'database.sql');
  const dbUrl = process.env.DATABASE_URL;

  try {
    const stat = await fs.stat(dumpFile);
    if (stat.isFile() && dbUrl) {
      console.log(`⏳ Restoring PostgreSQL database from ${dumpFile}...`);
      await execAsync(`psql "${dbUrl}" -f "${dumpFile}"`);
      console.log(`✔ Database restored successfully`);
    }
  } catch (err: any) {
    console.warn(`⚠ Database restore skipped or failed: ${err?.message}`);
  }

  // 2. Restore Files
  const backupUploads = path.join(backupDir, 'uploads');
  const targetUploads = path.resolve(process.cwd(), 'uploads');

  try {
    await fs.cp(backupUploads, targetUploads, { recursive: true });
    console.log(`✔ Uploaded storage files restored`);
  } catch {
    console.log(`ℹ No uploads folder found in backup`);
  }

  console.log(`\n🎉 Restore complete! Ready to start application.\n`);
}

runRestore().catch((err) => {
  console.error('❌ Restore failed:', err);
  process.exit(1);
});
