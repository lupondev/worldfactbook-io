import { ingestIctyDecision, type IctyDecisionSeed } from "@/lib/decisions/icty-crawler";

const seeds: IctyDecisionSeed[] = [
  { source: "ICTY", caseId: "IT-95-5/18-T", defendant: "Radovan Karadžić", date: "2016-03-24", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-95-5-18/ju/karadzic_judgement.pdf", title: "Prosecutor v. Radovan Karadžić Trial Judgment" },
  { source: "ICTY", caseId: "IT-09-92-T", defendant: "Ratko Mladić", date: "2017-11-22", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-09-92/ju/171122-judgement.pdf", title: "Prosecutor v. Ratko Mladić Trial Judgment" },
  { source: "ICTY", caseId: "IT-00-39-T", defendant: "Momčilo Krajišnik", date: "2006-09-27", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-00-39/ju/060927.pdf", title: "Prosecutor v. Momčilo Krajišnik Trial Judgment" },
  { source: "ICTY", caseId: "IT-99-36-T", defendant: "Radoslav Brđanin", date: "2004-09-01", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-99-36/ju/040901.pdf", title: "Prosecutor v. Radoslav Brđanin Trial Judgment" },
  { source: "ICTY", caseId: "IT-00-39&40/1-S", defendant: "Biljana Plavšić", date: "2003-02-27", type: "Sentence", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-00-39-40/ju/030227.pdf", title: "Prosecutor v. Biljana Plavšić Sentencing Judgment" },
  { source: "ICTY", caseId: "IT-94-1-T", defendant: "Duško Tadić", date: "1997-05-07", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-94-1/ju/970507.pdf", title: "Prosecutor v. Duško Tadić Trial Judgment" },
  { source: "ICTY", caseId: "IT-97-24-T", defendant: "Milorad Stakić", date: "2003-07-31", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-97-24/ju/030731.pdf", title: "Prosecutor v. Milorad Stakić Trial Judgment" },
  { source: "ICTY", caseId: "IT-98-33-T", defendant: "Radislav Krstić", date: "2001-08-02", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-98-33/ju/010802.pdf", title: "Prosecutor v. Radislav Krstić Trial Judgment" },
  { source: "ICTY", caseId: "IT-98-29-T", defendant: "Stanislav Galić", date: "2003-12-05", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-98-29/ju/031205.pdf", title: "Prosecutor v. Stanislav Galić Trial Judgment" },
  { source: "ICTY", caseId: "IT-04-75-T", defendant: "Goran Hadžić", date: "2015-03-24", type: "Decision", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-04-75/ju/150324.pdf", title: "Prosecutor v. Goran Hadžić Decision" },
  { source: "ICTY", caseId: "IT-03-67-T", defendant: "Vojislav Šešelj", date: "2016-03-31", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-03-67/ju/160331.pdf", title: "Prosecutor v. Vojislav Šešelj Trial Judgment" },
  { source: "ICTY", caseId: "IT-05-88/2-T", defendant: "Zdravko Tolimir", date: "2012-12-12", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-05-88-2/ju/121212.pdf", title: "Prosecutor v. Zdravko Tolimir Trial Judgment" },
  { source: "IRMCT", caseId: "MICT-13-55-A", defendant: "Radovan Karadžić", date: "2019-03-20", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/mict-13-55/a/190320-appeal-judgement.pdf", title: "Karadžić Appeal Judgment" },
  { source: "IRMCT", caseId: "MICT-13-56-A", defendant: "Ratko Mladić", date: "2021-06-08", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/mict-13-56/a/210608-appeal-judgement.pdf", title: "Mladić Appeal Judgment" },
  { source: "ICTY", caseId: "IT-97-25-T", defendant: "Naser Orić", date: "2006-06-30", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-03-68/ju/060630.pdf", title: "Prosecutor v. Naser Orić Trial Judgment" },
  { source: "ICTY", caseId: "IT-95-14/2-T", defendant: "Dragan Nikolić", date: "2003-12-18", type: "Sentence", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-94-2/ju/031218.pdf", title: "Prosecutor v. Dragan Nikolić Sentencing" },
  { source: "ICTY", caseId: "IT-98-30/1-T", defendant: "Miroslav Deronjić", date: "2004-03-30", type: "Sentence", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-02-61/ju/040330.pdf", title: "Prosecutor v. Miroslav Deronjić Sentencing" },
  { source: "ICTY", caseId: "IT-95-10-T", defendant: "Milan Simić", date: "2002-10-17", type: "Sentence", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-95-9-pt/ju/021017.pdf", title: "Prosecutor v. Milan Simić Sentencing" },
  { source: "ICTY", caseId: "IT-95-10/1-T", defendant: "Simo Drljača", date: "2003-09-19", type: "Decision", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-95-9/ju/030919.pdf", title: "Related Prijedor Decision" },
  { source: "ICTY", caseId: "IT-98-32-T", defendant: "Dario Kordić", date: "2001-02-26", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-95-14-2/ju/010226.pdf", title: "Prosecutor v. Kordić and Čerkez Trial Judgment" },
  { source: "ICTY", caseId: "IT-95-9-T", defendant: "Radoslav Brđanin", date: "2002-11-01", type: "Decision", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-99-36/dec/021101.pdf", title: "Brđanin Related Decision" },
  { source: "ICTY", caseId: "IT-97-25-A", defendant: "Naser Orić", date: "2008-07-03", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-03-68/a/080703.pdf", title: "Orić Appeal Judgment" },
  { source: "ICTY", caseId: "IT-04-74-T", defendant: "Jadranko Prlić", date: "2013-05-29", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-04-74/ju/130529.pdf", title: "Prlić et al. Trial Judgment" },
  { source: "ICTY", caseId: "IT-04-74-A", defendant: "Jadranko Prlić", date: "2017-11-29", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-04-74/a/171129.pdf", title: "Prlić et al. Appeal Judgment" },
  { source: "ICTY", caseId: "IT-05-87-T", defendant: "Vujadin Popović", date: "2010-06-10", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-05-88/ju/100610.pdf", title: "Popović et al. Trial Judgment" },
  { source: "ICTY", caseId: "IT-05-88-A", defendant: "Vujadin Popović", date: "2015-01-30", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-05-88/a/150130.pdf", title: "Popović et al. Appeal Judgment" },
  { source: "ICTY", caseId: "IT-95-13/1-T", defendant: "Milomir Stakić", date: "2003-07-31", type: "Judgment", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-97-24/ju/030731.pdf", title: "Stakić Trial Judgment" },
  { source: "ICTY", caseId: "IT-95-5-T", defendant: "Duško Tadić", date: "1999-07-15", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-94-1/a/990715.pdf", title: "Tadić Appeal Judgment" },
  { source: "ICTY", caseId: "IT-98-29-A", defendant: "Stanislav Galić", date: "2006-11-30", type: "Appeal", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-98-29/a/061130.pdf", title: "Galić Appeal Judgment" },
  { source: "ICTY", caseId: "IT-95-5/18-R77", defendant: "Radovan Karadžić", date: "2011-10-20", type: "Decision", pdfUrl: "https://www.irmct.org/sites/default/files/case-documents/it-95-5-18/dec/111020.pdf", title: "Karadžić Contempt Decision" },
];

async function main() {
  let inserted = 0;
  let skipped = 0;
  for (const seed of seeds) {
    try {
      const result = await ingestIctyDecision(seed);
      if (result.created) inserted++;
      else skipped++;
      process.stdout.write(`${result.created ? "CREATED" : "SKIPPED"} ${seed.source} ${seed.caseId}\n`);
    } catch (err) {
      skipped++;
      process.stderr.write(`FAILED ${seed.caseId} ${String(err)}\n`);
    }
  }
  process.stdout.write(`DONE created=${inserted} skipped=${skipped} total=${seeds.length}\n`);
}

main().catch((err) => {
  process.stderr.write(`${String(err)}\n`);
  process.exit(1);
});
