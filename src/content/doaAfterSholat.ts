export type DoaItem = {
	id: string;
	title: string;
	arab: string;
	latin: string;
	meaning: string;
};

export const DOA_AFTER_SHOLAT: DoaItem[] = [
	{
		id: "istighfar",
		title: "Istighfar",
		arab: "أَسْتَغْفِرُ اللّٰهَ",
		latin: "Astaghfirullah (3x)",
		meaning: "Aku memohon ampun kepada Allah.",
	},
	{
		id: "antas-salaam",
		title: "Allahumma antas-salaam (doa penutup selepas solat)",
		arab: "اللّٰهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ",
		latin:
			"Allahumma antas-salaam wa minkas-salaam tabaarakta ya dzal-jalaali wal-ikraam",
		meaning:
			"Ya Allah, Engkaulah As-Salam dan dari-Mu keselamatan. Maha Berkah Engkau wahai Pemilik keagungan dan kemuliaan.",
	},
	{
		id: "tasbih",
		title: "Tasbih",
		arab: "سُبْحَانَ اللّٰهِ",
		latin: "Subhanallah (33x)",
		meaning: "Maha Suci Allah.",
	},
	{
		id: "tahmid",
		title: "Tahmid",
		arab: "اَلْحَمْدُ لِلّٰهِ",
		latin: "Alhamdulillah (33x)",
		meaning: "Segala puji bagi Allah.",
	},
	{
		id: "takbir",
		title: "Takbir",
		arab: "اَللّٰهُ أَكْبَرُ",
		latin: "Allahu Akbar (34x)",
		meaning: "Allah Maha Besar.",
	},
	{
		id: "a-inni",
		title: "Allahumma a’inni ‘ala dzikrika (minta dibantu dzikir & ibadah)",
		arab: "اللّٰهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
		latin: "Allahumma a’inni ‘ala dzikrika wa syukrika wa husni ‘ibadatika",
		meaning:
			"Ya Allah, bantulah aku untuk mengingat-Mu, bersyukur kepada-Mu, dan beribadah dengan baik.",
	},
	{
		id: "rabbana-atina",
		title: "Rabbanaa aatinaa (kebaikan dunia & akhirat)",
		arab: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
		latin:
			"Rabbanaa aatinaa fid-dunyaa hasanah wa fil-aakhirati hasanah wa qinaa ‘adzaaban-naar",
		meaning:
			"Ya Rabb, berikan kebaikan di dunia dan akhirat, serta lindungi kami dari siksa neraka.",
	},
];
