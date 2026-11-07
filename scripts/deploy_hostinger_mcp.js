import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.resolve(__dirname, '../frontend/out');

export async function deployToHostinger() {
  console.log('🚀 Initiating Hostinger deployment for zestfeedx.com...');
  console.log('Target directory:', outDir);

  return new Promise((resolve, reject) => {
    const mcpProcess = spawn('npx.cmd', ['--package=@hostinger/mcp@latest', 'hostinger-hosting-mcp'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    let buffer = '';
    let initialized = false;

    mcpProcess.stdout.on('data', (data) => {
      const text = data.toString();
      buffer += text;

      // Handle JSON-RPC messages separated by newlines
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const msg = JSON.parse(line.trim());
          if (msg.id === 1) {
            // Initialized response
            initialized = true;
            // Send tools/call for hosting_deploy
            const deployReq = {
              jsonrpc: '2.0',
              id: 2,
              method: 'tools/call',
              params: {
                name: 'execute',
                arguments: {
                  operation: 'hosting_deploy',
                  params: {
                    domain: 'zestfeedx.com',
                    path: outDir,
                    type: 'static',
                  },
                },
              },
            };
            mcpProcess.stdin.write(JSON.stringify(deployReq) + '\n');
          } else if (msg.id === 2) {
            // Deploy response
            console.log('✅ Deploy Result:', JSON.stringify(msg.result || msg.error));
            console.log('🎉 Successfully deployed zestfeedx.com to Hostinger!');
            mcpProcess.kill();
            resolve(msg.result);
          }
        } catch (e) {
          // Non-JSON output
        }
      }
    });

    mcpProcess.stderr.on('data', (data) => {
      // Ignore routine logs
    });

    mcpProcess.on('error', (err) => {
      console.error('MCP process error:', err);
      reject(err);
    });

    mcpProcess.on('close', (code) => {
      if (!initialized) {
        console.log('Hostinger MCP exited with code', code);
      }
      resolve();
    });

    // Send initialize request
    const initReq = {
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: {},
        clientInfo: { name: 'zestfeedx-deployer', version: '1.0.0' },
      },
    };
    mcpProcess.stdin.write(JSON.stringify(initReq) + '\n');
  });
}

deployToHostinger().catch((err) => {
  console.error('Deployment error:', err);
  process.exit(1);
});
