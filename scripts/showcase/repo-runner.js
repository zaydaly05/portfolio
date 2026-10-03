const { spawn, execSync } = require('child_process');
const net = require('net');
const path = require('path');

/**
 * Isolated Application Runner & Port Manager
 * Starts repository applications on dynamic ports and monitors startup readiness.
 */

async function getAvailablePort(startPort = 4050) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(startPort, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
    server.on('error', () => {
      resolve(getAvailablePort(startPort + 1 + Math.floor(Math.random() * 10)));
    });
  });
}

async function waitForServerReady(url, maxWaitMs = 35000, pollIntervalMs = 1000) {
  const startTime = Date.now();
  console.log(`[Runner] Waiting for server at ${url} to become ready...`);

  while (Date.now() - startTime < maxWaitMs) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (res.status >= 200 && res.status < 500) {
        console.log(`[Runner] Server ready at ${url} (Status HTTP ${res.status})!`);
        return true;
      }
    } catch (err) {
      // Server not accepting connections yet
    }
    await new Promise(r => setTimeout(r, pollIntervalMs));
  }
  console.warn(`[Runner] Server readiness check timed out for ${url}`);
  return false;
}

function stopProcessTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === 'win32') {
      execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
    } else {
      process.kill(-pid, 'SIGKILL');
    }
  } catch (err) {
    // Ignore already terminated processes
  }
}

async function startProject(analysisResult, options = {}) {
  const { repoPath, installCmd, startCmd } = analysisResult;
  const appDir = analysisResult.appDir || repoPath;
  const timeoutMs = options.timeoutMs || 45000;

  if (!startCmd) {
    throw new Error(`No start command available for ${analysisResult.name}`);
  }

  const port = await getAvailablePort();
  const formattedStartCmd = startCmd.replace(/\{PORT\}/g, port.toString());
  const targetUrl = `http://localhost:${port}`;

  console.log(`\n========================================`);
  console.log(`🚀 Starting Project: ${analysisResult.name}`);
  console.log(`   Framework: ${analysisResult.framework}`);
  console.log(`   Working Dir: ${appDir}`);
  console.log(`   Command:   ${formattedStartCmd}`);
  console.log(`   Target:    ${targetUrl}`);
  console.log(`========================================\n`);

  // 1. Install dependencies if needed
  if (installCmd && !options.skipInstall) {
    const nodeModulesExist = fsExists(path.join(appDir, 'node_modules'));
    if (!nodeModulesExist) {
      console.log(`[Runner] Installing dependencies in ${appDir} via: ${installCmd}...`);
      try {
        execSync(installCmd, { cwd: appDir, stdio: 'inherit', timeout: 90000 });
      } catch (iErr) {
        console.warn(`[Runner] Warning during install step: ${iErr.message}`);
      }
    }
  }

  // 2. Spawn Application Process
  const env = {
    ...process.env,
    PORT: port.toString(),
    HOST: 'localhost',
    BROWSER: 'none',
    NODE_ENV: 'development',
    FORCE_COLOR: '0'
  };

  const child = spawn(formattedStartCmd, {
    cwd: appDir,
    shell: true,
    env,
    detached: false
  });

  let logs = '';
  child.stdout.on('data', (d) => {
    logs += d.toString();
  });
  child.stderr.on('data', (d) => {
    logs += d.toString();
  });

  // 3. Wait until server responds to HTTP requests
  const isReady = await waitForServerReady(targetUrl, timeoutMs);

  return {
    port,
    targetUrl,
    process: child,
    isReady,
    logs,
    stop: () => stopProcessTree(child.pid)
  };
}

function fsExists(p) {
  try {
    return require('fs').existsSync(p);
  } catch {
    return false;
  }
}

module.exports = { startProject, getAvailablePort, waitForServerReady, stopProcessTree };
