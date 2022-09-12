const sqlite3 = require('sqlite3').verbose()

const mongo = require('mongowave')

async function run() {
  console.time('Load Data')
  const source = await mongo({ name: 'firmalisten' })
  const docs = await source('company').find({}, { limit: 1000 })
  // const docs = await source('company').find()

  console.timeEnd('Load Data')
  // Set up db
  const db = new sqlite3.Database(':memory:')

  // db.serialize(() => {
  //   db.run('CREATE TABLE lorem (info TEXT)')

  //   const stmt = db.prepare('INSERT INTO lorem VALUES (?)')
  //   for (let i = 0; i < 10; i++) {
  //     stmt.run('Ipsum ' + i)
  //   }
  //   stmt.finalize()

  //   db.each('SELECT rowid AS id, info FROM lorem', (err, row) => {
  //     console.log(row.id + ': ' + row.info)
  //   })
  // })

  // db.close()

  db.serialize(() => {
    // Create table
    db.run(
      `CREATE TABLE company (
        id TEXT,
        name TEXT,
        typeName TEXT,
        typeCode TEXT,
        baStreet TEXT,
        baAreaName TEXT,
        baAreaCode TEXT,
        baMunicipalityName TEXT,
        baMunicipalityCode TEXT,
        baCountyName TEXT,
        baCountyCode TEXT,
        baCountryName TEXT,
        baCountryCode TEXT,
        paStreet TEXT,
        paAreaName TEXT,
        paAreaCode TEXT,
        paMunicipalityName TEXT,
        paMunicipalityCode TEXT,
        paCountyName TEXT,
        paCountyCode TEXT,
        paCountryName TEXT,
        paCountryCode TEXT,
        industry1Name TEXT,
        industry1Code TEXT,
        industry2Name TEXT,
        industry2Code TEXT,
        industry3Name TEXT,
        industry3Code TEXT,
        sectorName TEXT,
        sectorCode TEXT,
        bankrupt TEXT,
        closed TEXT,
        shut TEXT,
        inCompanyRegistry TEXT,
        inVatRegistry TEXT,
        inEmployRegistry TEXT,
        inVoluntaryRegistry TEXT,
        registeredDate TEXT,
        foundedDate TEXT,
        phone TEXT,
        mobile TEXT,
        website TEXT,
        email TEXT,
        lastAccountingYear TEXT,
        mainUnit TEXT,
        employees TEXT,
        lastHireDate TEXT,
        municipalityName TEXT,
        municipalityCode TEXT,
        countyName TEXT,
        countyCode TEXT,
        countryName TEXT,
        countryCode TEXT,
        industryName TEXT,
        industryCode TEXT,
        isActive TEXT,
        isNew TEXT,
        hasWebsite TEXT,
        hasEmployees TEXT
      )`
    )

    const stmt = db.prepare(`INSERT INTO company VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
      ?, ?, ?, ?, ?, ?, ?, ?, ?
    )`)

    for (const doc of docs) {
      const values = []
      for (let i = 0; i < 59; i++) {
        values.push(`test${i + 1}`)
      }
      stmt.run(values)
    }

    stmt.finalize()

    console.time('Load SQL')

    db.all(
      'SELECT * from company WHERE isActive = "test55"',
      function (err, docs) {
        if (err) {
          console.log(err.message)
        }
        console.log(docs)
        console.timeEnd('Load SQL')
      }
    )

    // db.each('SELECT * FROM company', (err, row) => {
    //   console.log(row)
    // })

    // Insert data
    // Query data
  })

  // db.close()

  // process.exit(0)
}

run()
