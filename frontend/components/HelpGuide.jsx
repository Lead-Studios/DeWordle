"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Settings, Gamepad2 } from "lucide-react"
import Link from "next/link"
import { helpContent } from "../app/helpContent"

// Component for rendering individual letter tiles
function LetterTile({ letter, state = "absent" }) {
  const baseStyles = "w-8 h-8 flex items-center justify-center text-base font-bold border-2 select-none"
  const stateStyles = {
    correct: "bg-green-600 text-white border-green-600",
    present: "bg-yellow-500 text-white border-yellow-500",
    absent: "dark:bg-gray-900 dark:text-white dark:border-gray-600 bg-gray-700 text-white border-gray-300",
  }

  return <div className={`${baseStyles} ${stateStyles[state]}`}>{letter}</div>
}

// Component for rendering a word example with colored tiles
function WordExample({ word, correctIndex, presentIndex, absentIndex }) {
  return (
    <div className="flex gap-1">
      {word.map((letter, index) => (
        <LetterTile
          key={index}
          letter={letter}
          state={index === correctIndex ? "correct" : index === presentIndex ? "present" : index === absentIndex ? "absent" : " "}
        />
      ))}
    </div>
  )
}

// Main HelpGuide component
export function HelpGuide({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        {/* Dialog header */}
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Help Guide</DialogTitle>
        </DialogHeader>

        {/* Tab navigation */}
        <Tabs defaultValue="getting-started" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="getting-started" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Getting Started</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span className="hidden sm:inline">How to Play</span>
            </TabsTrigger>
            <TabsTrigger value="troubleshooting" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Troubleshooting</span>
            </TabsTrigger>
          </TabsList>

          {/* Getting Started tab content */}
          <TabsContent value="getting-started" className="mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Welcome! Let's help you get started with our platform.
            </div>
            <Accordion type="single" collapsible className="w-full hover:no-underline">
              {helpContent.gettingStarted.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>

          {/* How to Play tab content */}
          <TabsContent value="features" className="mt-4">
            <div className="text-sm text-muted-foreground mb-4">Learn how to play Wordle.</div>
            <div className="space-y-6">
              {helpContent.features.map((section, index) => {
                switch (section.type) {
                  // Header section
                  case "header":
                    return (
                      <div key={index}>
                        <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                        <p className="text-base mb-4">{section.subtitle}</p>
                      </div>
                    )
                  // Rules section
                  case "rules":
                    return (
                      <div key={index} className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <p key={itemIndex} className="text-sm">
                            • {item}
                          </p>
                        ))}
                      </div>
                    )
                  // Examples section
                  case "examples":
                    return (
                      <div key={index} className="space-y-4">
                        <h3 className="text-lg font-semibold">{section.title}</h3>
                        {section.items.map((item, itemIndex) => (
                          <div key={itemIndex} className="space-y-2">
                            <WordExample
                              word={item.word}
                              correctIndex={item.correctIndex}
                              presentIndex={item.presentIndex}
                              absentIndex={item.absentIndex}
                            />
                            <p className="text-sm">
                              <strong>{item.word[item.absentIndex || item.correctIndex || item.presentIndex || 0]}</strong>{" "}
                              {item.explanation}
                            </p>
                          </div>
                        ))}
                      </div>
                    )
                  // Footer section
                  case "footer":
                    return (
                      <p key={index} className="text-sm text-muted-foreground">
                        {section.content.split("sign up").map((part, i) =>
                          i === 0 ? (
                            part
                          ) : (
                            <React.Fragment key={i}>
                              <Link
                                href="#"
                                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
                              >
                                sign up
                              </Link>
                              {part}
                            </React.Fragment>
                          ),
                        )}
                      </p>
                    )
                  default:
                    return null
                }
              })}
            </div>
          </TabsContent>

          {/* Troubleshooting tab content */}
          <TabsContent value="troubleshooting" className="mt-4">
            <div className="text-sm text-muted-foreground mb-4">
              Having issues? Find solutions to common problems here.
            </div>
            <Accordion type="single" collapsible className="w-full">
              {helpContent.troubleshooting.map((item, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="hover:no-underline">{item.title}</AccordionTrigger>
                  <AccordionContent>{item.content}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        </Tabs>

        {/* Close button */}
        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Close Guide
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

