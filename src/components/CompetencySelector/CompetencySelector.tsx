import React from 'react'
import FlipMove from 'react-flip-move'

import './CompetencySelector.css'

interface CompetencySelectorProps {
  competencies: any
  checker: (id: number) => void
}

const CompetencySelector = ({ competencies, checker }: CompetencySelectorProps) => {
  return (
    <div id="competency-selector">
      <FlipMove
        className="competency-selector-ul"
        typeName="ul"
        leaveAnimation={'none'}
        enterAnimation={'elevator'}
      >
        {competencies.map((cmp, i) => {
          return (
            <li key={cmp.id}>
              {cmp.compName}
              <div className="competency-selector-actions">
                <span data-uk-icon="icon: cog; ratio: 1.2" className="blue-icon" />
                <input
                  key={`${cmp.id}-${cmp.checked}`}
                  className="uk-checkbox fix-margin"
                  type="checkbox"
                  checked={cmp.checked}
                  onClick={() => checker(i)}
                />
              </div>
            </li>
          )
        })}
      </FlipMove>
    </div>
  )
}

export default CompetencySelector
