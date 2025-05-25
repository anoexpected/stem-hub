import SubjectDirectory from "@/components/subject-directory"

export default async function SubjectsPage() {
  // In a real app, we'd fetch subjects from Supabase
  // For now, using mock data
  const subjects = [
    {
      id: 1,
      name: "Physics",
      code: "9702",
      board: "CAIE",
      level: "A Level",
      description: "A comprehensive study of matter, energy, and their interactions.",
    },
    {
      id: 2,
      name: "Chemistry",
      code: "9701",
      board: "CAIE",
      level: "A Level",
      description: "The study of substances, their properties, structure, and the changes they undergo.",
    },
    {
      id: 3,
      name: "Biology",
      code: "9700",
      board: "CAIE",
      level: "A Level",
      description: "The study of living organisms and their interactions with each other and the environment.",
    },
    {
      id: 4,
      name: "Mathematics",
      code: "9709",
      board: "CAIE",
      level: "A Level",
      description: "The study of numbers, quantities, and shapes through abstract concepts.",
    },
    {
      id: 5,
      name: "Computer Science",
      code: "9618",
      board: "CAIE",
      level: "A Level",
      description: "The study of computers and computational systems, including programming and algorithms.",
    },
    {
      id: 6,
      name: "Physics",
      code: "4008",
      board: "ZIMSEC",
      level: "O Level",
      description: "A fundamental exploration of the physical world and its laws.",
    },
    {
      id: 7,
      name: "Chemistry",
      code: "4007",
      board: "ZIMSEC",
      level: "O Level",
      description: "The study of matter, its properties, and reactions.",
    },
    {
      id: 8,
      name: "Biology",
      code: "4006",
      board: "ZIMSEC",
      level: "O Level",
      description: "The study of living organisms and natural systems.",
    },
  ]

  return (
    <div className="container px-4 py-8 md:py-12">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold">Subject Directory</h1>
        <p className="text-muted-foreground text-lg">
          Browse our comprehensive collection of STEM subjects for CAIE and ZIMSEC curricula.
        </p>
      </div>

      <SubjectDirectory subjects={subjects} />
    </div>
  )
}
