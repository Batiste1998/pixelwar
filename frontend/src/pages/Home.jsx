import Canvas from '../components/canvas/Canvas'
import ChatBox from '../components/chat/ChatBox'

const Home = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Pixel War</h1>
      <div className="mb-8">
        <Canvas />
      </div>
      <div className="border rounded shadow-lg">
        <ChatBox />
      </div>
    </div>
  )
}

export default Home
