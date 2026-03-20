import {
  type HTMLAttributes,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PropsWithChildren,
} from 'react'

type RevealProps = PropsWithChildren<{
  className?: string
  delay?: number
  as?: 'div' | 'section' | 'article' | 'header'
}> &
  HTMLAttributes<HTMLElement>

export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
  ...rest
}: RevealProps) {
  const [visible, setVisible] = useState(false)
  const ref = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const node = ref.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  const Component = as
  const style = { transitionDelay: `${delay}ms` } as CSSProperties

  return (
    <Component
      ref={ref as never}
      className={`reveal${visible ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  )
}
