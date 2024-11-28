import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  setPixels,
  updatePixel,
  setLoading,
  setError,
} from '../../store/canvasSlice'
import { getCanvas, placePixel } from '../../api/pixel'
import { getSocket, initializeSocket } from '../../api/socket'
import ColorPicker from './ColorPicker'

const PIXEL_SIZE = 10
const CANVAS_WIDTH = 100
const CANVAS_HEIGHT = 100

const Canvas = () => {
  const canvasRef = useRef(null)
  const dispatch = useDispatch()
  const { pixels, selectedColor, loading } = useSelector(
    (state) => state.canvas
  )
  const { token } = useSelector((state) => state.auth)
  const [isDrawing, setIsDrawing] = useState(false)

  useEffect(() => {
    if (token) {
      const socket = initializeSocket(token)

      socket.on('pixelUpdate', ({ x, y, color }) => {
        dispatch(updatePixel({ x, y, color }))
      })

      loadCanvas()

      return () => {
        socket.disconnect()
      }
    }
  }, [token, dispatch])

  useEffect(() => {
    drawCanvas()
  }, [pixels])

  const loadCanvas = async () => {
    try {
      dispatch(setLoading(true))
      const canvasData = await getCanvas()
      dispatch(setPixels(canvasData))
    } catch (error) {
      dispatch(setError('Erreur lors du chargement du canvas'))
    } finally {
      dispatch(setLoading(false))
    }
  }

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = '#ddd'
    for (let i = 0; i <= CANVAS_WIDTH; i++) {
      ctx.beginPath()
      ctx.moveTo(i * PIXEL_SIZE, 0)
      ctx.lineTo(i * PIXEL_SIZE, CANVAS_HEIGHT * PIXEL_SIZE)
      ctx.stroke()
    }
    for (let i = 0; i <= CANVAS_HEIGHT; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * PIXEL_SIZE)
      ctx.lineTo(CANVAS_WIDTH * PIXEL_SIZE, i * PIXEL_SIZE)
      ctx.stroke()
    }

    Object.entries(pixels).forEach(([coord, color]) => {
      const [x, y] = coord.split(',').map(Number)
      ctx.fillStyle = color
      ctx.fillRect(x * PIXEL_SIZE, y * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE)
    })
  }

  const handleCanvasClick = async (e) => {
    if (loading || !token) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / PIXEL_SIZE)
    const y = Math.floor((e.clientY - rect.top) / PIXEL_SIZE)

    if (x >= 0 && x < CANVAS_WIDTH && y >= 0 && y < CANVAS_HEIGHT) {
      try {
        await placePixel(x, y, selectedColor)
      } catch (error) {
        dispatch(setError('Erreur lors du placement du pixel'))
      }
    }
  }

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <ColorPicker />
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH * PIXEL_SIZE}
        height={CANVAS_HEIGHT * PIXEL_SIZE}
        onClick={handleCanvasClick}
        style={{ border: '1px solid black' }}
      />
    </div>
  )
}

export default Canvas
