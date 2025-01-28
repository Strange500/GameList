"use client";
import Image from 'next/image'
import { useTheme } from 'next-themes'

function ThemeLogo() {
  const { resolvedTheme } = useTheme()
  let src

  switch (resolvedTheme) {
    case 'light':
      src = '/logo.png'
      break
    case 'dark':
      src = '/logo-light.png'
      break
    default:
      src = '/logo-light.png'
      break
  }

  return <Image suppressHydrationWarning src={src} width={130} height={130} alt='logo' />
}

export default ThemeLogo;