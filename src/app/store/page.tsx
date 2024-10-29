'use client'

import { useState } from 'react'
import { Moon, Sun, Search, ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/app/cart-context"
import Link from 'next/link'
import themeTypes from '../../../theme-types'
import { useTheme } from '../themeContext'

const products = [
  { id: 1, name: "Navaratna Mala", price: 999.00, rating: 4.5, image: "/navaratna.jpeg?height=200&width=200" },
  { id: 2, name: "Herbal Face Pack", price: 750.00, rating: 4.2, image: "/facep.jpeg?height=200&width=200" },
  { id: 3, name: "Navaratna", price: 1200.00, rating: 4.9, image: "/navaratna.jpeg?height=200&width=200" },
  { id: 4, name: "Japamala", price: 499.00, rating: 4.6, image: "/japamala.jpeg?height=200&width=200" },
  { id: 5, name: "Oil Pot", price: 549.00, rating: 4.3, image: "/oil_pot.jpeg?height=200&width=200" },
  { id: 6, name: "Ashwagandha Root", price: 199.00, rating: 4.6, image: "/ashwagandha_root.jpeg?height=200&width=200" },
  { id: 7, name: "Panchagavya Ghee Jar", price: 649.00, rating: 4.5, image: "/panchagavya_ghee_jar.jpeg?height=200&width=200" },
  { id: 8, name: "Parad Shivling", price: 1500.00, rating: 4.8, image: "/parad_shivling.jpeg?height=200&width=200" },
  { id: 9, name: "Ayurvedic Copper Water Bottle", price: 899.00, rating: 4.4, image: "/ayurvedic_copper_water_bottle.jpeg?height=200&width=200" },
  { id: 10, name: "Bhasma Vessel", price: 299.00, rating: 4.1, image: "/bhasma_vessel.jpeg?height=200&width=200" },
  { id: 11, name: "Complementary", price: 149.00, rating: 4.0, image: "/complementary.jpeg?height=200&width=200" },
  { id: 12, name: "Rudrakshi Mala", price: 1299.00, rating: 4.7, image: "/rudrakshi_mala.jpeg?height=200&width=200" },
  { id: 13, name: "Cow Dung Ash", price: 99.00, rating: 4.1, image: "/cow_dung_ash.jpeg?height=200&width=200" },
  { id: 14, name: "Shiva Statue", price: 349.00, rating: 4.5, image: "/shiva_statue.jpeg?height=200&width=200" },
  { id: 15, name: "Vaidya Danda", price: 749.00, rating: 4.3, image: "/vaidya_danda.jpeg?height=200&width=200" },
  { id: 16, name: "Yajna Spoon", price: 59.00, rating: 4.0, image: "/yajna_spoon.jpeg?height=200&width=200" },
]


export default function Store() {
  // const [darkMode, setDarkMode] = useState(false)
  const {darkMode , toggleDarkMode} = useTheme();
  const [searchTerm, setSearchTerm] = useState("")
  const { cart, addToCart, removeFromCart } = useCart()

  // const toggleDarkMode = () => {
  //   setDarkMode(!darkMode)
  //   document.documentElement.classList.toggle('dark')
  // }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="sticky top-0 z-10 p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold">Ayurvedic Store</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <Link href="/cart">
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">{cartItemCount}</Badge>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col justify-between">
              <CardHeader>
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md" />
                <CardTitle className="mt-2">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold">₹{product.price.toFixed(2)}</span>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button variant="outline" size="icon" onClick={() => removeFromCart(product.id)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span>{cart.find(item => item.id === product.id)?.quantity || 0}</span>
                <Button variant="outline" size="icon" onClick={() => addToCart(product.id)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
      <footer className="mt-12 p-4 bg-white dark:bg-gray-800 border-t text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}