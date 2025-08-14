const fs = require('fs')
const uploadPath = `${process.env.PWD}/${process.env.UPLOAD_PATH}`
const route = require('path')
const db = require('../../database/mariadb')
const { throws } = require('assert')

module.exports = {
    existsItem: ({ path, name }) => {
        // const result = fs.existsSync(`${uploadPath}/${path || '.'}/${name}`)
        const result = fs.existsSync(route.join(uploadPath, path, name))

        return result
    },

    createItem: async ({ path = '', name, type = 'file' }) => {
        try {
            let result = null
            if (type === 'file') {
                result = fs.writeFile(route.join(uploadPath, path, name), '', () => {
                    db.query('file.createFileDir', [path, name, type, false])
                })
                fs.c
            } else if (type === 'dir' || type === 'folder') {
                result = fs.mkdir(route.join(uploadPath, path, name), { recursive: true }, () => {
                    db.query('file.createFileDir', [path, name, type, false])
                })
            }

        } catch (ex) {
            return ex
        }

    },

    deleteItem: ({ path, name }) => {
        console.log('ballboy deleteItem')
        try {
            fs.rmSync(route.join(uploadPath, path, name), { recursive: true })
            return true
        } catch (ex) {
            throw ex
        }

    },

    renewalFileDb: async () => {
        // path, name, type, open
        await db.query('file.deleteAllFileData')

        let datas = []
        let parents = []

        let roots = fs.readdirSync(uploadPath).map((v) => {
            return {
                path: '',
                name: v,
                type: fs.statSync(`${uploadPath}/${v}`).isDirectory() ? 'dir' : 'file',
                open: false
            }
        })

        while (roots.length !== 0) {

            roots.map((v, i) => {
                const type = fs.statSync(route.join(uploadPath, v.path, v.name)).isDirectory()

                const data = {
                    path: v.path,
                    name: v.name,
                    type: type ? 'dir' : 'file',
                    open: false
                }

                if (type) {
                    let children = fs.readdirSync(route.join(uploadPath, v.path, v.name)).map((child) => {
                        return {
                            path: route.join(v.path, v.name),
                            name: child,
                            type: fs.statSync(route.join(uploadPath, v.path, v.name, child)).isDirectory() ? 'dir' : 'file',
                            open: false
                        }
                    })

                    parents.push(...children)
                }

                datas.push(data)
            })

            roots = [...parents]
            parents = []
        }
        datas.map((v) => {
            console.log([v.path, v.name, v.type, false])

            db.query('file.createFileDir', [v.path, v.name, v.type, false])
        })

    }
}