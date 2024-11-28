import { useDispatch, useSelector } from 'react-redux'
import { setSelectedColor } from '../../store/canvasSlice'

const ColorPicker = () => {
  const dispatch = useDispatch()
  const selectedColor = useSelector((state) => state.canvas.selectedColor)

  const colors = [
    '#000000',
    '#FFFFFF',
    '#FF0000',
    '#00FF00',
    '#0000FF',
    '#FFFF00',
    '#FF00FF',
    '#00FFFF',
    '#FFA500',
    '#800080',
  ]

  const handleColorSelect = (color) => {
    dispatch(setSelectedColor(color))
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '5px', margin: '10px' }}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorSelect(color)}
            style={{
              width: '30px',
              height: '30px',
              backgroundColor: color,
              border:
                selectedColor === color ? '3px solid black' : '1px solid gray',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default ColorPicker
