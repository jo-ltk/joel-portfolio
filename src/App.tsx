'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Briefcase, Check, Copy, Home, Mail, Moon, Sun, User } from 'lucide-react'
import CursorGrid from './components/CursorGrid'
import Dock from './components/Dock'
import Folder from './components/Folder'
import SideRays from './components/SideRays'
import SiteMetaPreview from './components/SiteMetaPreview'

function LinkedinIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function GithubIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  )
}

const projects = [
  { no: '01', title: 'Oxyzen', type: 'Employment engagement platform', text: 'A responsive product experience powered by React context, TanStack Query, reusable hooks, and GraphQL data flows.', tags: ['React', 'TypeScript', 'GraphQL'], art: 'oxy', url: 'https://www.oxyzen.app/' },
  { no: '02', title: 'AntMascot', type: 'B2B procurement platform', text: 'A clean, accessible interface system built with Next.js, Tailwind, Shadcn and component-first thinking.', tags: ['Next.js', 'Tailwind', 'shadcn/ui'], art: 'ant', url: 'https://v2.antmascot.com/' },
  { no: '03', title: 'GuhaTek', type: 'Corporate web experience', text: 'The official company website: performant, responsive, and built to evolve with the business.', tags: ['Next.js', 'REST APIs', 'Performance'], art: 'guha', url: 'https://www.guhatek.com/' },
]
const freelanceProjects = [
  { no: 'F01', title: 'Joseph', type: 'Brand & commerce website', url: 'https://www.josephco.uk/', tags: ['Web design', 'Commerce'] },
  { no: 'F02', title: 'Shree Developers Group', type: 'Real-estate web presence', url: 'https://shreedevelopersgroup.com', tags: ['Responsive UI', 'Brand'] },
  { no: 'F03', title: 'Globetrek Tours', type: 'Premium travel experience', url: 'https://globetrek-tours-premium-travel-webs.vercel.app/', tags: ['Travel', 'Next.js'] },
  { no: 'F04', title: 'DOHaD India', type: 'Research society website', url: 'https://dohadindia.org/', tags: ['Research', 'Web design'] },
  { no: 'F05', title: 'The Pact', type: 'Brand website', url: 'https://thepact.in/', tags: ['Web design', 'UI'] },
  { no: 'F06', title: 'Dress Codes', type: 'Fashion & commerce website', url: 'https://dresscodes.in/', tags: ['Commerce', 'Responsive UI'] },
  { no: 'F07', title: 'World Safari', type: 'Travel website', url: 'https://www.worldsafari.in/', tags: ['Travel', 'UX'] },
  { no: 'F08', title: 'Pay Pilot', type: 'Payments product interface', url: 'https://pay-pilot-one.vercel.app/', tags: ['Fintech', 'Product UI'] },
]
const accents = [{ name: 'Mono', value: '#d9d9d9' }, { name: 'Blue', value: '#72a7ff' }, { name: 'Lime', value: '#baff5d' }, { name: 'Violet', value: '#b49bff' }]

function Magnetic({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null)
  const move = (e: React.MouseEvent) => { const b = ref.current?.getBoundingClientRect(); if (b) ref.current!.style.transform = `translate(${(e.clientX-b.left-b.width/2)*.12}px, ${(e.clientY-b.top-b.height/2)*.12}px)` }
  return <a ref={ref} onMouseMove={move} onMouseLeave={() => ref.current && (ref.current.style.transform='translate(0,0)')} className={`magnetic ${className}`} href="#contact">{children}</a>
}

