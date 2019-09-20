import React from 'react'

import './CompetencySelector.css'

interface CompetencySelectorProps {
  competencies: any
  checker: (index: number) => void
}

const CompetencySelector = ({ competencies, checker }: CompetencySelectorProps) => {
  return (
    <div id="competency-selector">
      <ul id="competency-selector-ul">
        {competencies.map((cmp, i) => {
          return (
            <li key={`competencyList${i}`}>
              {cmp}
              <div className="competency-selector-actions">
                <span data-uk-icon="icon: cog; ratio: 1.2" className="blue-icon" />
                <input
                  className="uk-checkbox fix-margin"
                  type="checkbox"
                  checked={false}
                  onClick={() => checker(i)}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CompetencySelector
