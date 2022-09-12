const connection = require('mongowave')
const loki = require('lokijs')
const { MongoMemoryServer } = require('mongodb-memory-server')

async function run() {
  const db = await connection({ name: 'firmalisten' })

  // Start mongodb memory server
  const mongod = await MongoMemoryServer.create()
  const url = mongod.getUri()

  console.log({ url })

  const memdb = await connection({
    url,
    timestamps: false
  })

  // Load data into memory (LokiJS)
  console.time('Load Loki')

  var mem = new loki('firmalisten.db')
  var cache = mem.addCollection('company')

  let max = 0
  let count = 0
  let limit = 100000
  let skip = 0
  let page = 0
  const total = await db('company').count()

  console.log({ total })

  // process.exit(0)

  let data = [],
    size = 0

  while (count < (max || total)) {
    skip = page++ * limit
    const docs = await db('company').find({}, { skip, limit })

    console.time('Insert memserver')
    await memdb('company').create(docs)
    console.timeEnd('Insert memserver')

    for (const doc of docs) {
      cache.insert(doc)
      data.push(doc)
      size += JSON.stringify(doc).length
    }
    count += docs.length
    console.log(count)
  }
  console.timeEnd('Load Loki')

  console.log({ size })

  const memCount = await memdb('company').count()
  console.log({ memCount })

  let result

  console.time('Test DB 1')
  result = await db('company').find(
    { hasWebsite: true, baStreet: 'something' },
    { limit: 20 }
  )
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test DB 1')
  console.log('\n')

  console.time('Test Memory DB 1')
  result = await memdb('company').find(
    { hasWebsite: true, baStreet: 'something' },
    { limit: 20 }
  )
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test Memory DB 1')
  console.log('\n')

  console.time('Test Loki 1')
  result = cache
    .chain()
    .find({ hasWebsite: true, baStreet: 'something' })
    .limit(10)
    .data()
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test Loki 1')
  console.log('\n')

  console.time('Test JS 1')
  result = data.filter(
    (doc) => doc.hasWebsite === true && doc.baStreet === 'something'
  )
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test JS 1')
  console.log('\n')

  console.time('Test DB 2')
  result = await db('company').find(
    {
      hasWebsite: true,
      isActive: true,
      countyName: 'VIKEN'
    },
    { limit: 20 }
  )
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test DB 2')
  console.log('\n')

  console.time('Test Memory DB 2')
  result = await memdb('company').find(
    {
      hasWebsite: true,
      isActive: true,
      countyName: 'VIKEN'
    },
    { limit: 20 }
  )
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test Memory DB 2')
  console.log('\n')

  console.time('Test Loki 2')
  result = cache
    .chain()
    .find({
      hasWebsite: true,
      isActive: true,
      countyName: 'VIKEN'
    })
    .limit(20)
    .data()
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test Loki 2')
  console.log('\n')

  console.time('Test JS 2')
  result = data.filter((doc) => {
    return (
      doc.hasWebsite === true &&
      doc.isActive === true &&
      doc.countyName === 'VIKEN'
    )
  })
  console.log(`Found ${result.length} results`)
  console.timeEnd('Test JS 2')
  console.log('\n')

  await mongod.stop()

  process.exit(0)
}

run()
