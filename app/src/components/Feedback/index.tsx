import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import './styles.css'

// Feedback component
// This component will show a feedback message
// for 3 seconds and then will be removed
export const Feedback = ({
  text,
  onClose,
}: {
  text: string
  onClose: (e: string) => any
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose('')
    }, 3000)
    return () => clearTimeout(timer)
  }, [text])

  if (text) {
    return createPortal(
      <div className="feedback">
        <div className="feedback-text">{text}</div>
      </div>,
      document.getElementById('root') as HTMLElement,
    )
  }
  return null
}
