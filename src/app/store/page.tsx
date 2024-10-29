'use client'

import { useState } from 'react'
import { Moon, Sun, Search, ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/app/cart-context"
import Link from 'next/link'
import { useTheme } from '../themeContext'
import Image from 'next/image'

const products = [
  { id: 1, name: "Navaratna Mala", price: 999.00, rating: 4.5, image: "/navaratna.jpeg" },
  { id: 2, name: "Herbal Face Pack", price: 750.00, rating: 4.2, image: "/facep.jpeg" },
  { id: 3, name: "Navaratna", price: 1200.00, rating: 4.9, image: "/navaratna.jpeg" },
  { id: 4, name: "Japamala", price: 499.00, rating: 4.6, image: "/japamala.jpeg" },
  { id: 5, name: "Oil Pot", price: 549.00, rating: 4.3, image: "/oil_pot.jpeg" },
  { id: 6, name: "Ashwagandha Root", price: 199.00, rating: 4.6, image: "/ashwagandha_root.jpeg" },
  { id: 7, name: "Panchagavya Ghee Jar", price: 649.00, rating: 4.5, image: "/panchagavya_ghee_jar.jpeg" },
  { id: 8, name: "Parad Shivling", price: 1500.00, rating: 4.8, image: "/parad_shivling.jpeg" },
  { id: 9, name: "Ayurvedic Copper Water Bottle", price: 899.00, rating: 4.4, image: "/ayurvedic_copper_water_bottle.jpeg" },
  { id: 10, name: "Bhasma Vessel", price: 299.00, rating: 4.1, image: "/bhasma_vessel.jpeg" },
  { id: 11, name: "Complementary", price: 149.00, rating: 4.0, image: "/complementary.jpeg" },
  { id: 12, name: "Rudrakshi Mala", price: 1299.00, rating: 4.7, image: "/rudrakshi_mala.jpeg" },
  { id: 13, name: "Cow Dung Ash", price: 99.00, rating: 4.1, image: "/cow_dung_ash.jpeg" },
  { id: 14, name: "Shiva Statue", price: 349.00, rating: 4.5, image: "/shiva_statue.jpeg" },
  { id: 15, name: "Vaidya Danda", price: 749.00, rating: 4.3, image: "/vaidya_danda.jpeg" },
  { id: 16, name: "Yajna Spoon", price: 59.00, rating: 4.0, image: "/yajna_spoon.jpeg" },
]

export default function Store() {
  const { darkMode, toggleDarkMode } = useTheme()
  const [searchTerm, setSearchTerm] = useState("")
  const { cart, addToCart, removeFromCart } = useCart()

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-[#012A2E] text-gray-100' : 'bg-[#e6f3f3] text-gray-900'}`}>
      <header className="sticky top-0 z-10 p-4 flex justify-between items-center border-b bg-[#024950] shadow-lg">
        <div className="flex items-center space-x-2">
          <Image 
            src="/app_logo.png" 
            alt="Ayur Vaidya Pro Logo" 
            height={95} 
            width={65} 
            className="drop-shadow-md"
            priority
          />
          <h1 className="text-2xl font-bold text-white">Ayurvedic Store</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-64 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
          </div>
          <Link href="/cart">
            <Button 
              variant="outline" 
              size="icon" 
              className="relative bg-white/20 hover:bg-white/30 text-white border-white/50"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs bg-[#036b74] text-white">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={toggleDarkMode}
            className="bg-white/20 hover:bg-white/30 text-white border-white/50"
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card 
              key={product.id} 
              className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300 bg-white dark:bg-[#023940] border-[#024950] dark:border-[#036b74]"
            >
              <CardHeader>
                <div className="relative h-48 w-full overflow-hidden rounded-md">
                  <Image
                    src={product.image}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-300 hover:scale-105"
                  />
                </div>
                <CardTitle className="mt-2 text-[#024950] dark:text-white">{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-[#024950] dark:text-white">
                    ₹{product.price.toFixed(2)}
                  </span>
                  <div className="flex items-center bg-[#024950]/10 dark:bg-[#036b74]/20 px-2 py-1 rounded-full">
                    <Star className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="ml-1 text-[#024950] dark:text-white">{product.rating.toFixed(1)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => removeFromCart(product.id)}
                  className="border-[#024950] dark:border-[#036b74] text-[#024950] dark:text-white hover:bg-[#024950]/10"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-[#024950] dark:text-white font-medium">
                  {cart.find(item => item.id === product.id)?.quantity || 0}
                </span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => addToCart(product.id)}
                  className="border-[#024950] dark:border-[#036b74] text-[#024950] dark:text-white hover:bg-[#024950]/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>

      <footer className="mt-12 p-4 bg-[#024950] text-center">
        <p className="text-sm text-white">© 2024 Ayur Vaidya Pro. All rights reserved.</p>
      </footer>
    </div>
  )
}