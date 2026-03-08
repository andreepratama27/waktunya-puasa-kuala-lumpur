const QURAN_API_BASE = "https://api.quran.com/api/v4";
const AUDIO_BASE = "https://audio.qurancdn.com/";

export type QuranChapter = {
	id: number;
	name_simple: string;
	name_complex: string;
	name_arabic: string;
	verses_count: number;
	revelation_place: string;
};

type ChaptersResponse = { chapters: QuranChapter[] };

export type QuranVerse = {
	verseKey: string;
	verseNumber: number;
	arab: string;
	latin: string;
	translationId: string;
	audioUrl?: string;
};

type VerseApiWord = {
	char_type_name?: string;
	text?: string;
	transliteration?: { text?: string };
};

type VerseApiVerse = {
	verse_key: string;
	verse_number: number;
	text_uthmani?: string;
	words?: VerseApiWord[];
	translations?: { id: number; text?: string }[];
};

type VersesResponse = {
	verses: VerseApiVerse[];
	pagination: { current_page: number; next_page: number | null; total_pages: number };
};

type RecitationAudioFile = {
	verse_key: string;
	url?: string;
};

type RecitationResponse = {
	audio_files: RecitationAudioFile[];
	pagination: { current_page: number; next_page: number | null; total_pages: number };
};

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, "").trim();

const joinTransliteration = (words: VerseApiWord[]) => {
	// Join only actual words; ignore end markers.
	return words
		.filter((w) => w.char_type_name === "word")
		.map((w) => w.transliteration?.text ?? "")
		.map((w) => w.trim())
		.filter(Boolean)
		.join(" ")
		.replace(/\s+/g, " ")
		.trim();
};

export async function fetchChapters(): Promise<QuranChapter[]> {
	const url = new URL(`${QURAN_API_BASE}/chapters`);
	url.searchParams.set("language", "en");
	const res = await fetch(url.toString(), { cache: "force-cache" });
	if (!res.ok) throw new Error("Failed to fetch chapters");
	const json = (await res.json()) as ChaptersResponse;
	return json.chapters;
}

export type SurahBundle = {
	chapter: QuranChapter;
	verses: QuranVerse[];
};

export async function fetchSurahBundle(args: {
	surahId: number;
	translationId?: number; // default 33 (ID, Ministry)
	recitationId?: number; // default 7
}): Promise<SurahBundle> {
	const translationId = args.translationId ?? 33;
	const recitationId = args.recitationId ?? 7;

	// chapter metadata
	const chapters = await fetchChapters();
	const chapter = chapters.find((c) => c.id === args.surahId);
	if (!chapter) throw new Error("Surah not found");

	const verses: QuranVerse[] = [];
	const audioMap = new Map<string, string>();

	// Fetch audio urls (paginated)
	{
		let page = 1;
		while (true) {
			const url = new URL(`${QURAN_API_BASE}/recitations/${recitationId}/by_chapter/${args.surahId}`);
			url.searchParams.set("page", String(page));
			url.searchParams.set("per_page", "50");
			const res = await fetch(url.toString(), { cache: "force-cache" });
			if (!res.ok) break;
			const json = (await res.json()) as RecitationResponse;
			for (const f of json.audio_files ?? []) {
				if (f.verse_key && f.url) audioMap.set(f.verse_key, `${AUDIO_BASE}${f.url}`);
			}
			if (!json.pagination?.next_page) break;
			page = json.pagination.next_page;
		}
	}

	// Fetch verses + words + translations (paginated)
	{
		let page = 1;
		while (true) {
			const url = new URL(`${QURAN_API_BASE}/verses/by_chapter/${args.surahId}`);
			url.searchParams.set("language", "en");
			url.searchParams.set("words", "true");
			url.searchParams.set("translations", String(translationId));
			url.searchParams.set("fields", "text_uthmani");
			url.searchParams.set("page", String(page));
			url.searchParams.set("per_page", "50");

			const res = await fetch(url.toString(), { cache: "no-store" });
			if (!res.ok) throw new Error("Failed to fetch verses");
			const json = (await res.json()) as VersesResponse;
			for (const v of json.verses ?? []) {
				const translationText = v.translations?.[0]?.text ?? "";
				const latin = v.words ? joinTransliteration(v.words) : "";
				verses.push({
					verseKey: v.verse_key,
					verseNumber: v.verse_number,
					arab: v.text_uthmani ?? "-",
					latin,
					translationId: stripHtml(translationText),
					audioUrl: audioMap.get(v.verse_key),
				});
			}
			if (!json.pagination?.next_page) break;
			page = json.pagination.next_page;
		}
	}

	return { chapter, verses };
}
