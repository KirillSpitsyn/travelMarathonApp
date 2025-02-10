'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import Next.js router for navigation
import { Map as OLMap, View, Overlay } from 'ol'; // OpenLayers core
import TileLayer from 'ol/layer/Tile'; // Tile layer for the base map
import VectorLayer from 'ol/layer/Vector'; // Layer for vector markers
import VectorSource from 'ol/source/Vector'; // Source for vector data
import Feature from 'ol/Feature'; // Represents individual features on the map
import Point from 'ol/geom/Point'; // Geometry for point markers
import Style from 'ol/style/Style'; // Style for map elements
import Icon from 'ol/style/Icon'; // Icon style for markers
import OSM from 'ol/source/OSM'; // OpenStreetMap as the base layer
import { fromLonLat } from 'ol/proj'; // Convert longitude/latitude to map projection
import 'ol/ol.css'; // OpenLayers default CSS

const MarathonMap = () => {
  // References for map elements and OpenLayers objects
  const router = useRouter(); // Next.js router for navigation
  const mapRef = useRef<HTMLDivElement | null>(null); // Reference to the map container
  const mapInstance = useRef<OLMap | null>(null); // Stores the map instance
  const popupRef = useRef<HTMLDivElement | null>(null); // Reference to the popup container
  const overlayRef = useRef<Overlay | null>(null); // Reference to the popup overlay
  const markerLayerRef = useRef<VectorLayer | null>(null); // Reference to the marker layer

  // State variables for search input and loading indicator
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Indicates if the map is loading

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return; // Prevents duplicate initialization

    // Initialize OpenLayers Map
    mapInstance.current = new OLMap({
      target: mapRef.current, // Attach the map to the referenced div
      layers: [
        new TileLayer({
          source: new OSM(), // Uses OpenStreetMap as the base layer
        }),
      ],
      view: new View({
        center: fromLonLat([37.618423, 55.751244]), // Default center at Moscow
        zoom: 5, // Initial zoom level to show all marathon locations
      }),
    });

    // Create a vector source to hold marathon markers
    const vectorSource = new VectorSource();
    markerLayerRef.current = new VectorLayer({ source: vectorSource }); // Create a vector layer for markers
    mapInstance.current.addLayer(markerLayerRef.current); // Add the vector layer to the map

    // Initialize a popup overlay for displaying marathon info
    overlayRef.current = new Overlay({
      element: popupRef.current!, // Attach the popup container
      positioning: 'bottom-center', // Position popup at bottom of marker
      stopEvent: false, // Allow interactions on the map while the popup is open
    });
    mapInstance.current.addOverlay(overlayRef.current); // Add the popup overlay to the map

    // List of marathon details including name, date, and coordinates
    const marathons = [
      {
        name: 'Московский марафон',
        date: '20 сентября 2025',
        location: 'Москва, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [37.618423, 55.751244], // Moscow
        token: 'moscow',
      },
      {
        name: 'Санкт-Петербургский марафон',
        date: '17 августа 2025',
        location: 'Санкт-Петербург, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [30.3609, 59.9311], // Saint Petersburg
        token: 'saint-petersburg',
      },
      {
        name: 'Казанский марафон',
        date: '12 мая 2025',
        location: 'Казань, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [49.1221, 55.7887], // Kazan
        token: 'kazan',
      },
      {
        name: 'Сочинский марафон',
        date: '15 сентября 2025',
        location: 'Сочи, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [39.726, 43.5992], // Sochi
        token: 'sochi',
      },
      {
        name: 'Владивостокский марафон',
        date: '3 октября 2025',
        location: 'Владивосток, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [131.8869, 43.1155], // Vladivostok
        token: 'vladivostok',
      },
      {
        name: 'Екатеринбургский марафон',
        date: '10 июля 2025',
        location: 'Екатеринбург, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [60.5975, 56.8389], // Yekaterinburg
      },
      {
        name: 'Новосибирский марафон',
        date: '7 июня 2025',
        location: 'Новосибирск, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [82.9346, 55.0084], // Novosibirsk
      },
      {
        name: 'Омский марафон (Сибирский международный)',
        date: '24 августа 2025',
        location: 'Омск, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [73.3686, 54.9893], // Omsk
        token: 'omsk',
      },
      {
        name: 'Челябинский марафон',
        date: '19 мая 2025',
        location: 'Челябинск, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [61.4292, 55.1644], // Chelyabinsk
      },
      {
        name: 'Нижегородский марафон',
        date: '14 июня 2025',
        location: 'Нижний Новгород, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [44.002, 56.3287], // Nizhny Novgorod
      },
      {
        name: 'Самарский марафон',
        date: '12 сентября 2025',
        location: 'Самара, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [50.1983, 53.1959], // Samara
      },
      {
        name: 'Уфимский марафон',
        date: '10 августа 2025',
        location: 'Уфа, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [55.9587, 54.7348], // Ufa
      },
      {
        name: 'Красноярский марафон',
        date: '22 июля 2025',
        location: 'Красноярск, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [92.8932, 56.0153], // Krasnoyarsk
      },
      {
        name: 'Пермский марафон',
        date: '30 августа 2025',
        location: 'Пермь, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [56.2294, 58.0093], // Perm
      },
      {
        name: 'Иркутский марафон',
        date: '15 июля 2025',
        location: 'Иркутск, Россия',
        distance: '42.2 км (полный марафон)',
        coordinates: [104.2807, 52.2896], // Irkutsk
      },
    ];
    

    // Create a lookup map for marathon details to be used in popups
    const marathonMap = new Map();
    marathons.forEach((marathon) => {
      const feature = new Feature({
        geometry: new Point(fromLonLat(marathon.coordinates)), // Convert coordinates to map projection
      });

      // Set new icon (marker pin)
      feature.setStyle(
        new Style({
          image: new Icon({
            src: 'https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/map-marker-icon.png', // New marker icon
            scale: 0.04, // Adjust size
          }),
        })
      );

      vectorSource.addFeature(feature); // Add marker to the vector source
      feature.setId(marathon.name); // Assign an ID to each feature
      marathonMap.set(feature.getId(), marathon); // Store marathon details in a map
    });

    // GLOBAL EVENT LISTENER for clicks on markers
    mapInstance.current.on('click', (event) => {
      const clickedFeature = mapInstance.current!.forEachFeatureAtPixel(event.pixel, (feat) => feat);
      if (clickedFeature) {
        const marathon = marathonMap.get(clickedFeature.getId()); // Get the clicked marathon details
        if (marathon) {
          overlayRef.current?.setPosition(event.coordinate); // Position popup above marker
          if (popupRef.current) {
            popupRef.current.innerHTML = `
              <b>${marathon.name}</b> 🏃‍♂️<br />
              📅 Дата: ${marathon.date} <br />
              📍 Место: ${marathon.location} <br />
              🏁 Дистанция: ${marathon.distance} <br />
              <a href="/marathons/${marathon.token}" style="color: blue; text-decoration: underline;">Подробнее о марафоне</a>
            `;
            popupRef.current.style.display = 'block';
          }
        }
      } else {
        popupRef.current!.style.display = 'none'; // Hide popup if no marker is clicked
      }
    });

    setTimeout(() => setIsLoading(false), 1000); // Simulate loading effect
  }, []);

  // Search functionality: update the map view to the searched city without adding or removing markers
  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      const results = await response.json();
      if (results.length > 0) {
        const { lon, lat } = results[0];
        const coordinates = fromLonLat([parseFloat(lon), parseFloat(lat)]);
        mapInstance.current?.getView().setCenter(coordinates);
        mapInstance.current?.getView().setZoom(12);
      } else {
        alert('Местоположение не найдено.');
      }
    } catch (error) {
      console.error('Ошибка поиска:', error);
      alert('Ошибка поиска.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id='body'>
      {/* Styled Heading */}
      <div className="text-center py-4">
        <h1 className="text-center mb-4">Карта Марафонов России</h1>
      </div>     

      {/* Main Content */}
      <div className="container flex-grow-1 d-flex flex-column position-relative">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-3 d-flex">
          <input
            type="text"
            className="form-control me-2"
            placeholder="Поиск марафона по городу..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-secondary">
            Найти
          </button>
        </form>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="position-absolute top-50 start-50 translate-middle bg-white p-3 rounded shadow">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        )}

        {/* Map Container */}
        <div
          ref={mapRef}
          className="flex-grow-1 position-relative"
          style={{
            width: '100%',
            height: '600px',
            minHeight: '600px',
            borderRadius: '10px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
          }}
        />

        {/* Popup Overlay */}
        <div
          ref={popupRef}
          style={{
            display: 'none',
            position: 'absolute',
            background: 'white',
            padding: '10px',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
            fontSize: '14px',
            textAlign: 'center',
          }}
        />
      </div>
    </div>
  );
};

export default MarathonMap;