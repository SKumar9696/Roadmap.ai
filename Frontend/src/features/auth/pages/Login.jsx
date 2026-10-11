import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import Sparkle from '../../../components/Sparkle'
import LoadingScreen from '../../../components/LoadingScreen'
import { APP_NAME } from '../../../config'

const Login = () => {

    const { user, loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleLogin({ email, password })
        if (result.ok) {
            navigate('/')
        } else {
            setError(result.message)
        }
    }

    if (loading) {
        return <LoadingScreen />
    }

    // Already logged in: go straight to the app
    if (user) {
        return <Navigate to='/' replace />
    }

    return (
        <main className='auth-page'>
            <div className='auth-card'>
                <div className='auth-card__brand'>
                    <span className='auth-card__bar' aria-hidden='true' />
                    <span className='auth-card__name'><Sparkle size={22} />{APP_NAME}</span>
                </div>

                <h1>Welcome back</h1>
                <p className='auth-card__sub'>Log in to see your interview plans.</p>

                {error && <p className='auth-card__error' role='alert'>{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            value={email}
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' autoComplete='email' required
                            placeholder='you@example.com' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            value={password}
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' autoComplete='current-password' required
                            placeholder='Your password' />
                    </div>
                    <button type='submit' className='button primary-button'>Log in</button>
                </form>

                <p className='auth-card__switch'>Don't have an account? <Link to={"/register"}>Create one</Link></p>
            </div>
        </main>
    )
}

export default Login
