import React, { useState } from 'react'
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

import { FormLabel } from '../Label'

import { Button } from '../Button'
import './TagsForm.css'

interface Props {
  tags: string[]
  onSubmit: (tags: string[]) => void
  submitLabel?: string
  formLabel?: string
}

const TagsForm = ({ tags, onSubmit, submitLabel, formLabel }: Props) => {
  const [rawTags, setRawTags] = useState(tags)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <form
      className="uk-form-stacked uk-flex uk-flex-column full-width"
      onSubmit={async evt => {
        evt.preventDefault()
        setIsLoading(true)
        await onSubmit(rawTags)
        setIsLoading(false)
      }}
    >
      <fieldset className="uk-fieldset">
        <div className="uk-margin">
          <FormLabel label={formLabel ? formLabel.toUpperCase() : 'TAGS'} required />
          <TagsInput
            inputProps={{ id: 'tags' }}
            value={rawTags}
            onChange={changedTags => {
              setRawTags(changedTags)
            }}
          />
          <label className="form-label-desciptor">Press "Enter" to add an entry</label>
        </div>
      </fieldset>
      <div className="submit-btn-div">
        <Button className="uk-button uk-button-primary" showSpinner={isLoading}>
          {submitLabel || 'CONTINUE'}
        </Button>
      </div>
    </form>
  )
}

export default TagsForm
