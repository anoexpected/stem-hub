import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Users, Download, Share2, Bookmark } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import SubjectChapters from "@/components/subject-chapters"

type SubjectPageProps = {
  params: {
    board: string
    code: string
  }
}

export default function SubjectPage({ params }: SubjectPageProps) {
  // In a real app, we'd fetch subject data from Supabase
  // For now, using mock data

  // Mock subject data
  const subject = {
    id: 1,
    name: "Physics",
    code: params.code,
    board: params.board.toUpperCase(),
    level: params.board.toUpperCase() === "CAIE" ? "A Level" : "O Level",
    description: "A comprehensive study of matter, energy, and their interactions.",
    contributors: [
      { id: 1, name: "John Doe", avatar_url: "" },
      { id: 2, name: "Jane Smith", avatar_url: "" },
      { id: 3, name: "Alex Johnson", avatar_url: "" },
    ],
    chapters: [
      {
        id: 1,
        title: "Mechanics",
        type: "theory",
        order: 1,
        topics: [
          {
            id: 1,
            title: "Kinematics",
            content_md:
              "# Kinematics\n\nKinematics is the branch of mechanics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move.",
          },
          {
            id: 2,
            title: "Forces",
            content_md:
              "# Forces\n\nA force is any interaction that, when unopposed, will change the motion of an object.",
          },
          {
            id: 3,
            title: "Energy and Work",
            content_md:
              "# Energy and Work\n\nIn physics, energy is the quantitative property that must be transferred to an object in order to perform work on, or to heat, the object.",
          },
        ],
      },
      {
        id: 2,
        title: "Waves",
        type: "theory",
        order: 2,
        topics: [
          {
            id: 4,
            title: "Wave Properties",
            content_md:
              "# Wave Properties\n\nWaves are disturbances that transfer energy from one place to another without transferring matter.",
          },
          {
            id: 5,
            title: "Standing Waves",
            content_md: "# Standing Waves\n\nA standing wave is a wave that remains in a constant position.",
          },
        ],
      },
      {
        id: 3,
        title: "Electricity",
        type: "theory",
        order: 3,
        topics: [
          {
            id: 6,
            title: "Electric Fields",
            content_md:
              "# Electric Fields\n\nAn electric field is a vector field that associates to each point in space the Coulomb force experienced by a unit electric charge.",
          },
          {
            id: 7,
            title: "Circuits",
            content_md:
              "# Circuits\n\nAn electrical circuit is a path in which electrons flow from a voltage or current source.",
          },
        ],
      },
      {
        id: 4,
        title: "Practical Skills",
        type: "practical",
        order: 4,
        topics: [
          {
            id: 8,
            title: "Measurement Techniques",
            content_md: "# Measurement Techniques\n\nAccurate measurement is fundamental to physics.",
          },
          {
            id: 9,
            title: "Experimental Design",
            content_md: "# Experimental Design\n\nThe process of designing an experiment to test a hypothesis.",
          },
        ],
      },
    ],
  }

  if (!subject) {
    notFound()
  }

  return (
    <div className="container px-4 py-8 md:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href="/subjects" className="hover:text-foreground">
          Subjects
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link href={`/subjects/${params.board.toLowerCase()}`} className="hover:text-foreground">
          {params.board.toUpperCase()}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{subject.name}</span>
      </div>

      {/* Subject header */}
      <div className="flex flex-col md:flex-row justify-between gap-6 mb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-4xl font-bold">{subject.name}</h1>
            <Badge variant={subject.board === "CAIE" ? "default" : "secondary"} className="ml-2">
              {subject.board}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{subject.code}</span>
            <span>•</span>
            <span>{subject.level}</span>
          </div>
          <p className="text-lg max-w-2xl">{subject.description}</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Contributors:</span>
            <div className="flex -space-x-2">
              {subject.contributors.map((contributor) => (
                <Avatar key={contributor.id} className="h-8 w-8 border-2 border-background">
                  <AvatarImage src={contributor.avatar_url || "/placeholder.svg"} alt={contributor.name} />
                  <AvatarFallback>{contributor.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Notes
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Bookmark className="h-4 w-4 mr-2" />
              Bookmark
            </Button>
          </div>
        </div>
      </div>

      {/* Subject content */}
      <SubjectChapters chapters={subject.chapters} />
    </div>
  )
}
