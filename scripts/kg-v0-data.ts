export type KgV0Row = {
  type: string;
  slug: string;
  nameBs: string;
  nameEn?: string;
  shortBio: string;
  metadata?: Record<string, string>;
};

export const KG_V0_ENTITIES: KgV0Row[] = [
  {
    type: "person",
    slug: "christian-schmidt",
    nameBs: "Christian Schmidt",
    nameEn: "Christian Schmidt",
    shortBio:
      "Christian Schmidt jest visoki predstavnik za Bosnu i Hercegovinu, sa mandatom Bonn ovlasti u institucionalnim i ustavnim pitanjima.",
    metadata: {
      role: "Visoki predstavnik za BiH",
      activeFromIso: "2021-08-02T00:00:00.000Z",
    },
  },
  {
    type: "person",
    slug: "milorad-dodik",
    nameBs: "Milorad Dodik",
    nameEn: "Milorad Dodik",
    shortBio:
      "Milorad Dodik predsjednik je Republike Srpske i dugogodišnji politikant čiji se stavovi u odnosu na državne strukture često mijenjaju političkoj dinamici.",
    metadata: { role: "Predsjednik Republike Srpske" },
  },
  {
    type: "person",
    slug: "zeljko-komsic",
    nameBs: "Željko Komšić",
    nameEn: "Željko Komšić",
    shortBio:
      "Željko Komšić je član Predsjedništva Bosne i Hercegovine (Hrvatski član), bivši predsjedavajući i politički glas saveza građana.",
    metadata: { role: "Član Predsjedništva BiH (Hrvati)" },
  },
  {
    type: "person",
    slug: "denis-becirovic",
    nameBs: "Denis Bećirović",
    nameEn: "Denis Bećirović",
    shortBio:
      "Denis Bećirović je član Predsjedništva Bosne i Hercegovine (Bošnjaci) i akademski javni komunikator u političkom položaju.",
    metadata: { role: "Član Predsjedništva BiH (Bošnjaci)" },
  },
  {
    type: "person",
    slug: "zeljka-cvijanovic",
    nameBs: "Željka Cvijanović",
    nameEn: "Željka Cvijanović",
    shortBio:
      "Željka Cvijanović predsjednica je Srpske nakon vijede u pravosuđu i regionalnoj političkoj sceni Zapadnog Balkana.",
    metadata: { role: "Bivša predsjednica RS" },
  },
  {
    type: "person",
    slug: "nermin-niksic",
    nameBs: "Nermin Nikšić",
    nameEn: "Nermin Nikšić",
    shortBio:
      "Nermin Nikšić predstavlja vladinu liniju Federacije kao predsjednika Vijeća ministara državnog nivoa u BiH institucijama.",
    metadata: { role: "Predsjednik Vijeća ministara BiH (FBiH mandat u kontekstu)" },
  },
  {
    type: "person",
    slug: "borjana-kristo",
    nameBs: "Borjana Krišto",
    nameEn: "Borjana Krišto",
    shortBio:
      "Borjana Krišto vodi institucije federalnog nivoa u Bosni kao predstavnica HDZ blokova u parlamentarnoj aritmetici.",
    metadata: { role: "Visoka funkcija BiH parlamenta (HDZ konsenzus)" },
  },
  {
    type: "person",
    slug: "zlatko-lagumdzija",
    nameBs: "Zlatko Lagumdžija",
    nameEn: "Zlatko Lagumdžija",
    shortBio:
      "Zlatko Lagumdžija bivši je predsjedavajući Vijeća ministara SDS-SDP epoke i trajni akademski diplomat političkih debata.",
  },
  {
    type: "person",
    slug: "bakir-izetbegovic",
    nameBs: "Bakir Izetbegović",
    nameEn: "Bakir Izetbegović",
    shortBio:
      "Bakir Izetbegović predsjednik je SDA stranke te dugogodišnji parlamentarac i diplomat u institucijskim pregovorima BiH-EU.",
  },
  {
    type: "person",
    slug: "dragan-covic",
    nameBs: "Dragan Čović",
    nameEn: "Dragan Čović",
    shortBio:
      "Dragan Čović dugogodišnji je hrvatski predstavnik u blokovima HDZ-a i bivši član Predsjedništva BiH.",
  },
  {
    type: "person",
    slug: "alija-izetbegovic",
    nameBs: "Alija Izetbegović",
    nameEn: "Alija Izetbegović",
    shortBio:
      "Alija Izetbegović predsjednik je Predsjedništva RBiH u ratu i miru, utemeljitelj političkog smjera SDA u modernoj bosanskoj državi.",
  },
  {
    type: "person",
    slug: "franjo-tudman",
    nameBs: "Franjo Tuđman",
    nameEn: "Franjo Tuđman",
    shortBio:
      "Franjo Tuđman prvi je predsjednik neovisne Hrvatske; u dejtonskom procesu uticao je na dogovor o strukturi BiH.",
  },
  {
    type: "person",
    slug: "slobodan-milosevic",
    nameBs: "Slobodan Milošević",
    nameEn: "Slobodan Milošević",
    shortBio:
      "Slobodan Milošević vodio je Srbiju tokom raspada SFRJ i ratova devedesetih; osuđen od ICTY za zločine u Hrvatskoj i BiH.",
  },
  {
    type: "person",
    slug: "radovan-karadzic",
    nameBs: "Radovan Karadžić",
    nameEn: "Radovan Karadžić",
    shortBio:
      "Radovan Karadžić politički je lider RS u ratu i osuđen za genocid i zločine protiv čovječnosti (ICTY).",
  },
  {
    type: "person",
    slug: "ratko-mladic",
    nameBs: "Ratko Mladić",
    nameEn: "Ratko Mladić",
    shortBio:
      "Ratko Mladić bivši je komandant VRS; presuđen za genocid među ostalim u Srebrenici.",
  },
  {
    type: "person",
    slug: "biljana-plavsic",
    nameBs: "Biljana Plavšić",
    nameEn: "Biljana Plavšić",
    shortBio:
      "Biljana Plavšić bila je član Predsjedništva Srpske u ratu te kasnije predsjednica RS; pravosudno odgovarala za ratne zločine.",
  },
  {
    type: "person",
    slug: "momcilo-krajisnik",
    nameBs: "Momčilo Krajišnik",
    nameEn: "Momčilo Krajišnik",
    shortBio:
      "Momčilo Krajišnik ratni je politički lider RS u pregovorima i parlamentu; osuđen za zločine protiv čovječnosti.",
  },
  {
    type: "person",
    slug: "aleksandar-vucic",
    nameBs: "Aleksandar Vučić",
    nameEn: "Aleksandar Vučić",
    shortBio:
      "Aleksandar Vučić predsjednik je Srbije; u dijalogu s političarima na prostoru BiH ima politički uticaj preko regionalnih odnosa.",
  },
  {
    type: "person",
    slug: "andrej-plenkovic",
    nameBs: "Andrej Plenković",
    nameEn: "Andrej Plenković",
    shortBio:
      "Andrej Plenković hrvatski je premijer; zagovara EU integracije i susjedsku politiku koja uključuje i BiH.",
  },
  {
    type: "person",
    slug: "edi-rama",
    nameBs: "Edi Rama",
    nameEn: "Edi Rama",
    shortBio:
      "Edi Rama premijer je Albanije i faktor u regionalnim diplomatskim inicijativama na Zapadnom Balkanu.",
  },
  {
    type: "person",
    slug: "carl-bildt",
    nameBs: "Carl Bildt",
    nameEn: "Carl Bildt",
    shortBio:
      "Carl Bildt bivši je visoki predstavnik i švedski diplomat u dejtonskom procesu i ranoj poslijeratnoj stabilizaciji.",
  },
  {
    type: "person",
    slug: "wolfgang-petritsch",
    nameBs: "Wolfgang Petritsch",
    nameEn: "Wolfgang Petritsch",
    shortBio:
      "Wolfgang Petritsch austrijski diplomat, visoki predstavnik u periodu Bonn ovlasti i reformi.",
  },
  {
    type: "person",
    slug: "paddy-ashdown",
    nameBs: "Paddy Ashdown",
    nameEn: "Paddy Ashdown",
    shortBio:
      "Paddy Ashdown britanski je političar i visoki predstavnik poznat po snažnoj ulozi u institucionalnim reformama BiH.",
  },
  {
    type: "person",
    slug: "christian-schwarz-schilling",
    nameBs: "Christian Schwarz-Schilling",
    nameEn: "Christian Schwarz-Schilling",
    shortBio:
      "Christian Schwarz-Schilling njemački je političar koji je obavljao dužnost visokog predstavnika za BiH.",
  },
  {
    type: "person",
    slug: "miroslav-lajcak",
    nameBs: "Miroslav Lajčák",
    nameEn: "Miroslav Lajčák",
    shortBio:
      "Miroslav Lajčák slovenski diplomata; visoki predstavnik koji je posredovao oko izbornih i institucionalnih kriza.",
  },
  {
    type: "person",
    slug: "valentin-inzko",
    nameBs: "Valentin Inzko",
    nameEn: "Valentin Inzko",
    shortBio:
      "Valentin Inzko austrijski je diplomata; dugogodišnji visoki predstavnik čije su odluke uticale na institucionalnu klimu BiH.",
  },
  {
    type: "person",
    slug: "alija-behmen",
    nameBs: "Alija Behmen",
    nameEn: "Alija Behmen",
    shortBio:
      "Alija Behmen političar je i akademski sudionik društvenog života u BiH (referentna figura u institucionalnom kontekstu).",
  },
  {
    type: "person",
    slug: "sanela-hadziahmetovic",
    nameBs: "Sanela Hadžiahmetović",
    nameEn: "Sanela Hadžiahmetović",
    shortBio:
      "Sanela Hadžiahmetović parlamentarac je u domu naroda i glas u obrazovnoj i socijalnoj politici FBiH.",
  },
  {
    type: "person",
    slug: "adis-ahmetovic",
    nameBs: "Adis Ahmetović",
    nameEn: "Adis Ahmetović",
    shortBio:
      "Adis Ahmetović političar je u socijaldemokratskom bloku i stranačkim koalicijama parlamenta BiH.",
  },
  {
    type: "person",
    slug: "semsudin-mehmedovic",
    nameBs: "Šemsudin Mehmedović",
    nameEn: "Šemsudin Mehmedović",
    shortBio:
      "Šemsudin Mehmedović političar je u federalnim institucijama i stranačkim blokovima uz preplitanje SDP–SDA linija.",
  },
  {
    type: "org",
    slug: "ured-visokog-predstavnika",
    nameBs: "Ured visokog predstavnika (OHR)",
    nameEn: "Office of the High Representative",
    shortBio:
      "OHR je međunarodna institucija sa sjedištem u Sarajevu koja provodi Dejton i Bonn ovlasti i može uklanjati blokade u institucijama.",
  },
  {
    type: "org",
    slug: "sipa-fbih",
    nameBs: "SIPA — Služba za istraživanje i zaštitu",
    shortBio:
      "SIPA centralna je policijska služba u Federaciji za ozbiljne kriminalne slučajeve i međuentitetsku saradnju.",
  },
  {
    type: "org",
    slug: "vstv-bih",
    nameBs: "VSTV BiH — Visoki savjet za sudstvo",
    shortBio:
      "VSTV je nezavisan organ za izbor sudija, disciplinu i ostale standarde pravosuđa u BiH.",
  },
  {
    type: "org",
    slug: "sud-bih",
    nameBs: "Sud Bosne i Hercegovine",
    shortBio:
      "Sud BiH najviši je državni sud za krivične i druge nadležnosti koje ustavnim zakonima pripadaju državnom nivou.",
  },
  {
    type: "org",
    slug: "tuzilastvo-bih",
    nameBs: "Tužilaštvo Bosne i Hercegovine",
    shortBio:
      "Tužilaštvo BiH nadležno je za ratne zločine, korupciju visokog nivoa i druge predmete državnog krivičnog prava.",
  },
  {
    type: "org",
    slug: "ustavni-sud-bih",
    nameBs: "Ustavni sud Bosne i Hercegovine",
    shortBio:
      "Ustavni sud BiH tumači Ustav i određuje sukob nadležnosti među entitetima i državnim nivoom.",
  },
  {
    type: "org",
    slug: "predsjednistvo-bih",
    nameBs: "Predsjedništvo Bosne i Hercegovine",
    shortBio:
      "Predsjedništvo BiH tročlano je izvršno tijelo predsjednika države u rotacionom modelu kolegijalnog rada.",
  },
  {
    type: "org",
    slug: "vijece-ministara-bih",
    nameBs: "Vijeće ministara Bosne i Hercegovine",
    shortBio:
      "Vijeće ministara glavna je vlada na državnom nivou za vanjske poslove, fiskalnu koordinaciju i EU poslove.",
  },
  {
    type: "org",
    slug: "parlamentarna-skupstina-bih",
    nameBs: "Parlamentarna skupština Bosne i Hercegovine",
    shortBio:
      "Parlamentarna skupština zakonodavno je tijelo BiH s dva doma i ključno za ustavne i izborne reforme.",
  },
  {
    type: "org",
    slug: "vlada-fbih",
    nameBs: "Vlada Federacije Bosne i Hercegovine",
    shortBio:
      "Vlada FBiH vodi federalne resurse kantonalnog sistema i javnu upravu u većinski bošnjačko-hrvatskoj politici.",
  },
  {
    type: "org",
    slug: "vlada-rs",
    nameBs: "Vlada Republike Srpske",
    shortBio:
      "Vlada RS provodi entitetske zakone i budžet uz centar u Banjoj Luci unutar parlamenata RS.",
  },
  {
    type: "org",
    slug: "vlada-brcko-distrikta",
    nameBs: "Vlada Brčko distrikta BiH",
    shortBio:
      "Vlada Brčko distrikta upravlja neutralnim okrugom pod nadzorom međunarodnog arbitražnog režima.",
  },
  {
    type: "org",
    slug: "centralna-banka-bih",
    nameBs: "Centralna banka Bosne i Hercegovine",
    shortBio:
      "CBBiH održava konvertibilnu marku, bankarski nadzor i monetarnu stabilnost u cijeloj državi.",
  },
  {
    type: "org",
    slug: "stranka-demokratske-akcije",
    nameBs: "SDA — Stranka demokratske akcije",
    shortBio:
      "SDA bosanskošnjaka je historijska stranka koja vuče korijene iz neovisnosti i političkog predstavništva u FBiH.",
  },
  {
    type: "org",
    slug: "sdp-bih",
    nameBs: "SDP Bosne i Hercegovine",
    shortBio:
      "SDP je socijaldemokratska stranka u federalnom bloku i partner u koalicijama na državnom nivou.",
  },
  {
    type: "org",
    slug: "hdz-bih",
    nameBs: "HDZ BiH — Hrvatska demokratska zajednica Bosne i Hercegovine",
    shortBio:
      "HDZ BiH predstavlja hrvatski narod u izbornim jedinicama i vladi FBiH.",
  },
  {
    type: "org",
    slug: "snsd",
    nameBs: "SNSD — Savez nezavisnih socijaldemokrata",
    shortBio:
      "SNSD velika je stranka u RS s dominantnom ulogom u izvršnoj vlasti Banje Luke.",
  },
  {
    type: "org",
    slug: "pdp-rs",
    nameBs: "PDP — Partija demokratskog napretka",
    shortBio:
      "PDP je opoziciono-desničarska stranka u RS koja se poziva na institucije i pravnu državu.",
  },
  {
    type: "org",
    slug: "ictj-predhodnik-haski",
    nameBs: "ICTY — Haški tribunal (historijska ustanova)",
    shortBio:
      "ICTY bio je UN tribunal za ratne zločine na području bivše Jugoslavije i presude za genocid u Srebrenici.",
  },
  {
    type: "org",
    slug: "irmct",
    nameBs: "IRMCT — Mehanizam za krivične sudove",
    shortBio:
      "IRMCT nadovezuje se na Haški tribunal i izvršava preostale presude za ratne zločine iz ICTY mandate.",
  },
  {
    type: "event",
    slug: "genocid-srebrenica-1995",
    nameBs: "Genocid u Srebrenici (juli 1995)",
    shortBio:
      "Ubistvo više hiljada muških stanovnika Srebrenice predstavlja pravno utvrđen genocid u međunarodnom pravu.",
  },
  {
    type: "event",
    slug: "opsada-sarajeva",
    nameBs: "Opsada Sarajeva (1992–1996)",
    shortBio:
      "Opsada je trajala više od tisuću dana sa snajperima i granatiranjem civila u glavnom gradu BiH.",
  },
  {
    type: "event",
    slug: "dejtonski-sporazum-1995",
    nameBs: "Dejtonski sporazum (14. decembar 1995)",
    shortBio:
      "Dejton je okončao oružani sukob i uspostavio dva entiteta i zajedničke državne institucije BiH.",
  },
  {
    type: "event",
    slug: "bonn-powers-1997",
    nameBs: "Bonn ovlasti (1997)",
    shortBio:
      "Bonn ovlasti omogućile su visokom predstavniku donošenje odluka koje imaju snagu zakona u BiH.",
  },
  {
    type: "event",
    slug: "sejdic-finci-2009",
    nameBs: "Sejdić–Finci predmet (2009)",
    shortBio:
      "Presuda ESDAP-a postavila je pitanje diskriminacije u izboru članova Predsjedništva BiH.",
  },
  {
    type: "event",
    slug: "izbori-2022-bih",
    nameBs: "Opći izbori u BiH 2022.",
    shortBio:
      "Izbori 2022. oblikovali su parlamentarnu aritmetiku na državnom nivou i u entitetima.",
  },
  {
    type: "event",
    slug: "izbori-2024-lokalni-bih",
    nameBs: "Lokalni izbori u BiH 2024.",
    shortBio:
      "Lokalni izbori 2024. odnose se na gradonačelnike i općinska vijeća širom entiteta.",
  },
  {
    type: "event",
    slug: "izbori-2026-najavljeni",
    nameBs: "Opći izbori u BiH 2026. (najavljeni)",
    shortBio:
      "Naredni redovni izborni ciklus planiran je prema izbornom zakonodavstvu i političkim dogovorima.",
  },
  {
    type: "event",
    slug: "sankcije-schmidt-rs-2024",
    nameBs: "Sankcije SAD/UK povodom odnosa sa visokim predstavnikom (2024)",
    shortBio:
      "Sankcije su se odnosile na političko rukovodstvo RS u kontekstu odbijanja implementacije odluka OHR-a.",
  },
  {
    type: "event",
    slug: "schmidt-izborni-zakon-2022",
    nameBs: "Nametanje izmjena izbornog zakona od strane OHR (2022)",
    shortBio:
      "Visoki predstavnik je donio odluke oko izbornog zakona kad politički akteri nisu postigli konsenzus.",
  },
  {
    type: "event",
    slug: "zakon-genocidno-poricanje-usvajanje-2021",
    nameBs: "Usvajanje Zakona o zabrani negiranja genocida (2021)",
    shortBio:
      "Parlament FBiH i državni nivo razmatrali su zakon oko definicije negiranja zločina u javnom diskursu.",
  },
  {
    type: "event",
    slug: "presuda-karadzic-ictj-2016",
    nameBs: "ICTY presuda Radovanu Karadžiću (2016)",
    shortBio:
      "Presuda je utvrdila odgovornost za genocid, progone i opsadu civila.",
  },
  {
    type: "event",
    slug: "presuda-mladic-ictj-2017",
    nameBs: "ICTY presuda Ratku Mladiću (2017)",
    shortBio:
      "Presuda je obuhvatila komandnu odgovornost za genocid u Srebrenici i druge zločine.",
  },
  {
    type: "event",
    slug: "operacija-oluja-1995",
    nameBs: "Operacija „Oluja” (kolovoz 1995)",
    shortBio:
      "Vojna operacija hrvatskih snaga koja je okončala srpsku državnost u zapadnoj BiH uz velike izbjegličke valove.",
  },
  {
    type: "event",
    slug: "operacija-namjerna-sila-1995",
    nameBs: "NATO „Namjerna sila” (1995)",
    shortBio:
      "Zračni udari NATO-a usmjereni su na položaje Vojske RS tokom militarizacije BiH konflikta.",
  },
  {
    type: "event",
    slug: "vasingtonski-sporazum-1994",
    nameBs: "Vašingtonski sporazum (1994)",
    shortBio:
      "Dogovor je uveo entitetsku podjelu Federacije BiH prije Dejtona i smanjio linije fronta.",
  },
  {
    type: "event",
    slug: "aprilski-paket-2006",
    nameBs: "Aprilski paket ustavnih reformi (2006)",
    shortBio:
      "Reforme su pokušale približiti institucije EU standardima kroz parlamentarni proces.",
  },
  {
    type: "event",
    slug: "butmirski-paket-2009",
    nameBs: "Butmirski paket (2009)",
    shortBio:
      "Međunarodni pregovori u Sarajevu pokušali su ubrzati ustavne promjene za EU članstvo.",
  },
  {
    type: "event",
    slug: "eu-pristupni-pregovori-2024",
    nameBs: "EU otvara pristupne pregovore s BiH (2024)",
    shortBio:
      "Odluka Evropske komisije predstavlja politički korak u integracijskom putu države.",
  },
  {
    type: "event",
    slug: "referendum-nezavisnost-bih-1992",
    nameBs: "Referendum o neovisnosti BiH (1992)",
    shortBio:
      "Većina glasača podržala je nezavisnost, što je popratilo međunarodno priznanje i ratno razdoblje.",
  },
  {
    type: "place",
    slug: "bosna-i-hercegovina",
    nameBs: "Bosna i Hercegovina",
    shortBio:
      "BiH je decentralizirana država dva entiteta i Brčko distrikta s međunarodnim nadzorom Dejtona.",
  },
  {
    type: "place",
    slug: "federacija-bih",
    nameBs: "Federacija Bosne i Hercegovine",
    shortBio:
      "FBiH obuhvata deset kantona i federalnu vladu u Sarajevu i Mostaru.",
  },
  {
    type: "place",
    slug: "republika-srpska",
    nameBs: "Republika Srpska",
    shortBio:
      "RS je entitet sa sjedištem vlade u Banjoj Luci i parlamentom u istom gradu.",
  },
  {
    type: "place",
    slug: "brcko-distrikt",
    nameBs: "Brčko distrikt BiH",
    shortBio:
      "Brčko je neutralan distrikt pod posebnim arbitražnim režimom između entiteta.",
  },
  {
    type: "place",
    slug: "kanton-una-sana",
    nameBs: "Una-sanski kanton",
    shortBio:
      "USK obuhvata sjeverozapad FBiH uz granicu s Hrvatskom i važne granične prijelaze.",
  },
  {
    type: "place",
    slug: "kanton-posavina",
    nameBs: "Posavski kanton",
    shortBio:
      "Posavski kanton smješten je duž Save uz etnički mješovite općine.",
  },
  {
    type: "place",
    slug: "kanton-tuzla",
    nameBs: "Tuzlanski kanton",
    shortBio:
      "Industrijski centar severoistoka FBiH s rudarskom i hemijskom tradicijom.",
  },
  {
    type: "place",
    slug: "kanton-zenica-doboj",
    nameBs: "Zeničko-dobojski kanton",
    shortBio:
      "Kanton u središtu metalurske industrije i logističkih koridora.",
  },
  {
    type: "place",
    slug: "kanton-bpk-gorazde",
    nameBs: "Bosansko-podrinjski kanton Goražde",
    shortBio:
      "Jedan od pet kantona s većinskim bošnjačkim stanovništvom i teškim ratnim iskustvom.",
  },
  {
    type: "place",
    slug: "kanton-srednja-bosna",
    nameBs: "Srednjobosanski kanton",
    shortBio:
      "Obuhvata Travnik, Zenicu u političkom smislu i ruralne općine u središtu FBiH.",
  },
  {
    type: "place",
    slug: "kanton-sarajevo",
    nameBs: "Kanton Sarajevo",
    shortBio:
      "Glavni gradski kanton s driftom administrativnih funkcija i univerziteta.",
  },
  {
    type: "place",
    slug: "kanton-hnk",
    nameBs: "Hercegovačko-neretvanski kanton",
    shortBio:
      "HNK obuhvata Mostar i dolinu Neretve s historijskim mostovima i turizmom.",
  },
  {
    type: "place",
    slug: "kanton-zapadna-hercegovina",
    nameBs: "Zapadnohercegovački kanton",
    shortBio:
      "Kanton oko Širokog Brijega i Ljubuškog fokusiran na poljoprivredu i granicu s Hrvatskom.",
  },
  {
    type: "place",
    slug: "kanton-10",
    nameBs: "Kanton 10 (Livno)",
    shortBio:
      "Kanton 10 u zapadnoj Hercegovini uključuje Livno i Glamoč s planinskim područjima.",
  },
  {
    type: "place",
    slug: "sarajevo",
    nameBs: "Sarajevo",
    shortBio:
      "Glavni grad BiH, kulturni i politički centar s univerzitetima i međunarodnim institucijama.",
  },
  {
    type: "place",
    slug: "mostar",
    nameBs: "Mostar",
    shortBio:
      "Mostar je simbolički grad Neretvanskog kantona i historijski poznat po podijeljenim institucijama nakon rata.",
  },
  {
    type: "place",
    slug: "tuzla",
    nameBs: "Tuzla",
    shortBio:
      "Tuzla je industrijski grad soli i solane s jakom radničkom tradicijom.",
  },
  {
    type: "place",
    slug: "banja-luka",
    nameBs: "Banja Luka",
    shortBio:
      "Administrativni centar RS i drugi po veličini grad u državi.",
  },
  {
    type: "place",
    slug: "zenica",
    nameBs: "Zenica",
    shortBio:
      "Metalurski grad u sredini FBiH oko željezare i privrednih zona.",
  },
  {
    type: "place",
    slug: "bihac",
    nameBs: "Bihać",
    shortBio:
      "Grad na Uni sa jakom turističkom i graničnom ulogom prema Hrvatskoj.",
  },
  {
    type: "place",
    slug: "bijeljina",
    nameBs: "Bijeljina",
    shortBio:
      "Grad u sjeveroistoku RS uz granicu sa Srbijom i poljoprivrednu bazu.",
  },
  {
    type: "place",
    slug: "prijedor",
    nameBs: "Prijedor",
    shortBio:
      "Industrijski grad u RS pod historijskim opterećenjem ratnih zločina i logora.",
  },
  {
    type: "place",
    slug: "doboj",
    nameBs: "Doboj",
    shortBio:
      "Doboj je saobraćajni čvor na rijeci Bosni između entiteta.",
  },
  {
    type: "place",
    slug: "trebinje",
    nameBs: "Trebinje",
    shortBio:
      "Grad u istočnoj Hercegovini blizu Crne Gore s vinogradima i turizmom.",
  },
  {
    type: "place",
    slug: "srebrenica",
    nameBs: "Srebrenica",
    shortBio:
      "Općina u istočnoj BiH simbol genocida iz jula 1995. i memorijalnog turizma.",
  },
  {
    type: "place",
    slug: "gorazde",
    nameBs: "Goražde",
    shortBio:
      "Enklava pod opsadom tokom rata; danas grad u BPK Goražde kantonu.",
  },
  {
    type: "place",
    slug: "zepa",
    nameBs: "Žepa",
    shortBio:
      "Žepa je bila zaštićena enklava u istočnoj BiH sa teškim ratnim gubicima civila.",
  },
  {
    type: "place",
    slug: "foca",
    nameBs: "Foča (Foča-Ustikolina / historijski kontekst)",
    shortBio:
      "Područje Foče bilo je u fokusu ratnih zločina i presuda međunarodnih sudova.",
  },
  {
    type: "place",
    slug: "visegrad",
    nameBs: "Višegrad",
    shortBio:
      "Grad na Drini poznat po mostu Mehmed-paše i traumama rata devedesetih.",
  },
  {
    type: "place",
    slug: "neum",
    nameBs: "Neum",
    shortBio:
      "Neum je jedini izlaz BiH na Jadran u obliku kratkog obalnog koridora.",
  },
  {
    type: "law",
    slug: "ustav-bih-aneks-4",
    nameBs: "Ustav Bosne i Hercegovine (Aneks 4 Dejtonskog sporazuma)",
    shortBio:
      "Ustav iz Dejtona definira entitete, institucije i ljudska prava kao temelj države.",
  },
  {
    type: "law",
    slug: "izborni-zakon-bih",
    nameBs: "Izborni zakon Bosne i Hercegovine",
    shortBio:
      "Izborni zakon podešava izborna jedinice, kvote i barijere na Predsjedništvo i parlamente.",
  },
  {
    type: "law",
    slug: "krivicni-zakon-bih",
    nameBs: "Krivični zakon Bosne i Hercegovine",
    shortBio:
      "Državni krivični zakon za ratne zločine, korupciju i prijelaze jurisdikcije.",
  },
  {
    type: "law",
    slug: "zakon-zabrana-genocidnog-poricanja",
    nameBs: "Zakon o zabrani negiranja genocida",
    shortBio:
      "Zakon reguliše javno negiranje utvrđenih zločina i historijski osjetljive izjave.",
  },
  {
    type: "law",
    slug: "zakon-sukob-interesa-bih",
    nameBs: "Zakon o sukobu interesa",
    shortBio:
      "Propis transparentnosti imovine i ograničenja za javne funkcionere u BiH.",
  },
];
