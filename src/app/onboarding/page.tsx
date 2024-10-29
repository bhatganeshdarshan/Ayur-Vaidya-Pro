'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowRight, Instagram, Phone, MapPin, Mail, Twitter, Leaf, Sun, Moon, Wind } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function AyurVaidyaProLanding() {
  const router = useRouter()

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F1F8E9]">
      <motion.header 
        className="bg-[#A5D6A7] text-[#1B5E20] py-4 px-6 sticky top-0 z-10"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
      >
        <nav className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <Leaf className="mr-2" />
            Ayur Vaidya Pro
          </Link>
          <motion.ul 
            className="flex space-x-6"
            variants={staggerChildren}
            initial="initial"
            animate="animate"
          >
            {["Home", "Services", "Reviews", "Contact"].map((item, index) => (
              <motion.li key={index} variants={fadeIn}>
                <Link href={`#${item.toLowerCase()}`} className="hover:text-[#33691E] transition-colors">
                  {item}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        </nav>
      </motion.header>

      <main>
        <section className="bg-[#A5D6A7] text-[#1B5E20] py-20">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl font-bold mb-6 leading-tight">Harmony in Health, Wisdom in Wellness</h1>
              <p className="mb-8 text-lg">
                Discover the ancient wisdom of Ayurveda reimagined for modern life. Ayur Vaidya Pro brings personalized Ayurvedic health recommendations to your fingertips, blending tradition with technology for your well-being journey.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={() => router.push('/home')}
                  className="bg-[#33691E] hover:bg-[#1B5E20] text-white font-semibold py-3 px-6 rounded-full text-lg transition-colors"
                >
                  Begin Your Journey
                  <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </motion.div>
            <motion.div 
              className="md:w-1/2 md:pl-10"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="overflow-hidden rounded-2xl shadow-2xl">
                <CardContent className="p-0">
                  <video 
                    src="/ayur1.mp4" 
                    // alt="Ayurvedic Wellness" 
                    className="w-full h-auto object-cover"
                    style={{maxHeight:'450px',maxWidth:'550px'}}
                    loop
                    autoPlay
                    muted
                  />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        <section id="services" className="py-20 bg-[#E8F5E9]">
          <div className="container mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-12 text-[#1B5E20]"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Our Holistic Services
            </motion.h2>
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
              variants={staggerChildren}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {[
                { icon: Sun, title: "Personalized Wellness Plans", description: "Tailored Ayurvedic recommendations based on your unique constitution." },
                { icon: Moon, title: "Symptom-Based Insights", description: "AI-powered analysis to detect imbalances and suggest natural remedies." },
                { icon: Wind, title: "Lifestyle Optimization", description: "Custom diet plans and daily routines to harmonize your body and mind." }
              ].map((service, index) => (
                <motion.div key={index} variants={fadeIn}>
                  <Card className="bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <CardContent className="p-6 flex flex-col items-center text-center">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <service.icon className="w-16 h-16 text-[#4CAF50] mb-4" />
                      </motion.div>
                      <h3 className="text-xl font-semibold mb-2 text-[#1B5E20]">{service.title}</h3>
                      <p className="text-[#33691E]">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-[#C8E6C9] text-[#1B5E20]">
          <div className="container mx-auto flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
               <Card className="overflow-hidden rounded-2xl shadow-2xl">
                <CardContent className="p-0">
                  <video 
                    src="/ayur2.mp4"
                    className="w-full h-auto object-cover"
                    style={{ maxHeight: '450px', maxWidth: '650px' }}
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                </CardContent>
              </Card>
            </motion.div>
            <motion.div 
              className="md:w-1/2 md:pl-10"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Embrace the Wisdom of Ayurveda</h2>
              <p className="mb-8 text-lg">
                Ayur Vaidya Pro brings the time-tested knowledge of Ayurveda into the digital age. Our AI-powered app offers personalized health insights, balancing your doshas and guiding you towards optimal well-being through natural, holistic practices.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="secondary" 
                  onClick={() => router.push('/about')}
                  className="bg-[#1B5E20] hover:bg-[#33691E] text-white font-semibold py-3 px-6 rounded-full text-lg transition-colors"
                >
                  Learn More About Ayurveda
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section id="contact" className="py-20 bg-[#E8F5E9]">
          <div className="container mx-auto">
            <motion.h2 
              className="text-4xl font-bold text-center mb-12 text-[#1B5E20]"
              variants={fadeIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              Connect with Us
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="max-w-2xl mx-auto bg-white shadow-xl">
                <CardContent className="p-8">
                  <form className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Input placeholder="First name" className="bg-[#F1F8E9] border-[#A5D6A7]" />
                      <Input placeholder="Last name" className="bg-[#F1F8E9] border-[#A5D6A7]" />
                    </div>
                    <Input type="email" placeholder="Email address" className="bg-[#F1F8E9] border-[#A5D6A7]" />
                    <Textarea placeholder="Your message" className="bg-[#F1F8E9] border-[#A5D6A7]" />
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button type="submit" className="w-full bg-[#4CAF50] hover:bg-[#45a049] text-white font-semibold py-3 rounded-full text-lg transition-colors">
                        Send Message
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-[#A5D6A7] text-[#1B5E20] py-12">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {[
              { title: "About", links: ["Our Story", "Team", "Careers"] },
              { title: "Services", links: ["Consultations", "Personalized Plans", "Ayurvedic Products"] },
              { title: "Resources", links: ["Blog", "Podcast", "FAQ"] },
            ].map((section, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4 className="font-bold text-xl mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link href="#" className="hover:text-[#33691E] transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h4 className="font-bold text-xl mb-4">Stay Connected</h4>
              <p className="mb-4">Subscribe to our newsletter for Ayurvedic wisdom and exclusive offers.</p>
              <div className="flex">
                <Input placeholder="Your email" className="rounded-r-none bg-[#F1F8E9] text-[#1B5E20] border-[#4CAF50]" />
                <Button className="rounded-l-none bg-[#4CAF50] hover:bg-[#45a049] text-white">Subscribe</Button>
              </div>
            </motion.div>
          </div>
          <motion.div 
            className="border-t border-[#1B5E20]/20 pt-8 flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p>&copy; 2024 Ayur Vaidya Pro. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {[Instagram, Twitter, Mail, Phone, MapPin].map((Icon, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link href="#" className="hover:text-[#33691E] transition-colors">
                    <Icon />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  )
}