import peopleRaw from '../../markets/data-science-ml/people.json'

/** Source-reported public professional record. No production ML competence is implied. */
export interface DataScienceCandidate {
  id: string
  fullName: string
  title: string
  employer: string
  locationLabel: string
  talentPool: string
  profileUrl: string
  sourceDescription: string
  sourceCompiledOn: string
  evidenceStatus: 'SOURCE_REPORTED_UNVERIFIED'
}

export const dataScienceCandidates = peopleRaw as DataScienceCandidate[]
