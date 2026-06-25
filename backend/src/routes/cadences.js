import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

const mapCadenceRow = (row) => ({
  id: String(row.id),
  name: row.name,
  persona: row.persona,
  campaign: row.campaign,
  type: row.type,
  status: row.status,
  archived: row.archived,
  duration: row.duration,
  steps: row.steps || [],
  people_added: row.people_added,
  people_started: row.people_started,
  people_finished: row.people_finished,
  bounced: row.bounced,
  reply_rate: parseFloat(row.reply_rate) || 0,
  click_rate: parseFloat(row.click_rate) || 0,
  open_rate: parseFloat(row.open_rate) || 0,
  meeting_rate: parseFloat(row.meeting_rate) || 0,
  success_rate: parseFloat(row.success_rate) || 0,
  created_by: row.created_by,
  created_at: row.created_at,
});

/**
 * GET /api/cadences
 * List all cadences stored in Postgres
 */
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM cadences ORDER BY created_at DESC');
    res.json({ cadences: result.rows.map(mapCadenceRow) });
  } catch (error) {
    console.error('Error fetching cadences:', error);
    res.status(500).json({ error: 'Failed to fetch cadences' });
  }
});

/**
 * POST /api/cadences
 * Create a new cadence (with its generated steps) in Postgres
 */
router.post('/', async (req, res) => {
  try {
    const {
      name, persona, campaign, type, duration, steps,
      status = 'draft', created_by = null
    } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Cadence name is required' });
    }

    const result = await query(
      `INSERT INTO cadences (name, persona, campaign, type, status, duration, steps, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, persona, campaign, type, status, duration, JSON.stringify(steps || []), created_by]
    );

    if (result.rowCount === 0) {
      return res.status(503).json({ error: 'Database not available' });
    }

    res.status(201).json(mapCadenceRow(result.rows[0]));
  } catch (error) {
    console.error('Error creating cadence:', error);
    res.status(500).json({ error: 'Failed to create cadence' });
  }
});

/**
 * PUT /api/cadences/:id
 * Update an existing cadence (e.g. after regenerating steps)
 */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { steps, status, archived } = req.body;

    const result = await query(
      `UPDATE cadences SET
         steps = COALESCE($1, steps),
         status = COALESCE($2, status),
         archived = COALESCE($3, archived),
         updated_at = CURRENT_TIMESTAMP
       WHERE id = $4
       RETURNING *`,
      [steps ? JSON.stringify(steps) : null, status, archived, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Cadence not found' });
    }

    res.json(mapCadenceRow(result.rows[0]));
  } catch (error) {
    console.error('Error updating cadence:', error);
    res.status(500).json({ error: 'Failed to update cadence' });
  }
});

/**
 * GET /api/cadences/emails
 * List all generated emails stored in Postgres (across all cadences)
 */
router.get('/emails', async (req, res) => {
  try {
    const result = await query('SELECT * FROM generated_emails ORDER BY created_at DESC');
    res.json({ emails: result.rows.map(row => ({
      id: row.id,
      subject: row.subject,
      body: row.body,
      prospectName: row.prospect_name,
      companyName: row.company_name,
      cadenceName: row.cadence_name,
      cadenceType: row.cadence_type,
      industry: row.industry,
      stepDay: row.step_day,
      grade: row.grade,
      gradeReason: row.grade_reason,
      additionalContext: row.additional_context,
      generatedAt: row.created_at,
      cadenceId: row.cadence_id
    })) });
  } catch (error) {
    console.error('Error fetching generated emails:', error);
    res.status(500).json({ error: 'Failed to fetch generated emails' });
  }
});

/**
 * PUT /api/cadences/emails/:emailId/rating
 * Add or update a rating criterion for a Postgres-backed generated email
 */
router.put('/emails/:emailId/rating', async (req, res) => {
  try {
    const { emailId } = req.params;
    const { criterion, score } = req.body;

    if (!criterion || score === undefined) {
      return res.status(400).json({ error: 'Criterion and score are required' });
    }

    await query('DELETE FROM email_ratings WHERE email_id = $1 AND criterion = $2', [emailId, criterion]);
    const result = await query(
      `INSERT INTO email_ratings (email_id, criterion, score) VALUES ($1, $2, $3) RETURNING *`,
      [emailId, criterion, score]
    );

    if (result.rowCount === 0) {
      return res.status(503).json({ error: 'Database not available' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving email rating:', error);
    res.status(500).json({ error: 'Failed to save email rating' });
  }
});

/**
 * POST /api/cadences/emails/:emailId/comment
 * Add a comment for a Postgres-backed generated email
 */
router.post('/emails/:emailId/comment', async (req, res) => {
  try {
    const { emailId } = req.params;
    const { comment } = req.body;

    if (!comment || !comment.trim()) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    const result = await query(
      `INSERT INTO email_comments (email_id, comment) VALUES ($1, $2) RETURNING *`,
      [emailId, comment.trim()]
    );

    if (result.rowCount === 0) {
      return res.status(503).json({ error: 'Database not available' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving email comment:', error);
    res.status(500).json({ error: 'Failed to save email comment' });
  }
});

/**
 * POST /api/cadences/:id/emails
 * Save a generated email for a cadence step into Postgres
 */
router.post('/:id/emails', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subject, body, prospectName, companyName, cadenceType,
      industry, stepDay, additionalContext
    } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ error: 'subject and body are required' });
    }

    const cadenceId = id === 'null' || id === 'undefined' ? null : id;

    const result = await query(
      `INSERT INTO generated_emails
         (cadence_id, subject, body, prospect_name, company_name, cadence_type, industry, step_day, additional_context)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [cadenceId, subject, body, prospectName, companyName, cadenceType, industry, stepDay, additionalContext]
    );

    if (result.rowCount === 0) {
      return res.status(503).json({ error: 'Database not available' });
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving generated email:', error);
    res.status(500).json({ error: 'Failed to save generated email' });
  }
});

export default router;