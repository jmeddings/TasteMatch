const serverless = require('serverless-http')

let coldStartInitPromise

async function loadSecretsOnColdStart() {
  if (process.env.IS_OFFLINE) {
    try {
      // eslint-disable-next-line global-require
      require('dotenv').config()
    } catch (e) {
      console.warn('dotenv load failed (offline):', e)
    }
    return
  }

  const secretsId = process.env.SECRETS_ID
  if (!secretsId) return

  try {
    // eslint-disable-next-line global-require
    const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager')

    const client = new SecretsManagerClient({})
    const resp = await client.send(new GetSecretValueCommand({ SecretId: secretsId }))

    const secretString = resp.SecretString
    if (!secretString) return

    const json = JSON.parse(secretString)

    for (const [key, value] of Object.entries(json)) {
      if (value === undefined || value === null) continue
      if (process.env[key] === undefined) process.env[key] = String(value)
    }
  } catch (e) {
    // Cold start must never throw
    console.warn('Secrets Manager load failed:', e)
  }
}

function ensureColdStartInit() {
  if (!coldStartInitPromise) {
    coldStartInitPromise = loadSecretsOnColdStart()
  }
  return coldStartInitPromise
}

// Handler
const handler = async (event, context) => {
  await ensureColdStartInit()

  // Require app after secrets initialization so config is available
  // eslint-disable-next-line global-require
  const { app } = require('./app')
  const proxy = serverless(app)

  return proxy(event, context)
}

module.exports = { handler }
