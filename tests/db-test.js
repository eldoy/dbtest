const assert = require('assert')
const mongowave = require('mongowave')
const sqlite3 = require('sqlite3').verbose()

async function run() {
  console.log('Setting up connections')

  const db = await mongowave({ name: 'firmalisten' })
  const count = await db('company').count()
  console.log({ count })
  assert(count > 0)

  const dbram = await mongowave({
    name: 'firmalisten',
    url: 'mongodb://localhost:27018'
  })
  const ramcount = await dbram('company').count()
  console.log({ ramcount })
  assert(ramcount > 0)

  let result

  console.log('Running db test')

  // 1. Normal Mongodb
  console.time('mongodb')
  result = await db('company').find({ baStreet: 'hello' })
  console.log(result)
  console.timeEnd('mongodb')

  // 2. Ramdisk Mongodb
  console.time('mongodb ramdisk')
  result = await dbram('company').find({ baStreet: 'hello' })
  console.log(result)
  // await dbram('company').delete()
  console.timeEnd('mongodb ramdisk')

  // 3. Redis
  console.time('redis')
  console.timeEnd('redis')

  // 4. Sqlite normal
  console.time('sqlite')
  console.timeEnd('sqlite')

  // 5. Sqlite memory
  console.time('sqlite ramdisk')
  console.timeEnd('sqlite ramdisk')

  process.exit(0)
}

run()
