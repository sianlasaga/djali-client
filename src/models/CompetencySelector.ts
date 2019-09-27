import competencies, { CompetencyInterface } from '../competencies'

export interface State {
  competencies: CompetencySelectorInterface[]
}

export interface CompetencySelectorInterface extends CompetencyInterface {
  title: string
  checked: boolean
}

class CompetencySelectorModel implements State {
  public competencies: CompetencySelectorInterface[] = []

  constructor() {
    this.competencies = Object.values(competencies).map((competency, i) => {
      competency.matrix.map(m => {
        m.subcategories.map(s => {
          s.questions.map(q => {
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
}

const competencySelectorInstance = new CompetencySelectorModel()
export { competencySelectorInstance, CompetencySelectorModel }
