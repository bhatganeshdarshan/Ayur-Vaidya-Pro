import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Phone, Mail } from "lucide-react"
import Image from "next/image"

const doctors = [
  {
    name: "Dr. Amrita Sharma",
    specialty: "Diabetes",
    description: "Specializes in Ayurvedic treatments for diabetes management and prevention.",
    rating: 4.8,
    phone: "+91 98765 43210",
    email: "amrita.sharma@example.com"
  },
  {
    name: "Dr. Rajesh Patel",
    specialty: "Digestive & Metabolic",
    description: "Expert in Ayurvedic remedies for digestive issues and metabolic disorders.",
    rating: 4.9,
    phone: "+91 98765 43211",
    email: "rajesh.patel@example.com"
  },
  {
    name: "Dr. Sunita Gupta",
    specialty: "Joint, Spine & Muscle",
    description: "Focuses on Ayurvedic therapies for musculoskeletal conditions and pain management.",
    rating: 4.7,
    phone: "+91 98765 43212",
    email: "sunita.gupta@example.com"
  },
  {
    name: "Dr. Vikram Singh",
    specialty: "Neurological Disorders",
    description: "Specializes in Ayurvedic treatments for various neurological conditions.",
    rating: 4.8,
    phone: "+91 98765 43213",
    email: "vikram.singh@example.com"
  },
  {
    name: "Dr. Priya Desai",
    specialty: "Obesity",
    description: "Offers personalized Ayurvedic weight management programs.",
    rating: 4.6,
    phone: "+91 98765 43214",
    email: "priya.desai@example.com"
  },
  {
    name: "Dr. Anand Kumar",
    specialty: "B.N.Y.S (Naturopathy Doctor)",
    description: "Combines Ayurveda with naturopathy for holistic healing approaches.",
    rating: 4.9,
    phone: "+91 98765 43215",
    email: "anand.kumar@example.com"
  }
]

export default function Component() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Contact Ayurvedic Doctors</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor, index) => (
          <Card key={index} className="flex flex-col h-full overflow-hidden">
            <div className="relative h-48">
              <Image
                src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(doctor.name)}`}
                alt={doctor.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{doctor.name}</CardTitle>
              <CardDescription>{doctor.specialty}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="mb-4">{doctor.description}</p>
              <div className="flex items-center mb-2">
                <Star className="w-5 h-5 text-yellow-400 mr-1" />
                <span className="font-semibold">{doctor.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center mb-2">
                <Phone className="w-5 h-5 text-gray-500 mr-2" />
                <span>{doctor.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 text-gray-500 mr-2" />
                <span className="text-sm">{doctor.email}</span>
              </div>
            </CardContent>
            <CardContent>
              <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded-md transition-colors">
                Contact Doctor
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}