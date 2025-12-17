import Editor2D from './components/Editor2D'
import View3D from './components/View3D'
import Sidebar from './components/Sidebar'
import './App.css'

function App() {
  return (
    <div className="app-container">
      {/* 1. 側邊欄 */}
      <div className="panel-sidebar">
        <Sidebar />
      </div>

      {/* 2. 2D 編輯器 */}
      <div className="panel-2d">
        <Editor2D />
      </div>

      {/* 3. 3D 視圖 */}
      <div className="panel-3d">
        <View3D />
      </div>
    </div>
  )
}

export default App