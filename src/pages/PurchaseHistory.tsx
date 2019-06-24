import React from 'react'

import PurchaseCard from '../components/Card/PurchaseCard'
import './PurchaseHistory.css'

const PurchaseHistory = () => (
  <div
    id="purchase-history"
    className="uk-card uk-card-default uk-card-body uk-width-5-6@m uk-flex uk-margin-auto"
  >
    <div id="side-menu-filters" className="uk-card-default">
      <h4 id="side-menu-filters-title" className="color-primary">
        FILTERS
      </h4>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Unfunded
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Refunded
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Pending
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Disputes
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Ready To Process
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Completed
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Fulfilled
        </label>
      </div>
      <div className="uk-margin uk-grid-small uk-child-width-auto uk-grid">
        <label>
          <input className="uk-checkbox" type="checkbox" /> Errors
        </label>
      </div>
      <a href="#">Reset Filters</a>
    </div>
    <div id="side-menu-purchases">
      <div id="side-menu-purchases-header">
        <div id="left">
          <span className="uk-margin-medium-left" uk-icon="arrow-left" />
        </div>
        <div id="center">
          <h4 id="side-menu-purchases-title" className="color-primary">
            PURCHASES
          </h4>
        </div>
        <div id="right">
          <span className="uk-margin-medium-right" uk-icon="close" />
        </div>
      </div>
      <div className="uk-margin">
        <form className="uk-search uk-search-default uk-width-3-4">
          <span
            className="uk-search-icon-flip color-primary"
            data-uk-search-icon
            data-uk-icon="icon: search"
          />
          <input
            id="purchase-search-text"
            className="uk-search-input"
            type="search"
            placeholder="Search by title, order #, or vendor"
          />
        </form>
        <div id="right">
          <a href="#"> Sort </a> |
          <span className="uk-margin-small-right" uk-icon="thumbnails" />
        </div>
      </div>
      <p id="number-purchases-text"> 3 purchases found </p>
      <PurchaseCard />
      <PurchaseCard />
      <PurchaseCard />
    </div>
  </div>
)

export default PurchaseHistory
