#!/usr/bin/env node
import program from 'commander'
import path from 'path'
import fs from 'fs'
import url from 'url'
import simpleGit from "simple-git";
import { getConfig, setConfig } from './config'
import { clone, result as gitResult } from './git'
const git = simpleGit()

program
  .version('0.1.0')

program
  .command('clone <url>')
  .option('-f, --force')
  .action((url, options) => {
    const repoRoot = getConfig()['repoRoot']

    if (repoRoot) {
      const result = clone(url, repoRoot, options.force)
      let log = ''
      switch (result) {
        case gitResult.EXT_NAME_NOT_GIT:
          log = 'External name of given url is not \'.git\'.'
          break
        case gitResult.TARGET_DIR_EXIST:
          log = 'Target directory already exists, use --force to overwirte.'
        case gitResult.SUCCESS:
          log = 'Clone success!'
      }
    } else {
      console.error('Repo root not set')
    }

  })

program
  .command('set <key> <value>')
  .action((key, value) => {
    setConfig(key, value)
  })

program
  .command('get <key>')
  .action((key) => {
    getConfig()[key]
  })

program.parse(process.argv)