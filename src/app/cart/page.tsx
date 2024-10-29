'use client'

import { useState } from 'react'
import { Moon, Sun, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useCart } from '@/app/cart-context'
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

export default function CartPage() {
    const {darkMode , toggleDarkMode} = useTheme();
//   const [darkMode, setDarkMode] = useState(false)
  const { cart, addToCart, removeFromCart } = useCart()

//   const toggleDarkMode = () => {
//     setDarkMode(!darkMode)
//     document.documentElement.classList.toggle('dark')
//   }

  const cartItems = cart.map(item => {
    const product = products.find(p => p.id === item.id)
    return {
      ...item,
      ...product
    }
  })

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0)

  const handleBuy = () => {
    console.log("Proceeding to checkout with items:", cartItems)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className="sticky top-0 z-10 p-4 flex justify-between items-center border-b bg-white dark:bg-gray-800 shadow-sm">
        <h1 className="text-2xl font-bold flex items-center">
          <ShoppingCart className="mr-2 h-6 w-6" />
          Your Cart
        </h1>
        <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </header>
      <main className="container mx-auto mt-8 p-4">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Cart Items</CardTitle>
          </CardHeader>
          <CardContent>
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400">Your cart is empty</p>
            ) : (
              <ul className="space-y-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price?.toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)}>
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button variant="outline" size="icon" onClick={() => addToCart(item.id)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="destructive" size="icon" onClick={() => removeFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
          <Separator className="my-4" />
          <CardFooter className="flex justify-between items-center">
            <div className="text-lg font-semibold">
              Total: ₹{totalPrice.toFixed(2)}
            </div>
            <Button onClick={handleBuy} disabled={cartItems.length === 0}>
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}