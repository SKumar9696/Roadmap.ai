import React, { useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import AppBar from '../../../components/AppBar'
import LoadingScreen from '../../../components/LoadingScreen'


const NAV_ITEMS = [
    { id: 'technical', label: 'Technical', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>) },
    { id: 'behavioral', label: 'Behavioral', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>) },
    { id: 'roadmap', label: 'Road Map', icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>) },
]

const SEVERITY_ORDER = { high: 0, medium: 1, low: 2 }

const scoreTier = (score) => (score >= 80 ? 'high' : score >= 60 ? 'mid' : 'low')

const VERDICT = {
    high: 'Strong match for this role',
    mid: 'Decent match with some gaps',
    low: 'Low match: work on the gaps first',
}

// ── Sub-components ────────────────────────────────────────────────────────────
const QuestionCard = ({ item, index }) => {
    const [ open, setOpen ] = useState(false)
    return (
        <div className={`q-card ${open ? 'q-card--open' : ''}`}>
            <button type='button' className='q-card__header' onClick={() => setOpen(o => !o)} aria-expanded={open}>
                <span className='q-card__index'>Q{index + 1}</span>
                <span className='q-card__question'>{item.question}</span>
                <span className='q-card__chevron' aria-hidden='true'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </span>
            </button>
            {open && (
                <div className='q-card__body'>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--intention'>Why they ask this</span>
                        <p>{item.intention}</p>
                    </div>
                    <div className='q-card__section'>
                        <span className='q-card__tag q-card__tag--answer'>How to answer</span>
                        <p>{item.answer}</p>
                    </div>
                </div>
            )}
        </div>
    )
}

const RoadMapDay = ({ day }) => (
    <li className='roadmap-day'>
        <div className='roadmap-day__header'>
            <span className='roadmap-day__badge'>Day {day.day}</span>
            <h3 className='roadmap-day__focus'>{day.focus}</h3>
        </div>
        <ul className='roadmap-day__tasks'>
            {day.tasks.map((task, i) => (
                <li key={i}>{task}</li>
            ))}
        </ul>
    </li>
)

// ── Main Component ────────────────────────────────────────────────────────────
const Interview = () => {
    const [ activeNav, setActiveNav ] = useState('technical')
    // useInterview() already loads the report for the :interviewId in the URL
    const { report, loading } = useInterview()
    const navigate = useNavigate()

    if (loading || !report) {
        return <LoadingScreen message='Loading your interview plan…' />
    }

    const tier = scoreTier(report.matchScore)
    const counts = {
        technical: report.technicalQuestions.length,
        behavioral: report.behavioralQuestions.length,
        roadmap: report.preparationPlan.length,
    }
    const skillGaps = [ ...report.skillGaps ].sort((a, b) => SEVERITY_ORDER[ a.severity ] - SEVERITY_ORDER[ b.severity ])

    return (
        <div className='interview-page'>
            <AppBar maxWidth={1280} />

            <header className='report-header'>
                <h1>{report.title || 'Interview plan'}</h1>
                {report.createdAt && (
                    <p>Generated on {new Date(report.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                )}
            </header>

            <div className='interview-layout'>

                {/* ── Left Nav ── */}
                <nav className='interview-nav' aria-label='Report sections'>
                    <button type='button' className='button ghost-button interview-nav__back' onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
                        Back to Home
                    </button>
                    <p className='interview-nav__label'>Sections</p>
                    {NAV_ITEMS.map(item => (
                        <button
                            type='button'
                            key={item.id}
                            className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                            aria-current={activeNav === item.id ? 'page' : undefined}
                            onClick={() => setActiveNav(item.id)}
                        >
                            <span className='interview-nav__icon'>{item.icon}</span>
                            <span className='interview-nav__text'>{item.label}</span>
                            <span className='interview-nav__count'>{counts[ item.id ]}</span>
                        </button>
                    ))}
                </nav>

                {/* ── Center Content ── */}
                <main className='interview-content'>
                    {activeNav === 'technical' && (
                        <section>
                            <div className='content-header'>
                                <h2>Technical Questions</h2>
                                <span className='content-header__count'>{counts.technical} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.technicalQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'behavioral' && (
                        <section>
                            <div className='content-header'>
                                <h2>Behavioral Questions</h2>
                                <span className='content-header__count'>{counts.behavioral} questions</span>
                            </div>
                            <div className='q-list'>
                                {report.behavioralQuestions.map((q, i) => (
                                    <QuestionCard key={i} item={q} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {activeNav === 'roadmap' && (
                        <section>
                            <div className='content-header'>
                                <h2>Preparation Road Map</h2>
                                <span className='content-header__count'>{counts.roadmap}-day plan</span>
                            </div>
                            <ol className='roadmap-list'>
                                {report.preparationPlan.map((day) => (
                                    <RoadMapDay key={day.day} day={day} />
                                ))}
                            </ol>
                        </section>
                    )}
                </main>

                {/* ── Right Sidebar ── */}
                <aside className='interview-sidebar'>

                    <div className='score-card'>
                        <p className='sidebar-label'>Match score</p>
                        <div
                            className='score-ring'
                            style={{ '--score': report.matchScore }}
                            role='img'
                            aria-label={`Match score ${report.matchScore} percent`}
                        >
                            <span className='score-ring__value'>{report.matchScore}<small>%</small></span>
                        </div>
                        <p className={`score-card__verdict score-card__verdict--${tier}`}>{VERDICT[ tier ]}</p>
                    </div>

                    <div className='skill-gaps'>
                        <p className='sidebar-label'>Skill gaps</p>
                        {skillGaps.length > 0 ? (
                            <>
                                <ul className='skill-gaps__list'>
                                    {skillGaps.map((gap, i) => (
                                        <li key={i} className={`skill-tag skill-tag--${gap.severity}`} title={`${gap.severity} priority`}>
                                            {gap.skill}
                                        </li>
                                    ))}
                                </ul>
                                <p className='skill-gaps__legend'>
                                    <span className='legend-dot legend-dot--high' />High
                                    <span className='legend-dot legend-dot--medium' />Medium
                                    <span className='legend-dot legend-dot--low' />Low priority
                                </p>
                            </>
                        ) : (
                            <p className='skill-gaps__empty'>No major gaps found for this role.</p>
                        )}
                    </div>

                </aside>
            </div>
        </div>
    )
}

export default Interview
