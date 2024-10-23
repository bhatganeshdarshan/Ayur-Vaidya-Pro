'use client'

import { useState } from 'react'
import { Moon, Sun, Search, ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const products = [
  { id: 1, name: "Ashwagandha Capsules", price: 19.99, rating: 4.5, image: "/next.svg?height=200&width=200" },
  { id: 2, name: "Triphala Powder", price: 14.99, rating: 4.2, image: "/next.svg?height=200&width=200" },
  { id: 3, name: "Brahmi Ghritam", price: 24.99, rating: 4.7, image: "/next.svg?height=200&width=200" },
  { id: 4, name: "Chyawanprash", price: 29.99, rating: 4.8, image: "/next.svg?height=200&width=200" },
  { id: 5, name: "Neem Tablets", price: 12.99, rating: 4.0, image: "/next.svg?height=200&width=200" },
  { id: 6, name: "Tulsi Drops", price: 9.99, rating: 4.6, image: "/next.svg?height=200&width=200" },
]

export default function Store() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [cart, setCart] = useState<{id: number, quantity: number}[]>([])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { id: productId, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId)
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
      }
      return prevCart.filter(item => item.id !== productId)
    })
  }

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
          <Button variant="outline" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -top-2 -right-2 px-2 py-1 text-xs">{cartItemCount}</Badge>
            )}
          </Button>
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