import type { Registration } from '../types/registration';

export const WEB3FORMS_ACCESS_KEY = '42ca8ea6-f450-4594-b757-e8393c085c81';

export async function submitToWeb3Forms(record: Registration): Promise<boolean> {
  try {
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      from_name: 'RYVANTA 2026 Portal',
      registration_id: record.id,
      event_name: record.eventName,
      team_name: record.teamName || 'N/A',
      leader_name: record.leaderName,
      team_members: record.members.length > 0 ? record.members.join(', ') : 'None',
      team_size: record.memberCount,
      contact_email: record.email,
      contact_phone: record.phone,
      college_name: record.collegeName,
      year_of_study: record.year,
      domain: record.domain || 'N/A',
      fee_amount: `INR ${record.feeAmount}`,
      transaction_id: record.upiRef || 'AUTO_VERIFIED',
      participant_upi_id: record.participantUpiId || 'N/A',
      registered_at: new Date(record.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => null);
    if (result && result.success) {
      console.log('Successfully recorded in Web3Forms cloud database:', result);
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Web3Forms cloud submission notice:', err);
    return false;
  }
}
