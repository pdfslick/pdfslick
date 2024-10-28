export const pdfDocs: Record<
  string,
  { url: string; name: string; title?: string; size?: number }
> = {
  "p4450.pdf": {
    url: "/pdfs/p4450.pdf",
    name: "p4450.pdf",
    title:
      "IRS Congressional Budget Justification & Annual Performance Report and Plan Fiscal Year 2024",
    size: 2741941,
  },
  Petition_for_a_Nonimmigrant_Worker: {
    url: "/pdfs/i-129.pdf",
    name: "i-129.pdf",
    title: "Petition for a Nonimmigrant Worker (with Form)",
    size: 2166806,
  },
  Digital_Public_Administration_Factsheets_Sweden_vFINAL: {
    url: "/pdfs/Digital_Public_Administration_Factsheets_Sweden_vFINAL.pdf",
    name: "Digital_Public_Administration_Factsheets_Sweden_vFINAL.pdf",
    title: "Digital Government Factsheet Sweden",
    size: 3299330,
  },
  Stanley_Kubrick: {
    url: "/pdfs/Stanley_Kubrick.pdf",
    name: "Stanley_Kubrick.pdf",
    title: "Wikipedia's Stanley Kubrick Article as PDF",
    size: 2764644,
  },
  "A_brief_guide_to_the_EU.pdf": {
    url: "/pdfs/A_brief_guide_to_the_EU.pdf",
    name: "A_brief_guide_to_the_EU.pdf",
    title: "A brief guide to the EU",
    size: 2706610,
  },
  "CH_infographics.pdf": {
    url: "/pdfs/CH_infographics.pdf",
    name: "CH_infographics.pdf",
    title: "Switzerland in 23 Infographics",
    size: 2254451,
  },
  "us_constitution.pdf": {
    url: "/pdfs/us_constitution.pdf",
    name: "us_constitution.pdf",
    title: "US Consitution",
    size: 389617,
  },
  "2001__A_Space_Odyssey_(film)": {
    url: "/pdfs/2001__A_Space_Odyssey_(film).pdf",
    name: "2001__A_Space_Odyssey_(film).pdf",
    title: "Wikipedia's 2001: A Space Odyssey as PDF",
    size: 2513083,
  },

  "swedish-government-offices-yearbook-2021": {
    url: "/pdfs/swedish-government-offices-yearbook-2021.pdf",
    name: "swedish-government-offices-yearbook-2021.pdf",
    title: "Swedish Government Offices Yearbook 2021",
    size: 788453,
  },
};

export const pdfDocsList = Object.keys(pdfDocs).map((key) => pdfDocs[key]);
