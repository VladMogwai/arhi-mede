export const ro = {
  languageName: "Română",
  nav: {
    studio: "Studioul",
    projects: "Proiecte",
    contact: "Contact",
    home: "Acasă",
  },
  common: {
    examplePhoto: "Foto exemplu",
    nextPhoto: "Fotografia următoare",
    viewProject: "Vezi proiectul",
    allProjects: "Toate proiectele",
    backToProjects: "Proiecte",
    nextProject: "Proiectul următor",
    romanianOnly: "Acest text este disponibil deocamdată doar în limba română.",
  },
  categories: {
    "constructii-noi": "Construcții noi",
    "consolidari-si-reabilitari-de-cladiri-existente": "Consolidări și reabilitări",
    "amenajare-interioara": "Amenajări interioare",
    studii: "Studii",
  } as Record<string, string>,
  home: {
    metaTitle: "Arhi Mede Studio — birou de arhitectură în București",
    metaDescription:
      "Birou de arhitectură din București: case pasive certificate, consolidări și reabilitări de clădiri existente, amenajări interioare și studii urbane.",
    heroStatement:
      "Birou de arhitectură din București. Proiectăm case pasive, reabilităm clădiri vechi și dăm viață unor spații sănătoase, în armonie cu mediul.",
    studio: {
      title: "Studioul",
      lead: "Este un birou de arhitectură unde proiectele sunt mai mult decât un desen și un dosar pe hârtie. Un birou care dă viață unor spații de calitate, în care clienții să locuiască confortabil, sănătoși și în armonie cu mediul. Arhitectura ne modelează felul de a fi, ne influențează stările zilnice, ne definește relațiile sociale.",
      caption: "Primele case certificate pasiv din zona Bucureștiului, din 2015.",
    },
    services: {
      title: "Ce facem",
      items: [
        { title: "Construcții noi", text: "Proiectare și urmărirea execuției, de la tema de proiectare la casa locuită." },
        { title: "Consolidări și reabilitări", text: "Clădiri existente și de patrimoniu, cu respect pentru materialul originar." },
        { title: "Amenajări interioare", text: "Clasice sau moderne, cu fiecare detaliu urmărit până la final." },
        { title: "Studii", text: "Idei și propuneri pentru oraș, spațiu public și peisaj." },
      ],
    },
    featured: { label: "Proiect recomandat" },
    approach: {
      title: "Abordarea",
      text: "Proiectele noastre răspund temelor beneficiarilor, dar respectă și vecinii, comunitatea, mediul, peisajul. Calitatea investiției presupune o arhitectură responsabilă, care realizează un echilibru între investiția economică, sustenabilitate și contextul social.",
      caption: "O investiție inteligentă începe cu o temă bine definită.",
      points: [
        { title: "Standard pasiv", text: "Case certificate de Passive House Institute din Darmstadt, pe structură din lemn CLT." },
        { title: "Patrimoniu", text: "Reabilitări care păstrează materialul originar și meșteșugul local." },
        { title: "Context", text: "Clădiri care se integrează discret în sat, în oraș și în peisaj." },
      ],
    },
    team: {
      title: "Echipa",
      caption: "Un birou mic, în care fiecare proiect este urmărit de arhitecți, de la primul desen la șantier.",
    },
    cta: {
      title: "Aveți un proiect?",
      text: "Spuneți-ne despre teren, clădire sau idee. Vă răspundem cu pașii următori și o ofertă.",
      button: "Scrieți-ne",
    },
  },
  projects: {
    metaTitle: "Proiecte",
    metaDescription: "Case pasive, reabilitări de clădiri vechi, amenajări interioare și studii urbane realizate de Arhi Mede Studio.",
    title: "Proiecte",
    intro: "Case pasive, clădiri vechi readuse la viață, interioare și idei pentru oraș.",
    filterAll: "Toate",
  },
  footer: {
    tagline: "Birou de arhitectură",
    address: "Adresa",
    contact: "Contact",
    hours: "Program",
    weekdays: "Luni – Vineri",
    saturday: "Sâmbătă",
    rights: "Toate drepturile rezervate.",
  },
};

export type Dictionary = typeof ro;
