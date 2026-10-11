import React, { useState } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import AppBar from '../../../components/AppBar'
import Sparkle from '../../../components/Sparkle'
import LoadingScreen from '../../../components/LoadingScreen'

const MAX_RESUME_MB = 3 // must match the multer limit in Backend/src/middlewares/file.middleware.js
const MAX_JD_CHARS = 5000

const scoreTier = (score) => (score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low')

const formatSize = (bytes) =>
    bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`

const Home = () => {

    const { loading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    // Kept in React state (not only in the <input>) so it survives the loading
    // screen and is still attached if you retry after an error.
    const [ resumeFile, setResumeFile ] = useState(null)
    const [ error, setError ] = useState("")

    const navigate = useNavigate()

    const pickResume = (file) => {
        if (!file) return
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setError("Resume must be a PDF file.")
            return
        }
        if (file.size > MAX_RESUME_MB * 1024 * 1024) {
            setError(`Resume is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_RESUME_MB} MB.`)
            return
        }
        setError("")
        setResumeFile(file)
    }

    const handleGenerateReport = async () => {
        if (!jobDescription.trim()) {
            setError("Paste the job description first.")
            return
        }
        if (!resumeFile && !selfDescription.trim()) {
            setError("Upload a PDF resume or write a short self-description.")
            return
        }
        setError("")
        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            navigate(`/interview/${data._id}`)
        } catch (err) {
            console.log(err)
            setError(err?.response?.data?.message || "Couldn't generate your plan. Check that the backend is running, then try again.")
        }
    }

    if (loading) {
        return <LoadingScreen message='Building your interview plan… this takes about 30 seconds.' />
    }

    return (
        <div className='home-page'>

            <AppBar maxWidth={900} />

            {/* Page Header */}
            <header className='page-header'>
                <span className='page-header__bar' aria-hidden='true' />
                <h1>
                    <Sparkle size={30} className='page-header__sparkle' />
                    Create Your Custom <span className='highlight'>Interview Plan</span>
                </h1>
                <p>Let our AI analyze the job requirements and your unique profile to build a winning strategy.</p>
            </header>

            {/* Main Card */}
            <div className='interview-card'>
                <div className='interview-card__body'>

                    {/* Left Panel - Job Description */}
                    <section className='panel panel--left' aria-labelledby='jd-title'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                            </span>
                            <h2 id='jd-title'>Target Job Description</h2>
                            <span className='badge'>Required</span>
                        </div>
                        <div className='panel__field'>
                            <textarea
                                aria-labelledby='jd-title'
                                value={jobDescription}
                                onChange={(e) => { setJobDescription(e.target.value) }}
                                className='panel__textarea'
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
                                maxLength={MAX_JD_CHARS}
                            />
                            <span className='char-counter'>{jobDescription.length} / {MAX_JD_CHARS} chars</span>
                        </div>
                    </section>

                    {/* Vertical Divider */}
                    <div className='panel-divider' />

                    {/* Right Panel - Profile */}
                    <section className='panel panel--right' aria-labelledby='profile-title'>
                        <div className='panel__header'>
                            <span className='panel__icon'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                            </span>
                            <h2 id='profile-title'>Your Profile</h2>
                        </div>

                        {/* Upload Resume */}
                        <div className='upload-section'>
                            <span className='section-label'>
                                Upload Resume
                                <span className='badge'>Best Results</span>
                            </span>
                            <label
                                className={`dropzone ${resumeFile ? 'dropzone--selected' : ''}`}
                                htmlFor='resume'
                                onDragOver={(e) => { e.preventDefault() }}
                                onDrop={(e) => {
                                    e.preventDefault()
                                    pickResume(e.dataTransfer.files[ 0 ])
                                }}
                            >
                                <span className='dropzone__icon'>
                                    {resumeFile ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><polyline points="9 15 11 17 15 13" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                    )}
                                </span>
                                <p className='dropzone__title'>
                                    {resumeFile ? resumeFile.name : 'Click to upload or drag & drop'}
                                </p>
                                <p className='dropzone__subtitle'>
                                    {resumeFile
                                        ? `${formatSize(resumeFile.size)}, click to change`
                                        : `PDF only (Max ${MAX_RESUME_MB}MB)`}
                                </p>
                                <input
                                    hidden
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,application/pdf'
                                    onChange={(e) => {
                                        pickResume(e.target.files[ 0 ])
                                        e.target.value = "" // lets you pick the same file again after changing it
                                    }}
                                />
                            </label>
                        </div>

                        {/* OR Divider */}
                        <div className='or-divider'><span>OR</span></div>

                        {/* Quick Self-Description */}
                        <div className='self-description'>
                            <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                            <textarea
                                value={selfDescription}
                                onChange={(e) => { setSelfDescription(e.target.value) }}
                                id='selfDescription'
                                name='selfDescription'
                                className='panel__textarea panel__textarea--short'
                                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                            />
                        </div>

                        {/* Info Box */}
                        <div className='info-box'>
                            <span className='info-box__icon' aria-hidden='true'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="currentColor" /><line x1="12" y1="11" x2="12" y2="16.5" stroke="#0a2a56" strokeWidth="2.2" strokeLinecap="round" /><circle cx="12" cy="7.6" r="1.3" fill="#0a2a56" /></svg>
                            </span>
                            <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to generate a personalized plan.</p>
                        </div>
                    </section>
                </div>

                {/* Card Footer */}
                <div className='interview-card__footer'>
                    {error ? (
                        <p className='footer-info footer-info--error' role='alert'>{error}</p>
                    ) : (
                        <p className='footer-info'>
                            <Sparkle size={16} variant='solid' className='footer-info__icon' />
                            AI-Powered Strategy Generation &bull; Approx 30s
                        </p>
                    )}
                    <button
                        type='button'
                        onClick={handleGenerateReport}
                        className='generate-btn'>
                        <Sparkle size={16} variant='solid' />
                        Generate My Interview Strategy
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                    </button>
                </div>
            </div>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className='recent-reports' aria-labelledby='recent-title'>
                    <h2 id='recent-title'>My Recent Interview Plans</h2>
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id}>
                                <button type='button' className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <span className='report-item__title'>{report.title || 'Untitled Position'}</span>
                                    <span className='report-item__meta'>
                                        Generated on {new Date(report.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </span>
                                    <span className={`report-item__score report-item__score--${scoreTier(report.matchScore)}`}>
                                        {report.matchScore}% match
                                    </span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    )
}

export default Home