export default function App() {
  const [light, setLight] = useState(false); const [accent, setAccent] = useState(accents[0]); const [copied, setCopied] = useState(false)
  const [customizerOpen, setCustomizerOpen] = useState(true)
  const customizerRef = useRef<HTMLElement>(null)
  const [activeHref, setActiveHref] = useState('#top')
  const [cursor, setCursor] = useState({x:-100,y:-100}); const { scrollYProgress } = useScroll(); const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })
  const heroY = useTransform(scrollYProgress, [0,.28], [0,180])
  useEffect(() => { document.documentElement.dataset.theme = light ? 'light' : 'dark'; document.documentElement.style.setProperty('--accent', accent.value) }, [light, accent])
  useEffect(() => { const f=(e:MouseEvent)=>setCursor({x:e.clientX,y:e.clientY}); window.addEventListener('mousemove',f); return()=>window.removeEventListener('mousemove',f) }, [])
  useEffect(() => {
    if (!customizerOpen) return
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node
      if (customizerRef.current && !customizerRef.current.contains(target)) setCustomizerOpen(false)
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCustomizerOpen(false) }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('touchstart', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('touchstart', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [customizerOpen])
  useEffect(() => {
    const sectionIds = ['top', 'work', 'about', 'contact']
    const onScroll = () => {
      const marker = window.scrollY + window.innerHeight * 0.28
      let current = '#top'
      for (const id of sectionIds) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= marker) current = `#${id}`
      }
      setActiveHref(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const title = document.querySelector<HTMLElement>('.hero h1')
    if (!title || title.dataset.split === 'true') return
    const walker = document.createTreeWalker(title, NodeFilter.SHOW_TEXT)
    const nodes: Text[] = []
    while (walker.nextNode()) nodes.push(walker.currentNode as Text)
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment()
      Array.from(node.textContent || '').forEach((character, index) => {
        const span = document.createElement('span')
        span.className = 'hero-char'
        span.style.setProperty('--char-index', String(index))
        span.textContent = character === ' ' ? '\u00a0' : character
        fragment.appendChild(span)
      })
      node.replaceWith(fragment)
    })
    title.dataset.split = 'true'
  }, [])
  const goTo = (href: string) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }
  const dockItems = useMemo(() => [
    { icon: <Home size={18} strokeWidth={1.75} />, label: 'Home', onClick: () => goTo('#top') },
    { icon: <Briefcase size={18} strokeWidth={1.75} />, label: 'Work', onClick: () => goTo('#work') },
    { icon: <User size={18} strokeWidth={1.75} />, label: 'About', onClick: () => goTo('#about') },
    { icon: <Mail size={18} strokeWidth={1.75} />, label: 'Contact', onClick: () => goTo('#contact') },
  ], [])
  const activeDockLabel = ({ '#top': 'Home', '#work': 'Work', '#about': 'About', '#contact': 'Contact' } as const)[activeHref as '#top' | '#work' | '#about' | '#contact'] ?? 'Home'
  const copyEmail = async () => { await navigator.clipboard.writeText('joelthomas6094@gmail.com'); setCopied(true); setTimeout(()=>setCopied(false), 1500) }
  return <main onMouseMove={() => {}}>
    <motion.div className="progress" style={{ scaleX: progress }} />
    <div className="cursor" style={{transform:`translate(${cursor.x}px,${cursor.y}px)`}} />
    <div className="grain" />
    <header><a className="brand" href="#top">JL<span>®</span></a><nav><a href="#work">Selected work</a><a href="#about">About</a><a href="#contact">Contact</a></nav></header>
    <div className="mobile-dock" aria-hidden={false}>
      <Dock
        items={dockItems}
        activeLabel={activeDockLabel}
        panelHeight={68}
        baseItemSize={48}
        magnification={62}
        distance={140}
      />
    </div>
    <aside ref={customizerRef} className={`customizer${customizerOpen ? ' is-open' : ''}`}>
      <button
        type="button"
        className="customizer-fab"
        aria-label={customizerOpen ? 'Close theme controls' : 'Open theme controls'}
        aria-expanded={customizerOpen}
        aria-controls="customizer-panel"
        onClick={() => setCustomizerOpen((open) => !open)}
      >
        <span className="customizer-fab-swatch" style={{ background: accent.value }} />
      </button>
      <div
        id="customizer-panel"
        className="customizer-panel"
        role="group"
        aria-label="Theme and accent"
        aria-hidden={!customizerOpen}
        inert={!customizerOpen ? true : undefined}
      >
        <button type="button" className="customizer-mode" onClick={() => setLight(!light)} aria-label="Switch colour mode">{light ? <Moon size={17} strokeWidth={1.75} /> : <Sun size={17} strokeWidth={1.75} />}</button>
        <div className="divider" />
        {accents.map((a) => (
          <button
            key={a.name}
            type="button"
            aria-label={`${a.name} accent`}
            aria-pressed={accent.name === a.name}
            className={`swatch${accent.name === a.name ? ' active' : ''}`}
            style={{ background: a.value }}
            onClick={() => setAccent(a)}
          />
        ))}
      </div>
    </aside>
    <section id="top" className="hero">
      <div className="hero-rays" aria-hidden="true">
        <SideRays
          speed={1.6}
          rayColor1={accent.value}
          rayColor2={light ? '#a8b4c4' : '#6e7f96'}
          intensity={light ? 1.8 : 2.6}
          spread={2.1}
          origin="top-right"
          tilt={-4}
          saturation={accent.name === 'Mono' ? 0.65 : 1.35}
          blend={0.55}
          falloff={1.45}
          opacity={light ? 0.75 : 0.95}
        />
      </div>
      <div className="orb one" aria-hidden="true" />
      <div className="orbit orbit-a" aria-hidden="true" />
      <div className="orbit orbit-b" aria-hidden="true" />
      <motion.div className="hero-inner" style={{y:heroY}}>
        <p className="eyebrow"><i /> Software engineer · India</p>
        <h1>BUILDING<br/><em>quietly bold</em><br/>digital things.</h1>
        <p className="hero-copy">I’m Joel Thomas , a frontend-focused software engineer creating clear, high-performing web experiences where technology feels human.</p>
        <div className="hero-actions">
          <Magnetic className="pill primary">Explore my work <ArrowDownRight size={18}/></Magnetic>
          <a className="text-link" href="#about">A little more about me <ArrowDownRight size={16}/></a>
        </div>
      </motion.div>
     
    </section>
    <section id="work" className="work section"><div className="section-head"><p className="eyebrow"><i /> Selected projects</p><h2>Office work<br/>I’ve helped <em>ship.</em></h2><p>Product platforms and company sites from my office collaborations — clear interfaces, durable systems, pragmatic engineering.</p></div>
      <div className="office-folders">{projects.map((p,i)=><motion.article className="office-folder" key={p.title} initial={{opacity:0,y:36}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-8%'}} transition={{duration:.55,delay:i*.08}}>
        <div className="office-folder-stage">
          <Folder
            color={accent.value}
            size={1}
            label={p.title}
            items={[
              <div className="paper-sheet">
                <span className="paper-kicker">{p.no} · Project</span>
                <strong>{p.title}</strong>
                <em>{p.type}</em>
              </div>,
              <div className="paper-sheet">
                <span className="paper-kicker">Built with</span>
                <div className="paper-tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
              </div>,
              <a className="paper-sheet paper-cta" href={p.url} target="_blank" rel="noreferrer">
                <span className="paper-kicker">Link</span>
                <strong>View live site</strong>
                <span className="paper-open">Open <ArrowUpRight size={13}/></span>
              </a>,
            ]}
          />
        </div>
        <div className="office-folder-copy">
          <span className="office-no">{p.no}</span>
          <h3>{p.title}</h3>
          <p className="office-type">{p.type}</p>
          <div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div>
          <a className="office-link" href={p.url} target="_blank" rel="noreferrer">View live <ArrowUpRight size={15}/></a>
        </div>
      </motion.article>)}</div>
      <div className="freelance-heading"><p className="eyebrow"><i /> Independent work</p><h3>Freelance<br/><em>collaborations.</em></h3><p>A growing collection of live digital experiences made for ambitious brands and teams.</p></div>
      <div className="freelance-grid">{freelanceProjects.map((p,i)=><motion.a className="freelance-card" key={p.title} href={p.url} target="_blank" rel="noreferrer" initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.55,delay:(i%4)*.06}}><span className="freelance-no">{p.no}</span><span className="freelance-arrow"><ArrowUpRight size={19}/></span><SiteMetaPreview url={p.url} /><div className="freelance-meta"><h3>{p.title}</h3><p>{p.type}</p><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div></motion.a>)}</div>
    </section>
    <section id="about" className="about section"><div className="about-number">02</div><div className="about-copy"><p className="eyebrow"><i /> The person behind the pixels</p><h2>Design-trained.<br/><em>Engineering-minded.</em></h2><p className="large">My visual arts background taught me to notice what others skip. Now I bring that instinct to React, Next.js, and TypeScript — shaping product UI that is both useful and unmistakably considered.</p><div className="facts"><div><b>3+</b><span>years shaping digital work</span></div><div><b>∞</b><span>curiosity for better systems</span></div><div><b>01</b><span>creative brain, technical heart</span></div></div></div><div className="about-visual"><div className="portrait"><span>JL</span><div className="portrait-line"/></div><p>BA Visual Arts<br/>MG University</p><p>Now building from<br/>Chennai / Hybrid</p></div></section>
    <section className="capabilities section"><p className="eyebrow"><i /> What I work with</p><div className="skills">{['React.js','Next.js','TypeScript','Tailwind CSS','GraphQL','REST APIs','TanStack Query','Redux Toolkit','Generative AI','AWS + Docker'].map((x,i)=><motion.div key={x} initial={{opacity:0,x:-30}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*.035}}><span>{String(i+1).padStart(2,'0')}</span>{x}<ArrowUpRight size={18}/></motion.div>)}</div></section>
    <section id="contact" className="contact">
      <div className="contact-grid" aria-hidden="true">
        <CursorGrid
          cellSize={56}
          color="#111111"
          radius={130}
          falloff="smooth"
          holdTime={380}
          fadeDuration={900}
          lineWidth={1.15}
          maxOpacity={0.85}
          fillOpacity={0.06}
          gridOpacity={0.08}
          cellRadius={0}
          clickPulse
          pulseSpeed={520}
        />
      </div>
      <div className="contact-body">
        <p className="eyebrow"><i /> Let’s make something count</p>
        <h2>Have an idea?<br/><em>Let’s give it life.</em></h2>
        <div className="contact-bottom">
          <button className="email" onClick={copyEmail}>{copied?<><Check/> Copied</>:<>joelthomas6094@gmail.com <Copy/></>}</button>
          <div className="socials">
            <a href="https://www.linkedin.com/in/joel-thomas-89152a288/" target="_blank" rel="noreferrer"><LinkedinIcon /> LinkedIn</a>
            <a href="https://github.com/jo-ltk" target="_blank" rel="noreferrer"><GithubIcon /> GitHub</a>
            <a href="mailto:joelthomas6094@gmail.com"><Mail size={20} strokeWidth={1.75} /> Email</a>
          </div>
        </div>
      </div>
    </section>
    <footer><span>© 2026 JOEL THOMAS</span><span>Crafted with care &amp; caffeine</span><a href="#top">Back to top ↑</a></footer>
  </main>
}
