const { spawn } = require('child_process');

async function run(command, args, discardPager) {
  return new Promise((resolve, reject) => {
    let stdall = '';
    let stdout = '';
    let stderr = '';
    let env = process.env;
    if (discardPager) {
      env.TERM = 'dumb';
      delete env.MANPAGER;
      delete env.PAGER;
    }
    const cmd = spawn(command, args, { env: env });

    cmd.stdout.on('data', (data) => {
      data = data.toString();
      stdall += data;
      stdout += data;
    });

    cmd.stderr.on('data', (data) => {
      data = data.toString();
      stdall += data;
      stderr += data;
    });

    cmd.on('close', (code) => {
      resolve({
        code: code,
        stdall: stdall,
        stdout: stdout,
        stderr: stderr,
      });
    });

    cmd.on('error', (err) => {
      reject(new Error(`Unable to spawn child process: ${err}`));
    });
  });
}

module.exports = {
  run: run,
};
