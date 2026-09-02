import type { Registration } from '../types/registration';

export const WEB3FORMS_ACCESS_KEY = '5cdcb0d8-1706-4a19-9e9c-6cd2f5c5a599';

export async function submitToWeb3Forms(record: Registration): Promise<boolean> {
  try {
    const payload = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `🏆 New Registration: ${record.eventName} - Squad "${record.teamName}" [ID: ${record.id}]`,
      from_name: 'RYVANTA Innovation Challenge',
      registration_id: record.id,
      event_name: record.eventName,
      squad_name: record.teamName,
      leader_name: record.leaderName || record.members[0] || 'N/A',
      leader_email: record.leaderEmail || record.email,
      leader_phone: record.leaderPhone || record.phone,
      institution_name: record.institution || 'N/A',
      challenge_track: record.track || record.domain || 'N/A',
      squad_size: record.memberCount,
      all_members: record.members.join(', '),
      member_breakdown: record.memberDetails
        ? JSON.stringify(record.memberDetails)
        : record.members.join(', '),
      registration_fee: `INR ${record.feeAmount}`,
      payment_status: record.paymentStatus,
      transaction_utr_reference: record.upiRef || 'N/A',
      payment_screenshot_attached: record.paymentScreenshot ? 'YES (Base64 Proof Recorded)' : 'NO',
      registered_at: new Date(record.createdAt).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata'
      })
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json().catch(() => null);
    if (result && result.success) {
      return true;
    }
    return false;
  } catch (err) {
    console.warn('Web3Forms submission note:', err);
    return false;
  }
}
