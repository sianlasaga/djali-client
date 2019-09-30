import competencies, {
  CompetencyDictionaryInterface,
  CompetencyInterface,
  CompetencySubcategoryInterface,
} from '../competencies'

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
      competency.matrix.map(matrix => {
        matrix.subcategories.map(subCategory => {
          subCategory.questions.map(question => {
            if (!this.descriptionIndex[competency.id]) {
              this.descriptionIndex[competency.id] = {}
            }
            this.descriptionIndex[competency.id][subCategory.item] = subCategory.questions
            subCategory.assessment = -1
            return question
          })
          return subCategory
        })
        return matrix
      })
      return { ...competency, checked: false, index: i }
    })
  }

  public load(rawCompetency: AssessmentSummary) {
    Object.keys(rawCompetency).forEach(selectedCompetency => {
      const i = this.competencies.findIndex(el => el.id === selectedCompetency)
      this.setCompetencyCheck(i, true)
      this.competencies[i].matrix.forEach(matrix => {
        matrix.subcategories = matrix.subcategories.map(subCategory => {
          rawCompetency[selectedCompetency].forEach(competency => {
            competency.items.forEach(item => {
              if (subCategory.item === item.item) {
                subCategory.assessment = item.assessment
              }
            })
          })
          return subCategory
        })
      })
    })
    return this
  }

  public setCompetencyCheck(index: number, isChecked: boolean) {
    let competencyClone = [...this.competencies]
    competencyClone = competencyClone.splice(index, 1)
    competencyClone[0].checked = isChecked
    this.competencies = competencyClone
    return this
  }

  public generateAssessmentSummary(id: string) {
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
