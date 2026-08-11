'use client'

import React from 'react'
import OrbitalUniverseView from './OrbitalUniverseView'

interface RoadmapLandingPageProps {
  onSelectUniverse: (universe: 'role' | 'dsa' | 'cs') => void
}

export default function RoadmapLandingPage({ onSelectUniverse }: RoadmapLandingPageProps) {
  return <OrbitalUniverseView onSelectUniverse={onSelectUniverse} />
}
