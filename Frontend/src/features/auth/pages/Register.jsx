import React, { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import Sparkle from '../../../components/Sparkle'
import LoadingScreen from '../../../components/LoadingScreen'
import { APP_NAME } from '../../../config'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const { user, loading, handleRegister } = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        const result = await handleRegister({ username, email, password })
        if (result.ok) {
            navigate("/")
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

                <h1>Create your account</h1>
                <p className='auth-card__sub'>Get a tailored interview plan for any job description.</p>

                {error && <p className='auth-card__error' role='alert'>{error}</p>}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            value={username}
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' autoComplete='username' required
                            placeholder='Pick a username' />
                    </div>
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
                            type="password" id="password" name='password' autoComplete='new-password' required
                            placeholder='Choose a password' />
                    </div>

                    <button type='submit' className='button primary-button'>Create account</button>

                </form>

                <p className='auth-card__switch'>Already have an account? <Link to={"/login"}>Log in</Link></p>
            </div>
        </main>
    )
}

export default Register
