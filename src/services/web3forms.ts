import type { Registration } from '../types/registration';

export const WEB3FORMS_ACCESS_KEY = '5cdcb0d8-1706-4a19-9e9c-6cd2f5c5a599';

export async function submitToWeb3Forms(record: Registration): Promise<boolean> {
  try {
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `🏆 New Registration: ${record.eventName} - Team ${record.teamName} [ID: ${record.id}]`,
      from_name: 'RYVANTA 2026 Portal',
      registration_id: record.id,
      event_name: record.eventName,
      team_name: record.teamName,
      members_list: record.members.join(', '),
      team_size: record.memberCount,
      contact_email: record.email,
      contact_phone: record.phone,
      department: record.department || 'N/A',
      domain: record.domain || 'N/A',
      fee_amount: `INR ${record.feeAmount}`,
      payment_status: record.paymentStatus,
      transaction_reference: record.upiRef || 'AUTO_VERIFIED',
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
