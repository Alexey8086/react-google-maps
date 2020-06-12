import './App.css'
import React, { useState, useEffect } from "react"
import {
  withGoogleMap,
  withScriptjs,
  GoogleMap,
  Marker,
  InfoWindow
} from "react-google-maps"
import * as officeData from "./data/offices.json"
import mapStyles from "./mapStyles"

function Map() {
  const [selectedOffice, setSelectedOffice] = useState(null)

  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedOffice(null)
      }
    }

    window.addEventListener("keydown", listener)

    return () => {
      window.removeEventListener("keydown", listener)
    }
  }, [])

  return (
    <GoogleMap
      defaultZoom={12}
      defaultCenter={{ lat: 54.734988, lng: 55.957796 }}
      defaultOptions={{ styles: mapStyles }}
    >
      {
        officeData.features.map(office => (

          <Marker
            key={office.properties.office_ID}

            position={{
              lat: office.geometry.coordinates[0],
              lng: office.geometry.coordinates[1]
            }}

            onClick={() => {
              setSelectedOffice(office)
            }}

            icon={{
              url: office.properties.PICTURE,
              scaledSize: new window.google.maps.Size(35, 35)
            }}
          />
        ))
      }

      {
        selectedOffice && (
          <InfoWindow
            position={{
              lat: selectedOffice.geometry.coordinates[0],
              lng: selectedOffice.geometry.coordinates[1]
            }}

            onCloseClick={() => {
              setSelectedOffice(null)
            }}
          >
            <>
              <h2>Название:&nbsp;{selectedOffice.properties.NAME}</h2>
              <p>Описание:&nbsp;{selectedOffice.properties.DESCRIPTION}</p>
              <p>Адрес:&nbsp;{selectedOffice.properties.ADDRESS}</p>
              <p>Цена в месяц в руб.:&nbsp;{selectedOffice.properties.PRICE ? selectedOffice.properties.PRICE : 'Уже сдается'}</p>
              <p>Площадь в кв.м:&nbsp;{selectedOffice.properties.AREA}</p>
              <p>Этаж:&nbsp;{selectedOffice.properties.FLOOR}</p>
              {selectedOffice.properties.RENT ?<p>Офис сейчас сдаётся</p> : <p>Офис сейча свободен</p>}
            </>
          </InfoWindow>
        )
      }
    </GoogleMap>
  )
}

const MapWrapped = withScriptjs(withGoogleMap(Map))

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <MapWrapped
        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${
          process.env.REACT_APP_GOOGLE_KEY
        }`}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `100%` }} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    </div>
  )
}
