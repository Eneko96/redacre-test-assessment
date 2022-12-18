interface ToolbarRightProps {
  children: React.ReactNode
}

const ToolbarRight: React.FC<ToolbarRightProps> = ({ children }) => {
  return <div className="toolbar-right">{children}</div>
}

export default ToolbarRight
