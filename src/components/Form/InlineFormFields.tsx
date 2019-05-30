import React, { ReactNode } from 'react'

import { FormLabel } from '../Label'

import './InlineFormFields.css'

interface Field {
  component: ReactNode
  label: {
    name: string
    required?: boolean
  }
  descriptiveLabel?: string
}

interface Props {
  fields: Field[]
}

const InlineFormFields = (props: Props) => {
  const { fields } = props
  const numberOfFields = fields.length
  return (
    <div id="multi-fields">
      {fields.map((field: Field, index: number) => (
        <div
          key={field.label.name}
          id={index === numberOfFields - 1 ? 'last-field' : 'field'}
          className={`uk-width-1-${numberOfFields}@s`}
        >
          <FormLabel required={field.label.required} label={field.label.name} />
          {field.component}
          {field.descriptiveLabel ? (
            <label className="form-label-desciptor">{field.descriptiveLabel}</label>
          ) : null}
        </div>
      ))}
    </div>
  )
}

export default InlineFormFields
