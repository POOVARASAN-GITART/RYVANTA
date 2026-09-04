export const REGISTRATION_CLOSES_AT = "2026-09-12T23:59:59";
export const EVENT_STARTS_AT = "2026-09-19T09:00:00";

export const EVENTS = [
	{
		id: "hackathon",
		index: 1,
		name: "Hackathon",
		fullName: "Hackathon",
		tagline: "Eight hours, one working prototype, judged on the build.",
		venue: "Auditorium",
		fee: 100,
		memberCounts: [2, 3],
		domains: [
			"Artificial Intelligence & Machine Learning",
			"IoT & Smart Automation",
			"Cybersecurity & Digital Safety",
			"Computer Vision & Image Processing",
			"Healthcare & Smart Health",
			"Smart Agriculture & Farming",
			"Smart Transportation & Mobility",
		],
		rules: [
			"Teams must consist of 2-3 members.",
			"The Problem Statement will be released via email before the event.",
			"Teams must develop their prototype based on the given problem statement.",
			"Teams must bring the completed prototype for evaluation.",
			"Teams must prepare a Spot PPT during the event.",
			"Teams must bring their own laptops and chargers.",
			"The decision of the judges/organizers is final and binding.",
			"Teams must report on time, repeated late arrival may affect evaluation.",
		],
		agenda: [
			{
				time: "08:30 AM - 09:30 AM",
				task: "Inauguration"
			},
			{
				time: "09:30 AM - 10:30 AM",
				task: "PPT Prepare"
			},
			{
				time: "10:30 AM - 12:30 PM",
				task: "PPT Presentation"
			},
			{
				time: "12:30 PM - 01:00 PM",
				task: "Lunch"
			},
			{
				time: "01:15 PM - 03:00 PM",
				task: "Prototype Evaluation"
			},
			{
				time: "03:00 PM - 03:30 PM",
				task: "Prize Distribution"
			},
		],
		prize: [
			{ place: "1st Prize", amount: "5,000" },
			{ place: "2nd Prize", amount: "3,000" },
		],
	},
	{
		id: "games2d",
		index: 2,
		name: "2D Game Development",
		fullName: "2D Game Development",
		tagline: "Ship a playable 2D game from a themed domain prompt.",
		venue: "HPC Lab",
		fee: 100,
		memberCounts: [2, 3],
		rules: [
			"Teams must consist of 2-3 members.",
			"Every team must bring their own laptop for the competition.",
			"Each team must ensure that their laptop is fully charged and has the required development environment installed before the event.",
			"Game domains/themes will be provided at the beginning of the event, and teams must develop their game based on the provided domain.",
			"Participants are free to use any suitable 2D game engine or development framework of their choice.",
			"Pre-built games or previously developed game projects are strictly not allowed.",
			"The game must be developed and submitted within the specified time limit.",
			"Participants must follow all instructions given by the event coordinators and volunteers throughout the competition.",
		],
		agenda: [
			{
				time: "08:30 AM - 10:00 AM",
				task: "Inauguration"
			},
			{
				time: "10:00 AM - 10:10 AM",
				task: "Check-in and Rules Briefing",
			},
			{
				time: "10:10 AM - 11:10 AM",
				task: "Development 1"
			},
			{
				time: "11:10 AM - 11:25 AM",
				task: "Break"
			},
			{
				time: "11:25 AM - 12:40 PM",
				task: "Round 2"
			},
		],
		prize: [
			{ place: "1st Prize", amount: "3,000" },
			{ place: "2nd Prize", amount: "1,000" },
		],
	},
	{
		id: "ctf",
		index: 3,
		name: "Capture The Flag",
		fullName: "Capture The Flag - CTF",
		tagline:
			"The system has vulnerabilities. Your mission is to find them.",
		venue: "IT Lab",
		fee: 100,
		memberCounts: [2, 3],
		rules: [
			"Teams must consist of 2-3 members.",
			"Participants must bring their own laptops.",
			"There will be 2 rounds with 2 flags to capture.",
			"The first to submit the flag tops the leaderboard.",
			"Final winners are calculated on total points taken.",
			"Any form of DoS or attacks on the scoring infrastructure is strictly forbidden.",
			"Flags must be submitted in the specified format.",
			"You can use any operating system you prefer.",
			"Sharing flags or hints with other teams is prohibited.",
		],
		agenda: [
			{ time: "08:30 AM - 10:00 AM", task: "Inauguration" },
			{
				time: "10:00 AM - 10:15 AM",
				task: "Check-in and Rules Briefing",
			},
			{ time: "10:15 AM - 11:30 AM", task: "Round 1" },
			{ time: "11:30 AM - 11:45 AM", task: "Break" },
			{ time: "11:45 AM - 01:00 PM", task: "Round 2" },
		],
		prize: [
			{ place: "1st Prize", amount: "3,000" },
			{ place: "2nd Prize", amount: "1,000" },
		],
	},
];

export function getEvent(id) {
	return EVENTS.find((event) => event.id === id) ?? EVENTS[0];
}

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

export const SUPPORT_LINES = [
	{
		label: "Registration desk",
		number: "+91 95665 42006",
		tel: "+919566542006",
	},
	{
		label: "Event coordination",
		number: "+91 90030 18088",
		tel: "+919003018088",
	},
];
