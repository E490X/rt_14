import React from 'react'
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api'

function LocationMap({center}) {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyDcjtGb2jSVKXsUjxVAcJx6hboHbUe6fqI'
      })
  if (!isLoaded) return <div>Loading...</div>

    return (
        <GoogleMap zoom={10} center={center} mapContainerClassName="map-container">
          <MarkerF position={center} />
        </GoogleMap>
      )
}

export default LocationMap
