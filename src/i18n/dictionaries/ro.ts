export const ro = {
  languageName: "Română",
  nav: {
    home: "Acasă",
    arhi: "ARHI",
    mede: "MEDE",
    projects: "Proiecte",
    about: "Despre",
    contact: "Contact",
    menu: "Meniu",
    close: "Închide",
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
    metaTitle: "Arhi Mede — arhitectură, patrimoniu și materiale circulare",
    metaDescription:
      "Practică multidisciplinară din București: arhitectură, cercetare, patrimoniu, design interior, evaluarea și recuperarea materialelor, design circular și educație.",
    heroStatement: "Construim locuri mai bune. Prelungim viața a ceea ce există deja.",
    studio: {
      title: "Studioul",
      lead: "ARHI MEDE este o practică multidisciplinară care reunește arhitectura, cercetarea, patrimoniul, designul interior și serviciile de circularitate pentru a crea medii construite atent gândite, reziliente și responsabile față de resurse.",
      caption: "Primele case certificate pasiv din zona Bucureștiului, din 2015.",
    },
    need: {
      title: "Am nevoie de…",
      caption: "Alegeți ce vă trebuie și vă arătăm direcția potrivită.",
    },
    featured: { label: "Proiect recomandat" },
    approach: {
      title: "De ce noi",
      text: "Nu vedem arhitectura, patrimoniul, materialele și designul ca discipline separate, ci ca părți ale aceluiași sistem. Așa îi ajutăm pe clienți să folosească mai bine resursele existente, să reducă risipa și să creeze proiecte funcționale, responsabile și durabile.",
      caption: "Putem interveni în orice etapă a proiectului.",
      points: [
        { title: "Standard pasiv", text: "Case certificate de Passive House Institute din Darmstadt, pe structură din lemn CLT." },
        { title: "Patrimoniu", text: "Reabilitări care păstrează materialul originar și meșteșugul local." },
        { title: "A doua viață", text: "Lemn recuperat din demolări, refolosit în case noi și în restaurări." },
      ],
    },
    team: {
      title: "Echipa",
      caption: "Un birou mic, în care fiecare proiect este urmărit de arhitecți, de la primul desen la șantier.",
    },
    cta: {
      title: "Aveți un proiect?",
      text: "Spuneți-ne despre teren, clădire, materiale sau idee. Vă răspundem cu pașii următori și o ofertă.",
      button: "Scrieți-ne",
    },
  },
  divisions: {
    label: "Divizia",
    arhi: {
      description: "Creăm, restaurăm și îmbunătățim clădiri și spații.",
      metaDescription: "ARHI: arhitectură, cercetare, patrimoniu și design interior.",
    },
    mede: {
      description: "Prelungim viața materialelor, produselor și resurselor prin soluții circulare.",
      metaDescription: "MEDE: evaluarea materialelor, elemente recuperate, design circular și educație.",
    },
  },
  pillar: {
    services: "Ce includem",
    projects: "Proiecte",
    noProjects: "Proiectele pentru această direcție vor fi adăugate în curând.",
    next: "Direcția următoare",
    ctaTitle: "Vorbim despre proiectul dumneavoastră?",
    ctaButton: "Scrieți-ne",
  },
  about: {
    metaTitle: "Despre noi",
    metaDescription: "ARHI MEDE reunește arhitectura, cercetarea, patrimoniul, designul interior și serviciile de circularitate.",
    label: "Despre noi",
  },
  projects: {
    metaTitle: "Proiecte",
    metaDescription: "Case pasive, reabilitări de clădiri vechi, amenajări interioare și studii urbane realizate de Arhi Mede Studio.",
    title: "Proiecte",
    intro: "Case pasive, clădiri vechi readuse la viață, interioare și idei pentru oraș.",
    filterAll: "Toate",
  },
  footer: {
    tagline: "Arhitectură · Materiale",
    address: "Adresa",
    contact: "Contact",
    hours: "Program",
    weekdays: "Luni – Vineri",
    saturday: "Sâmbătă",
    rights: "Toate drepturile rezervate.",
  },
};

export type Dictionary = typeof ro;
