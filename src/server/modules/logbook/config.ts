export const ENRICHMENT_ENDPOINT = {
  AUTH: 'https://enrichment-socs.apps.binus.ac.id/lp-api/api/auth/login',
  LOGBOOK_DATA: 'https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/log-book',
  CHANGE_SEMESTER: (semester: number) =>
    `https://enrichment-socs.apps.binus.ac.id/lp-api/api/semester/${semester}`,
  UPDATE_LOGBOOK: (uid: string) =>
    `https://enrichment-socs.apps.binus.ac.id/lp-api/api/student/log-book/${uid}/edit`,
};
