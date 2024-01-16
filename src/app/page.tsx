import Image from 'next/image'
import MainCanvas from '@/app/components/MainCanvas/index'

export default function Home() {
  return (
    <main style={{ width: '100%', height: '100vh' }}>
      <MainCanvas />
    </main>
  )
}
