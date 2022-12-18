/* eslint-disable react/display-name */
import React, { forwardRef, ForwardRefExoticComponent } from 'react'
import { classNames as cs } from '../../utils/classNames'
import ToolbarLeft from './ToolbarLeft'
import ToolbarRight from './ToolbarRight'
import './styles.css'

interface ToolbarProps {
  title: string
  className?: string
  children: React.ReactNode | React.ReactNode[]
  onChange?: (e: React.FormEvent<HTMLFormElement>) => void
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  ref: React.Ref<HTMLFormElement>
}

interface IToolbarProps extends ForwardRefExoticComponent<ToolbarProps> {
  Left: typeof ToolbarLeft
  Right: typeof ToolbarRight
}
// Toolbar component
// It will render a toolbar with a title and two sides
// The left side will render the first ToolbarLeft component
// The right side will render the first ToolbarRight component
const Toolbar = forwardRef<HTMLFormElement, ToolbarProps>(
  ({ title, className, children, onSubmit }, ref) => {
    const Children = React.Children.toArray(children)
    const leftSide = () => {
      const leftChild = Children.find(
        (child) => React.isValidElement(child) && child.type === ToolbarLeft,
      )
      if (leftChild) {
        return leftChild as React.ReactElement
      }
      return null
    }

    const rightSide = () => {
      const rightSide = Children.find(
        (child) => React.isValidElement(child) && child.type === ToolbarRight,
      )
      if (rightSide) {
        return rightSide as React.ReactElement
      }
      return null
    }

    return (
      <div className={`${cs('toolbar', className)}`}>
        <form onSubmit={onSubmit} ref={ref}>
          <div className="toolbar-title">{title}</div>
          <div className="toolbar-actions">
            {leftSide()}
            <div className="toolbar-separator"> = </div>
            {rightSide()}
            <button className="toolbar-save">Save</button>
          </div>
        </form>
      </div>
    )
  },
) as IToolbarProps

Toolbar.Left = ToolbarLeft as typeof ToolbarLeft
Toolbar.Right = ToolbarRight as typeof ToolbarRight

export default Toolbar
