import React from 'react'

import './DropdownSearchCompetency.css'

// interface DropdownSearchCompetencyProps {

// }
// { }: DropdownSearchCompetencyProps
const DropdownSearchCompetency = () => {
  return (
    <div id="main-cont-comp">
      <div id="flexible-cont-comp" className="uk-box-shadow-large">
        <div className="padding-fix">
          <div id="input-cont-comp" className="bordered">
            <input id="search-bar-comp" type="text" />
            <span data-uk-icon="icon: search; ratio: 1.2" className="blue-icon" />
          </div>
        </div>
        {/* <ul id="search-comp-ul">
          <li>
              Project Management: Software
              <span data-uk-icon="icon: plus" className="blue-icon" />
          </li>
          <li>
            Project Management: Cinema
            <span data-uk-icon="icon: plus" className="blue-icon" />
          </li>
          <li>
            Project Management: Studio
            <span data-uk-icon="icon: plus" className="blue-icon" />
          </li>
        </ul> */}
      </div>
    </div>
  )
}

export default DropdownSearchCompetency
