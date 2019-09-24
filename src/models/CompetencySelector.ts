export interface State {
  competencies: Competencies[]
}

export interface Competencies {
  id: string
  compName: string
  checked: boolean
}

class CompetencySelectorModel implements State {
  public competencies: Competencies[] = [
    {
      id: 'cmp1',
      compName: 'competency1',
      checked: false,
    },
    {
      id: 'cmp2',
      compName: 'competency2',
      checked: false,
    },
    {
      id: 'cmp3',
      compName: 'competency3',
      checked: false,
    },
    {
      id: 'cmp4',
      compName: 'competency4',
      checked: false,
    },
    {
      id: 'cmp5',
      compName: 'competency5',
      checked: false,
    },
    {
      id: 'cmp6',
      compName: 'competency6',
      checked: false,
    },
  ]

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
