/**
 * attn — load a local .env file if there is one (never committed).
 * Imported FIRST by server.js so every other module sees the variables.
 * Hosts like Render inject environment variables directly, so a missing
 * .env is normal there.
 */
try {
  process.loadEnvFile();
} catch {
  /* no .env file — fine */
}
