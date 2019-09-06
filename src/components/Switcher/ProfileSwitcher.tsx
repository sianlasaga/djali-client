import React from 'react'

import { ListingCardGroup } from '../CardGroup'
import { ProfileBasicInfoSegment, RatingsAndReviewsSegment } from '../Segment'

import Listing from '../../models/Listing'
import Profile from '../../models/Profile'

import ClientRatings from '../../constants/ClientRatings.json'
import OrderRatings from '../../constants/OrderRatings.json'

import Rating, { RatingSummary } from '../../interfaces/Rating'

interface Props {
  profile: Profile
  listings: Listing[]
  ratingSummary: RatingSummary
  ratings: Rating[]
}

const ProfileSwitcher = ({ profile, listings, ratingSummary, ratings }: Props) => {
  const { average, count, djali } = ratingSummary
  return (
    <ul id="container-profile" className="uk-switcher">
      <li>
        <ProfileBasicInfoSegment profile={profile} />
      </li>
      <li>
        <ListingCardGroup data={listings} />
      </li>
      <li id="profile-ratings">
        <div className="uk-flex">
          <div className="uk-flex-1 uk-padding divider border-remove-vertical border-remove-left">
            <h4 className="uk-text-bold uk-text-center">Buyer Ratings</h4>
            <div className="uk-padding-small uk-padding-remove-horizontal">
              <RatingsAndReviewsSegment ratingInputs={ClientRatings} djaliRatings={djali} />
            </div>
          </div>
          <div className="uk-flex-1 uk-padding">
            <h4 className="uk-text-bold uk-text-center">Seller Ratings</h4>
            <div className="uk-padding-small uk-padding-remove-horizontal">
              <RatingsAndReviewsSegment
                ratingInputs={OrderRatings}
                ratings={ratings}
                totalAverageRating={average}
                totalReviewCount={count}
              />
            </div>
          </div>
        </div>
      </li>
      <li>Coming soon!</li>
      <li>Coming soon!</li>
      <li>Redirecting...</li>
      <li>Redirecting...</li>
    </ul>
  )
}

export default ProfileSwitcher
