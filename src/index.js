#!/usr/bin/env node

'use strict'

const path = require('path')

const program = require('commander')
const cosmiconfig = require('cosmiconfig')

const fetchGitignore = require('./fetchGitignore')
const pckg = require('../package.json')

const rootDir = process.cwd()
const explorer = cosmiconfig(pckg.name)

program
  .version(pckg.version)
  .description('Check if staged files should be ignored by https://github.com/github/gitignore')
  .option('-t, --types <types>', 'Add types separated by ,', val => val.split(','))
  .action((...args) => {
    const files = args.slice(0, -1).map(file => path.relative(rootDir, file))

    explorer
      .load(rootDir)
      .then((result) => {
        const config = Object.assign({}, { types: program.types }, result && result.config)

        return Promise.all(fetchGitignore(config))
          .then((ignores) => {
            const errors = ignores
              .reduce((acc, ignore) => acc.concat(files.find(ignore.denies)), [])
              .filter(Boolean)

            if (errors.length) {
              return Promise.reject(
                `You're going to stage ignored files: \n\n - ${errors.join('\n - ')}`,
              )
            }

            return null
          })
      })
      .then(() => process.exit(0))
      .catch((error) => {
        console.error(error)

        process.exit(1)
      })
  })
  .parse(process.argv)
