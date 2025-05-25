import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronRight, Download, Share2, Bookmark, ArrowLeft, ArrowRight } from "lucide-react"
import TopicViewer from "@/components/topic-viewer"

type TopicPageProps = {
  params: {
    id: string
  }
}

export default function TopicPage({ params }: TopicPageProps) {
  const topicId = Number.parseInt(params.id)

  // In a real app, we'd fetch topic data from Supabase
  // For now, using mock data

  // Mock topic data
  const topic = {
    id: topicId,
    title: "Kinematics",
    content_md: `# Kinematics

Kinematics is the branch of mechanics that describes the motion of points, bodies, and systems of bodies without considering the forces that cause them to move.

## Displacement, Velocity, and Acceleration

### Displacement

Displacement is the change in position of an object. It is a vector quantity with both magnitude and direction.

$$s = s_f - s_i$$

Where:
- $s$ is displacement
- $s_f$ is final position
- $s_i$ is initial position

### Velocity

Velocity is the rate of change of displacement with respect to time. It is also a vector quantity.

$$v = \frac{ds}{dt}$$

Average velocity over a time interval:

$$v_{avg} = \frac{\Delta s}{\Delta t}$$

### Acceleration

Acceleration is the rate of change of velocity with respect to time. It is a vector quantity.

$$a = \frac{dv}{dt}$$

Average acceleration over a time interval:

$$a_{avg} = \frac{\Delta v}{\Delta t}$$

## Equations of Motion

For constant acceleration, the following equations of motion apply:

$$v = u + at$$

$$s = ut + \frac{1}{2}at^2$$

$$v^2 = u^2 + 2as$$

Where:
- $v$ is final velocity
- $u$ is initial velocity
- $a$ is acceleration
- $t$ is time
- $s$ is displacement

## Projectile Motion

Projectile motion is a form of motion where an object moves in a parabolic path under the influence of gravity only.

For a projectile launched with initial velocity $u$ at angle $θ$ to the horizontal:

Horizontal component of velocity: $u_x = u \cos θ$
Vertical component of velocity: $u_y = u \sin θ$

Range: $R = \frac{u^2 \sin 2θ}{g}$

Maximum height: $H = \frac{u^2 \sin^2 θ}{2g}$

Time of flight: $T = \frac{2u \sin θ}{g}$`,
    chapter_id: 1,
    chapter_title: "Mechanics",
    subject_id: 1,
    subject_name: "Physics",
    subject_code: "9702",
    subject_board: "CAIE",
    next_topic: {
      id: 2,
      title: "Forces",
    },
    prev_topic: null,
  }

  if (!topic) {
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
        <Link href={`/subjects/${topic.subject_board.toLowerCase()}`} className="hover:text-foreground">
          {topic.subject_board}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link
          href={`/subjects/${topic.subject_board.toLowerCase()}/${topic.subject_code}`}
          className="hover:text-foreground"
        >
          {topic.subject_name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Link
          href={`/subjects/${topic.subject_board.toLowerCase()}/${topic.subject_code}#chapter-${topic.chapter_id}`}
          className="hover:text-foreground"
        >
          {topic.chapter_title}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{topic.title}</span>
      </div>

      {/* Topic header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{topic.title}</h1>
          <p className="text-muted-foreground">
            {topic.subject_name} • {topic.chapter_title}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Bookmark className="h-4 w-4 mr-2" />
            Bookmark
          </Button>
          <Button size="sm">Quick Quiz</Button>
        </div>
      </div>

      {/* Topic content */}
      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-8">
        <TopicViewer content={topic.content_md} />
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-12 pt-6 border-t">
        {topic.prev_topic ? (
          <Link href={`/topics/${topic.prev_topic.id}`}>
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {topic.prev_topic.title}
            </Button>
          </Link>
        ) : (
          <div></div>
        )}

        {topic.next_topic && (
          <Link href={`/topics/${topic.next_topic.id}`}>
            <Button variant="outline">
              {topic.next_topic.title}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
