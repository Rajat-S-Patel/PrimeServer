const { Worker } = require('worker_threads')

const runService = (workerData) => {
    console.log('1');
  return new Promise((resolve, reject) => {
    const worker = new Worker('./myWorker.js', { workerData });
    worker.on('message', resolve);
    worker.on('error', reject);
    worker.on('exit', (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    })
  }).then(console.log('completed'));
}

const run = async () => {
  console.log('first');
  const result = await runService('world')
  console.log('test');
  console.log(result);
}

run().catch(err => console.error(err))