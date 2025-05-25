"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedElement } from "@/components/ui/animated-element"
import { Calendar, Users, MessageSquare } from "lucide-react"
import Link from "next/link"
import { createSupabaseClient } from "@/lib/supabase"
import { motion } from "framer-motion"

type DiscordStats = {
  online: number
  members: number
  messages_today: number
}

type Webinar = {
  id: number
  title: string
  date: string
  topic: string
}

export default function CommunityExtras() {
  const [discordStats, setDiscordStats] = useState<DiscordStats | null>(null)
  const [webinars, setWebinars] = useState<Webinar[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const supabase = createSupabaseClient()

      // Fetch discord stats
      const { data: discordData } = await supabase
        .from("discord_stats")
        .select("*")
        .order("updated_at", { ascending: false })
        .limit(1)
        .single()

      // Fetch upcoming webinars
      const { data: webinarData } = await supabase
        .from("webinars")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(3)

      if (discordData) {
        setDiscordStats({
          online: discordData.online,
          members: discordData.members,
          messages_today: discordData.messages_today,
        })
      }

      if (webinarData) {
        setWebinars(webinarData)
      }
    } catch (error) {
      console.error("Error fetching community data:", error)
      // Fallback to minimal mock data
      setDiscordStats({ online: 100, members: 1000, messages_today: 500 })
      setWebinars([
        {
          id: 1,
          title: "Upcoming Webinar",
          date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          topic: "Physics",
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()

    // Clean up function
    return () => {
      setDiscordStats(null)
      setWebinars([])
    }
  }, [fetchData])

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }, [])

  return (
    <section className="container px-4 md:px-6 py-16 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-tertiary/5 via-background to-background z-0" />

      <AnimatedElement animation="fade-up" className="relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Join our community</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Connect with fellow students, attend live webinars, and get help in real-time.
          </p>
        </div>
      </AnimatedElement>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        {/* Discord Widget */}
        <AnimatedElement animation="fade-up" delay={0.1}>
          <Card className="bg-card border-border/40 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Users className="h-5 w-5" />
                Discord Community
              </CardTitle>
              <CardDescription className="text-foreground/80">
                Join thousands of STEM students for discussions and help
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-10 bg-muted rounded animate-pulse" />
                  <div className="h-10 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                discordStats && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <motion.div
                        className="flex flex-col p-4 rounded-lg bg-primary/5"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-2xl font-bold text-primary">{discordStats.online}</span>
                        <span className="text-sm text-muted-foreground">Online now</span>
                      </motion.div>
                      <motion.div
                        className="flex flex-col p-4 rounded-lg bg-secondary/5"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-2xl font-bold text-secondary">{discordStats.members}</span>
                        <span className="text-sm text-muted-foreground">Members</span>
                      </motion.div>
                      <motion.div
                        className="flex flex-col p-4 rounded-lg bg-tertiary/5"
                        whileHover={{ y: -5 }}
                        transition={{ duration: 0.2 }}
                      >
                        <span className="text-2xl font-bold text-tertiary">{discordStats.messages_today}</span>
                        <span className="text-sm text-muted-foreground">Messages today</span>
                      </motion.div>
                    </div>

                    <div className="flex justify-center">
                      <Link href="https://discord.gg/stemhub" target="_blank" rel="noopener noreferrer">
                        <AnimatedButton variant="tertiary" className="w-full">
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Join Discord Server
                        </AnimatedButton>
                      </Link>
                    </div>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </AnimatedElement>

        {/* Webinar Schedule */}
        <AnimatedElement animation="fade-up" delay={0.2}>
          <Card className="bg-card border-border/40 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-secondary/10 to-transparent border-b border-border/40">
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Calendar className="h-5 w-5" />
                Upcoming Webinars
              </CardTitle>
              <CardDescription className="text-foreground/80">Free live sessions with expert tutors</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="space-y-2">
                  <div className="h-16 bg-muted rounded animate-pulse" />
                  <div className="h-16 bg-muted rounded animate-pulse" />
                </div>
              ) : (
                <div className="space-y-6">
                  {webinars.length > 0 ? (
                    <div className="space-y-3">
                      {webinars.map((webinar, index) => (
                        <motion.div
                          key={webinar.id}
                          className="flex items-start space-x-3 p-4 rounded-lg border border-border/40 bg-card/50"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ scale: 1.02, boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" }}
                        >
                          <div className="flex-1 space-y-1">
                            <p className="font-medium text-foreground">{webinar.title}</p>
                            <p className="text-sm text-muted-foreground">{formatDate(webinar.date)}</p>
                          </div>
                          <div className="text-xs px-2 py-1 rounded-full bg-tertiary/10 text-tertiary">
                            {webinar.topic}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground">No upcoming webinars at the moment.</p>
                  )}

                  <div className="flex justify-center">
                    <Link href="/webinars">
                      <AnimatedButton
                        variant="outline"
                        className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                      >
                        View All Webinars
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>
    </section>
  )
}
