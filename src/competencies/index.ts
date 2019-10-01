import ProgrammerCompetency from './ProgrammerCompetency.json'

export interface CompetencyQuestionInterface {
  category: string
  subcategories: CompetencySubcategoryInterface[]
}

export interface CompetencySubcategoryInterface {
  item: string
  questions: string[]
  assessment: number
}

export interface CompetencyInterface {
  id: string
  title: string
  relatedCompetencies: string[]
  matrix: CompetencyQuestionInterface[]
}

export interface CompetencyDictionaryInterface {
  [key: string]: CompetencyInterface
}

const competencies = {
  programmerCompetency: ProgrammerCompetency as CompetencyInterface,
} as CompetencyDictionaryInterface

export default competencies
