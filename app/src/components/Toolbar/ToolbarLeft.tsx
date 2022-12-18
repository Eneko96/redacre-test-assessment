interface ToolbarLeftProps {
  children: React.ReactNode
}

const ToolbarLeft: React.FC<ToolbarLeftProps> = ({ children }) => {
  return <div className="toolbar-left">{children}</div>
}

export default ToolbarLeft
