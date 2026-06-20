'use client'

import dynamic from 'next/dynamic'

const MakScene = dynamic(() => import('./MakScene'), { ssr: false })

export default function MakPage() {
  return (
    <main style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <MakScene />
    </main>
  )
}
