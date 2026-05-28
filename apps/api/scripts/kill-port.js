/**
 * Kills any process occupying the given port before the dev server starts.
 * Works on Windows (netstat + taskkill) and Unix (lsof + kill).
 */
const { execSync } = require('child_process');
const port = process.argv[2] || '3001';

try {
  if (process.platform === 'win32') {
    const output = execSync(`netstat -ano`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const lines = output.split('\n').filter((l) => l.includes(`:${port} `) || l.includes(`:${port}\t`));
    const pids = [...new Set(
      lines
        .map((l) => l.trim().split(/\s+/).pop())
        .filter((p) => p && /^\d+$/.test(p) && p !== '0'),
    )];
    if (pids.length === 0) {
      console.log(`Port ${port} is free.`);
    } else {
      pids.forEach((pid) => {
        try {
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
          console.log(`Killed PID ${pid} (was using port ${port})`);
        } catch {
          // Process may have already exited
        }
      });
    }
  } else {
    // Unix/Mac
    const output = execSync(`lsof -ti:${port}`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
    const pids = output.trim().split('\n').filter(Boolean);
    pids.forEach((pid) => {
      try {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
        console.log(`Killed PID ${pid} (was using port ${port})`);
      } catch {
        // Already gone
      }
    });
  }
} catch {
  // Port was free or command failed — safe to continue
}
