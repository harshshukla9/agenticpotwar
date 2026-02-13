import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: 'Bid on Pot War',
    action: {
      type: 'launch_frame',
      name: 'Pot War | Make Your First ARB',
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: '#f7f7f7',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Pot War | Make Your First ARB',
    openGraph: {
      title: 'Pot War | Make Your First ARB',
      description: 'The last depositor wins the entire pool. Strategy, timing and a bit of luck!',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
