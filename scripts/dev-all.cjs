const { spawn } = require('child_process')
const path = require('path')

const root = path.resolve(__dirname, '..')
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const nodeCmd = 'node'

const services = [
  {
    name: 'mock',
    cwd: path.join(root, 'wenjuan-mock'),
    command: nodeCmd,
    args: ['index.js'],
  },
  {
    name: 'admin',
    cwd: path.join(root, 'wenjuan-fe', 'react-program'),
    command: npmCmd,
    args: ['start'],
  },
  {
    name: 'client',
    cwd: path.join(root, 'wenjuan-client'),
    command: npmCmd,
    args: ['run', 'dev'],
  },
]

const children = []

function log(name, data, isError = false) {
  const lines = data.toString().split(/\r?\n/).filter(Boolean)
  for (const line of lines) {
    const message = `[${name}] ${line}`
    if (isError) console.error(message)
    else console.log(message)
  }
}

function startService(service) {
  const command = [service.command, ...service.args].join(' ')
  const child = spawn(command, {
    cwd: service.cwd,
    shell: true,
    env: {
      ...process.env,
      BROWSER: 'none',
    },
  })

  children.push(child)

  child.stdout.on('data', data => log(service.name, data))
  child.stderr.on('data', data => log(service.name, data, true))
  child.on('exit', code => {
    if (code !== 0 && code !== null) {
      console.error(`[${service.name}] exited with code ${code}`)
    }
  })
}

function stopAll() {
  console.log('\nStopping all services...')
  for (const child of children) {
    if (!child.killed) child.kill()
  }
  process.exit()
}

process.on('SIGINT', stopAll)
process.on('SIGTERM', stopAll)

console.log('Starting survey platform...')
console.log('Mock API: http://localhost:3001')
console.log('Admin:    http://localhost:8000')
console.log('Client:   http://localhost:3000')
console.log('Press Ctrl+C to stop all services.\n')

for (const service of services) {
  startService(service)
}
