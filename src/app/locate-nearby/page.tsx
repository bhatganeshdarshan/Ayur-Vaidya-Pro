'use client'
import { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Phone, Clock, ExternalLink } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import themeTypes from '../../../theme-types';
import { useTheme } from '../themeContext';

const AYURVEDIC_TYPE = 'hospital';
const YOGA_TYPE = 'yoga center';

interface Location {
  id: string;
  name: string;
  address: string;
  phone: string;    
  distance: string;
  hours: string;
  type: string;
  geometry : any ; 
}

const mapContainerStyle = {
  height: "400px",
  width: "100%"
};

const center = {
  lat: 0,
  lng: 0
};

export default function NearBy() {
  // const [darkMode, setDarkMode] = useState<boolean>(false);
  const {darkMode , toggleDarkMode} = useTheme();
  const [ayurvedicLocations, setAyurvedicLocations] = useState<Location[]>([]);
  const [yogaCenters, setYogaCenters] = useState<Location[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  // const toggleDarkMode = (): void => {
  //   setDarkMode(!darkMode);
  //   document.documentElement.classList.toggle('dark');
  // };

  const getNearbyPlaces = async (lat: number, lng: number, type: string): Promise<Location[] | undefined> => {
    try {
      const response = await axios.get('http://localhost:5000/api/places', {
        params: {
          lat,
          lng,
          type,
        },
      });
  
      const data = response.data;
  
      if (data.status === 'OK') {
        return data.results.map((place: any) => ({
          id: place.place_id,
          name: place.name,
          address: place.vicinity,
          phone: place.formatted_phone_number || 'N/A',
          distance: 'Nearby', 
          hours: place.opening_hours ? (place.opening_hours.open_now ? 'Open Now' : 'Closed') : 'N/A',
          type: type === AYURVEDIC_TYPE ? 'Ayurvedic Hospital' : 'Yoga Center',
          geometry: place.geometry 
        }));
      } else {
        throw new Error('Error fetching data from Google API');
      }
    } catch (error: any) {
      setError(error.message);
    }
  };
  

  // Cur user loc
  const fetchNearbyLocations = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setUserLocation({ lat, lng }); // hospital / yga center location

        // Fetch hospitals
        const ayurvedicResults = await getNearbyPlaces(lat, lng, AYURVEDIC_TYPE);
        if (ayurvedicResults) setAyurvedicLocations(ayurvedicResults);

        // Fetch yoga centers
        const yogaResults = await getNearbyPlaces(lat, lng, YOGA_TYPE);
        if (yogaResults) setYogaCenters(yogaResults);
      }, (error) => {
        setError('Unable to retrieve your location');
      });
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    fetchNearbyLocations();
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold">Ayur Vaidya Pro</h1>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-3xl font-bold mb-6 text-center">Find Nearby Locations</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <Tabs defaultValue="ayurvedic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ayurvedic">Ayurvedic Hospitals & Stores</TabsTrigger>
            <TabsTrigger value="yoga">Yoga Centers</TabsTrigger>
          </TabsList>
          <TabsContent value="ayurvedic">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                </CardHeader>
                <CardContent>
                  {userLocation && (
                    <LoadScript googleMapsApiKey="AIzaSyAIvOQ5TMxm9IdWuZeipj4OyASsOyiKLTo">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={userLocation}
                        zoom={12}
                      >
                        {ayurvedicLocations.map(location => (
  <Marker 
    key={location.id} 
    position={{ 
      lat: location.geometry?.location.lat || 0, 
      lng: location.geometry?.location.lng || 0  
    }} 
  />
))}

                      </GoogleMap>
                    </LoadScript>
                  )}
                </CardContent>
              </Card>
              {ayurvedicLocations.length > 0 ? ayurvedicLocations.map((location) => (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start">
                      <span>{location.name}</span>
                      <Badge variant="secondary">{location.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{location.distance} away</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{location.address}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>{location.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>{location.hours}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Get Directions
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )) : <p>No Ayurvedic locations found.</p>}
            </div>
          </TabsContent>
          <TabsContent value="yoga">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Map View</CardTitle>
                </CardHeader>
                <CardContent>
                  {userLocation && (
                    <LoadScript googleMapsApiKey="AIzaSyAIvOQ5TMxm9IdWuZeipj4OyASsOyiKLTo">
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={userLocation}
                        zoom={12}
                      >
                        {yogaCenters.map(center => (
                          <Marker key={center.id} position={{ lat: center.geometry.location.lat, lng: center.geometry.location.lng }} />
                        ))}
                      </GoogleMap>
                    </LoadScript>
                  )}
                </CardContent>
              </Card>
              {yogaCenters.length > 0 ? yogaCenters.map((center) => (
                <Card key={center.id}>
                  <CardHeader>
                    <CardTitle>{center.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{center.distance} away</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{center.address}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>{center.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 flex-shrink-0" />
                        <p>{center.hours}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Get Directions
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )) : <p>No Yoga Centers found.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
