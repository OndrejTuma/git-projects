import simpleGit from 'simple-git'
import Cors from 'cors'

import initMiddleware from '../../../lib/initMiddleware'
import projectDir from '../../../consts/projectDir'

// Initialize the cors middleware
const cors = initMiddleware(
  // You can read more about the available options here: https://github.com/expressjs/cors#configuration-options
  Cors({
    // Only allow requests with GET, POST and OPTIONS
    methods: ['GET', 'POST', 'OPTIONS'],
  })
)

// create branch
export default async (req, res) => {
  await cors(req, res)

  const { branchName, workingDir } = JSON.parse(req.body)

  if (!workingDir || !branchName) {
    res.status(400).json({error: true, message: 'Branch name or Working Dir missing'})

    return
  }

  const git = simpleGit(projectDir + workingDir)

  const { all } = await git.branchLocal()

  // Branch does not exists, create one
  if (!all.find(name => name === branchName)) {
    await git.fetch()
    await git.branch(['--no-track', branchName, 'origin/master'])
  }
  // checkout branch
  await git.checkout(branchName)

  res.status(200).json({ success: true })
}
