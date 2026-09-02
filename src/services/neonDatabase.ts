import { neon, type NeonQueryFunction } from '@neondatabase/serverless';
import type { Registration, PaymentStatus } from '../types/registration';

const NEON_STORAGE_KEY = 'ryvanta_neon_connection_string';

// Fallback to environment variable if present
export function getNeonConnectionString(): string {
  try {
    const saved = localStorage.getItem(NEON_STORAGE_KEY);
    if (saved && saved.trim()) return saved.trim();
  } catch {
    // ignore
  }
  return (import.meta as any).env?.VITE_NEON_DATABASE_URL || '';
}

export function saveNeonConnectionString(url: string): void {
  try {
    if (!url.trim()) {
      localStorage.removeItem(NEON_STORAGE_KEY);
    } else {
      localStorage.setItem(NEON_STORAGE_KEY, url.trim());
    }
  } catch {
    // ignore
  }
}

function getClient(connectionString?: string): NeonQueryFunction<false, false> | null {
  const conn = connectionString || getNeonConnectionString();
  if (!conn) return null;
  try {
    return neon(conn);
  } catch (err) {
    console.warn('[Neon.tech] Connection client init error:', err);
    return null;
  }
}

/**
 * Initializes the Neon PostgreSQL table schema if not already present.
 */
export async function initNeonTable(connectionString?: string): Promise<boolean> {
  const sql = getClient(connectionString);
  if (!sql) return false;

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ryvanta_registrations (
        id VARCHAR(50) PRIMARY KEY,
        event_id VARCHAR(50) NOT NULL,
        event_name VARCHAR(200) NOT NULL,
        team_name VARCHAR(200) NOT NULL,
        leader_name VARCHAR(200),
        leader_email VARCHAR(200),
        leader_phone VARCHAR(50),
        institution VARCHAR(255),
        department VARCHAR(100),
        domain VARCHAR(255),
        members JSONB DEFAULT '[]'::jsonb,
        member_details JSONB DEFAULT '[]'::jsonb,
        member_count INT DEFAULT 1,
        payment_status VARCHAR(50) DEFAULT 'verified',
        payment_method VARCHAR(50) DEFAULT 'upi',
        fee_amount INT DEFAULT 300,
        upi_ref VARCHAR(100),
        payment_screenshot TEXT,
        terms_accepted BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Also create index on email and event_id for high performance queries
    await sql`
      CREATE INDEX IF NOT EXISTS idx_ryvanta_leader_email ON ryvanta_registrations (leader_email);
    `;
    await sql`
      CREATE INDEX IF NOT EXISTS idx_ryvanta_event_id ON ryvanta_registrations (event_id);
    `;

    return true;
  } catch (err) {
    console.error('[Neon.tech] Error creating ryvanta_registrations table:', err);
    return false;
  }
}

/**
 * Saves or updates a registration record directly into Neon.tech PostgreSQL.
 */
export async function saveToNeon(record: Registration, connectionString?: string): Promise<boolean> {
  const sql = getClient(connectionString);
  if (!sql) return false;

  try {
    await initNeonTable(connectionString);

    const membersJson = JSON.stringify(record.members || []);
    const memberDetailsJson = JSON.stringify(record.memberDetails || []);

    await sql`
      INSERT INTO ryvanta_registrations (
        id,
        event_id,
        event_name,
        team_name,
        leader_name,
        leader_email,
        leader_phone,
        institution,
        department,
        domain,
        members,
        member_details,
        member_count,
        payment_status,
        payment_method,
        fee_amount,
        upi_ref,
        payment_screenshot,
        terms_accepted,
        created_at,
        updated_at
      ) VALUES (
        ${record.id},
        ${record.eventId},
        ${record.eventName},
        ${record.teamName},
        ${record.leaderName || ''},
        ${record.leaderEmail || record.email || ''},
        ${record.leaderPhone || record.phone || ''},
        ${record.institution || ''},
        ${record.department || ''},
        ${record.track || record.domain || ''},
        ${membersJson}::jsonb,
        ${memberDetailsJson}::jsonb,
        ${record.memberCount || record.members.length || 1},
        ${record.paymentStatus || 'verified'},
        ${record.paymentMethod || 'upi'},
        ${record.feeAmount || 300},
        ${record.upiRef || ''},
        ${record.paymentScreenshot || ''},
        ${record.termsAccepted ?? true},
        ${record.createdAt || new Date().toISOString()},
        ${new Date().toISOString()}
      )
      ON CONFLICT (id) DO UPDATE SET
        payment_status = EXCLUDED.payment_status,
        upi_ref = EXCLUDED.upi_ref,
        payment_screenshot = COALESCE(NULLIF(EXCLUDED.payment_screenshot, ''), ryvanta_registrations.payment_screenshot),
        updated_at = CURRENT_TIMESTAMP;
    `;

    console.log(`[Neon.tech] Successfully saved registration ${record.id} to PostgreSQL database.`);
    return true;
  } catch (err) {
    console.error(`[Neon.tech] Failed to save registration ${record.id}:`, err);
    return false;
  }
}

