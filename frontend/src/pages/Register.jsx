import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess, loginFailure } from '../store/authSlice'
import { registerUser } from '../api/auth'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { error } = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError(null)

    if (formData.password !== formData.confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas')
      return
    }

    try {
      setLoading(true)
      const data = await registerUser({
        username: formData.username,
        password: formData.password,
      })
      dispatch(loginSuccess(data))
      navigate('/')
    } catch (err) {
      dispatch(
        loginFailure(err.response?.data?.message || "Erreur d'inscription")
      )
      setFormError(err.response?.data?.message || "Erreur d'inscription")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom d'utilisateur:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            minLength="3"
            maxLength="20"
            required
          />
        </div>
        <div>
          <label>Mot de passe:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        <div>
          <label>Confirmer le mot de passe:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription...' : "S'inscrire"}
        </button>
        {(formError || error) && (
          <div style={{ color: 'red' }}>{formError || error}</div>
        )}
      </form>
    </div>
  )
}

export default Register
