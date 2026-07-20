const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

let schemaReady = null;
function ensureSchema() {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS members (
        nickname    TEXT PRIMARY KEY,
        mbti        TEXT NOT NULL,
        alias       TEXT NOT NULL,
        member_group TEXT NOT NULL,
        pct         JSONB NOT NULL,
        tested_at   TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `;
  }
  return schemaReady;
}

module.exports = async function handler(req, res) {
  try {
    await ensureSchema();

    if (req.method === 'GET') {
      const rows = await sql`
        SELECT nickname, mbti, alias, member_group AS "group", pct, tested_at AS date
        FROM members
        ORDER BY tested_at DESC
      `;
      res.status(200).json(rows);
      return;
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'object' && req.body !== null
        ? req.body
        : JSON.parse(req.body || '{}');
      const { nickname, mbti, alias, group, pct, date } = body;

      if (!nickname || !mbti || !alias || !group || !pct) {
        res.status(400).json({ error: 'nickname, mbti, alias, group, pct는 필수입니다.' });
        return;
      }

      await sql`
        INSERT INTO members (nickname, mbti, alias, member_group, pct, tested_at)
        VALUES (${nickname}, ${mbti}, ${alias}, ${group}, ${JSON.stringify(pct)}, ${date || new Date().toISOString()})
        ON CONFLICT (nickname) DO UPDATE SET
          mbti = EXCLUDED.mbti,
          alias = EXCLUDED.alias,
          member_group = EXCLUDED.member_group,
          pct = EXCLUDED.pct,
          tested_at = EXCLUDED.tested_at
      `;
      res.status(200).json({ ok: true });
      return;
    }

    if (req.method === 'DELETE') {
      const nickname = req.query && req.query.nickname;
      if (!nickname) {
        res.status(400).json({ error: 'nickname 쿼리 파라미터가 필요합니다.' });
        return;
      }
      await sql`DELETE FROM members WHERE nickname = ${nickname}`;
      res.status(200).json({ ok: true });
      return;
    }

    res.status(405).json({ error: 'method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'server error' });
  }
};
