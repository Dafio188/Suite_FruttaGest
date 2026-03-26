import { spawn } from 'child_process';
const child = spawn('node', ['--env-file=.env.local', 'server.js'], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
});
child.on('exit', (c) => console.log('node exited with', c));
