'use strict'

const fs = require('fs')
const https = require('https')
const path = require('path')
const url = require('url')

const mkdirp = require('mkdirp')
const parser = require('gitignore-parser')

const presets = require('./presets')

const link = 'https://raw.githubusercontent.com/github/gitignore/master/'

const fetchGitignore = ({ types }) => types
  .reduce((acc, type) => acc.concat(presets[type] || type), [])
  .map((type) => {
    const name = `${type}.gitignore`
    const file = path.join(__dirname, `../ignores/${name}`)

    return new Promise((resolve, reject) => {
      const read = () => {
        fs.readFile(file, (err, data) => {
          resolve(parser.compile(data.toString()))
        })
      }

      fs.stat(file, (error) => {
        if (error) {
          const dir = path.dirname(file)

          mkdirp(dir, (err) => {
            if (err) {
              reject(`Could not create a directory ${dir}`)

              return
            }

            https.get(url.resolve(link, name), (res) => {
              if (res.statusCode !== 200) {
                reject(`Could not get the ${name}`)
              }

              res
                .pipe(fs.createWriteStream(file, { flags: 'a' }))
                .on('finish', read)
            })
          })

          return
        }

        read()
      })
    })
  })

module.exports = fetchGitignore
