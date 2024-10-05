const mariadb = require('mysql2')
const fs = require('fs')
const path = require('path')

const db = mariadb.createPool({
    host: process.env.MARIADB_HOST,
    port: 3306,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DB,
})

const query = async (query, params = [], scheme = false) => {
    try {
        const conn = db.promise()
        const [module, queryFile] = query.split('.')

        console.log('[ballboy database] >>> ', params)
        const [rows, fields] = await conn.execute(fs.readFileSync(path.join(process.cwd(), 'api', module, 'query', `${queryFile}.sql`)).toString(), params);

        return {
            data: rows,
            ...(scheme && { fields: fields })
        }
    } catch (ex) {
        throw ex
    }
}

const test = (param) => {
    const [module, query] = param.split('.')
    console.log(module, query)
    console.log(fs.readFileSync(path.join(process.cwd(), 'api', module, 'query', `${query}.sql`)).toString())

}

module.exports = {
    query: query,
    test: test
}