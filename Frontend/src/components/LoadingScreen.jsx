const LoadingScreen = ({ message = 'Loading…' }) => (
    <main className='loading-screen' role='status' aria-live='polite'>
        <span className='loading-screen__spinner' aria-hidden='true' />
        <p className='loading-screen__text'>{message}</p>
    </main>
)

export default LoadingScreen
