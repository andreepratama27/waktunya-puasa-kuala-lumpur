import type { DoaItem } from "@/content/doaAfterSholat";

export type WiridItem = DoaItem & {
	badge?: "Ringkas";
	notes?: string[];
};

const SOURCE_URL =
	"https://akuislam.com/blog/ibadah/wirid-doa-selepas-solat/#zikir";

// Catatan: Konten Arab + latin diambil dari sumber di atas.
// Arti/terjemahan dinormalisasi ke Bahasa Indonesia.
export const ZIKIR_WIRID_AFTER_SHOLAT: WiridItem[] = [
	{
		id: "wirid-01-istighfar-3x",
		badge: "Ringkas",
		title: "Istighfar (3x)",
		arab:
			"أَسْتَغْفِرُ اللّٰهَ الْعَظِيمَ، الَّذِي لَا إِلٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ، وَأَتُوبُ إِلَيْهِ",
		latin:
			"Astagfirullahal-‘Adzīm, Allāzī Lā Ilāha Illā Huwal-Ḥayyul-Qayyūm, Wa Atubu Ilaih (3x)",
		meaning:
			"Aku memohon ampun kepada Allah Yang Maha Agung; tiada Tuhan selain Dia, Yang Maha Hidup lagi terus-menerus mengurus (makhluk-Nya); dan aku bertaubat kepada-Nya.",
	},
	{
		id: "wirid-02-tauhid-3x",
		badge: "Ringkas",
		title: "Pengakuan tauhid (3x)",
		arab:
			"لَا إِلَـٰهَ إِلَّا اللّٰهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، يُحْيِي وَيُمِيتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ",
		latin:
			"Lā Ilāha Illallāhu Waḥdahu Lā Syarīka Lahu, Lahul-Mulku Wa Lahul-Ḥamdu Yuḥyī Wa Yumītu Wa Huwa ‘Alā Kulli Syai-In Qadīr (3x)",
		meaning:
			"Tiada Tuhan yang berhak disembah selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya segala puji. Dia menghidupkan dan mematikan, dan Dia Mahakuasa atas segala sesuatu.",
	},
	{
		id: "wirid-03-ajirna-minan-nar",
		badge: "Ringkas",
		title: "Memohon dijauhkan dari neraka (3x / 7x)",
		arab: "اللّٰهُمَّ أَجِرْنَا مِنَ النَّارِ",
		latin: "Allāhumma Ajirnā Minan-Nār (3x / 7x)",
		meaning: "Ya Allah, lindungilah kami dari api neraka.",
		notes: [
			"Boleh ganti ‘Ajirnā’ (أَجِرْنَا) dengan ‘Ajirnī’ (أَجِرْنِى) jika sholat sendirian.",
			"Dibaca 7x untuk sholat Subuh dan Maghrib (sesuai catatan sumber).",
			`Sumber: ${SOURCE_URL}`,
		],
	},
	{
		id: "wirid-04-antas-salam",
		badge: "Ringkas",
		title: "Doa keselamatan (Antas-salām)",
		arab:
			"اَللَّهُمَّ أَنْتَ السَّلَامُ، وَمِنْكَ السَّلَامُ، وَإِلَيْكَ يَعُودُ السَّلَامُ، فَحَيِّنَا رَبَّنَا بِالسَّلَام، وَأَدْخِلْنَا الْـجَنَّةَ دَارَ السَّلَامِ، تَبَارَكْتَ رَبَّنَا وَتَعَالَيْتَ يَاذَا الْـجَلَالِ وَالْإِكْرَامِ",
		latin:
			"Allāhumma Antas-Salām, Wa Minka As-Salām, Wa Ilāika Ya‘ūdu As-Salām, Faḥayyinā Rabbanā Bi-Salām, Wa Adkhilnā Al-Jannata Dāra As-Salām, Tabārakta Rabbanā Wa Ta‘ālayta Yā Dzāl-Jalāli Wal-Ikrām",
		meaning:
			"Ya Allah, Engkaulah sumber keselamatan; dari-Mu keselamatan; kepada-Mu kembali keselamatan. Maka hidupkanlah kami, wahai Tuhan kami, dalam keselamatan; masukkan kami ke surga, negeri keselamatan. Mahaberkah Engkau wahai Tuhan kami dan Mahatinggi Engkau, wahai Pemilik keagungan dan kemuliaan.",
	},
	{
		id: "wirid-05-taawudz",
		badge: "Ringkas",
		title: "Ta’awudz",
		arab: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ",
		latin: "A‘ūDzu Billāhi Mina Ash-Shayṭānir-Rojīm",
		meaning: "Aku berlindung kepada Allah dari godaan setan yang terkutuk.",
	},
	{
		id: "wirid-06-al-fatihah",
		badge: "Ringkas",
		title: "Al-Fatihah",
		arab:
			"بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ١ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ٢ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٣ مَٰلِكِ يَوۡمِ ٱلدِّينِ ٤ إِيَّاكَ نَعۡبُدُ وَإِيَّاكَ نَسۡتَعِينُ ٥ ٱهۡدِنَا ٱلصِّرَٰطَ ٱلۡمُسۡتَقِيمَ ٦ صِرَٰطَ ٱلَّذِينَ أَنۡعَمۡتَ عَلَيۡهِمۡ غَيۡرِ ٱلۡمَغۡضُوبِ عَلَيۡهِمۡ وَلَا ٱلضَّآلِّينَ ٧",
		latin:
			"Bismillāhir-Raḥmānir-Raḥīm. Al-Ḥamdu Lillāhi Rabbil-‘Ālamīn. Ar-Raḥmānir-Raḥīm. Māliki Yaumid-Dīn. Iyyāka Na‘Budu Wa Iyyāka Nasta‘Īn. Ihdinaṣ-Ṣirāṭal-Mustaqīm. Ṣirāṭallażīna An‘Amta ‘Alaihim, Gairil-Magḍūbi ‘Alaihim Wa Laḍ-Ḍāllīn",
		meaning:
			"Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang. Segala puji bagi Allah, Tuhan semesta alam. Yang Maha Pengasih lagi Maha Penyayang. Pemilik hari pembalasan. Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami mohon pertolongan. Tunjukilah kami jalan yang lurus; (yaitu) jalan orang-orang yang Engkau beri nikmat, bukan jalan orang-orang yang dimurkai dan bukan (pula) jalan orang-orang yang sesat.",
	},
	{
		id: "wirid-07-al-baqarah-2163",
		title: "QS. Al-Baqarah: 163",
		arab:
			"وَإِلَٰهُكُمۡ إِلَٰهٞ وَٰحِدٞۖ لَّآ إِلَٰهَ إِلَّا هُوَ ٱلرَّحۡمَٰنُ ٱلرَّحِيمُ ١٦٣",
		latin:
			"Wa ilāhukum ilāhuw Wāḥid, Lā ilāha illā Huwar-Raḥmānur-Raḥīm",
		meaning:
			"Dan Tuhanmu adalah Tuhan Yang Maha Esa; tidak ada Tuhan selain Dia, Yang Maha Pengasih lagi Maha Penyayang.",
	},
	{
		id: "wirid-08-ayatul-kursi",
		badge: "Ringkas",
		title: "Ayatul Kursi (QS. Al-Baqarah: 255)",
		arab:
			"ٱللَّهُ لَآ إِلَٰهَ إِلَّا هُوَ ٱلۡحَيُّ ٱلۡقَيُّومُۚ لَا تَأۡخُذُهُۥ سِنَةٞ وَلَا نَوۡمٞۚ لَّهُۥ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلۡأَرۡضِۗ مَن ذَا ٱلَّذِي يَشۡفَعُ عِندَهُۥٓ إِلَّا بِإِذۡنِهِۦۚ يَعۡلَمُ مَا بَيۡنَ أَيۡدِيهِمۡ وَمَا خَلۡفَهُمۡۖ وَلَا يُحِيطُونَ بِشَيۡءٖ مِّنۡ عِلۡمِهِۦٓ إِلَّا بِمَا شَآءَۚ وَسِعَ كُرۡسِيُّهُ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضَۖ وَلَا يَـُٔودُهُۥ حِفۡظُهُمَاۚ وَهُوَ ٱلۡعَلِيُّ ٱلۡعَظِيمُ ٢٥٥",
		latin:
			"Allāhu Lā Ilāha Illā Huw, Al-Ḥayyul-Qayyūm, Lā Ta’khużuhū Sinatuw Wa Lā Naum, Lahū Mā Fis-Samāwāti Wa Mā Fil-Arḍ, Man Żallażī Yasyfa‘U ‘Indahū Illā Bi’iżnih, Ya‘Lamu Mā Baina Aidīhim Wa Mā Khalfahum, Wa Lā Yuḥīṭūna Bisyai’im Min ‘Ilmihī Illā Bimā Syā’, Wasi‘A Kursiyyuhus-Samāwāti Wal-Arḍ, Wa Lā Ya’ūduhū Ḥifẓuhumā, Wa Huwal-‘Aliyyul-‘Aẓīm",
		meaning:
			"Allah, tidak ada Tuhan selain Dia, Yang Maha Hidup, Yang terus-menerus mengurus (makhluk-Nya). Dia tidak mengantuk dan tidak tidur. Milik-Nya apa yang di langit dan di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka; mereka tidak mengetahui apa pun dari ilmu-Nya kecuali apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi; memelihara keduanya tidak memberatkan-Nya. Dia Mahatinggi lagi Mahabesar.",
	},
	{
		id: "wirid-09-al-baqarah-2284",
		title: "QS. Al-Baqarah: 284",
		arab:
			"لِّلَّهِ مَا فِي ٱلسَّمَٰوَٰتِ وَمَا فِي ٱلۡأَرضِۗ وَإِن تُبۡدُواْ مَا فِيٓ أَنفُسِكُمۡ أَوۡ تُخۡفُوهُ يُحَاسِبكُم بِهِ ٱللَّهُۖ فَيَغۡفِرُ لِمَن يَشَآءُ وَيُعَذِّبُ مَن يَشَآءُۗ وَٱللَّهُ عَلَىٰ كُلِّ شَيْءٖ قَدِيرٌ ٢٨٤",
		latin:
			"Lillāhi Mā Fis-Samāwāti Wa Mā Fil-Arḍ, Wa In Tubdū Mā Fī Anfusikum Au Tukhfūhu Yuḥāsibkum Bihillāh, Fa Yagfiru Limay Yasyā’u Wa Yu‘Ażżibu May Yasyā’, Wallāhu ‘Alā Kulli Syai’in Qadīr",
		meaning:
			"Milik Allah apa yang di langit dan di bumi. Jika kamu menampakkan apa yang ada dalam hatimu atau menyembunyikannya, Allah akan memperhitungkannya. Lalu Dia mengampuni siapa yang Dia kehendaki dan mengazab siapa yang Dia kehendaki. Allah Mahakuasa atas segala sesuatu.",
	},
	{
		id: "wirid-10-al-baqarah-2285",
		title: "QS. Al-Baqarah: 285",
		arab:
			"ءَامَنَ ٱلرَّسُولُ بِمَآ أُنزِلَ إِلَيۡهِ مِن رَّبِّهِۦ وَٱلۡمُؤمِنُونَۚ كُلٌّ ءَامَنَ بِٱللَّهِ وَمَلَٰٓئِكَتِهِۦ وَكُتُبِهِۦ وَرُسُلِهِۦ لَا نُفَرِّق بَينَ أَحَدٖ مِّن رُّسُلِهِۦۚ وَقَالُواْ سَمِعنَا وَأَطَعنَاۖ غُفرَانَكَ رَبَّنَا وَإِلَيكَ ٱلۡمَصِيرُ ٢٨٥",
		latin:
			"Āmanar-Rasūlu Bimā Unzila Ilaihi Mir Rabbihī Wal-Mu’minūn, Kullun Āmana Billāhi Wa Malā’ikatihī Wa Kutubihī Wa Rusulih, Lā Nufarriqu Baina Aḥadim Mir Rusulih, Wa Qālū Sami‘Nā Wa Aṭa‘Nā Gufrānaka Rabbanā Wa Ilaikal-Maṣīr",
		meaning:
			"Rasul beriman kepada apa yang diturunkan kepadanya dari Tuhannya, dan (demikian pula) orang-orang yang beriman. Semuanya beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, dan rasul-rasul-Nya. (Mereka berkata) ‘Kami tidak membeda-bedakan seorang pun dari rasul-rasul-Nya.’ Mereka berkata, ‘Kami dengar dan kami taat. Ampunilah kami, wahai Tuhan kami, dan kepada-Mu tempat kembali.’",
	},
	{
		id: "wirid-11-al-baqarah-2286",
		title: "QS. Al-Baqarah: 286",
		arab:
			"لَا يُكَلِّفُ ٱللَّهُ نَفسًا إِلَّا وُسعَهَاۚ لَهَا مَا كَسَبَت وَعَلَيهَا مَا ٱكتَسَبَتۗ رَبَّنَا لَا تُؤاخِذنَآ إِن نَّسِينَآ أَو أَخطَأنَاۚ رَبَّنَا وَلَا تَحمِل عَلَينَآ إِصرا كَمَا حَمَلتَهُۥ عَلَى ٱلَّذِينَ مِن قَبلِنَاۚ رَبَّنَا وَلَا تُحَمِّلنَا مَا لَا طَاقَةَ لَنَا بِهِۦۖ وَٱعفُ عَنَّا وَٱغفِر لَنَا وَٱرحَمنَآۚ أَنتَ مَولَىٰنَا فَٱنصُرنَا عَلَى ٱلۡقَومِ ٱلۡكَٰفِرِينَ ٢٨٦",
		latin:
			"Lā Yukallifullāhu Nafsan Illā Wus‘Ahā, Lahā Mā Kasabat Wa ‘Alaihā Maktasabat, Rabbanā Lā Tu’ākhiżnā In Nasīnā Au Akhṭa’nā, Rabbanā Wa Lā Taḥmil ‘Alainā Iṣran Kamā Ḥamaltahū ‘Alallażīna Min Qablinā, Rabbanā Wa Lā Tuḥammilnā Mā Lā Ṭāqata Lanā Bih, Wa‘Fu ‘Annā, Wagfir Lanā, Warḥamnā, Anta Maulānā Fanṣurnā ‘Alal Qaumil-Kāfirīn",
		meaning:
			"Allah tidak membebani seseorang melainkan sesuai kesanggupannya. Ia mendapat (pahala) dari (kebaikan) yang diusahakannya dan menanggung (dosa) dari (keburukan) yang diperbuatnya. (Mereka berdoa:) ‘Wahai Tuhan kami, janganlah Engkau hukum kami jika kami lupa atau kami tersalah. Wahai Tuhan kami, janganlah Engkau bebankan kepada kami beban berat sebagaimana Engkau bebankan kepada orang-orang sebelum kami. Wahai Tuhan kami, janganlah Engkau pikulkan kepada kami apa yang tidak sanggup kami memikulnya. Maafkanlah kami, ampunilah kami, dan rahmatilah kami. Engkaulah Pelindung kami, maka tolonglah kami menghadapi kaum yang kafir.’",
	},
	{
		id: "wirid-12-ali-imran-318",
		title: "QS. Ali ‘Imran: 18",
		arab:
			"شَهِدَ ٱللَّهُ أَنَّهُۥ لَآ إِلَٰهَ إِلَّا هُوَ وَٱلۡمَلَٰٓئِكَةُ وَأُوْلُواْ ٱلۡعِلمِ قَآئِمَۢا بِٱلۡقِسطِۚ لَآ إِلَٰهَ إِلَّا هُوَ ٱلۡعَزِيزُ ٱلۡحَكِيمُ ١٨",
		latin:
			"Syahidallāhu Annahū Lā ilāha illā Huwa Wal-Malā’ikatu Wa Ulul-‘Ilmi Qā’imam Bil-Qisṭ, Lā Ilāha Illā Huwal-‘Azīzul-Ḥakīm",
		meaning:
			"Allah menyatakan bahwa tidak ada Tuhan selain Dia; (demikian pula) para malaikat dan orang-orang berilmu (juga menyatakan), dengan menegakkan keadilan. Tidak ada Tuhan selain Dia, Yang Mahaperkasa lagi Mahabijaksana.",
	},
	{
		id: "wirid-13-ali-imran-319",
		title: "QS. Ali ‘Imran: 19",
		arab: "إِنَّ ٱلدِّينَ عِندَ ٱللَّهِ ٱلۡإِسلَٰمُۗ",
		latin: "innad-dīna ‘indallāhil-islām",
		meaning: "Sesungguhnya agama (yang diridai) di sisi Allah hanyalah Islam.",
	},
	{
		id: "wirid-14-ali-imran-326",
		title: "QS. Ali ‘Imran: 26",
		arab:
			"قُلِ ٱللَّهُمَّ مَٰلِكَ ٱلۡمُلكِ تُؤتِي ٱلۡمُلكَ مَن تَشَآءُ وَتَنزِعُ ٱلۡمُلكَ مِمَّن تَشَآءُ وَتُعِزُّ مَن تَشَآءُ وَتُذِلُّ مَن تَشَآءُۖ بِيَدِكَ ٱلۡخَيرُۖ إِنَّكَ عَلَىٰ كُلِّ شَيْءٖ قَدِيرٞ ٢٦",
		latin:
			"Qulillāhumma Mālikal-Mulki Tu’til-Mulka Man Tasyā’u Wa Tanzi‘Ul-Mulka Mim Man Tasyā’u Wa Tu‘Izzu Man Tasyā’u Wa Tużillu Man Tasyā’, Biyadikal-Khaīr, Innaka ‘Alā Kulli Syai’in Qadīr",
		meaning:
			"Katakanlah: ‘Ya Allah, Pemilik kerajaan. Engkau berikan kerajaan kepada siapa yang Engkau kehendaki dan Engkau cabut kerajaan dari siapa yang Engkau kehendaki. Engkau muliakan siapa yang Engkau kehendaki dan Engkau hinakan siapa yang Engkau kehendaki. Di tangan-Mu segala kebaikan. Sesungguhnya Engkau Mahakuasa atas segala sesuatu.’",
	},
	{
		id: "wirid-15-ali-imran-327",
		title: "QS. Ali ‘Imran: 27",
		arab:
			"تُولِجُ ٱلَّيلَ فِي ٱلنَّهَارِ وَتُولِجُ ٱلنَّهَارَ فِي ٱلَّيلِۖ وَتُخرِجُ ٱلۡحَيَّ مِنَ ٱلۡمَيِّتِ وَتُخرِجُ ٱلۡمَيِّتَ مِنَ ٱلۡحَيِّۖ وَتَرزُقُ مَن تَشَآءُ بِغَيرِ حِسَابٖ ٢٧",
		latin:
			"Tūlijul-Laila Fin-Nahāri Wa Tūlijun-Nahāra Fil-Laili Wa Tukhrijul-Ḥayya Minal-Mayyiti Wa Tukhrijul-Mayyita Minal-Ḥayyi Wa Tarzuqu Man Tasyā’u Bigairi Ḥisāb",
		meaning:
			"Engkau masukkan malam ke dalam siang dan Engkau masukkan siang ke dalam malam. Engkau keluarkan yang hidup dari yang mati dan Engkau keluarkan yang mati dari yang hidup. Engkau beri rezeki kepada siapa yang Engkau kehendaki tanpa hisab.",
	},
	{
		id: "wirid-16-al-ikhlas",
		badge: "Ringkas",
		title: "Al-Ikhlas",
		arab:
			"قُل هُوَ ٱللَّهُ أَحَدٌ ١ ٱللَّهُ ٱلصَّمَدُ ٢ لَم يَلِد وَلَم يُولَد ٣ وَلَم يَكُن لَّهُۥ كُفُوًا أَحَدُۢ ٤",
		latin:
			"Qul Huwallāhu Aḥad. Allāhuṣ-Ṣamad. Lam Yalid Wa Lam Yūlad. Wa Lam Yakul Lahū Kufuwan Aḥad.",
		meaning:
			"Katakanlah: Dialah Allah Yang Maha Esa. Allah tempat bergantung segala sesuatu. Dia tidak beranak dan tidak pula diperanakkan. Dan tidak ada sesuatu pun yang setara dengan-Nya.",
	},
	{
		id: "wirid-17-al-falaq",
		badge: "Ringkas",
		title: "Al-Falaq",
		arab:
			"قُل أَعُوذُ بِرَبِّ ٱلۡفَلَقِ ١ مِن شَرِّ مَا خَلَقَ ٢ وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ ٣ وَمِن شَرِّ ٱلنَّفَّٰثَٰتِ فِي ٱلۡعُقَدِ ٤ وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ ٥",
		latin:
			"Qul A‘Ūżu Birabbil-Falaq. Min Syarri Mā Khalaq. Wa Min Syarri Gāsiqin Iżā Waqab. Wa Min Syarrin-Naffāṡāti Fil-‘Uqad. Wa Min Syarri Ḥāsidin Iżā Ḥasad",
		meaning:
			"Katakanlah: Aku berlindung kepada Tuhan yang menguasai subuh, dari kejahatan makhluk-Nya, dari kejahatan malam apabila gelap gulita, dari kejahatan (tukang sihir) yang meniup pada buhul-buhul, dan dari kejahatan orang yang dengki bila ia dengki.",
	},
	{
		id: "wirid-18-an-nas",
		badge: "Ringkas",
		title: "An-Nas",
		arab:
			"قُل أَعُوذُ بِرَبِّ ٱلنَّاسِ ١ مَلِكِ ٱلنَّاسِ ٢ إِلَٰهِ ٱلنَّاسِ ٣ مِن شَرِّ ٱلۡوَسوَاسِ ٱلۡخَنَّاسِ ٤ ٱلَّذِي يُوَسوِسُ فِي صُدُورِ ٱلنَّاسِ ٥ مِنَ ٱلۡجِنَّةِ وَٱلنَّاسِ ٦",
		latin:
			"Qul A‘Ūżu Birabbin-Nās. Malikin-Nās. Ilāhin-Nās. Min Syarril-Waswāsil-Khannās. Allażī Yuwaswisu Fī Ṣudūrin-Nās. Minal Jinnati Wan-Nās",
		meaning:
			"Katakanlah: Aku berlindung kepada Tuhan manusia, Raja manusia, Sembahan manusia, dari kejahatan bisikan setan yang bersembunyi, yang membisikkan (kejahatan) ke dalam dada manusia, dari (golongan) jin dan manusia.",
	},
	{
		id: "wirid-19-al-fatihah-lagi",
		title: "Al-Fatihah (lagi)",
		arab:
			"بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ١ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَٰلَمِينَ ٢ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ ٣ مَٰلِكِ يَومِ ٱلدِّينِ ٤ إِيَّاكَ نَعبُدُ وَإِيَّاكَ نَستَعِينُ ٥ ٱهدِنَا ٱلصِّرَٰطَ ٱلمُستَقِيمَ ٦ صِرَٰطَ ٱلَّذِينَ أَنعَمتَ عَلَيهِم غَيرِ ٱلۡمَغضُوبِ عَلَيهِم وَلَا ٱلضَّآلِّينَ ٧",
		latin:
			"Bismillāhir-Raḥmānir-Raḥīm. Al-Ḥamdu Lillāhi Rabbil-‘Ālamīn. Ar-Raḥmānir-Raḥīm. Māliki Yaumid-Dīn. Iyyāka Na‘Budu Wa Iyyāka Nasta‘Īn. Ihdinaṣ-Ṣirāṭal-Mustaqīm. Ṣirāṭallażīna An‘Amta ‘Alaihim, Gairil-Magḍūbi ‘Alaihim Wa Laḍ-Ḍāllīn",
		meaning:
			"Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang... (Al-Fatihah).",
	},
	{
		id: "wirid-20-tasbih-ilahi",
		badge: "Ringkas",
		title: "Tasbih pembuka",
		arab: "إِلَـٰهِى يَا رَبِّـى ــ سُبْحَانَ اللَّهِ",
		latin: "Ilāhī Yā Rabbī ― Subḥānallāh",
		meaning: "Ya Allah, wahai Tuhanku — Mahasuci Allah.",
		notes: [
			"Jika menjadi imam (sholat berjamaah), di sumber dicantumkan versi: إِلَـٰهَنَا يَا رَبَّنَا ــ سُبْحَانَ اللَّهِ (Ilāhanā Yā Rabbanā ― Subḥānallāh).",
		],
	},
	{
		id: "wirid-21-subhanallah-33",
		badge: "Ringkas",
		title: "Subḥānallāh (33x)",
		arab: "سُبْحَانَ اللّٰهِ",
		latin: "Subḥānallāh (33x)",
		meaning: "Mahasuci Allah.",
	},
	{
		id: "wirid-22-tahmid-panjang",
		badge: "Ringkas",
		title: "Tahmid (kalimat pujian)",
		arab: "سُبْحَانَ اللَّهِ وَبِـحَمْدِهِ دَآئِمًا قَائِمًا أَبَدًا ـــ اَلْـحَمْدُ لِلَّهِ",
		latin:
			"Subḥānallāhi Wa Bi-Ḥamdihi Dā’iman Qā’iman Abadaa — Al-Ḥamdu Lillāh",
		meaning:
			"Mahasuci Allah, aku bertasbih sambil memuji-Nya, terus-menerus dan selamanya — segala puji hanya bagi Allah.",
	},
	{
		id: "wirid-23-alhamdulillah-33",
		badge: "Ringkas",
		title: "Alḥamdulillāh (33x)",
		arab: "اَلْـحَمْدُ لِلَّهِ",
		latin: "Alhamdulillah (33x)",
		meaning: "Segala puji hanya bagi Allah.",
	},
	{
		id: "wirid-24-takbir-panjang",
		badge: "Ringkas",
		title: "Takbir (kalimat pengagungan)",
		arab: "اَلْـحَمْدُ لِلَّهِ رَبِّ الْعَالَـمِينَ عَلَى كُلِّ حَالٍ وَنِعْمَةٍ ــ اَللَّهُ أَكْبَرُ",
		latin:
			"Al-Ḥamdu Lillāhi Rabbil-‘Ālamīna ‘Alā Kulli Ḥālin Wa Ni‘matin ― Allāhu Akbar",
		meaning:
			"Segala puji bagi Allah, Tuhan semesta alam, dalam setiap keadaan dan nikmat pemberian-Nya — Allah Mahabesar.",
	},
	{
		id: "wirid-25-allahu-akbar-33",
		badge: "Ringkas",
		title: "Allāhu Akbar (33x)",
		arab: "اَللَّهُ أَكْبَرُ",
		latin: "Allāhu Akbar (33x)",
		meaning: "Allah Mahabesar.",
	},
	{
		id: "wirid-26-pelengkap",
		badge: "Ringkas",
		title: "Pelengkap tasbih/tahmid/takbir",
		arab:
			"اللَّهُ أَكْبَرُ كَبِيْرًا وَالْحَمْدُ لِلَّهِ كَثِيْرًا وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيْلًا. لَا إِلـٰهَ إِلَّا اللَّهُ وَحْدَهُ لا شَرِيْكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ يُحْيِي وَيُمِيْتُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيْرٌ وَإِلَيْهِ الْمَصِيْرُ وَلاَ حَوْلَ وَلاَ قُوَّةَ إِلَّا بِاللَّهِ الْعَلِيِّ الْعَظِيْمِ، أَسْتَغْفِرُ اللَّهَ الْعَظِيْمَ",
		latin:
			"Allāhu Akbar Kabīraw Wa Al-Ḥamdu Lillāhi Kathīraw Wa Subḥānallāhi Bukrataw Wa Aṣīlaa. Lā Ilāha Illā Allāhu Waḥdahu Lā Sharīka Lah, Lahul-Mulku Wa Lahul-Ḥamdu Yuḥyī Wa Yumītu Wa Huwa ‘Alā Kulli Shay’in Qadīr Wa Ilaihil-Maṣīr. Wa Lā Ḥawla Wa Lā Quwwata Illā Billāhil-‘Aliyyil-‘Aẓīm, Astaghfirullāhal-‘Aẓīm",
		meaning:
			"Allah Mahabesar, segala puji bagi Allah, Mahasuci Allah di pagi dan petang. Tiada Tuhan selain Allah semata, tiada sekutu bagi-Nya. Milik-Nya kerajaan dan bagi-Nya segala puji. Dia menghidupkan dan mematikan, dan Dia Mahakuasa atas segala sesuatu; kepada Allah tempat kembali. Tidak ada daya dan kekuatan kecuali dengan pertolongan Allah Yang Mahatinggi lagi Mahaagung. Aku memohon ampun kepada Allah Yang Mahaagung.",
		notes: [`Sumber: ${SOURCE_URL}`],
	},
];
