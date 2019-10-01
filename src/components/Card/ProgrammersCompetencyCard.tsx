import React from 'react'
import AccordianTable from '../../components/Accordion/AccordionTable'
import {
  competencySelectorInstance,
  CompetencySelectorModel,
} from '../../models/CompetencySelector'
import decodeHtml from '../../utils/Unescape'
import './ProgrammersCompetencyCard.css'

interface ProgrammersCompetencyCard {
  data: any
}

const ProgrammersCompetencyCard = (props: ProgrammersCompetencyCard) => {
  const { data } = props
  const keys = Object.keys(data.customProps.competencies)

  return (
    <div className="uk-margin-bottom">
      <div className="uk-card uk-card-default uk-card-body">
        <h3 id="title-background" className="uk-card-title">
          Competency
        </h3>
        <br />
        {keys.map((cmp, i) => {
          const competency = data.customProps.competencies[cmp]
          const assessment = competencySelectorInstance.generateFullAssessment(cmp, competency)
          return Object.keys(assessment).map(a => {
            return (
              <>
                <h4>{a}</h4>
                <AccordianTable data={assessment[a]} />
              </>
            )
          })
        })}
      </div>
    </div>
  )
}

export default ProgrammersCompetencyCard
