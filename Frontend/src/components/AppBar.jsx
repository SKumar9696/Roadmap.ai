import { Link } from 'react-router'
import { useAuth } from '../features/auth/hooks/useAuth'
import { APP_NAME } from '../config'
import Sparkle from './Sparkle'
import './app-bar.scss'

/**
 * Top bar for logged-in pages: app name (links home) on the left,
 * the signed-in username and a Log out button on the right.
 */
const AppBar = ({ maxWidth = 900 }) => {
    const { user, handleLogout } = useAuth()

    return (
        <header className='app-bar' style={{ maxWidth }}>
            <Link to='/' className='app-bar__brand'>
                <Sparkle size={20} />
                <span>{APP_NAME}</span>
            </Link>
            <div className='app-bar__user'>
                {user && <span className='app-bar__name'>{user.username}</span>}
                <button type='button' className='button ghost-button' onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </header>
    )
}

export default AppBar
