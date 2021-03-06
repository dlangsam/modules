import _ from 'lodash'
import React from 'react'
import { getState, shouldShowCTA } from '@helpusersvote/logic'
import EARLY_VOTING_DATA from './data/early-voting.json'
import POLLING_PLACE_DATA from './data/polls.json'
import { getMapImages, toAddr } from './utils'

import GoogleReportForm from './stateless/google-report-form'
import LocationAddress from './stateless/location-address'
import PollingPlaceNotFound from './stateless/not-found'
import { ElectionDayNotice } from './stateless/election-day'
import { DirectionsDate, DirectionsHours } from './stateless/directions'

export function PollingPlaceDirections({
  address: backupAddress,
  voterInfo,
  queryParams,
  onChangeAddress
}) {
  const address = voterInfo.address || backupAddress
  const state = getState(address.state)
  const earlyVoting = EARLY_VOTING_DATA[state.abbr] || {}
  const pollingPlace = POLLING_PLACE_DATA[state.abbr] || {}
  const { earlyLocations, locations = [] } = voterInfo

  if (locations && locations.length === 0) {
    return (
      <PollingPlaceNotFound
        address={address}
        voterInfo={voterInfo}
        queryParams={queryParams}
        onChangeAddress={onChangeAddress}
      />
    )
  }

  const location = locations[0] || { hours: [] }
  const locationAddress = location.address || {}

  const userAddr = toAddr(address)
  const pollAddr = toAddr(location.address)

  const directionsURL = [
    'https://maps.google.com?saddr=',
    encodeURIComponent(userAddr),
    '&daddr=',
    encodeURIComponent(pollAddr)
  ].join('')

  const mapImages = getMapImages({
    userAddr,
    pollAddr
  })

  const isElectionDay = queryParams.election || shouldShowCTA()
  const votingDate = isElectionDay ? <b>today</b> : 'on Election Day'

  return (
    <div className="mt3 w-100">
      <div className="mt1">
        You can vote here {votingDate} from{' '}
        <span className="dib">
          <span className="b">
            {location.hours && location.hours.length > 0
              ? location.hours
              : pollingPlace.hours}
          </span>
          !
        </span>
        <br />
      </div>

      {!isElectionDay &&
        earlyVoting &&
        earlyLocations &&
        earlyLocations.length > 0 && (
          <div className="mt2 f5-ns f6 gray">
            In {state.name}, you can also vote <i>before</i> Election Day — find
            your early voting information{' '}
            <a
              className="fw5 link blue underline-hover pointer"
              href="https://www.vote.org/early-voting-calendar/"
            >
              here
            </a>
            .
          </div>
        )}

      <div className="outdent">
        <div className="directions directions-small mt3 mb1 flex-ns flex-row-ns">
          <div className="directions-info w-40-ns flex-ns flex-column-ns justify-between-ns">
            <div className="flex-auto-ns">
              <div>
                <div className="directions-label">
                  Your Polling Place&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                  <a
                    className="fw5 link blue underline-hover"
                    href={directionsURL}
                    target="_blank"
                  >
                    Get Directions
                  </a>
                </div>
                <LocationAddress
                  className="directions-address1"
                  address={locationAddress}
                />
                <DirectionsDate />
                <DirectionsHours
                  location={location}
                  pollingPlace={pollingPlace}
                />
                <ElectionDayNotice />
              </div>
            </div>
            <div className="mt3 dn db-ns">
              <div className="directions-label">
                Your Address&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                <a
                  className="fw5 link blue underline-hover pointer"
                  onClick={onChangeAddress}
                >
                  Change
                </a>
              </div>
              <LocationAddress address={address} />
            </div>
          </div>
          <div className="directions-container relative flex-auto-ns">
            <a
              className="directions-map dn db-ns"
              href={directionsURL}
              target="_blank"
              style={{
                backgroundImage: `url('${mapImages.large}')`
              }}
            />
            <a
              className="directions-map db dn-ns"
              href={directionsURL}
              target="_blank"
            >
              <img src={mapImages.small} />
            </a>
          </div>
          <div className="directions-info dn-ns">
            <div className="mt3-ns">
              <div className="directions-label">
                Your Address&nbsp;&nbsp;&middot;&nbsp;
                <a
                  className="fw5 link blue underline-hover pointer"
                  onClick={onChangeAddress}
                >
                  Change
                </a>
              </div>
              <LocationAddress address={address} />
            </div>
          </div>
        </div>
        <div className="cf" style={{ fontSize: 12 }}>
          <div className="fr">
            <GoogleReportForm address={address} />
          </div>
        </div>
      </div>
      {/* <PollingPlacePlan /> */}
    </div>
  )
}

export default PollingPlaceDirections
