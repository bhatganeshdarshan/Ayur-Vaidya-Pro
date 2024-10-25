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
  { id: 1, name: "Ashwagandha Capsules", price: 19.99, image: "/Ashwagandha.webp?height=100&width=100" },
  { id: 2, name: "Triphala Powder", price: 14.99, image: "/next.svg?height=100&width=100" },
  { id: 3, name: "Brahmi Ghritam", price: 24.99, image: "/next.svg?height=100&width=100" },
  { id: 4, name: "Chyawanprash", price: 29.99, image: "/next.svg?height=100&width=100" },
  { id: 5, name: "Neem Tablets", price: 12.99, image: "/next.svg?height=100&width=100" },
  { id: 6, name: "Tulsi Drops", price: 9.99, image: "/next.svg?height=100&width=100" },
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