'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun, MapPin, Phone, Clock, ExternalLink, UserCog, ArrowRight, ShoppingBag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import axios from 'axios'
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'
import { useTheme } from '../themeContext'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const AYURVEDIC_TYPE = 'hospital'
const YOGA_TYPE = 'yoga center'

interface Location {
  id: string
  name: string
  address: string
  phone: string    
  distance: string
  hours: string
  type: string
  geometry: any
}

const mapContainerStyle = {
  height: "400px",
  width: "100%"
}

const center = {
  lat: 0,
  lng: 0
}

export default function NearBy() {
  const { darkMode, toggleDarkMode } = useTheme()
  const router = useRouter()
  const [ayurvedicLocations, setAyurvedicLocations] = useState<Location[]>([])
  const [yogaCenters, setYogaCenters] = useState<Location[]>([])
  const [error, setError] = useState<string | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const getNearbyPlaces = async (lat: number, lng: number, type: string): Promise<Location[] | undefined> => {
    try {
      const response = await axios.get('http://localhost:5000/api/places', {
        params: {
          lat,
          lng,
          type,
        },
      })
  
      const data = response.data
  
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
        }))
      } else {
        throw new Error('Error fetching data from Google API')
      }
    } catch (error: any) {
      setError(error.message)
    }
  }

  const fetchNearbyLocations = (): void => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setUserLocation({ lat, lng })

        const ayurvedicResults = await getNearbyPlaces(lat, lng, AYURVEDIC_TYPE)
        if (ayurvedicResults) setAyurvedicLocations(ayurvedicResults)

        const yogaResults = await getNearbyPlaces(lat, lng, YOGA_TYPE)
        if (yogaResults) setYogaCenters(yogaResults)
      }, (error) => {
        setError('Unable to retrieve your location')
      })
    } else {
      setError('Geolocation is not supported by this browser.')
    }
  }

  useEffect(() => {
    fetchNearbyLocations()
  }, [])

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image src="/app_logo.png" alt="Ayur Vaidya Pro Logo" height={95} width={65} className="drop-shadow-md" />
          <h1 className="text-2xl font-bold text-white drop-shadow-sm">Ayur Vaidya Pro</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => router.push('/doctors')} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            Book Appointment
          </Button>
          <Button variant="outline" size="icon" onClick={() => router.push('/home')} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            <UserCog className="h-4 w-4" />
            <span className="sr-only">User settings</span>
          </Button>
          <Button variant="outline" size="icon" onClick={toggleDarkMode} className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-3xl font-bold mb-6 text-center text-[#024950] dark:text-white">Find Nearby Locations</h2>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <Tabs defaultValue="ayurvedic" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ayurvedic" className="data-[state=active]:bg-[#024950] data-[state=active]:text-white">Ayurvedic Hospitals & Stores</TabsTrigger>
            <TabsTrigger value="yoga" className="data-[state=active]:bg-[#024950] data-[state=active]:text-white">Yoga Centers</TabsTrigger>
          </TabsList>
          <TabsContent value="ayurvedic">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:col-span-2 bg-white dark:bg-gray-800 border-[#024950] border">
                <CardHeader>
                  <CardTitle className="text-[#024950] dark:text-white">Map View</CardTitle>
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
                <Card key={location.id} className="bg-white dark:bg-gray-800 border-[#024950] border">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-start text-[#024950] dark:text-white">
                      <span>{location.name}</span>
                      <Badge variant="secondary" className="bg-[#024950] text-white">{location.type}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{location.distance} away</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-[#024950] dark:text-white" />
                        <p>{location.address}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-[#024950] dark:text-white" />
                        <p>{location.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 flex-shrink-0 text-[#024950] dark:text-white" />
                        <p>{location.hours}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#024950] text-white hover:bg-[#036b74]">
                      Get Directions
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-[#024950] dark:text-white">No Ayurvedic locations found.</p>}
            </div>
          </TabsContent>
          <TabsContent value="yoga">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="md:col-span-2 bg-white dark:bg-gray-800 border-[#024950] border">
                <CardHeader>
                  <CardTitle className="text-[#024950] dark:text-white">Map View</CardTitle>
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
                <Card key={center.id} className="bg-white dark:bg-gray-800 border-[#024950] border">
                  <CardHeader>
                    <CardTitle className="text-[#024950] dark:text-white">{center.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{center.distance} away</p>
                    <div className="space-y-2">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-[#024950] dark:text-white" />
                        <p>{center.address}</p>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 flex-shrink-0 text-[#024950] dark:text-white" />
                        <p>{center.phone}</p>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 flex-shrink-0 text-[#024950] dark:text-white" />
                        <p>{center.hours}</p>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-[#024950] text-white hover:bg-[#036b74]">
                      Get Directions
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-[#024950] dark:text-white">No Yoga Centers found.</p>}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="mt-12 p-4 bg-[#024950] text-center text-white">
        <p className="text-sm">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
      <div className="fixed bottom-6 right-6 group">
        <Button
          onClick={() => router.push('/store')}
          className="rounded-full w-16 h-16 shadow-lg hover:shadow-xl transition-all duration-300 bg-[#024950] hover:bg-[#036b74] text-white"
        >
          <ShoppingBag className="h-6 w-6" />
          <span className="sr-only">Ayurvedic Products</span>
        </Button>
        <div className="absolute bottom-20 right-0 flex items-center justify-end space-x-2 animate-bounce">
          <span className="text-sm font-medium bg-white dark:bg-gray-800 text-[#024950] dark:text-gray-100 py-1 px-2 rounded shadow-md">
            Store
          </span>
          <ArrowRight className="h-5 w-5 text-[#024950] dark:text-[#036b74]" />
        </div>
      </div>
    </div>
  )
}