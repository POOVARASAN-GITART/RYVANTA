export const WEB3FORMS_ACCESS_KEY = "42ca8ea6-f450-4594-b757-e8393c085c81";

export async function submitToWeb3Forms(record) {
	try {
		const payload = {
			access_key: WEB3FORMS_ACCESS_KEY,
			team_name: record.teamName,
			college_name: record.institution,
			year: record.year || "N/A",
			team_leader_name: record.leaderName,
			email: record.leaderEmail,
			phone_no: record.leaderPhone,
			event_participating: record.eventName,
			domain: record.domain || "N/A",
			how_many_team_members: (record.members?.length || 0) + 1,
			upi_id: record.userUpiId || "N/A",
			transaction_id: record.upiRef || "N/A", // upiRef usually holds the transaction ID from the user
		};

		if (record.members && Array.isArray(record.members)) {
			record.members.forEach((m, idx) => {
				payload[`Team Member ${idx + 1} Name`] = m.name || "N/A";
				payload[`Team Member ${idx + 1} Email`] = m.email || "N/A";
			});
		}

		const response = await fetch("https://api.web3forms.com/submit", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(payload),
		});

		const result = await response.json().catch(() => null);
		if (result && result.success) {
			return true;
		}
		return false;
	} catch (err) {
		console.warn("Web3Forms submission note:", err);
		return false;
	}
}
