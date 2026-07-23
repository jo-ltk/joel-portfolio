'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Check, Copy, Mail, Moon, Sun, X } from 'lucide-react'
import CursorGrid from './components/CursorGrid'

const projects = [
  { no: '01', title: 'Oxyzen', type: 'Employment engagement platform', text: 'A responsive product experience powered by React context, TanStack Query, reusable hooks, and GraphQL data flows.', tags: ['React', 'TypeScript', 'GraphQL'], art: 'oxy', url: 'https://www.oxyzen.app/' },
  { no: '02', title: 'AntMascot', type: 'B2B procurement platform', text: 'A clean, accessible interface system built with Next.js, Tailwind, Shadcn and component-first thinking.', tags: ['Next.js', 'Tailwind', 'shadcn/ui'], art: 'ant', url: 'https://v2.antmascot.com/' },
  { no: '03', title: 'GuhaTek', type: 'Corporate web experience', text: 'The official company website: performant, responsive, and built to evolve with the business.', tags: ['Next.js', 'REST APIs', 'Performance'], art: 'guha', url: 'https://www.guhatek.com/' },
]
const freelanceProjects = [
  { no: 'F01', title: 'Joseph', type: 'Brand & commerce website', url: 'https://www.josephco.uk/', tags: ['Web design', 'Commerce'] },
  { no: 'F02', title: 'Shree Developers Group', type: 'Real-estate web presence', url: 'https://shreedevelopersgroup.com', tags: ['Responsive UI', 'Brand'] },
  { no: 'F03', title: 'Globetrek Tours', type: 'Premium travel experience', url: 'https://globetrek-tours-premium-travel-webs.vercel.app/', tags: ['Travel', 'Next.js'] },
  { no: 'F04', title: 'Flowboard', type: 'Platform experience', url: 'https://flowboard-platform.vercel.app/', tags: ['Platform', 'Frontend'] },
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
  const [light, setLight] = useState(false); const [accent, setAccent] = useState(accents[0]); const [menu, setMenu] = useState(false); const [copied, setCopied] = useState(false)
  const [cursor, setCursor] = useState({x:-100,y:-100}); const { scrollYProgress } = useScroll(); const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 28 })
  const heroY = useTransform(scrollYProgress, [0,.28], [0,180])
  useEffect(() => { document.documentElement.dataset.theme = light ? 'light' : 'dark'; document.documentElement.style.setProperty('--accent', accent.value) }, [light, accent])
  useEffect(() => { const f=(e:MouseEvent)=>setCursor({x:e.clientX,y:e.clientY}); window.addEventListener('mousemove',f); return()=>window.removeEventListener('mousemove',f) }, [])
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
  const copyEmail = async () => { await navigator.clipboard.writeText('joelthomas6094@gmail.com'); setCopied(true); setTimeout(()=>setCopied(false), 1500) }
  return <main onMouseMove={() => {}}>
    <motion.div className="progress" style={{ scaleX: progress }} />
    <div className="cursor" style={{transform:`translate(${cursor.x}px,${cursor.y}px)`}} />
    <div className="grain" />
    <header><a className="brand" href="#top">JL<span>®</span></a><nav><a href="#work">Selected work</a><a href="#about">About</a><a href="#contact">Contact</a></nav><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X/>:<span>Menu</span>}</button></header>
    {menu && <motion.div initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} className="mobile-menu"><a href="#work" onClick={()=>setMenu(false)}>Selected work</a><a href="#about" onClick={()=>setMenu(false)}>About</a><a href="#contact" onClick={()=>setMenu(false)}>Contact</a></motion.div>}
    <aside className="customizer"><button onClick={()=>setLight(!light)} aria-label="Switch colour mode">{light?<Moon size={17}/>:<Sun size={17}/>}</button><div className="divider" />{accents.map(a=><button key={a.name} aria-label={`${a.name} accent`} className={`swatch ${accent.name===a.name?'active':''}`} style={{background:a.value}} onClick={()=>setAccent(a)} />)}</aside>
    <section id="top" className="hero">
      <motion.div className="hero-inner" style={{y:heroY}}><p className="eyebrow"><i /> Software engineer · India</p><h1>BUILDING<br/><em>quietly bold</em><br/>digital things.</h1><p className="hero-copy">I’m Joel Thomas — a frontend-focused software engineer creating clear, high-performing web experiences where technology feels human.</p><div className="hero-actions"><Magnetic className="pill primary">Explore my work <ArrowDownRight size={18}/></Magnetic><a className="text-link" href="#about">A little more about me <ArrowDownRight size={16}/></a></div></motion.div>
    </section>
    <section id="work" className="work section"><div className="section-head"><p className="eyebrow"><i /> Selected projects</p><h2>A few things<br/>I’ve helped <em>move.</em></h2><p>Thoughtful interfaces, durable component systems, and pragmatic engineering — made for people, not portfolios.</p></div>
      <div className="project-list">{projects.map((p,i)=><motion.article className={`project ${p.art}`} key={p.title} initial={{opacity:0,y:70}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-10%'}} transition={{duration:.75,delay:i*.08}}><div className="project-meta"><span>{p.no}</span><span>{p.type}</span></div><div className="project-art"><div className="art-grid"/><div className="project-mark">{p.title.slice(0,1)}</div><div className="floating-card">{p.title === 'Oxyzen' ? 'Work, connected.' : p.title === 'AntMascot' ? 'procure / better' : 'Build with intent'}</div></div><div className="project-info"><div><h3>{p.title}</h3><p>{p.text}</p></div><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></div><a className="project-arrow" href={p.url} target="_blank" rel="noreferrer" aria-label={`Open ${p.title}`}><ArrowUpRight /></a></motion.article>)}</div>
      <div className="freelance-heading"><p className="eyebrow"><i /> Independent work</p><h3>Freelance<br/><em>collaborations.</em></h3><p>A growing collection of live digital experiences made for ambitious brands and teams.</p></div>
      <div className="freelance-grid">{freelanceProjects.map((p,i)=><motion.a className="freelance-card" key={p.title} href={p.url} target="_blank" rel="noreferrer" initial={{opacity:0,y:35}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:.55,delay:(i%4)*.06}}><span className="freelance-no">{p.no}</span><span className="freelance-arrow"><ArrowUpRight size={19}/></span><div><h3>{p.title}</h3><p>{p.type}</p></div><div className="tags">{p.tags.map(t=><span key={t}>{t}</span>)}</div></motion.a>)}</div>
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
            <a href="https://www.linkedin.com/in/joel-thomas-89152a288/" target="_blank" rel="noreferrer">in LinkedIn</a>
            <a href="https://github.com/jo-ltk" target="_blank" rel="noreferrer">gh GitHub</a>
            <a href="mailto:joelthomas6094@gmail.com"><Mail/> Email</a>
          </div>
        </div>
      </div>
    </section>
    <footer><span>© 2026 JOEL THOMAS</span><span>Crafted with care &amp; caffeine</span><a href="#top">Back to top ↑</a></footer>
  </main>
}
