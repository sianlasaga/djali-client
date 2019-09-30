import competencies, { CompetencyDictionaryInterface, CompetencyInterface } from '../competencies'

export interface State {
  competencies: CompetencySelectorInterface[]
}

export interface CompetencySelectorInterface extends CompetencyInterface {
  title: string
  checked: boolean
}

export interface ItemReport {
  item: string
  assessment: number
}

export interface SingleAssessmentSummary {
  category: string
  items: ItemReport[]
}

export interface DescriptionIndexInterface {
  [key: string]: {
    [key: string]: string[]
  }
}

export interface FullAssessmentReportItem {
  item: string
  description: string
  assessment: number
}

export interface FullAssessmentReport {
  category: string
  items: FullAssessmentReportItem[]
}

export interface AssessmentSummary {
  [key: string]: SingleAssessmentSummary[]
}

class CompetencySelectorModel implements State {
  public competencies: CompetencySelectorInterface[] = []
  public competenciesIndex: CompetencyDictionaryInterface = competencies
  public descriptionIndex: DescriptionIndexInterface = {}

  constructor() {
    this.competencies = Object.values(competencies).map((competency, i) => {
      competency.matrix.map(m => {
        m.subcategories.map(s => {
          s.questions.map(q => {
            if (!this.descriptionIndex[competency.id]) {
              this.descriptionIndex[competency.id] = {}
            }
            this.descriptionIndex[competency.id][s.item] = s.questions
            s.assessment = -1
            return q
          })
          return s
        })
        return m
      })
      return { ...competency, checked: false, index: i }
    })
  }

  public checkCompetency(i) {
    const cmp = this.competencies
    const rem = cmp.splice(i, 1)
    rem[0].checked = true
    const newCmp = [...rem, ...cmp]
    console.log(rem)
    this.competencies = newCmp
    return this
  }

  public uncheckCompetency(i) {
    const cmp = this.competencies
    const rem = cmp.splice(i, 1)
    rem[0].checked = false
    const newCmp = [...cmp, ...rem]
    console.log(rem)
    this.competencies = newCmp
    return this
  }

  public generateAssessmentSummary(id) {
    const assessmentSummary = [] as SingleAssessmentSummary[]
    this.competenciesIndex[id].matrix.forEach(category => {
      const categoryReport = {
        category: category.category,
        items: [] as ItemReport[],
      } as SingleAssessmentSummary
      category.subcategories.forEach(subCategory => {
        const itemReport = {
          item: subCategory.item,
          assessment: subCategory.assessment,
        }
        categoryReport.items.push(itemReport)
      })
      assessmentSummary.push(categoryReport)
    })
    return assessmentSummary
  }

  public generateFullAssessment(id: string, data: SingleAssessmentSummary[]) {
    const report = {
      [id]: [] as FullAssessmentReport[],
    }
    data.forEach(assessment => {
      const assessmentReportCategory = {
        category: assessment.category,
        items: [],
      } as FullAssessmentReport
      assessment.items.forEach(item => {
        const itemReport = {} as FullAssessmentReportItem
        itemReport.item = item.item
        itemReport.description = this.descriptionIndex[id][item.item][item.assessment]
        itemReport.assessment = item.assessment
        assessmentReportCategory.items.push(itemReport)
      })
      report[id].push(assessmentReportCategory)
    })
    return report
  }
}

const competencySelectorInstance = new CompetencySelectorModel()
export { competencySelectorInstance, CompetencySelectorModel }