/**
 * Updates the payment status of a registration in Neon.tech PostgreSQL.
 */
export async function updatePaymentInNeon(
  id: string,
  paymentStatus: PaymentStatus,
  upiRef?: string,
  connectionString?: string
): Promise<boolean> {
  const sql = getClient(connectionString);
  if (!sql) return false;

  try {
    if (upiRef) {
      await sql`
        UPDATE ryvanta_registrations
        SET payment_status = ${paymentStatus},
            upi_ref = ${upiRef},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id};
      `;
    } else {
      await sql`
        UPDATE ryvanta_registrations
        SET payment_status = ${paymentStatus},
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ${id};
      `;
    }
    return true;
  } catch (err) {
    console.error(`[Neon.tech] Error updating payment for ${id}:`, err);
    return false;
  }
}

/**
 * Fetches all registrations stored in Neon.tech PostgreSQL.
 */
export async function fetchFromNeon(connectionString?: string): Promise<Registration[] | null> {
  const sql = getClient(connectionString);
  if (!sql) return null;

  try {
    await initNeonTable(connectionString);
    const rows = await sql`
      SELECT * FROM ryvanta_registrations
      ORDER BY created_at DESC;
    `;

    return rows.map((row: any) => ({
      id: row.id,
      eventId: row.event_id,
      eventName: row.event_name,
      teamName: row.team_name,
      leaderName: row.leader_name,
      leaderEmail: row.leader_email,
      leaderPhone: row.leader_phone,
      institution: row.institution,
      department: row.department,
      domain: row.domain,
      track: row.domain,
      members: Array.isArray(row.members) ? row.members : JSON.parse(row.members || '[]'),
      memberDetails: Array.isArray(row.member_details) ? row.member_details : JSON.parse(row.member_details || '[]'),
      memberCount: row.member_count,
      email: row.leader_email,
      phone: row.leader_phone,
      paymentStatus: row.payment_status as PaymentStatus,
      paymentMethod: row.payment_method,
      feeAmount: row.fee_amount,
      upiRef: row.upi_ref,
      paymentScreenshot: row.payment_screenshot,
      termsAccepted: row.terms_accepted,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));
  } catch (err) {
    console.error('[Neon.tech] Error fetching registrations:', err);
    return null;
  }
}

/**
 * Tests connection to Neon.tech PostgreSQL and returns version or database name.
 */
export async function testNeonConnection(connectionString: string): Promise<{ success: boolean; message: string; version?: string }> {
  try {
    if (!connectionString.trim()) {
      return { success: false, message: 'Connection string is empty.' };
    }
    const sql = neon(connectionString.trim());
    const result = await sql`SELECT version(), current_database(), current_user;`;
    if (result && result.length > 0) {
      const dbName = result[0].current_database;
      const dbUser = result[0].current_user;
      return {
        success: true,
        message: `Successfully connected to Neon.tech Database: "${dbName}" as user "${dbUser}"!`,
        version: result[0].version
      };
    }
    return { success: false, message: 'No result returned from query.' };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Failed to connect to Neon PostgreSQL database.'
    };
  }
}
