"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bookmark, BookOpen, Trash2 } from "lucide-react"
import { useSupabase } from "@/components/supabase-provider"

type BookmarkedItem = {
  id: number
  type: "subject" | "topic"
  title: string
  description: string
  path: string
  created_at: string
}

export default function BookmarksPage() {
  const { user } = useSupabase()
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    const fetchBookmarks = async () => {
      setLoading(true)

      // In a real app, we'd fetch from Supabase
      // For now, using mock data
      const mockBookmarks = [
        {
          id: 1,
          type: "subject",
          title: "Physics",
          description: "A Level CAIE (9702)",
          path: "/subjects/caie/9702",
          created_at: "2025-05-10T14:30:00Z",
        },
        {
          id: 2,
          type: "topic",
          title: "Kinematics",
          description: "Physics > Mechanics",
          path: "/topics/1",
          created_at: "2025-05-12T09:15:00Z",
        },
        {
          id: 3,
          type: "topic",
          title: "Circuits",
          description: "Physics > Electricity",
          path: "/topics/7",
          created_at: "2025-05-14T16:45:00Z",
        },
      ] as BookmarkedItem[]

      setBookmarks(mockBookmarks)
      setLoading(false)
    }

    fetchBookmarks()
  }, [user, router])

  const handleRemoveBookmark = (id: number) => {
    // In a real app, we'd delete from Supabase
    setBookmarks(bookmarks.filter((bookmark) => bookmark.id !== id))
  }

  const subjectBookmarks = bookmarks.filter((bookmark) => bookmark.type === "subject")
  const topicBookmarks = bookmarks.filter((bookmark) => bookmark.type === "topic")

  if (!user) {
    return null
  }

  return (
    <div className="container py-10">
      <div className="space-y-4 mb-8">
        <h1 className="text-4xl font-bold">My Bookmarks</h1>
        <p className="text-muted-foreground text-lg">Access your saved subjects and topics for quick reference.</p>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Bookmarks</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
          <TabsTrigger value="topics">Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted rounded-t-lg" />
                  <CardContent className="h-20" />
                </Card>
              ))}
            </div>
          ) : bookmarks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {bookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} onRemove={handleRemoveBookmark} />
              ))}
            </div>
          ) : (
            <EmptyBookmarks />
          )}
        </TabsContent>

        <TabsContent value="subjects">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted rounded-t-lg" />
                  <CardContent className="h-20" />
                </Card>
              ))}
            </div>
          ) : subjectBookmarks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {subjectBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} onRemove={handleRemoveBookmark} />
              ))}
            </div>
          ) : (
            <EmptyBookmarks type="subjects" />
          )}
        </TabsContent>

        <TabsContent value="topics">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="h-24 bg-muted rounded-t-lg" />
                  <CardContent className="h-20" />
                </Card>
              ))}
            </div>
          ) : topicBookmarks.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topicBookmarks.map((bookmark) => (
                <BookmarkCard key={bookmark.id} bookmark={bookmark} onRemove={handleRemoveBookmark} />
              ))}
            </div>
          ) : (
            <EmptyBookmarks type="topics" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function BookmarkCard({
  bookmark,
  onRemove,
}: {
  bookmark: BookmarkedItem
  onRemove: (id: number) => void
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date)
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          {bookmark.type === "subject" ? (
            <BookOpen className="h-6 w-6 text-primary" />
          ) : (
            <Bookmark className="h-6 w-6 text-primary" />
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(bookmark.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Remove bookmark</span>
          </Button>
        </div>
        <CardTitle className="text-xl">{bookmark.title}</CardTitle>
        <CardDescription>{bookmark.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-xs text-muted-foreground">Bookmarked on {formatDate(bookmark.created_at)}</p>
      </CardContent>
      <CardFooter>
        <Link href={bookmark.path} className="w-full">
          <Button variant="outline" className="w-full">
            View {bookmark.type === "subject" ? "Subject" : "Topic"}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

function EmptyBookmarks({ type = "bookmarks" }: { type?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-lg">
      <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-xl font-medium mb-2">No {type} yet</h3>
      <p className="text-muted-foreground text-center max-w-md mb-4">
        {type === "subjects"
          ? "You haven't bookmarked any subjects yet. Browse subjects and click the bookmark icon to save them here."
          : type === "topics"
            ? "You haven't bookmarked any topics yet. While studying, click the bookmark icon to save topics for quick access."
            : "You haven't bookmarked anything yet. Browse subjects and topics and click the bookmark icon to save them here."}
      </p>
      <Link href="/subjects">
        <Button>Browse Subjects</Button>
      </Link>
    </div>
  )
}
