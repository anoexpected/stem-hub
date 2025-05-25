"use client"

import Link from "next/link"
import { AnimatedButton } from "@/components/ui/animated-button"
import { AnimatedElement } from "@/components/ui/animated-element"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageCircle, GraduationCap } from "lucide-react"
import Lottie from "lottie-react"

// Import Lottie animations
const bookAnimation = {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Book Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Book",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [50, 50, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], h: 1 },
            { t: 30, s: [110, 110, 100], h: 1 },
            { t: 60, s: [100, 100, 100], h: 1 },
          ],
          ix: 6,
          l: 2,
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [40, 50], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 4, ix: 4 },
              nm: "Rectangle Path",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.486, 0.361, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Book Shape",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
}

const chatAnimation = {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Chat Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Chat Bubble",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 0, k: [50, 50, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: {
          a: 1,
          k: [
            { t: 0, s: [100, 100, 100], h: 1 },
            { t: 15, s: [105, 105, 100], h: 1 },
            { t: 30, s: [100, 100, 100], h: 1 },
            { t: 45, s: [105, 105, 100], h: 1 },
            { t: 60, s: [100, 100, 100], h: 1 },
          ],
          ix: 6,
          l: 2,
        },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              p: { a: 0, k: [0, 0], ix: 3 },
              s: { a: 0, k: [40, 40], ix: 2 },
              nm: "Ellipse Path",
              mn: "ADBE Vector Shape - Ellipse",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.353, 0.871, 0.69, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Chat Shape",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
}

const graduationAnimation = {
  v: "5.7.8",
  fr: 30,
  ip: 0,
  op: 60,
  w: 100,
  h: 100,
  nm: "Graduation Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Graduation Cap",
      sr: 1,
      ks: {
        o: { a: 0, k: 100, ix: 11 },
        r: {
          a: 1,
          k: [
            { t: 0, s: [0], h: 1 },
            { t: 30, s: [10], h: 1 },
            { t: 60, s: [0], h: 1 },
          ],
          ix: 10,
        },
        p: { a: 0, k: [50, 50, 0], ix: 2, l: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1, l: 2 },
        s: { a: 0, k: [100, 100, 100], ix: 6, l: 2 },
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [40, 10], ix: 2 },
              p: { a: 0, k: [0, 0], ix: 3 },
              r: { a: 0, k: 0, ix: 4 },
              nm: "Rectangle Path",
              mn: "ADBE Vector Shape - Rect",
              hd: false,
            },
            {
              ty: "fl",
              c: { a: 0, k: [0, 0.51, 1, 1], ix: 4 },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: "Fill",
              mn: "ADBE Vector Graphic - Fill",
              hd: false,
            },
            {
              ty: "tr",
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: "Transform",
            },
          ],
          nm: "Cap Shape",
          np: 2,
          cix: 2,
          bm: 0,
          ix: 1,
          mn: "ADBE Vector Group",
          hd: false,
        },
      ],
      ip: 0,
      op: 60,
      st: 0,
      bm: 0,
    },
  ],
  markers: [],
}

export default function FeatureSection() {
  const features = [
    {
      icon: BookOpen,
      animation: bookAnimation,
      title: "Peer-Written Notes",
      description: "Access comprehensive notes written by top students and educators for all STEM subjects.",
      buttonText: "Find your subject",
      buttonLink: "/subjects",
      color: "text-primary",
    },
    {
      icon: MessageCircle,
      animation: chatAnimation,
      title: "Community Q&A",
      description: "Get your questions answered by a community of students and teachers in real-time.",
      buttonText: "Join our Discord",
      buttonLink: "https://discord.gg/stemhub",
      color: "text-secondary",
    },
    {
      icon: GraduationCap,
      animation: graduationAnimation,
      title: "Uni Planning",
      description: "Explore university options, admission requirements, and scholarship opportunities.",
      buttonText: "Explore Uni Guide",
      buttonLink: "/uni-guide",
      color: "text-tertiary",
    },
  ]

  return (
    <section className="container px-4 md:px-6 py-8">
      <AnimatedElement animation="fade-up">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Everything you need to <span className="text-primary">excel</span> in STEM
          </h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Comprehensive resources designed to help you master your STEM subjects and prepare for exams.
          </p>
        </div>
      </AnimatedElement>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <AnimatedElement key={index} animation="fade-up" delay={0.1 * (index + 1)} className="h-full">
            <Card className="flex flex-col h-full bg-card border-border/40 hover:border-primary/40 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
              <CardHeader>
                <div className="w-16 h-16 mb-4">
                  <Lottie animationData={feature.animation} loop={true} className={feature.color} />
                </div>
                <CardTitle className="text-secondary">{feature.title}</CardTitle>
                <CardDescription className="text-foreground/80">{feature.description}</CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Link href={feature.buttonLink} className="w-full">
                  <AnimatedButton
                    className="w-full"
                    variant={index === 0 ? "default" : index === 1 ? "secondary" : "tertiary"}
                  >
                    {feature.buttonText}
                  </AnimatedButton>
                </Link>
              </CardFooter>
            </Card>
          </AnimatedElement>
        ))}
      </div>
    </section>
  )
}
