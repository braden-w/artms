import type { Column } from "#db/schema/columns";

export const COLUMNS_IN_DATABASE = [
	{
		name: "id",
		type: "Text",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 0,
	},
	{
		name: "title",
		type: "Text",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 1,
	},
	{
		name: "content",
		type: "Textarea",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 2,
	},
	{
		name: "resonance",
		type: "Select",
		isArray: false,
		options: [
			{
				value: "Generational",
				color: "red",
			},
			{
				value: "Extreme",
				color: "orange",
			},
			{
				value: "Transformative",
				color: "yellow",
			},
			{
				value: "Profound",
				color: "amber",
			},
			{
				value: "Moderate",
				color: "green",
			},
			{
				value: "Mild",
				color: "cyan",
			},
			{
				value: "Minimal",
				color: "indigo",
			},
			{
				value: "",
				color: "zinc",
			},
			{
				value: "Wholesome",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 3,
	},
	{
		name: "on",
		type: "Multi-select",
		isArray: true,
		options: [
			{
				value: "React",
				color: "zinc",
			},
			{
				value: "Next.js",
				color: "zinc",
			},
			{
				value: "ShadCN",
				color: "zinc",
			},
			{
				value: "Productivity",
				color: "zinc",
			},
			{
				value: "Note Taking",
				color: "zinc",
			},
			{
				value: "Local First",
				color: "zinc",
			},
			{
				value: "Frontend",
				color: "zinc",
			},
			{
				value: "Vietnamese",
				color: "zinc",
			},
			{
				value: "JavaScript",
				color: "zinc",
			},
			{
				value: "Event Loop",
				color: "zinc",
			},
			{
				value: "Asynchronous Programming",
				color: "zinc",
			},
			{
				value: "Migration",
				color: "zinc",
			},
			{
				value: "Music",
				color: "zinc",
			},
			{
				value: "Music Migration",
				color: "zinc",
			},
			{
				value: "Kung Fu Panda",
				color: "zinc",
			},
			{
				value: "Lore",
				color: "zinc",
			},
			{
				value: "Movies",
				color: "zinc",
			},
			{
				value: "Rust",
				color: "zinc",
			},
			{
				value: "Tennis",
				color: "zinc",
			},
			{
				value: "Roger Federer",
				color: "zinc",
			},
			{
				value: "Dartmouth",
				color: "zinc",
			},
			{
				value: "Inspiration",
				color: "zinc",
			},
			{
				value: "F-14",
				color: "zinc",
			},
			{
				value: "Flight",
				color: "zinc",
			},
			{
				value: "Ace Combat",
				color: "zinc",
			},
			{
				value: "Planes",
				color: "zinc",
			},
			{
				value: "Streamlit",
				color: "zinc",
			},
			{
				value: "App Development",
				color: "zinc",
			},
			{
				value: "Multi Page Apps",
				color: "zinc",
			},
			{
				value: "Astro",
				color: "zinc",
			},
			{
				value: "Hydration",
				color: "zinc",
			},
			{
				value: "SSR",
				color: "zinc",
			},
			{
				value: "Forms",
				color: "zinc",
			},
			{
				value: "Yale",
				color: "zinc",
			},
			{
				value: "Yale Club",
				color: "zinc",
			},
			{
				value: "New York",
				color: "zinc",
			},
			{
				value: "Pizza",
				color: "zinc",
			},
			{
				value: "Wholesome",
				color: "zinc",
			},
			{
				value: "FroCos",
				color: "zinc",
			},
			{
				value: "GitHub",
				color: "zinc",
			},
			{
				value: "Releases",
				color: "zinc",
			},
			{
				value: "Ci/CD",
				color: "zinc",
			},
			{
				value: "Changelogs",
				color: "zinc",
			},
			{
				value: "Tags",
				color: "zinc",
			},
			{
				value: "Whispering",
				color: "zinc",
			},
			{
				value: "Transcription",
				color: "zinc",
			},
			{
				value: "Speech to Text",
				color: "zinc",
			},
			{
				value: "Software Engineering",
				color: "zinc",
			},
			{
				value: "Secrets",
				color: "zinc",
			},
			{
				value: "Nature",
				color: "zinc",
			},
			{
				value: "Explanation",
				color: "zinc",
			},
			{
				value: "Natural Selection",
				color: "zinc",
			},
			{
				value: "Local Maxima",
				color: "zinc",
			},
			{
				value: "Global Maxima",
				color: "zinc",
			},
			{
				value: "Optimization",
				color: "zinc",
			},
			{
				value: "Text to Speech",
				color: "zinc",
			},
			{
				value: "VAD",
				color: "zinc",
			},
			{
				value: "Voice Detection",
				color: "zinc",
			},
			{
				value: "Groq",
				color: "zinc",
			},
			{
				value: "Whisper",
				color: "zinc",
			},
			{
				value: "Voice Assistant",
				color: "zinc",
			},
			{
				value: "Llama",
				color: "zinc",
			},
			{
				value: "Artificial Intelligence",
				color: "zinc",
			},
			{
				value: "Vercel",
				color: "zinc",
			},
			{
				value: "Sports",
				color: "zinc",
			},
			{
				value: "Procrastination",
				color: "zinc",
			},
			{
				value: "Leisure",
				color: "zinc",
			},
			{
				value: "Epicenter",
				color: "zinc",
			},
			{
				value: "Planets",
				color: "zinc",
			},
			{
				value: "Greek",
				color: "zinc",
			},
			{
				value: "HackMIT",
				color: "zinc",
			},
			{
				value: "Travel",
				color: "zinc",
			},
			{
				value: "Stretching",
				color: "zinc",
			},
			{
				value: "Hip Flexors",
				color: "zinc",
			},
			{
				value: "Databases",
				color: "zinc",
			},
			{
				value: "B-Trees",
				color: "zinc",
			},
			{
				value: "SQLite",
				color: "zinc",
			},
			{
				value: "Algorithms",
				color: "zinc",
			},
			{
				value: "Pitching",
				color: "zinc",
			},
			{
				value: "Baseball",
				color: "zinc",
			},
			{
				value: "Nodes",
				color: "zinc",
			},
			{
				value: "Tiptap",
				color: "zinc",
			},
			{
				value: "Marks",
				color: "zinc",
			},
			{
				value: "Text Editing",
				color: "zinc",
			},
			{
				value: "Recording",
				color: "zinc",
			},
			{
				value: "Video",
				color: "zinc",
			},
			{
				value: "Projects",
				color: "zinc",
			},
			{
				value: "Content Creation",
				color: "zinc",
			},
			{
				value: "Backend",
				color: "zinc",
			},
			{
				value: "Monorepos",
				color: "zinc",
			},
			{
				value: "Star Wars",
				color: "zinc",
			},
			{
				value: "Film",
				color: "zinc",
			},
			{
				value: "UI/UX",
				color: "zinc",
			},
			{
				value: "Basketball",
				color: "zinc",
			},
			{
				value: "Giannis Antetoukounmpo",
				color: "zinc",
			},
			{
				value: "NBA",
				color: "zinc",
			},
			{
				value: "Saudi Arabia",
				color: "zinc",
			},
			{
				value: "Finance",
				color: "zinc",
			},
			{
				value: "Real Estate",
				color: "zinc",
			},
			{
				value: "HTML",
				color: "zinc",
			},
			{
				value: "TailwindCSS",
				color: "zinc",
			},
			{
				value: "CSS",
				color: "zinc",
			},
			{
				value: "Tables",
				color: "zinc",
			},
			{
				value: "Garbage Collection",
				color: "zinc",
			},
			{
				value: "Programming",
				color: "zinc",
			},
			{
				value: "Politics",
				color: "zinc",
			},
			{
				value: "Korea",
				color: "zinc",
			},
			{
				value: "Traits",
				color: "zinc",
			},
			{
				value: "Composition",
				color: "zinc",
			},
			{
				value: "Inheritance",
				color: "zinc",
			},
			{
				value: "Object-Oriented Programming",
				color: "zinc",
			},
			{
				value: "State Management",
				color: "zinc",
			},
			{
				value: "Re-Rendering",
				color: "zinc",
			},
			{
				value: "Rendering",
				color: "zinc",
			},
			{
				value: "Data Tables",
				color: "zinc",
			},
			{
				value: "Effect-TS",
				color: "zinc",
			},
			{
				value: "Functional Programming",
				color: "zinc",
			},
			{
				value: "TypeScript",
				color: "zinc",
			},
			{
				value: "Concurrency",
				color: "zinc",
			},
			{
				value: "Error Handling",
				color: "zinc",
			},
			{
				value: "Search",
				color: "zinc",
			},
			{
				value: "Terminal",
				color: "zinc",
			},
			{
				value: "Bash",
				color: "zinc",
			},
			{
				value: "Fight Club",
				color: "zinc",
			},
			{
				value: "Books",
				color: "zinc",
			},
			{
				value: "Image",
				color: "zinc",
			},
			{
				value: "Compression",
				color: "zinc",
			},
			{
				value: "Squoosh",
				color: "zinc",
			},
			{
				value: "Google",
				color: "zinc",
			},
			{
				value: "Generics",
				color: "zinc",
			},
			{
				value: "Interpersonal",
				color: "zinc",
			},
			{
				value: "Relationships",
				color: "zinc",
			},
			{
				value: "Carrie",
				color: "zinc",
			},
			{
				value: "Birthday",
				color: "zinc",
			},
			{
				value: "Singing",
				color: "zinc",
			},
			{
				value: "Family",
				color: "zinc",
			},
			{
				value: "Testing",
				color: "zinc",
			},
			{
				value: "Interviews",
				color: "zinc",
			},
			{
				value: "Data Processing",
				color: "zinc",
			},
			{
				value: "Formatting",
				color: "zinc",
			},
			{
				value: "Parsing",
				color: "zinc",
			},
			{
				value: "Virtual Angel",
				color: "zinc",
			},
			{
				value: "ARTMS",
				color: "zinc",
			},
			{
				value: "Performance",
				color: "zinc",
			},
			{
				value: "Minimalism",
				color: "zinc",
			},
			{
				value: "Fullstack",
				color: "zinc",
			},
			{
				value: "Three Body Problem",
				color: "zinc",
			},
			{
				value: "Human Race",
				color: "zinc",
			},
			{
				value: "Ye Wenjie",
				color: "zinc",
			},
			{
				value: "Humankind",
				color: "zinc",
			},
			{
				value: "Red Guard",
				color: "zinc",
			},
			{
				value: "Communism",
				color: "zinc",
			},
			{
				value: "History",
				color: "zinc",
			},
			{
				value: "Environmentalism",
				color: "zinc",
			},
			{
				value: "Animals",
				color: "zinc",
			},
			{
				value: "Counting",
				color: "zinc",
			},
			{
				value: "Monkeys",
				color: "zinc",
			},
			{
				value: "Taxes",
				color: "zinc",
			},
			{
				value: "Write Offs",
				color: "zinc",
			},
			{
				value: "Business Expenses",
				color: "zinc",
			},
			{
				value: "Stores",
				color: "zinc",
			},
			{
				value: "Universities",
				color: "zinc",
			},
			{
				value: "Elitism",
				color: "zinc",
			},
			{
				value: "Equity",
				color: "zinc",
			},
			{
				value: "Inertia",
				color: "zinc",
			},
			{
				value: "Coding",
				color: "zinc",
			},
			{
				value: "Chinese",
				color: "zinc",
			},
			{
				value: "Linear",
				color: "zinc",
			},
			{
				value: "Product Management",
				color: "zinc",
			},
			{
				value: "Development",
				color: "zinc",
			},
			{
				value: "YouTube Music",
				color: "zinc",
			},
			{
				value: "Albert Camus",
				color: "zinc",
			},
			{
				value: "Renaud Camus",
				color: "zinc",
			},
			{
				value: "Philosophy",
				color: "zinc",
			},
			{
				value: "Great Replacement Theory",
				color: "zinc",
			},
			{
				value: "ChatGPT",
				color: "zinc",
			},
			{
				value: "JSON mode",
				color: "zinc",
			},
			{
				value: "APIs",
				color: "zinc",
			},
			{
				value: "Leave of Absence",
				color: "zinc",
			},
			{
				value: "Drizzle",
				color: "zinc",
			},
			{
				value: "Server Components",
				color: "zinc",
			},
			{
				value: "Functions",
				color: "zinc",
			},
			{
				value: "Abstraction",
				color: "zinc",
			},
			{
				value: "Extraction",
				color: "zinc",
			},
			{
				value: "TanStack Query",
				color: "zinc",
			},
			{
				value: "Hooks",
				color: "zinc",
			},
			{
				value: "War",
				color: "zinc",
			},
			{
				value: "Tactics",
				color: "zinc",
			},
			{
				value: "Strategy",
				color: "zinc",
			},
			{
				value: "Bugs",
				color: "zinc",
			},
			{
				value: "Resilience",
				color: "zinc",
			},
			{
				value: "Tab",
				color: "zinc",
			},
			{
				value: "Democrats",
				color: "zinc",
			},
			{
				value: "Republicans",
				color: "zinc",
			},
			{
				value: "Product Market Fit",
				color: "zinc",
			},
			{
				value: "Entrepreneurship",
				color: "zinc",
			},
			{
				value: "Personal Development",
				color: "zinc",
			},
			{
				value: "Golf",
				color: "zinc",
			},
			{
				value: "Tiger Woods",
				color: "zinc",
			},
			{
				value: "Time",
				color: "zinc",
			},
			{
				value: "Credit Cards",
				color: "zinc",
			},
			{
				value: "TSA PreCheck",
				color: "zinc",
			},
			{
				value: "Global Entry",
				color: "zinc",
			},
			{
				value: "Cron",
				color: "zinc",
			},
			{
				value: "Hosting",
				color: "zinc",
			},
			{
				value: "Servers",
				color: "zinc",
			},
			{
				value: "Clients",
				color: "zinc",
			},
			{
				value: "Middleman",
				color: "zinc",
			},
			{
				value: "Environment",
				color: "zinc",
			},
			{
				value: "Services",
				color: "zinc",
			},
			{
				value: "ORMs",
				color: "zinc",
			},
			{
				value: "MacBook",
				color: "zinc",
			},
			{
				value: "iMessage",
				color: "zinc",
			},
			{
				value: "Sync",
				color: "zinc",
			},
			{
				value: "Dialogs",
				color: "zinc",
			},
			{
				value: "Popups",
				color: "zinc",
			},
			{
				value: "Race",
				color: "zinc",
			},
			{
				value: "Racing",
				color: "zinc",
			},
			{
				value: "Running",
				color: "zinc",
			},
			{
				value: "Jesse Owens",
				color: "zinc",
			},
			{
				value: "Luz Long",
				color: "zinc",
			},
			{
				value: "BFG",
				color: "zinc",
			},
			{
				value: "Git",
				color: "zinc",
			},
			{
				value: "Emails",
				color: "zinc",
			},
			{
				value: "Open Source",
				color: "zinc",
			},
			{
				value: "Y Combinator",
				color: "zinc",
			},
			{
				value: "Venture Capital",
				color: "zinc",
			},
			{
				value: "College",
				color: "zinc",
			},
			{
				value: "Due Diligence",
				color: "zinc",
			},
			{
				value: "Svelte 5",
				color: "zinc",
			},
			{
				value: "Runes",
				color: "zinc",
			},
			{
				value: "Local Storage",
				color: "zinc",
			},
			{
				value: "Imports",
				color: "zinc",
			},
			{
				value: "Inflation",
				color: "zinc",
			},
			{
				value: "Economics",
				color: "zinc",
			},
			{
				value: "Jade Trilogy",
				color: "zinc",
			},
			{
				value: "The Three-Body Problem",
				color: "zinc",
			},
			{
				value: "Environment Variables",
				color: "zinc",
			},
			{
				value: "Tacos",
				color: "zinc",
			},
			{
				value: "Los Angeles",
				color: "zinc",
			},
			{
				value: "Business",
				color: "zinc",
			},
			{
				value: "Authentication",
				color: "zinc",
			},
			{
				value: "Sessions",
				color: "zinc",
			},
			{
				value: "JWTs",
				color: "zinc",
			},
			{
				value: "The Last Airbender",
				color: "zinc",
			},
			{
				value: "Netflix",
				color: "zinc",
			},
			{
				value: "Life",
				color: "zinc",
			},
			{
				value: "Chores",
				color: "zinc",
			},
			{
				value: "Cleaning",
				color: "zinc",
			},
			{
				value: "Drains",
				color: "zinc",
			},
			{
				value: "Disney",
				color: "zinc",
			},
			{
				value: "Streaming",
				color: "zinc",
			},
			{
				value: "Children",
				color: "zinc",
			},
			{
				value: "Millennials",
				color: "zinc",
			},
			{
				value: "K-pop",
				color: "zinc",
			},
			{
				value: "Heejin",
				color: "zinc",
			},
			{
				value: "Financial Aid",
				color: "zinc",
			},
			{
				value: "Writing",
				color: "zinc",
			},
			{
				value: "High School",
				color: "zinc",
			},
			{
				value: "IRS",
				color: "zinc",
			},
			{
				value: "Style",
				color: "zinc",
			},
			{
				value: "Pipelines",
				color: "zinc",
			},
			{
				value: "Law",
				color: "zinc",
			},
			{
				value: "Versioning",
				color: "zinc",
			},
			{
				value: "Processes",
				color: "zinc",
			},
			{
				value: "Data",
				color: "zinc",
			},
			{
				value: "Biology",
				color: "zinc",
			},
			{
				value: "Computer Science",
				color: "zinc",
			},
			{
				value: "Funny",
				color: "zinc",
			},
			{
				value: "Money",
				color: "zinc",
			},
			{
				value: "Hype",
				color: "zinc",
			},
			{
				value: "Innovation",
				color: "zinc",
			},
			{
				value: "Performances",
				color: "zinc",
			},
			{
				value: "SQL",
				color: "zinc",
			},
			{
				value: "Styling",
				color: "zinc",
			},
			{
				value: "System Design",
				color: "zinc",
			},
			{
				value: "Dad",
				color: "zinc",
			},
			{
				value: "Virtual Desktops",
				color: "zinc",
			},
			{
				value: "Window Management",
				color: "zinc",
			},
			{
				value: "Retrieval Augmented Generation",
				color: "zinc",
			},
			{
				value: "Vector Search",
				color: "zinc",
			},
			{
				value: "Tools",
				color: "zinc",
			},
			{
				value: "Mice",
				color: "zinc",
			},
			{
				value: "Effect",
				color: "zinc",
			},
			{
				value: "HTTP",
				color: "zinc",
			},
			{
				value: "Fetch",
				color: "zinc",
			},
			{
				value: "CORS",
				color: "zinc",
			},
			{
				value: "Leadership",
				color: "zinc",
			},
			{
				value: "Confidence",
				color: "zinc",
			},
			{
				value: "Athletics",
				color: "zinc",
			},
			{
				value: "Belief",
				color: "zinc",
			},
			{
				value: "Success",
				color: "zinc",
			},
			{
				value: "Building",
				color: "zinc",
			},
			{
				value: "Founders",
				color: "zinc",
			},
			{
				value: "Technical Founders",
				color: "zinc",
			},
			{
				value: "Svelte",
				color: "zinc",
			},
			{
				value: "User Interfaces",
				color: "zinc",
			},
			{
				value: "Large Language Models",
				color: "zinc",
			},
			{
				value: "Meta",
				color: "zinc",
			},
			{
				value: "Food",
				color: "zinc",
			},
			{
				value: "Crayfish",
				color: "zinc",
			},
			{
				value: "Donald Trump",
				color: "zinc",
			},
			{
				value: "J.D. Vance",
				color: "zinc",
			},
			{
				value: "Fireship",
				color: "zinc",
			},
			{
				value: "React Context",
				color: "zinc",
			},
			{
				value: "Restaurant",
				color: "zinc",
			},
			{
				value: "Neo Scholars",
				color: "zinc",
			},
			{
				value: "Failure",
				color: "zinc",
			},
			{
				value: "Dreams",
				color: "zinc",
			},
			{
				value: "Vietnamese Food",
				color: "zinc",
			},
			{
				value: "Pho",
				color: "zinc",
			},
			{
				value: "Assessment",
				color: "zinc",
			},
			{
				value: "Query",
				color: "zinc",
			},
			{
				value: "Astro Framework",
				color: "zinc",
			},
			{
				value: "Optimistic Updates",
				color: "zinc",
			},
			{
				value: "Shower Thought",
				color: "zinc",
			},
			{
				value: "Web UI",
				color: "zinc",
			},
			{
				value: "Solid",
				color: "zinc",
			},
			{
				value: "Qwik",
				color: "zinc",
			},
			{
				value: "Vue",
				color: "zinc",
			},
			{
				value: "JavaScript Frameworks",
				color: "zinc",
			},
			{
				value: "Reactivity",
				color: "zinc",
			},
			{
				value: "Cache",
				color: "zinc",
			},
			{
				value: "Lazy Loading",
				color: "zinc",
			},
			{
				value: "Clean Code",
				color: "zinc",
			},
			{
				value: "Queries",
				color: "zinc",
			},
			{
				value: "Mutations",
				color: "zinc",
			},
			{
				value: "Guides",
				color: "zinc",
			},
			{
				value: "Dinner",
				color: "zinc",
			},
			{
				value: "Financial Freedom",
				color: "zinc",
			},
			{
				value: "Personal Finance",
				color: "zinc",
			},
			{
				value: "Hype Cycles",
				color: "zinc",
			},
			{
				value: "Technology",
				color: "zinc",
			},
			{
				value: "Packaging",
				color: "zinc",
			},
			{
				value: "Shipping",
				color: "zinc",
			},
			{
				value: "AWS",
				color: "zinc",
			},
			{
				value: "Code",
				color: "zinc",
			},
			{
				value: "Readability",
				color: "zinc",
			},
			{
				value: "Orphans",
				color: "zinc",
			},
			{
				value: "Coming of Age",
				color: "zinc",
			},
			{
				value: "Theft of Swords",
				color: "zinc",
			},
			{
				value: "Sam Altman",
				color: "zinc",
			},
			{
				value: "OpenAI",
				color: "zinc",
			},
			{
				value: "Personal Statement",
				color: "zinc",
			},
			{
				value: "Applications",
				color: "zinc",
			},
			{
				value: "Presidents",
				color: "zinc",
			},
			{
				value: "Empathy",
				color: "zinc",
			},
			{
				value: "Generational",
				color: "zinc",
			},
			{
				value: "Cooking",
				color: "zinc",
			},
			{
				value: "Situations",
				color: "zinc",
			},
			{
				value: "Mom",
				color: "zinc",
			},
			{
				value: "Fruit",
				color: "zinc",
			},
			{
				value: "",
				color: "zinc",
			},
			{
				value: "Health",
				color: "zinc",
			},
			{
				value: "Fun Facts",
				color: "zinc",
			},
			{
				value: "Scientists",
				color: "zinc",
			},
			{
				value: "Investment Banking",
				color: "zinc",
			},
			{
				value: "Privacy",
				color: "zinc",
			},
			{
				value: "Skincare",
				color: "zinc",
			},
			{
				value: "Realization",
				color: "zinc",
			},
			{
				value: "JSX",
				color: "zinc",
			},
			{
				value: "Objects",
				color: "zinc",
			},
			{
				value: "Domestic Abuse",
				color: "zinc",
			},
			{
				value: "Marriage",
				color: "zinc",
			},
			{
				value: "Brian Johnson",
				color: "zinc",
			},
			{
				value: "NewJeans",
				color: "zinc",
			},
			{
				value: "Kep1er",
				color: "zinc",
			},
			{
				value: "Statistics",
				color: "zinc",
			},
			{
				value: "Hot Hands",
				color: "zinc",
			},
			{
				value: "Probability",
				color: "zinc",
			},
			{
				value: "Scott Wu",
				color: "zinc",
			},
			{
				value: "Deven AI",
				color: "zinc",
			},
			{
				value: "IOI",
				color: "zinc",
			},
			{
				value: "Codeforces",
				color: "zinc",
			},
			{
				value: "Prodigies",
				color: "zinc",
			},
			{
				value: "Driving",
				color: "zinc",
			},
			{
				value: "Traffic",
				color: "zinc",
			},
			{
				value: "UI",
				color: "zinc",
			},
			{
				value: "Components",
				color: "zinc",
			},
			{
				value: "UI Libraries",
				color: "zinc",
			},
			{
				value: "Design",
				color: "zinc",
			},
			{
				value: "Video Games",
				color: "zinc",
			},
			{
				value: "Osu",
				color: "zinc",
			},
			{
				value: "Tournaments",
				color: "zinc",
			},
			{
				value: "Championships",
				color: "zinc",
			},
			{
				value: "Refactoring",
				color: "zinc",
			},
			{
				value: "Locations",
				color: "zinc",
			},
			{
				value: "Student Life",
				color: "zinc",
			},
			{
				value: "Work",
				color: "zinc",
			},
			{
				value: "Ambulances",
				color: "zinc",
			},
			{
				value: "Gap Years",
				color: "zinc",
			},
			{
				value: "FOOT",
				color: "zinc",
			},
			{
				value: "Horror",
				color: "zinc",
			},
			{
				value: "Grace Hopper",
				color: "zinc",
			},
			{
				value: "Bowling",
				color: "zinc",
			},
			{
				value: "Technique",
				color: "zinc",
			},
			{
				value: "ISO 8601",
				color: "zinc",
			},
			{
				value: "Timestamps",
				color: "zinc",
			},
			{
				value: "Best Practices",
				color: "zinc",
			},
			{
				value: "Class of 2028",
				color: "zinc",
			},
			{
				value: "Buckley Institute",
				color: "zinc",
			},
			{
				value: "Lauren Noble",
				color: "zinc",
			},
			{
				value: "Racial Slur",
				color: "zinc",
			},
			{
				value: "Disorderly Conduct",
				color: "zinc",
			},
			{
				value: "Jordan",
				color: "zinc",
			},
			{
				value: "Kobe",
				color: "zinc",
			},
			{
				value: "Dean",
				color: "zinc",
			},
			{
				value: "Arrays",
				color: "zinc",
			},
			{
				value: "Move In",
				color: "zinc",
			},
			{
				value: "Orientation",
				color: "zinc",
			},
			{
				value: "Snack Breaks",
				color: "zinc",
			},
			{
				value: "Campus Life",
				color: "zinc",
			},
			{
				value: "Parallel Programming",
				color: "zinc",
			},
			{
				value: "CPU",
				color: "zinc",
			},
			{
				value: "Operating Systems",
				color: "zinc",
			},
			{
				value: "Transfer Credits",
				color: "zinc",
			},
			{
				value: "AP Credits",
				color: "zinc",
			},
			{
				value: "Rejection",
				color: "zinc",
			},
			{
				value: "Education",
				color: "zinc",
			},
			{
				value: "Friendship",
				color: "zinc",
			},
			{
				value: "College Life",
				color: "zinc",
			},
			{
				value: "First Year Experience",
				color: "zinc",
			},
			{
				value: "Support Systems",
				color: "zinc",
			},
			{
				value: "Dunkin' Donuts",
				color: "zinc",
			},
			{
				value: "Coffee",
				color: "zinc",
			},
			{
				value: "Donuts",
				color: "zinc",
			},
			{
				value: "Socializing",
				color: "zinc",
			},
			{
				value: "Russia",
				color: "zinc",
			},
			{
				value: "Military",
				color: "zinc",
			},
			{
				value: "Ukraine",
				color: "zinc",
			},
			{
				value: "IndexedDB",
				color: "zinc",
			},
			{
				value: "Data Storage",
				color: "zinc",
			},
			{
				value: "Lunch",
				color: "zinc",
			},
			{
				value: "Chili",
				color: "zinc",
			},
			{
				value: "Merchandise",
				color: "zinc",
			},
			{
				value: "Incentives",
				color: "zinc",
			},
			{
				value: "CS Department",
				color: "zinc",
			},
			{
				value: "Housing",
				color: "zinc",
			},
			{
				value: "Fees",
				color: "zinc",
			},
			{
				value: "Campus",
				color: "zinc",
			},
			{
				value: "Integrity",
				color: "zinc",
			},
			{
				value: "Fraud",
				color: "zinc",
			},
			{
				value: "College Applications",
				color: "zinc",
			},
			{
				value: "Gossip",
				color: "zinc",
			},
			{
				value: "Email Clients",
				color: "zinc",
			},
			{
				value: "Outlook",
				color: "zinc",
			},
			{
				value: "Mimestream",
				color: "zinc",
			},
			{
				value: "Superhuman",
				color: "zinc",
			},
			{
				value: "GMail",
				color: "zinc",
			},
			{
				value: "EM Client",
				color: "zinc",
			},
			{
				value: "Parties",
				color: "zinc",
			},
			{
				value: "Mental Health",
				color: "zinc",
			},
			{
				value: "Academic Integrity",
				color: "zinc",
			},
			{
				value: "Alcohol and Medical Emergencies",
				color: "zinc",
			},
			{
				value: "College Students",
				color: "zinc",
			},
			{
				value: "ExComm",
				color: "zinc",
			},
			{
				value: "Disciplinary Actions",
				color: "zinc",
			},
			{
				value: "Inbox Zero",
				color: "zinc",
			},
			{
				value: "Analytics",
				color: "zinc",
			},
			{
				value: "Gmail",
				color: "zinc",
			},
			{
				value: "Networking",
				color: "zinc",
			},
			{
				value: "Spotify",
				color: "zinc",
			},
			{
				value: "Rating System",
				color: "zinc",
			},
			{
				value: "UI Components",
				color: "zinc",
			},
			{
				value: "Training",
				color: "zinc",
			},
			{
				value: "School",
				color: "zinc",
			},
			{
				value: "Schedule",
				color: "zinc",
			},
			{
				value: "Mutex",
				color: "zinc",
			},
			{
				value: "Tauri",
				color: "zinc",
			},
			{
				value: "Ice Cream",
				color: "zinc",
			},
			{
				value: "Social Events",
				color: "zinc",
			},
			{
				value: "MBA Students",
				color: "zinc",
			},
			{
				value: "New Haven",
				color: "zinc",
			},
			{
				value: "Career",
				color: "zinc",
			},
			{
				value: "Discipline",
				color: "zinc",
			},
			{
				value: "Recessions",
				color: "zinc",
			},
			{
				value: "Resume",
				color: "zinc",
			},
			{
				value: "Career Development",
				color: "zinc",
			},
			{
				value: "Skills",
				color: "zinc",
			},
			{
				value: "Tide Pools",
				color: "zinc",
			},
			{
				value: "Nanoid",
				color: "zinc",
			},
			{
				value: "URL Friendly",
				color: "zinc",
			},
			{
				value: "User Experience",
				color: "zinc",
			},
			{
				value: "REST",
				color: "zinc",
			},
			{
				value: "Server Functions",
				color: "zinc",
			},
			{
				value: "Beef Noodle Soup",
				color: "zinc",
			},
			{
				value: "FTS",
				color: "zinc",
			},
			{
				value: "Compensation",
				color: "zinc",
			},
			{
				value: "Hiring",
				color: "zinc",
			},
			{
				value: "Startups",
				color: "zinc",
			},
			{
				value: "Employee Retention",
				color: "zinc",
			},
			{
				value: "Talent Acquisition",
				color: "zinc",
			},
			{
				value: "ACT",
				color: "zinc",
			},
			{
				value: "SAT",
				color: "zinc",
			},
			{
				value: "Exams",
				color: "zinc",
			},
			{
				value: "Standardized Testing",
				color: "zinc",
			},
			{
				value: "Counseling",
				color: "zinc",
			},
			{
				value: "Role-Playing",
				color: "zinc",
			},
			{
				value: "Parenting",
				color: "zinc",
			},
			{
				value: "Support",
				color: "zinc",
			},
			{
				value: "Meritocracy",
				color: "zinc",
			},
			{
				value: "College Admissions",
				color: "zinc",
			},
			{
				value: "Lying on Resumes",
				color: "zinc",
			},
			{
				value: "COVID",
				color: "zinc",
			},
			{
				value: "Teamwork",
				color: "zinc",
			},
			{
				value: "Counselors",
				color: "zinc",
			},
			{
				value: "Collaboration",
				color: "zinc",
			},
			{
				value: "Ideas",
				color: "zinc",
			},
			{
				value: "Deans",
				color: "zinc",
			},
			{
				value: "Dining Hall",
				color: "zinc",
			},
			{
				value: "Autonomy",
				color: "zinc",
			},
			{
				value: "Social Interaction",
				color: "zinc",
			},
			{
				value: "Work Session",
				color: "zinc",
			},
			{
				value: "Moving",
				color: "zinc",
			},
			{
				value: "Scooter",
				color: "zinc",
			},
			{
				value: "Transportation",
				color: "zinc",
			},
			{
				value: "Skateboard",
				color: "zinc",
			},
			{
				value: "Difficult Conversations",
				color: "zinc",
			},
			{
				value: "University",
				color: "zinc",
			},
			{
				value: "Kindness",
				color: "zinc",
			},
			{
				value: "Appreciation",
				color: "zinc",
			},
			{
				value: "Elections",
				color: "zinc",
			},
			{
				value: "Role Playing",
				color: "zinc",
			},
			{
				value: "Ambition",
				color: "zinc",
			},
			{
				value: "Open-Mindedness",
				color: "zinc",
			},
			{
				value: "Double Majoring",
				color: "zinc",
			},
			{
				value: "Reflection",
				color: "zinc",
			},
			{
				value: "Memories",
				color: "zinc",
			},
			{
				value: "Community",
				color: "zinc",
			},
			{
				value: "Wealth",
				color: "zinc",
			},
			{
				value: "Class",
				color: "zinc",
			},
			{
				value: "Inequality",
				color: "zinc",
			},
			{
				value: "User Interface",
				color: "zinc",
			},
			{
				value: "Web Development",
				color: "zinc",
			},
			{
				value: "Bitrate",
				color: "zinc",
			},
			{
				value: "Video Editing",
				color: "zinc",
			},
			{
				value: "Obsession",
				color: "zinc",
			},
			{
				value: "France",
				color: "zinc",
			},
			{
				value: "Paris",
				color: "zinc",
			},
			{
				value: "Dependency Injection",
				color: "zinc",
			},
			{
				value: "Layering",
				color: "zinc",
			},
			{
				value: "Buttery",
				color: "zinc",
			},
			{
				value: "Gym",
				color: "zinc",
			},
			{
				value: "Consulting",
				color: "zinc",
			},
			{
				value: "Secret Societies",
				color: "zinc",
			},
			{
				value: "Courses",
				color: "zinc",
			},
			{
				value: "Asian American History",
				color: "zinc",
			},
			{
				value: "Wine",
				color: "zinc",
			},
			{
				value: "Catering",
				color: "zinc",
			},
			{
				value: "Heat",
				color: "zinc",
			},
			{
				value: "Liberal Arts",
				color: "zinc",
			},
			{
				value: "Tsai City",
				color: "zinc",
			},
			{
				value: "Drinks",
				color: "zinc",
			},
			{
				value: "Chicken Tenders",
				color: "zinc",
			},
			{
				value: "Textbooks",
				color: "zinc",
			},
			{
				value: "A cappella",
				color: "zinc",
			},
			{
				value: "Clubs",
				color: "zinc",
			},
			{
				value: "Humor",
				color: "zinc",
			},
			{
				value: "Jokes",
				color: "zinc",
			},
			{
				value: "Brainstorming",
				color: "zinc",
			},
			{
				value: "Iteration",
				color: "zinc",
			},
			{
				value: "Fire",
				color: "zinc",
			},
			{
				value: "Master's Program",
				color: "zinc",
			},
			{
				value: "PostgreSQL",
				color: "zinc",
			},
			{
				value: "Namespacing",
				color: "zinc",
			},
			{
				value: "Data Fetching",
				color: "zinc",
			},
			{
				value: "Caching",
				color: "zinc",
			},
			{
				value: "Frameworks",
				color: "zinc",
			},
			{
				value: "Client-Server Architecture",
				color: "zinc",
			},
			{
				value: "Libraries",
				color: "zinc",
			},
			{
				value: "Vision",
				color: "zinc",
			},
			{
				value: "Tennis'",
				color: "zinc",
			},
			{
				value: "Sound",
				color: "zinc",
			},
			{
				value: "Rhythm",
				color: "zinc",
			},
			{
				value: "Communication",
				color: "zinc",
			},
			{
				value: "Clutter",
				color: "zinc",
			},
			{
				value: "Language",
				color: "zinc",
			},
			{
				value: "Simplicity",
				color: "zinc",
			},
			{
				value: "Self-Improvement",
				color: "zinc",
			},
			{
				value: "Mindfulness",
				color: "zinc",
			},
			{
				value: "Psychology",
				color: "zinc",
			},
			{
				value: "Codebase",
				color: "zinc",
			},
			{
				value: "Pull Requests",
				color: "zinc",
			},
			{
				value: "Graduate School",
				color: "zinc",
			},
			{
				value: "Tuition",
				color: "zinc",
			},
			{
				value: "Acceptance Rate",
				color: "zinc",
			},
			{
				value: "Athletes",
				color: "zinc",
			},
			{
				value: "Attention",
				color: "zinc",
			},
			{
				value: "Majors",
				color: "zinc",
			},
			{
				value: "Minors",
				color: "zinc",
			},
			{
				value: "Certificates",
				color: "zinc",
			},
			{
				value: "Ethics, Politics, and Economics (EP&E)",
				color: "zinc",
			},
			{
				value: "YPU",
				color: "zinc",
			},
			{
				value: "Eli Day",
				color: "zinc",
			},
			{
				value: "Papa John's",
				color: "zinc",
			},
			{
				value: "Duty Night",
				color: "zinc",
			},
			{
				value: "The Bachelorette",
				color: "zinc",
			},
			{
				value: "Law School",
				color: "zinc",
			},
			{
				value: "Creative Writing",
				color: "zinc",
			},
			{
				value: "Eric Posner",
				color: "zinc",
			},
			{
				value: "Peter Thiel",
				color: "zinc",
			},
			{
				value: "Debate",
				color: "zinc",
			},
			{
				value: "Corporate Law",
				color: "zinc",
			},
			{
				value: "Corporate Governance",
				color: "zinc",
			},
			{
				value: "Financial Crisis",
				color: "zinc",
			},
			{
				value: "Yale Law School",
				color: "zinc",
			},
			{
				value: "Citibank",
				color: "zinc",
			},
			{
				value: "Brett McIntosh",
				color: "zinc",
			},
			{
				value: "Yale Alumni Association",
				color: "zinc",
			},
			{
				value: "Cross Campus",
				color: "zinc",
			},
			{
				value: "Merch",
				color: "zinc",
			},
			{
				value: "Plants",
				color: "zinc",
			},
			{
				value: "Graduation",
				color: "zinc",
			},
			{
				value: "Southeast Asia",
				color: "zinc",
			},
			{
				value: "TablePlus",
				color: "zinc",
			},
			{
				value: "LibSql",
				color: "zinc",
			},
			{
				value: "Turso",
				color: "zinc",
			},
			{
				value: "Military Power",
				color: "zinc",
			},
			{
				value: "Iraq",
				color: "zinc",
			},
			{
				value: "Invasions",
				color: "zinc",
			},
			{
				value: "Academic Freedom",
				color: "zinc",
			},
			{
				value: "Seminars",
				color: "zinc",
			},
			{
				value: "Theater Studies",
				color: "zinc",
			},
			{
				value: "Humanities",
				color: "zinc",
			},
			{
				value: "Public Performance",
				color: "zinc",
			},
			{
				value: "Conflict Resolution",
				color: "zinc",
			},
			{
				value: "Trust",
				color: "zinc",
			},
			{
				value: "Growth Mindset",
				color: "zinc",
			},
			{
				value: "Ping Pong",
				color: "zinc",
			},
			{
				value: "Stanford",
				color: "zinc",
			},
			{
				value: "Competition",
				color: "zinc",
			},
			{
				value: "Phone Calls",
				color: "zinc",
			},
			{
				value: "Call Blockers",
				color: "zinc",
			},
			{
				value: "Magic Bars",
				color: "zinc",
			},
			{
				value: "Double Major",
				color: "zinc",
			},
			{
				value: "Recommendations",
				color: "zinc",
			},
			{
				value: "Job Market",
				color: "zinc",
			},
			{
				value: "Life Lessons",
				color: "zinc",
			},
			{
				value: "California",
				color: "zinc",
			},
			{
				value: "Zod",
				color: "zinc",
			},
			{
				value: "Cost of Living",
				color: "zinc",
			},
			{
				value: "Mochi",
				color: "zinc",
			},
			{
				value: "Group Chats",
				color: "zinc",
			},
			{
				value: "Meals",
				color: "zinc",
			},
			{
				value: "Discriminated Unions",
				color: "zinc",
			},
			{
				value: "Visas",
				color: "zinc",
			},
			{
				value: "Word Puzzles",
				color: "zinc",
			},
			{
				value: "Ali Partovi",
				color: "zinc",
			},
			{
				value: "New York Times",
				color: "zinc",
			},
			{
				value: "Bankruptcy",
				color: "zinc",
			},
			{
				value: "COVID-19",
				color: "zinc",
			},
			{
				value: "Dogs",
				color: "zinc",
			},
			{
				value: "Loss",
				color: "zinc",
			},
			{
				value: "Grief",
				color: "zinc",
			},
			{
				value: "Competitors",
				color: "zinc",
			},
			{
				value: "Berkeley Square",
				color: "zinc",
			},
			{
				value: "Grandpa",
				color: "zinc",
			},
			{
				value: "Childhood Memories",
				color: "zinc",
			},
			{
				value: "Shortcuts",
				color: "zinc",
			},
			{
				value: "Goldman Sachs",
				color: "zinc",
			},
			{
				value: "International Applicants",
				color: "zinc",
			},
			{
				value: "Labor Market Test",
				color: "zinc",
			},
			{
				value: "Employment",
				color: "zinc",
			},
			{
				value: "Recruitment",
				color: "zinc",
			},
			{
				value: "Bill Clinton",
				color: "zinc",
			},
			{
				value: "Hillary Clinton",
				color: "zinc",
			},
			{
				value: "Burglary",
				color: "zinc",
			},
			{
				value: "Inside Jokes",
				color: "zinc",
			},
			{
				value: "A Cappella",
				color: "zinc",
			},
			{
				value: "Woolsey Hall",
				color: "zinc",
			},
			{
				value: "Mentorship",
				color: "zinc",
			},
			{
				value: "Yale Political Union (YPU)",
				color: "zinc",
			},
			{
				value: "Privilege",
				color: "zinc",
			},
			{
				value: "Yale Political Union",
				color: "zinc",
			},
			{
				value: "Blackstone",
				color: "zinc",
			},
			{
				value: "Sleep Deprivation",
				color: "zinc",
			},
			{
				value: "Workplace Stress",
				color: "zinc",
			},
			{
				value: "Mergers and Acquisitions",
				color: "zinc",
			},
			{
				value: "Skull and Bones",
				color: "zinc",
			},
			{
				value: "Bulletin Boards",
				color: "zinc",
			},
			{
				value: "Internships",
				color: "zinc",
			},
			{
				value: "Wikipedia",
				color: "zinc",
			},
			{
				value: "Arcadia",
				color: "zinc",
			},
			{
				value: "Veterans",
				color: "zinc",
			},
			{
				value: "Santa Anita Racetrack",
				color: "zinc",
			},
			{
				value: "Racism",
				color: "zinc",
			},
			{
				value: "Immigration",
				color: "zinc",
			},
			{
				value: "Farewells",
				color: "zinc",
			},
			{
				value: "Nostalgia",
				color: "zinc",
			},
			{
				value: "Bagels",
				color: "zinc",
			},
			{
				value: "Olmo",
				color: "zinc",
			},
			{
				value: "Milk",
				color: "zinc",
			},
			{
				value: "Apples",
				color: "zinc",
			},
			{
				value: "Emotional Distress",
				color: "zinc",
			},
			{
				value: "Database",
				color: "zinc",
			},
			{
				value: "Harris Campaign",
				color: "zinc",
			},
			{
				value: "Web Scraping",
				color: "zinc",
			},
			{
				value: "Political Campaigns",
				color: "zinc",
			},
			{
				value: "Rallies",
				color: "zinc",
			},
			{
				value: "Recommendation Letter",
				color: "zinc",
			},
			{
				value: "FroCo",
				color: "zinc",
			},
			{
				value: "Bingham Hall",
				color: "zinc",
			},
			{
				value: "Friends",
				color: "zinc",
			},
			{
				value: "Conversation",
				color: "zinc",
			},
			{
				value: "Coincidences",
				color: "zinc",
			},
			{
				value: "Bible",
				color: "zinc",
			},
			{
				value: "Motivation",
				color: "zinc",
			},
			{
				value: "Proactivity",
				color: "zinc",
			},
			{
				value: "Regulation",
				color: "zinc",
			},
			{
				value: "Yale Hospitality",
				color: "zinc",
			},
			{
				value: "Instagram",
				color: "zinc",
			},
			{
				value: "Social Media",
				color: "zinc",
			},
			{
				value: "Reunions",
				color: "zinc",
			},
			{
				value: "Harvard",
				color: "zinc",
			},
			{
				value: "Arcadia High School",
				color: "zinc",
			},
			{
				value: "Places",
				color: "zinc",
			},
			{
				value: "Texas",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: "meta+u",
		position: 4,
	},
	{
		name: "type",
		type: "Multi-select",
		isArray: true,
		options: [
			{
				value: "Speech",
				color: "zinc",
			},
			{
				value: "Article",
				color: "zinc",
			},
			{
				value: "Memory",
				color: "zinc",
			},
			{
				value: "Message",
				color: "zinc",
			},
			{
				value: "_misc",
				color: "zinc",
			},
			{
				value: "How-To",
				color: "zinc",
			},
			{
				value: "Reflection",
				color: "zinc",
			},
			{
				value: "Journal",
				color: "zinc",
			},
			{
				value: "Text",
				color: "zinc",
			},
			{
				value: "Book",
				color: "zinc",
			},
			{
				value: "Meal",
				color: "zinc",
			},
			{
				value: "Lunch",
				color: "zinc",
			},
			{
				value: "Video",
				color: "zinc",
			},
			{
				value: "Event",
				color: "zinc",
			},
			{
				value: "Progress",
				color: "zinc",
			},
			{
				value: "Shower Thought",
				color: "zinc",
			},
			{
				value: "List",
				color: "zinc",
			},
			{
				value: "Component",
				color: "zinc",
			},
			{
				value: "UI Component",
				color: "zinc",
			},
			{
				value: "Call",
				color: "zinc",
			},
			{
				value: "Quote",
				color: "zinc",
			},
			{
				value: "Tool",
				color: "zinc",
			},
			{
				value: "Software",
				color: "zinc",
			},
			{
				value: "Fun Fact",
				color: "zinc",
			},
			{
				value: "Tribute",
				color: "zinc",
			},
			{
				value: "Restaurant",
				color: "zinc",
			},
			{
				value: "Restaurant",
				color: "zinc",
			},
			{
				value: "Conversation",
				color: "zinc",
			},
			{
				value: "Update",
				color: "zinc",
			},
			{
				value: "Progress Report",
				color: "zinc",
			},
			{
				value: "Release",
				color: "zinc",
			},
			{
				value: "Announcement",
				color: "zinc",
			},
			{
				value: "Story",
				color: "zinc",
			},
			{
				value: "Explanation",
				color: "zinc",
			},
			{
				value: "Opinion",
				color: "zinc",
			},
			{
				value: "Advice",
				color: "zinc",
			},
			{
				value: "Tip",
				color: "zinc",
			},
			{
				value: "Thread",
				color: "zinc",
			},
			{
				value: "Discourse",
				color: "zinc",
			},
			{
				value: "Comment",
				color: "zinc",
			},
			{
				value: "Visit",
				color: "zinc",
			},
			{
				value: "Guide",
				color: "zinc",
			},
			{
				value: "Hot Take",
				color: "zinc",
			},
			{
				value: "Template",
				color: "zinc",
			},
			{
				value: "Project",
				color: "zinc",
			},
			{
				value: "GitHub Repository",
				color: "zinc",
			},
			{
				value: "Email",
				color: "zinc",
			},
			{
				value: "Clip",
				color: "zinc",
			},
			{
				value: "Activity",
				color: "zinc",
			},
			{
				value: "Realization",
				color: "zinc",
			},
			{
				value: "Demo",
				color: "zinc",
			},
			{
				value: "Stretch",
				color: "zinc",
			},
			{
				value: "Exercise",
				color: "zinc",
			},
			{
				value: "Expalanation",
				color: "zinc",
			},
			{
				value: "Diagram",
				color: "zinc",
			},
			{
				value: "Algorithm",
				color: "zinc",
			},
			{
				value: "Interview",
				color: "zinc",
			},
			{
				value: "Observation",
				color: "zinc",
			},
			{
				value: "Thought",
				color: "zinc",
			},
			{
				value: "Documentary",
				color: "zinc",
			},
			{
				value: "Walkthrough",
				color: "zinc",
			},
			{
				value: "README",
				color: "zinc",
			},
			{
				value: "Application",
				color: "zinc",
			},
			{
				value: "Moment",
				color: "zinc",
			},
			{
				value: "Coding Progress",
				color: "zinc",
			},
			{
				value: "Excerpt",
				color: "zinc",
			},
			{
				value: "FYI",
				color: "zinc",
			},
			{
				value: "LPT",
				color: "zinc",
			},
			{
				value: "Chat",
				color: "zinc",
			},
			{
				value: "Mental Model",
				color: "zinc",
			},
			{
				value: "Concept",
				color: "zinc",
			},
			{
				value: "Joke",
				color: "zinc",
			},
			{
				value: "Letter",
				color: "zinc",
			},
			{
				value: "Documentation",
				color: "zinc",
			},
			{
				value: "Snippet",
				color: "zinc",
			},
			{
				value: "Talk",
				color: "zinc",
			},
			{
				value: "Discussion",
				color: "zinc",
			},
			{
				value: "Package",
				color: "zinc",
			},
			{
				value: "Performance",
				color: "zinc",
			},
			{
				value: "Phrase",
				color: "zinc",
			},
			{
				value: "Response",
				color: "zinc",
			},
			{
				value: "Comeback",
				color: "zinc",
			},
			{
				value: "Tutorial",
				color: "zinc",
			},
			{
				value: "Fix",
				color: "zinc",
			},
			{
				value: "Recommendation",
				color: "zinc",
			},
			{
				value: "Discovery",
				color: "zinc",
			},
			{
				value: "Resource",
				color: "zinc",
			},
			{
				value: "Example",
				color: "zinc",
			},
			{
				value: "News",
				color: "zinc",
			},
			{
				value: "Humor",
				color: "zinc",
			},
			{
				value: "Dream",
				color: "zinc",
			},
			{
				value: "Dinner",
				color: "zinc",
			},
			{
				value: "Cuisine",
				color: "zinc",
			},
			{
				value: "Assessment",
				color: "zinc",
			},
			{
				value: "Use Case",
				color: "zinc",
			},
			{
				value: "Feature",
				color: "zinc",
			},
			{
				value: "Celebration",
				color: "zinc",
			},
			{
				value: "Surprise",
				color: "zinc",
			},
			{
				value: "Wholesome",
				color: "zinc",
			},
			{
				value: "Review",
				color: "zinc",
			},
			{
				value: "Essay",
				color: "zinc",
			},
			{
				value: "Family Gathering",
				color: "zinc",
			},
			{
				value: "Coincidence",
				color: "zinc",
			},
			{
				value: "Report",
				color: "zinc",
			},
			{
				value: "Reaction",
				color: "zinc",
			},
			{
				value: "Framework",
				color: "zinc",
			},
			{
				value: "Video Essay",
				color: "zinc",
			},
			{
				value: "Guest Lecture",
				color: "zinc",
			},
			{
				value: "Fireside Chat",
				color: "zinc",
			},
			{
				value: "Lecture",
				color: "zinc",
			},
			{
				value: "Cautionary Tale",
				color: "zinc",
			},
			{
				value: "Anecdote",
				color: "zinc",
			},
			{
				value: "Analysis",
				color: "zinc",
			},
			{
				value: "YouTube",
				color: "zinc",
			},
			{
				value: "Short",
				color: "zinc",
			},
			{
				value: "Movie",
				color: "zinc",
			},
			{
				value: "Post",
				color: "zinc",
			},
			{
				value: "Prodigy",
				color: "zinc",
			},
			{
				value: "Tweet",
				color: "zinc",
			},
			{
				value: "Seminar",
				color: "zinc",
			},
			{
				value: "Form",
				color: "zinc",
			},
			{
				value: "Newsletter",
				color: "zinc",
			},
			{
				value: "Prompt",
				color: "zinc",
			},
			{
				value: "_frontend_coding_tips",
				color: "zinc",
			},
			{
				value: "PSA",
				color: "zinc",
			},
			{
				value: "Manifesto",
				color: "zinc",
			},
			{
				value: "Technique",
				color: "zinc",
			},
			{
				value: "Function",
				color: "zinc",
			},
			{
				value: "Appreciation",
				color: "zinc",
			},
			{
				value: "Training",
				color: "zinc",
			},
			{
				value: "Idea",
				color: "zinc",
			},
			{
				value: "Flyer",
				color: "zinc",
			},
			{
				value: "Nightmare",
				color: "zinc",
			},
			{
				value: "Party",
				color: "zinc",
			},
			{
				value: "Course",
				color: "zinc",
			},
			{
				value: "Tour",
				color: "zinc",
			},
			{
				value: "Paper",
				color: "zinc",
			},
			{
				value: "Argument",
				color: "zinc",
			},
			{
				value: "Request",
				color: "zinc",
			},
			{
				value: "Duty",
				color: "zinc",
			},
			{
				value: "Breakfast",
				color: "zinc",
			},
			{
				value: "Recipe",
				color: "zinc",
			},
			{
				value: "Meme",
				color: "zinc",
			},
			{
				value: "Short Story",
				color: "zinc",
			},
			{
				value: "Creative Writing",
				color: "zinc",
			},
			{
				value: "Brunch",
				color: "zinc",
			},
			{
				value: "Walk",
				color: "zinc",
			},
			{
				value: "Personal Statement",
				color: "zinc",
			},
			{
				value: "Ad",
				color: "zinc",
			},
			{
				value: "Graph",
				color: "zinc",
			},
			{
				value: "Heist",
				color: "zinc",
			},
			{
				value: "Creative Nonfiction",
				color: "zinc",
			},
			{
				value: "Well-Written Writing Sample",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: "meta+i",
		position: 5,
	},
	{
		name: "status",
		type: "Select",
		isArray: false,
		options: [
			{
				value: "Needs Tagging",
				color: "zinc",
			},
			{
				value: "Needs Polishing",
				color: "zinc",
			},
			{
				value: "Needs Scaffolding",
				color: "zinc",
			},
			{
				value: "Done",
				color: "zinc",
			},
			{
				value: "Icebox",
				color: "zinc",
			},
			{
				value: "Backlog",
				color: "zinc",
			},
			{
				value: "Family",
				color: "zinc",
			},
			{
				value: "Todo",
				color: "zinc",
			},
			{
				value: "Imported from Todoist",
				color: "zinc",
			},
			{
				value: "Parsing",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: "meta+s",
		position: 6,
	},
	{
		name: "visibility",
		type: "Select",
		isArray: false,
		options: [
			{
				value: "Public",
				color: "red",
			},
			{
				value: "Unlisted",
				color: "amber",
			},
			{
				value: "Private",
				color: "fuchsia",
			},
			{
				value: "Family",
				color: "zinc",
			},
			{
				value: "carr",
				color: "zinc",
			},
			{
				value: "Carrie",
				color: "zinc",
			},
			{
				value: "Mild",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: "meta+v",
		position: 7,
	},
	{
		name: "subtitle",
		type: "Text",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 8,
	},
	{
		name: "alias",
		type: "Multi-select",
		isArray: true,
		options: [
			{
				value:
					"Transcript for My 9-11 All-School Assembly Speech - by Braden Wong - Optim - Medium",
				color: "zinc",
			},
			{
				value: "Transcript for My 9-11 All-School Assembly Speech",
				color: "zinc",
			},
			{
				value: "Transcript for My 9/11 All-School Assembly Speech",
				color: "zinc",
			},
			{
				value: "I'm a Compartmentalizer in friendships",
				color: "zinc",
			},
			{
				value:
					'[[Race, Crime, and the Law]] on how racism is completely impermissable and a slippery slope, no matter how "polite"ly applied',
				color: "zinc",
			},
			{
				value:
					"Every developer should watch Lydia Hallie's video explaining the Javascript Event Loop",
				color: "zinc",
			},
			{
				value: "The Paradox of Academic Excellence: A Lunchtime Revelation",
				color: "zinc",
			},
			{
				value: "A Week in the Life of EcoPackables",
				color: "zinc",
			},
			{
				value: "Progress Report: EcoPackables",
				color: "zinc",
			},
			{
				value: "The Making of EcoPackables: A Weekly Update",
				color: "zinc",
			},
			{
				value: "Behind the Scenes: EcoPackables Development",
				color: "zinc",
			},
			{
				value: "EcoPackables: A Peek into Our Progress",
				color: "zinc",
			},
			{
				value:
					"Don't try doing streaming yourself. Use the AI package instead.",
				color: "zinc",
			},
			{
				value:
					"Taxonomy by ShadCN is a wonderful example of a dashboard with NextJS 13, and the best example app I've ever seen (comes with everything you need)",
				color: "zinc",
			},
			{
				value: "Taxonomy: A Next.js 13 Demo App That's Hard to Resist",
				color: "zinc",
			},
			{
				value: "The Irresistible Appeal of ShadCN's Taxonomy",
				color: "zinc",
			},
			{
				value:
					"Exploring the Stunning Design and Functionality of ShadCN's Taxonomy",
				color: "zinc",
			},
			{
				value:
					"Why ShadCN's Taxonomy Might Just Make a React Convert Out of You",
				color: "zinc",
			},
			{
				value:
					"A SvelteKit Fanboy's Unexpected Attraction to a React-Based Design System",
				color: "zinc",
			},
			{
				value: "Reannouncing Yale Course Superlatives",
				color: "zinc",
			},
			{
				value:
					"Pro tip: create type guards with Zod.safeparse. It’s consistent across all data shapes and you don’t have to do typeof",
				color: "zinc",
			},
			{
				value:
					'"To learn, and then have occasion to practice what you have learned—is this not satisfying?"',
				color: "zinc",
			},
			{
				value: "YouTube channels die after 2 years",
				color: "zinc",
			},
			{
				value:
					"After 2 years of Obsidian, I think it is about time that I make my own editor",
				color: "zinc",
			},
			{
				value: "Effect Recommends Generators Over Pipes",
				color: "zinc",
			},
			{
				value: "How I use useMutation in Whispering",
				color: "zinc",
			},
			{
				value: "Bad Tanstack Docs",
				color: "zinc",
			},
			{
				value: "The Tanstack Docs are Bad",
				color: "zinc",
			},
			{
				value: "The best Tanstack Query setup that I use in most apps",
				color: "zinc",
			},
			{
				value: "Tanstack Refetch on Focus",
				color: "zinc",
			},
			{
				value: "Debounced Tanstack Query",
				color: "zinc",
			},
			{
				value: "Tanstack Debounced Query",
				color: "zinc",
			},
			{
				value: "Debounced Tanstack useQuery",
				color: "zinc",
			},
			{
				value: "Tanstack Debounced useQuery",
				color: "zinc",
			},
			{
				value: "How to Do Business and Keep Your Soul",
				color: "zinc",
			},
			{
				value:
					"In Ecommerce, 40% Of Users Start Their Experience with a Search Bar",
				color: "zinc",
			},
			{
				value:
					"Turn off next.js  eslint and typescript lint before build, it's braindead",
				color: "zinc",
			},
			{
				value: "false",
				color: "zinc",
			},
			{
				value: "Mark Zuckerberg went to Phillips Exeter",
				color: "zinc",
			},
			{
				value:
					"Studying in the room in New Vassar with Rachel, Harrison, and Andy",
				color: "zinc",
			},
			{
				value: "[[HIST 210 Early Middle Ages, 284-1000",
				color: "zinc",
			},
			{
				value:
					"[[HIST 210 Early Middle Ages, 284-1000|HIST 210 Early Middle Ages, 284-1000]]",
				color: "zinc",
			},
			{
				value: "John Nash died in 2015",
				color: "zinc",
			},
			{
				value: "South Korea is about the size of Indiana",
				color: "zinc",
			},
			{
				value: "Halo Effect",
				color: "zinc",
			},
			{
				value: "Why It Was Amazing to Be a Gladiator - YouTube",
				color: "zinc",
			},
			{
				value: "Flusha Was a Big Brain CSGO Player",
				color: "zinc",
			},
			{
				value: "In Defense of Flusha",
				color: "zinc",
			},
			{
				value:
					"Launders Clears Flusha's Name of Cheating Accusations in Masterful CSGO Analysis",
				color: "zinc",
			},
			{
				value:
					"The Unique Challenges of Sharing My [[Epicenter]], My Passion Project",
				color: "zinc",
			},
			{
				value: "Type Safety is key",
				color: "zinc",
			},
			{
				value:
					"People have to understand that in war, there are two types of people fighting on the same side",
				color: "zinc",
			},
			{
				value: "Leiden Frost Effect",
				color: "zinc",
			},
			{
				value: "Watermelon is my favorite fruit",
				color: "zinc",
			},
			{
				value: "The Barbie plan to make Kens jealous doesn't make sense to me",
				color: "zinc",
			},
			{
				value: "Waking up and chatting with Andrew",
				color: "zinc",
			},
			{
				value: "The Questionable Engineering of Oceangate - YouTube",
				color: "zinc",
			},
			{
				value: "A wonderful investigation of Oceangate by Real Engineering",
				color: "zinc",
			},
			{
				value: "Meeting Laura and Sarah in Datadog",
				color: "zinc",
			},
			{
				value:
					"Had a dream about Tom Cruise taking me and jumping off a mountain cliff",
				color: "zinc",
			},
			{
				value: "Cooking spicy vermicelli noodles with Carrie",
				color: "zinc",
			},
			{
				value:
					"Some companies, such as Speechify, hire child prodigies for $250,000",
				color: "zinc",
			},
			{
				value: "James Clear 3-2-1 Newsletter",
				color: "zinc",
			},
			{
				value:
					"The James Clear 3-2-1 newsletter is one of the best short inspiring newsletters I've ever read",
				color: "zinc",
			},
			{
				value: "Remember to set Tanstack Query's staleTime to over 0",
				color: "zinc",
			},
			{
				value: "Luce Hall is connected to Rosenkranz on 2nd floor ",
				color: "zinc",
			},
			{
				value: "Forbes 30 Under 30 is Pay To Win",
				color: "zinc",
			},
			{
				value: "Write as if you just had a long time to think before you talk",
				color: "zinc",
			},
			{
				value: "One of my biggest regrets was not recording my 911 speech",
				color: "zinc",
			},
			{
				value: "Moloch",
				color: "zinc",
			},
			{
				value:
					"There’s no need to force shoulder lag. If you’re set up correctly and accelerate hand, it will happen",
				color: "zinc",
			},
			{
				value: "What evidence would make you change your mind?",
				color: "zinc",
			},
			{
				value: 'My mom openly acknowledges her "Old Chinese Thinking"',
				color: "zinc",
			},
			{
				value: "Golang Command Line Application",
				color: "zinc",
			},
			{
				value:
					"Penguin AI taught me and made me extremely comfortable with React and TailwindCSS",
				color: "zinc",
			},
			{
				value: "Serendipitous",
				color: "zinc",
			},
			{
				value: "Is being a self-taught programmer a compliment?",
				color: "zinc",
			},
			{
				value: "Have a strong mental map or high degree of humility (or both)",
				color: "zinc",
			},
			{
				value:
					"Five of Ten Dating Apps are the Same Company, Just Bumble versus The World",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 9,
	},
	{
		name: "date",
		type: "Date",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 10,
	},
	{
		name: "timezone",
		type: "Select",
		isArray: false,
		options: [
			{
				color: "red",
				value: "America/Los_Angeles",
			},
			{
				color: "sky",
				value: "America/New_York",
			},
			{
				color: "amber",
				value: "Asia/Singapore",
			},
			{
				color: "green",
				value: "Europe/London",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 11,
	},
	{
		name: "post_on",
		type: "Multi-select",
		isArray: true,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 12,
	},
	{
		name: "created_at",
		type: "Text",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 13,
	},
	{
		name: "updated_at",
		type: "Text",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 14,
	},
	{
		name: "type/Book/goodreads_url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Book",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 15,
	},
	{
		name: "type/Article/url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Article",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 16,
	},
	{
		name: "type/Project/deployment_url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Project",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 17,
	},
	{
		name: "type/Project/github_url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Project",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 18,
	},
	{
		name: "type/GitHub Repository/url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "GitHub Repository",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 19,
	},
	{
		name: "type/Prompt/system_prompt",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Prompt",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 20,
	},
	{
		name: "type/Prompt/user_prompt",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Prompt",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 21,
	},
	{
		name: "type/Restaurant/yelp_url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Restaurant",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 22,
	},
	{
		name: "type/Blog/built_with",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Blog",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 23,
	},
	{
		name: "type/Event/description",
		type: "Textarea",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Event",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 24,
	},
	{
		name: "type/Book/link",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Book",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 25,
	},
	{
		name: "type/Comment/video_id",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Comment",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 26,
	},
	{
		name: "type/Excerpt/source",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Excerpt",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 27,
	},
	{
		name: "type/Tool/url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Tool",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 28,
	},
	{
		name: "type/Tool/title",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Tool",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 29,
	},
	{
		name: "type/Email/subject",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Email",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 30,
	},
	{
		name: "type/Video/url",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Video",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 31,
	},
	{
		name: "type/Restaurant/recommended_by",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Restaurant",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 32,
	},
	{
		name: "type/Quote/from",
		type: "Text",
		isArray: false,
		options: [],
		filter: {
			type: "group",
			combinator: "AND",
			rulesOrGroups: [
				{
					type: "rule",
					propertyName: "type",
					operator: "contains",
					value: "Quote",
				},
			],
		},
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 33,
	},
	{
		name: "content_draft",
		type: "Textarea",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 34,
	},
	{
		name: "content_review",
		type: "Textarea",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 35,
	},
	{
		name: "tags",
		type: "Multi-select",
		isArray: true,
		options: [
			{
				value: "9-11",
				color: "zinc",
			},
			{
				value: "Motivation",
				color: "zinc",
			},
			{
				value: "Inspirational",
				color: "zinc",
			},
			{
				value: "Life",
				color: "zinc",
			},
			{
				value: "Python",
				color: "zinc",
			},
			{
				value: "JavaScript",
				color: "zinc",
			},
			{
				value: "Automation",
				color: "zinc",
			},
			{
				value: "Content Creation",
				color: "zinc",
			},
			{
				value: "Publishing",
				color: "zinc",
			},
			{
				value: "Social Media",
				color: "zinc",
			},
			{
				value: "YouTube",
				color: "zinc",
			},
			{
				value: "TikTok",
				color: "zinc",
			},
			{
				value: "Instagram",
				color: "zinc",
			},
			{
				value: "Friendship",
				color: "zinc",
			},
			{
				value: "Social Networks",
				color: "zinc",
			},
			{
				value: "Friends",
				color: "zinc",
			},
			{
				value: "Klarety",
				color: "zinc",
			},
			{
				value: "Artificial Intelligence",
				color: "zinc",
			},
			{
				value: "Inspiration",
				color: "zinc",
			},
			{
				value: "Sports",
				color: "zinc",
			},
			{
				value: "Gratitude",
				color: "zinc",
			},
			{
				value: "Motherhood",
				color: "zinc",
			},
			{
				value: "Success Stories",
				color: "zinc",
			},
			{
				value: "Resilience",
				color: "zinc",
			},
			{
				value: "Life Lessons",
				color: "zinc",
			},
			{
				value: "NBA",
				color: "zinc",
			},
			{
				value: "Kevin Durant",
				color: "zinc",
			},
			{
				value: "Education",
				color: "zinc",
			},
			{
				value: "Electrical Engineering",
				color: "zinc",
			},
			{
				value: "Practical Skills",
				color: "zinc",
			},
			{
				value: "Humor",
				color: "zinc",
			},
			{
				value: "Yale",
				color: "zinc",
			},
			{
				value: "GPA",
				color: "zinc",
			},
			{
				value: "EcoPackables",
				color: "zinc",
			},
			{
				value: "Sustainable Packaging",
				color: "zinc",
			},
			{
				value: "Web Development",
				color: "zinc",
			},
			{
				value: "UI/UX Design",
				color: "zinc",
			},
			{
				value: "Database Management",
				color: "zinc",
			},
			{
				value: "Account Management",
				color: "zinc",
			},
			{
				value: "Product Development",
				color: "zinc",
			},
			{
				value: "Startups",
				color: "zinc",
			},
			{
				value: "Technology",
				color: "zinc",
			},
			{
				value: "Entrepreneurship",
				color: "zinc",
			},
			{
				value: "Features",
				color: "zinc",
			},
			{
				value: "Coding",
				color: "zinc",
			},
			{
				value: "Progress",
				color: "zinc",
			},
			{
				value: "ChatGPT",
				color: "zinc",
			},
			{
				value: "Noodles",
				color: "zinc",
			},
			{
				value: "Tuna",
				color: "zinc",
			},
			{
				value: "Yale University",
				color: "zinc",
			},
			{
				value: "Harvard-Yale Game",
				color: "zinc",
			},
			{
				value: "College Life",
				color: "zinc",
			},
			{
				value: "Student Experience",
				color: "zinc",
			},
			{
				value: "Inclusivity",
				color: "zinc",
			},
			{
				value: "University Events",
				color: "zinc",
			},
			{
				value: "Personal Growth",
				color: "zinc",
			},
			{
				value: "Community",
				color: "zinc",
			},
			{
				value: "Open Source",
				color: "zinc",
			},
			{
				value: "Svelte",
				color: "zinc",
			},
			{
				value: "Vue.js",
				color: "zinc",
			},
			{
				value: "Reactivity Transform",
				color: "zinc",
			},
			{
				value: "Frameworks",
				color: "zinc",
			},
			{
				value: "Collaboration",
				color: "zinc",
			},
			{
				value: "Innovation",
				color: "zinc",
			},
			{
				value: "Rapid Prototyping",
				color: "zinc",
			},
			{
				value: "Supabase",
				color: "zinc",
			},
			{
				value: "Supabase CLI Tool",
				color: "zinc",
			},
			{
				value: "Migrations",
				color: "zinc",
			},
			{
				value: "Database Backup",
				color: "zinc",
			},
			{
				value: "Squashing",
				color: "zinc",
			},
			{
				value: "Prototyping",
				color: "zinc",
			},
			{
				value: "Backend",
				color: "zinc",
			},
			{
				value: "Next.js",
				color: "zinc",
			},
			{
				value: "React",
				color: "zinc",
			},
			{
				value: "ShadCN",
				color: "zinc",
			},
			{
				value: "Taxonomy",
				color: "zinc",
			},
			{
				value: "UI Library",
				color: "zinc",
			},
			{
				value: "Design System",
				color: "zinc",
			},
			{
				value: "App Router",
				color: "zinc",
			},
			{
				value: "Authentication",
				color: "zinc",
			},
			{
				value: "Blog",
				color: "zinc",
			},
			{
				value: "Documentation Site",
				color: "zinc",
			},
			{
				value: "SvelteKit",
				color: "zinc",
			},
			{
				value: "Landing Page",
				color: "zinc",
			},
			{
				value: "Courses",
				color: "zinc",
			},
			{
				value: "Classes",
				color: "zinc",
			},
			{
				value: "Superlatives",
				color: "zinc",
			},
			{
				value: "Harvard",
				color: "zinc",
			},
			{
				value: "MIT",
				color: "zinc",
			},
			{
				value: "Academic Culture",
				color: "zinc",
			},
			{
				value: "Princeton University",
				color: "zinc",
			},
			{
				value: "Time Management",
				color: "zinc",
			},
			{
				value: "Stress",
				color: "zinc",
			},
			{
				value: "Functional Programming",
				color: "zinc",
			},
			{
				value: "Asynchronous Programming",
				color: "zinc",
			},
			{
				value: "Code Simplification",
				color: "zinc",
			},
			{
				value: "Effect.ts",
				color: "zinc",
			},
			{
				value: "Generators",
				color: "zinc",
			},
			{
				value: "Software Development",
				color: "zinc",
			},
			{
				value: "TypeScript",
				color: "zinc",
			},
			{
				value: "GitHub",
				color: "zinc",
			},
			{
				value: "Content Delivery Network (CDN)",
				color: "zinc",
			},
			{
				value: "Markdown",
				color: "zinc",
			},
			{
				value: "Google Photos",
				color: "zinc",
			},
			{
				value: "Double Majoring",
				color: "zinc",
			},
			{
				value: "College",
				color: "zinc",
			},
			{
				value: "Statistics and Data Science",
				color: "zinc",
			},
			{
				value: "Computer Science and Economics",
				color: "zinc",
			},
			{
				value: "Major",
				color: "zinc",
			},
			{
				value: "Tauri",
				color: "zinc",
			},
			{
				value: "Tailwind CSS",
				color: "zinc",
			},
			{
				value: "Frontend",
				color: "zinc",
			},
			{
				value: "Productivity",
				color: "zinc",
			},
			{
				value: "Workflow",
				color: "zinc",
			},
			{
				value: "CLI",
				color: "zinc",
			},
			{
				value: "Integration",
				color: "zinc",
			},
			{
				value: "Elon Musk",
				color: "zinc",
			},
			{
				value: "Upbringing",
				color: "zinc",
			},
			{
				value: "Studying",
				color: "zinc",
			},
			{
				value: "Architecture",
				color: "zinc",
			},
			{
				value: "Carrie",
				color: "zinc",
			},
			{
				value: "Books",
				color: "zinc",
			},
			{
				value: "CSGO",
				color: "zinc",
			},
			{
				value: "Esports",
				color: "zinc",
			},
			{
				value: "Gaming",
				color: "zinc",
			},
			{
				value: "Video Essay",
				color: "zinc",
			},
			{
				value: "Analysis",
				color: "zinc",
			},
			{
				value: "Flusha",
				color: "zinc",
			},
			{
				value: "Cheating",
				color: "zinc",
			},
			{
				value: "Hacking",
				color: "zinc",
			},
			{
				value: "Aim",
				color: "zinc",
			},
			{
				value: "Mechanics",
				color: "zinc",
			},
			{
				value: "Game Sense",
				color: "zinc",
			},
			{
				value: "Positioning",
				color: "zinc",
			},
			{
				value: "Smoke Usage",
				color: "zinc",
			},
			{
				value: "Competitive Integrity",
				color: "zinc",
			},
			{
				value: "Counter-Strike",
				color: "zinc",
			},
			{
				value: "Passion",
				color: "zinc",
			},
			{
				value: "Project",
				color: "zinc",
			},
			{
				value: "Vision",
				color: "zinc",
			},
			{
				value: "Commitment",
				color: "zinc",
			},
			{
				value: "Editing",
				color: "zinc",
			},
			{
				value: "Obsidian",
				color: "zinc",
			},
			{
				value: "Politics",
				color: "zinc",
			},
			{
				value: "Dictatorship",
				color: "zinc",
			},
			{
				value: "United States",
				color: "zinc",
			},
			{
				value: "Funny",
				color: "zinc",
			},
			{
				value: "Dream",
				color: "zinc",
			},
			{
				value: "Action",
				color: "zinc",
			},
			{
				value: "Advice",
				color: "zinc",
			},
			{
				value: "Science/Sleep",
				color: "zinc",
			},
			{
				value: "Calls",
				color: "zinc",
			},
			{
				value: "Call",
				color: "zinc",
			},
			{
				value: "Daily Note/Writeup Snippets",
				color: "zinc",
			},
			{
				value: "Joke",
				color: "zinc",
			},
			{
				value: "Idea",
				color: "zinc",
			},
			{
				value: "Mindset",
				color: "zinc",
			},
			{
				value: "Email",
				color: "zinc",
			},
		],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 36,
	},
	{
		name: "url",
		type: "Text",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "MMMM d, yyyy h:mm a zzz",
		shortcut: null,
		position: 37,
	},
	{
		name: "references",
		type: "Textarea",
		isArray: false,
		options: [],
		filter: null,
		dateDisplayFormat: "ddd MMM DD YYYY HH:mm:ss [GMT]ZZ [(]zzz[)]",
		shortcut: null,
		position: 38,
	},
] as const satisfies Column[];

export type ColumnInDatabase = (typeof COLUMNS_IN_DATABASE)[number];
