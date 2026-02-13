import type { SafeAreaInsets } from '@/types'

interface SafeAreaContainerProps {
  children: React.ReactNode
  insets?: SafeAreaInsets
}

export const SafeAreaContainer = ({
  children,
  insets,
}: SafeAreaContainerProps) => (
  <main
    className="flex min-h-[100dvh] w-full flex-col overflow-hidden"
    style={{
      paddingTop: insets?.top ?? 0,
      paddingBottom: insets?.bottom ?? 0,
      paddingLeft: insets?.left ?? 0,
      paddingRight: insets?.right ?? 0,
    }}
  >
    {children}
  </main>
)
