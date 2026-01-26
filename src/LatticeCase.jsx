import React, { useState } from 'react';

// ============================================
// LATTICE: Next-Gen Experiment Tracking
// Tabbed Case Study
// ============================================

const defined = {
  bg: { primary: '#FDFCFA', secondary: '#F8F6F3', tertiary: '#F0EDE8', inverse: '#18181B' },
  text: { primary: '#18181B', secondary: '#52525B', muted: '#A1A1AA', inverse: '#FAFAFA' },
  accent: { primary: '#6366F1', danger: '#EF4444', warning: '#F59E0B', success: '#10B981' },
  border: { light: '#E4E4E7', medium: '#D4D4D8' },
};

// ============================================
// DATA
// ============================================

const personas = [
  {
    id: 'liam',
    name: 'Liam R.',
    role: 'PhD Candidate, Computer Vision',
    org: 'Top-10 CS Program, 3rd Year',
    photo: 'L',
    context: 'Working on efficient vision transformers. Needs to reproduce SOTA papers before extending them. Limited compute budget, working mostly alone.',
    quote: "I spend more time trying to reproduce papers than actually doing novel research. Last month I burned two weeks trying to match numbers from a CVPR paper — the authors never responded to my emails, and their code was broken on three different dependency versions.",
    tools: 'W&B (free tier), Jupyter notebooks, custom bash scripts',
    compute: '~$200/month (university credits)',
    team: 'Solo researcher with weekly advisor check-ins',
    frustrations: [
      'Reproduction is lonely — no way to know if others have tried and failed',
      'Lost 3 months of experiment notes when laptop crashed',
      'Cannot remember reasoning behind experiments from 2 months ago',
    ],
  },
  {
    id: 'marcella',
    name: 'Marcella G.',
    role: 'Senior Research Scientist',
    org: 'Major AI Lab, Foundation Models Team',
    photo: 'M',
    context: 'Leading a research direction with 8 reports. Manages $50k/month compute budget. Responsible for team productivity and research output.',
    quote: "We're burning money on experiments that don't need to run. Last quarter, I found out three different people on my team ran nearly identical ablations without knowing about each other. That's probably $15k in wasted compute.",
    tools: 'Internal MLflow fork, custom dashboards, Notion, Slack',
    compute: '~$50,000/month across team',
    team: '8 researchers, 2 ML engineers',
    frustrations: [
      'No visibility into what team members are running until standup',
      'Knowledge walks out the door when people leave',
      'Cost estimation is guesswork — we find out what something costs after',
    ],
  },
  {
    id: 'sarah',
    name: 'Sarah H.',
    role: 'Senior ML Engineer',
    org: 'Series B Startup, ML Platform Team',
    photo: 'S',
    context: 'Bridges research team to production. Takes "best" models from research and makes them production-ready. Owns ML infrastructure.',
    quote: "Research hands me a model and says 'this is the best one.' I ask how they evaluated it, and they show me a W&B dashboard with training curves. That tells me nothing about production readiness.",
    tools: 'MLflow for model registry, internal deployment tooling, Grafana',
    compute: '~$8,000/month (mostly eval and staging)',
    team: '3 ML engineers, interfaces with 5-person research team',
    frustrations: [
      'Research → production handoff loses all context',
      'Research evaluation metrics are meaningless for production',
      'No lineage from deployed model back to training decisions',
    ],
  },
  {
    id: 'david',
    name: 'David C.',
    role: 'Independent ML Researcher',
    org: 'Former FAANG, Now Independent',
    photo: 'D',
    context: 'Left big tech to do independent research. Building in public, limited compute budget. Collaborates async with other independents.',
    quote: "I want to build on other people's work, but I can't find it. Someone tweets 'we got CLIP working with 10x less compute' — amazing! Where are their experiment configs? It's just a screenshot of a loss curve.",
    tools: 'W&B, Google Colab Pro, HuggingFace Hub, Twitter',
    compute: '~$500/month (personal budget)',
    team: 'Solo, async collaboration with Twitter mutuals',
    frustrations: [
      'Community knowledge is scattered and unsearchable',
      'Can\'t build on others\' experiments — only their code',
      'Every run matters when compute-constrained',
    ],
  },
];

const journeyPhases = [
  {
    name: 'Discovery',
    days: '1-3',
    pain: 'Low',
    toolSupport: 'N/A',
    gap: false,
    description: 'Finding what to work on',
    activities: [
      'Browse arXiv, Twitter, colleague recommendations',
      'Read 10-20 abstracts, deep-dive 3-5 papers',
      'Discuss with advisor/team',
    ],
    tools: 'arXiv, Semantic Scholar, Twitter, Slack',
    insight: 'Low pain. Tools exist. Not a gap.',
  },
  {
    name: 'Reproduction',
    days: '4-14',
    pain: 'Extreme',
    toolSupport: 'Almost none',
    gap: true,
    description: 'Getting baseline to work',
    activities: [
      'Find paper\'s code repository (if it exists)',
      'Set up environment — usually fails first 10 times',
      'Results don\'t match paper — debug for days',
      'Email authors (no response)',
      'Give up or finally get "close enough"',
    ],
    tools: 'GitHub, Docker, manual debugging',
    insight: 'EXTREME pain. Almost no tool support. This is the gap.',
  },
  {
    name: 'Baseline',
    days: '15-25',
    pain: 'Moderate',
    toolSupport: 'Good',
    gap: false,
    description: 'Setting up infrastructure',
    activities: [
      'Establish working baseline',
      'Set up experiment tracking (W&B, MLflow)',
      'Configure logging, checkpointing, evaluation',
    ],
    tools: 'W&B, MLflow, Hydra, Docker',
    insight: 'Moderate pain. Current tools help here.',
  },
  {
    name: 'Experimentation',
    days: '26-60',
    pain: 'Low',
    toolSupport: 'Excellent',
    gap: false,
    description: 'Running and analyzing experiments',
    activities: [
      'Run variations on baseline',
      'Hyperparameter sweeps',
      'Ablation studies',
      'Analyze results, iterate',
    ],
    tools: 'W&B Sweeps, Optuna, Ray Tune',
    insight: 'Low pain. Tools work well. Not a gap.',
  },
  {
    name: 'Evaluation',
    days: '61-90',
    pain: 'Moderate',
    toolSupport: 'Partial',
    gap: true,
    description: 'Validating and communicating',
    activities: [
      'Run final evaluations',
      'Statistical significance testing',
      'Generate figures and tables',
      'Write paper / report',
    ],
    tools: 'Custom eval scripts, matplotlib, LaTeX',
    insight: 'Moderate pain. Gap in structured evaluation.',
  },
];

const competitors = [
  {
    name: 'Weights & Biases',
    category: 'Experiment Tracking',
    users: '500k+ users',
    strengths: ['Best-in-class dashboard UX', 'Excellent visualization', 'Great team features', 'Reports for communication'],
    gaps: ['No reproduction assistance', 'No paper connection', 'Evaluation is just metric logging', 'Separate from production'],
    verdict: 'Excellent at what it does. But it\'s a logging tool, not a thinking environment.',
  },
  {
    name: 'MLflow',
    category: 'MLOps Platform',
    users: '10M+ downloads',
    strengths: ['Open source', 'Self-hostable', 'Strong model registry', 'Good deployment pipeline'],
    gaps: ['UX significantly behind W&B', 'Weak collaboration', 'Research workflows not prioritized'],
    verdict: 'Better for MLOps than research. Different focus.',
  },
  {
    name: 'Papers With Code',
    category: 'Research Discovery',
    users: '1M+ monthly',
    strengths: ['Paper-code linking', 'Benchmark leaderboards', 'Great for discovery'],
    gaps: ['No actual experiment tracking', 'Repos listed but not verified working', 'No reproduction learnings shared'],
    verdict: 'Solves discovery, not reproduction or tracking.',
  },
];

const keyFindings = [
  { stat: '43%', label: 'of workflow time spent in reproduction phase (telemetry data, n=2 teams)' },
  { stat: '9 of 12', label: 'interview participants described accidentally duplicating team experiments' },
  { stat: '~$12k', label: 'estimated quarterly waste on duplicate runs (team lead survey responses)' },
  { stat: '0', label: 'tools provide experiment-to-paper lineage or reproduction tracking' },
];

const predictions = [
  { title: 'Evaluation becomes the core primitive', desc: 'Runs exist to feed evaluations. The evaluation result is the primary artifact, not training metrics.' },
  { title: 'Experiments become a connected graph', desc: 'Every experiment links to papers, datasets, prior runs. Like Git for experiments.' },
  { title: 'Pre-run cost prediction becomes mandatory', desc: 'Before starting: estimated cost, time, similar past experiments, duplicate warnings.' },
  { title: 'Research and production merge', desc: 'One continuous flow from hypothesis to deployment to monitoring to retrain.' },
  { title: 'Experiments become citable artifacts', desc: 'Experiments get DOIs, can be cited alongside papers and code.' },
  { title: 'Intelligent guidance emerges', desc: 'Evidence-based suggestions: "4 people tried this config, 3 succeeded."' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export default function LatticeCase() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activePersona, setActivePersona] = useState(0);
  const [activePhase, setActivePhase] = useState(1);

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>
            <div style={styles.logoMark}>L</div>
            <span style={styles.logoText}>Lattice</span>
          </div>
        </div>
        
        <h1 style={styles.title}>What Does Next-Gen Experiment Tracking Look Like?</h1>
        
        {/* TABS */}
        <div style={styles.tabs}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'research', label: 'Research' },
            { id: 'product', label: 'Design' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...styles.tab,
                borderBottomColor: activeTab === tab.id ? defined.accent.primary : 'transparent',
                color: activeTab === tab.id ? defined.text.primary : defined.text.muted,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ============================================ */}
      {/* OVERVIEW TAB */}
      {/* ============================================ */}
      {activeTab === 'overview' && (
        <div style={styles.tabContent}>
          
          {/* Hero Section */}
          <section style={{padding: '48px', background: `linear-gradient(135deg, ${defined.bg.secondary} 0%, ${defined.bg.primary} 100%)`}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center'}}>
              <div>
                <div style={{display: 'flex', gap: 16, marginBottom: 24}}>
                  <span style={{padding: '6px 12px', background: defined.bg.tertiary, borderRadius: 4, fontSize: 12, fontWeight: 500}}>12 weeks</span>
                  <span style={{padding: '6px 12px', background: defined.bg.tertiary, borderRadius: 4, fontSize: 12, fontWeight: 500}}>Solo designer</span>
                  <span style={{padding: '6px 12px', background: defined.bg.tertiary, borderRadius: 4, fontSize: 12, fontWeight: 500}}>0 → 1</span>
                </div>
                <h2 style={{fontSize: 28, fontWeight: 600, margin: '0 0 16px 0', lineHeight: 1.3}}>
                  Redesigning experiment tracking for the age of foundation models
                </h2>
                <p style={{fontSize: 16, color: defined.text.secondary, margin: '0 0 24px 0', lineHeight: 1.6}}>
                  Research revealed current tools optimize for the wrong phase. I designed a graph-based system 
                  that connects experiments to papers, evaluations, and team knowledge.
                </p>
                <div style={{display: 'flex', gap: 32}}>
                  <div>
                    <span style={{fontSize: 24, fontWeight: 600, color: defined.accent.primary}}>12</span>
                    <span style={{display: 'block', fontSize: 12, color: defined.text.muted}}>interviews</span>
                  </div>
                  <div>
                    <span style={{fontSize: 24, fontWeight: 600, color: defined.accent.primary}}>47</span>
                    <span style={{display: 'block', fontSize: 12, color: defined.text.muted}}>survey responses</span>
                  </div>
                  <div>
                    <span style={{fontSize: 24, fontWeight: 600, color: defined.accent.primary}}>2</span>
                    <span style={{display: 'block', fontSize: 12, color: defined.text.muted}}>teams instrumented</span>
                  </div>
                </div>
              </div>
              
              {/* Hero Visual - Mini Graph Preview */}
              <div style={{background: defined.bg.primary, borderRadius: 12, padding: 24, border: `1px solid ${defined.border.light}`, boxShadow: '0 4px 24px rgba(0,0,0,0.06)'}}>
                <svg width="100%" height="240" viewBox="0 0 360 240">
                  {/* Paper node */}
                  <rect x="40" y="30" width="70" height="45" rx="6" fill={defined.bg.secondary} stroke={defined.border.medium} strokeWidth="1.5"/>
                  <text x="75" y="50" textAnchor="middle" fontSize="9" fill={defined.text.muted}>PAPER</text>
                  <text x="75" y="64" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">arXiv:2301</text>
                  
                  {/* Dataset node */}
                  <rect x="250" y="30" width="70" height="45" rx="6" fill={defined.bg.secondary} stroke={defined.border.medium} strokeWidth="1.5"/>
                  <text x="285" y="50" textAnchor="middle" fontSize="9" fill={defined.text.muted}>DATASET</text>
                  <text x="285" y="64" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">ImageNet</text>
                  
                  {/* Central experiment - highlighted */}
                  <rect x="130" y="100" width="100" height="55" rx="8" fill={defined.accent.primary} stroke={defined.accent.primary} strokeWidth="2"/>
                  <text x="180" y="122" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.8)">EXPERIMENT</text>
                  <text x="180" y="138" textAnchor="middle" fontSize="11" fill="#FFF" fontWeight="600">vit-finetune-042</text>
                  
                  {/* Eval node */}
                  <rect x="40" y="180" width="70" height="45" rx="6" fill="#D1FAE5" stroke={defined.accent.success} strokeWidth="1.5"/>
                  <text x="75" y="200" textAnchor="middle" fontSize="9" fill={defined.accent.success}>EVAL</text>
                  <text x="75" y="214" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">✓ Pass</text>
                  
                  {/* Model node */}
                  <rect x="250" y="180" width="70" height="45" rx="6" fill={defined.bg.secondary} stroke={defined.border.medium} strokeWidth="1.5"/>
                  <text x="285" y="200" textAnchor="middle" fontSize="9" fill={defined.text.muted}>MODEL</text>
                  <text x="285" y="214" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">v2.1-prod</text>
                  
                  {/* Connection lines */}
                  <line x1="95" y1="75" x2="145" y2="100" stroke={defined.border.medium} strokeWidth="1.5"/>
                  <line x1="265" y1="75" x2="215" y2="100" stroke={defined.border.medium} strokeWidth="1.5"/>
                  <line x1="145" y1="155" x2="95" y2="180" stroke={defined.border.medium} strokeWidth="1.5"/>
                  <line x1="215" y1="155" x2="265" y2="180" stroke={defined.border.medium} strokeWidth="1.5"/>
                </svg>
              </div>
            </div>
          </section>

          {/* Background */}
          <section style={{padding: '48px', background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Background</h2>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48}}>
              <div>
                <p style={{fontSize: 15, color: defined.text.secondary, lineHeight: 1.7, margin: '0 0 16px 0'}}>
                  ML experiment tracking is a $500M+ market dominated by tools built for a previous era. 
                  When W&B launched in 2017, the workflow was: train from scratch, log metrics, look at loss curves.
                </p>
                <p style={{fontSize: 15, color: defined.text.secondary, lineHeight: 1.7, margin: 0}}>
                  But the landscape has shifted. Models are fine-tuned, not trained from scratch. 
                  Single runs cost $10k+. Teams are larger with coordination overhead. 
                  <strong style={{color: defined.text.primary}}> Yet the tools haven't evolved.</strong>
                </p>
              </div>
              <div style={{background: defined.bg.primary, borderRadius: 8, padding: 24, border: `1px solid ${defined.border.light}`}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase'}}>The Shift</span>
                <div style={{marginTop: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
                  {[
                    { before: 'Train from scratch', after: 'Fine-tune existing models' },
                    { before: 'Loss curves enough', after: 'Human eval required' },
                    { before: '$100/run', after: '$10,000+/run' },
                    { before: 'Solo researcher', after: 'Team coordination' },
                  ].map((item, i) => (
                    <div key={i} style={{display: 'flex', alignItems: 'center', gap: 12, fontSize: 13}}>
                      <span style={{color: defined.text.muted, textDecoration: 'line-through', flex: 1}}>{item.before}</span>
                      <span style={{color: defined.text.muted}}>→</span>
                      <span style={{color: defined.text.primary, fontWeight: 500, flex: 1}}>{item.after}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Research Highlight */}
          <section style={{padding: '48px'}}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48}}>
              <div>
                <h2 style={styles.sectionTitle}>The Key Finding</h2>
                <p style={{fontSize: 15, color: defined.text.secondary, lineHeight: 1.7, margin: '0 0 24px 0'}}>
                  After 12 interviews and surveying 47 ML practitioners across academia, big tech, startups, and independent research, 
                  a clear pattern emerged: <strong style={{color: defined.text.primary}}>tools optimize for the wrong phase.</strong>
                </p>
                <div style={{padding: 20, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.danger}`}}>
                  <p style={{fontSize: 15, margin: 0, lineHeight: 1.6}}>
                    <strong>Reproduction</strong> — where 43% of workflow time is spent (per telemetry) — has almost no tool support. 
                    <strong> Experimentation</strong> — where tools are excellent — has relatively low pain.
                  </p>
                </div>
              </div>
              
              {/* Pain vs Tool Support Visual */}
              <div style={{background: defined.bg.secondary, borderRadius: 12, padding: 24}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase'}}>Pain vs Tool Support</span>
                <svg width="100%" height="200" viewBox="0 0 280 200" style={{marginTop: 16}}>
                  {/* Axes */}
                  <line x1="40" y1="160" x2="260" y2="160" stroke={defined.border.medium} strokeWidth="1"/>
                  <line x1="40" y1="160" x2="40" y2="30" stroke={defined.border.medium} strokeWidth="1"/>
                  
                  {/* Y axis labels */}
                  <text x="15" y="50" fontSize="9" fill={defined.text.muted}>High</text>
                  <text x="15" y="155" fontSize="9" fill={defined.text.muted}>Low</text>
                  
                  {/* Bars - Pain */}
                  <rect x="60" y="130" width="30" height="30" fill={defined.bg.tertiary} rx="2"/>
                  <rect x="110" y="50" width="30" height="110" fill={defined.accent.danger} opacity="0.8" rx="2"/>
                  <rect x="160" y="90" width="30" height="70" fill={defined.accent.warning} opacity="0.7" rx="2"/>
                  <rect x="210" y="120" width="30" height="40" fill={defined.bg.tertiary} rx="2"/>
                  
                  {/* Tool support line */}
                  <path d="M 75 140 L 125 145 L 175 80 L 225 60" stroke={defined.accent.primary} strokeWidth="2" fill="none"/>
                  <circle cx="75" cy="140" r="4" fill={defined.accent.primary}/>
                  <circle cx="125" cy="145" r="4" fill={defined.accent.primary}/>
                  <circle cx="175" cy="80" r="4" fill={defined.accent.primary}/>
                  <circle cx="225" cy="60" r="4" fill={defined.accent.primary}/>
                  
                  {/* X axis labels */}
                  <text x="75" y="178" textAnchor="middle" fontSize="8" fill={defined.text.muted}>Discovery</text>
                  <text x="125" y="178" textAnchor="middle" fontSize="8" fill={defined.accent.danger} fontWeight="600">Repro</text>
                  <text x="175" y="178" textAnchor="middle" fontSize="8" fill={defined.text.muted}>Baseline</text>
                  <text x="225" y="178" textAnchor="middle" fontSize="8" fill={defined.text.muted}>Experiment</text>
                  
                  {/* Legend */}
                  <rect x="60" y="10" width="12" height="12" fill={defined.accent.danger} opacity="0.8" rx="2"/>
                  <text x="78" y="20" fontSize="9" fill={defined.text.muted}>Pain level</text>
                  <line x1="130" y1="16" x2="150" y2="16" stroke={defined.accent.primary} strokeWidth="2"/>
                  <circle cx="140" cy="16" r="3" fill={defined.accent.primary}/>
                  <text x="158" y="20" fontSize="9" fill={defined.text.muted}>Tool support</text>
                </svg>
              </div>
            </div>
          </section>

          {/* Process Overview - Visual */}
          <section style={{padding: '48px', background: defined.bg.secondary, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32}}>
            {/* Research */}
            <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 12}}>
              <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, textTransform: 'uppercase'}}>Research</span>
              <h3 style={{fontSize: 17, fontWeight: 600, margin: '12px 0'}}>Discovered the gap</h3>
              
              {/* Mini journey viz */}
              <svg width="100%" height="60" viewBox="0 0 200 60" style={{marginBottom: 16}}>
                <line x1="20" y1="30" x2="180" y2="30" stroke={defined.border.medium} strokeWidth="2"/>
                <circle cx="40" cy="30" r="8" fill={defined.bg.tertiary} stroke={defined.border.medium}/>
                <circle cx="80" cy="30" r="18" fill={defined.accent.danger} opacity="0.8"/>
                <circle cx="80" cy="30" r="6" fill={defined.bg.primary} stroke={defined.text.primary} strokeWidth="1.5"/>
                <circle cx="120" cy="30" r="10" fill={defined.accent.warning} opacity="0.6"/>
                <circle cx="120" cy="30" r="5" fill={defined.bg.primary} stroke={defined.text.primary} strokeWidth="1.5"/>
                <circle cx="160" cy="30" r="6" fill={defined.bg.tertiary} stroke={defined.border.medium}/>
                <text x="80" y="55" textAnchor="middle" fontSize="8" fill={defined.accent.danger}>← pain here</text>
              </svg>
              
              <ul style={{margin: 0, paddingLeft: 16, fontSize: 13, color: defined.text.secondary, lineHeight: 1.8}}>
                <li>12 in-depth interviews</li>
                <li>Journey mapping across 5 phases</li>
                <li>Competitive feature analysis</li>
              </ul>
            </div>
            
            {/* Strategy */}
            <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 12}}>
              <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, textTransform: 'uppercase'}}>Strategy</span>
              <h3 style={{fontSize: 17, fontWeight: 600, margin: '12px 0'}}>Found the whitespace</h3>
              
              {/* Mini positioning map */}
              <svg width="100%" height="80" viewBox="0 0 200 80" style={{marginBottom: 16}}>
                <line x1="30" y1="70" x2="180" y2="70" stroke={defined.border.medium} strokeWidth="1"/>
                <line x1="30" y1="70" x2="30" y2="10" stroke={defined.border.medium} strokeWidth="1"/>
                <circle cx="80" cy="55" r="12" fill={defined.bg.tertiary} stroke={defined.border.medium}/>
                <text x="80" y="58" textAnchor="middle" fontSize="7" fill={defined.text.muted}>W&B</text>
                <circle cx="120" cy="50" r="10" fill={defined.bg.tertiary} stroke={defined.border.medium}/>
                <text x="120" y="53" textAnchor="middle" fontSize="7" fill={defined.text.muted}>MLflow</text>
                <circle cx="140" cy="25" r="14" fill={defined.accent.primary}/>
                <text x="140" y="28" textAnchor="middle" fontSize="8" fill="#FFF" fontWeight="600">L</text>
              </svg>
              
              <ul style={{margin: 0, paddingLeft: 16, fontSize: 13, color: defined.text.secondary, lineHeight: 1.8}}>
                <li>No one does knowledge graphs</li>
                <li>No one does pre-run checks</li>
                <li>No one connects to papers</li>
              </ul>
            </div>
            
            {/* Design */}
            <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 12}}>
              <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, textTransform: 'uppercase'}}>Design</span>
              <h3 style={{fontSize: 17, fontWeight: 600, margin: '12px 0'}}>Tested 3 layouts</h3>
              
              {/* Mini wireframe evolution */}
              <div style={{display: 'flex', gap: 8, marginBottom: 16}}>
                <div style={{flex: 1, height: 50, background: defined.bg.tertiary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: 9, color: defined.accent.danger}}>✗</span>
                </div>
                <div style={{flex: 1, height: 50, background: defined.bg.tertiary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: 9, color: defined.accent.warning}}>~</span>
                </div>
                <div style={{flex: 1, height: 50, background: defined.accent.primary, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <span style={{fontSize: 9, color: '#FFF'}}>✓</span>
                </div>
              </div>
              
              <ul style={{margin: 0, paddingLeft: 16, fontSize: 13, color: defined.text.secondary, lineHeight: 1.8}}>
                <li>8 wireframe iterations</li>
                <li>Usability tested with 2 users</li>
                <li>3 high-fidelity screens</li>
              </ul>
            </div>
          </section>

          {/* Screen Previews */}
          <section style={{padding: '48px', background: defined.bg.secondary}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32}}>
              <h2 style={styles.sectionTitle}>Final Designs</h2>
              <span style={{fontSize: 13, color: defined.text.muted}}>3 core screens</span>
            </div>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24}}>
              {/* Screen 1: Graph */}
              <div style={{background: defined.bg.primary, borderRadius: 12, overflow: 'hidden', border: `1px solid ${defined.border.light}`}}>
                <div style={{padding: '8px 12px', background: defined.bg.tertiary, fontSize: 11, color: defined.text.muted, display: 'flex', alignItems: 'center', gap: 6}}>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#FF5F57'}}></span>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E'}}></span>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#28C840'}}></span>
                  <span style={{marginLeft: 8}}>Graph View</span>
                </div>
                <svg width="100%" height="160" viewBox="0 0 240 160" style={{background: '#FAFAFA'}}>
                  {/* Sidebar */}
                  <rect x="0" y="0" width="40" height="160" fill="#18181B"/>
                  <rect x="8" y="20" width="24" height="16" rx="3" fill={defined.accent.primary}/>
                  <rect x="8" y="44" width="24" height="16" rx="3" fill="transparent" stroke="#444" strokeWidth="1"/>
                  <rect x="8" y="68" width="24" height="16" rx="3" fill="transparent" stroke="#444" strokeWidth="1"/>
                  
                  {/* Graph nodes */}
                  <rect x="60" y="20" width="45" height="28" rx="4" fill="#FFF" stroke="#DDD"/>
                  <rect x="145" y="20" width="45" height="28" rx="4" fill="#FFF" stroke="#DDD"/>
                  <rect x="95" y="65" width="50" height="32" rx="4" fill={defined.accent.primary}/>
                  <rect x="60" y="115" width="40" height="25" rx="4" fill="#D1FAE5" stroke={defined.accent.success}/>
                  <rect x="140" y="115" width="50" height="25" rx="4" fill="#FFF" stroke="#DDD"/>
                  
                  {/* Lines */}
                  <line x1="82" y1="48" x2="105" y2="65" stroke="#DDD" strokeWidth="1"/>
                  <line x1="167" y1="48" x2="135" y2="65" stroke="#DDD" strokeWidth="1"/>
                  <line x1="105" y1="97" x2="85" y2="115" stroke="#DDD" strokeWidth="1"/>
                  <line x1="135" y1="97" x2="155" y2="115" stroke="#DDD" strokeWidth="1"/>
                  
                  {/* Detail panel */}
                  <rect x="200" y="0" width="40" height="160" fill="#F5F5F5" stroke="#EEE"/>
                </svg>
                <div style={{padding: 12}}>
                  <span style={{fontSize: 12, fontWeight: 500}}>Experiment relationships</span>
                  <p style={{fontSize: 11, color: defined.text.muted, margin: '4px 0 0 0'}}>Navigate by connection, not list</p>
                </div>
              </div>
              
              {/* Screen 2: Pre-Run */}
              <div style={{background: defined.bg.primary, borderRadius: 12, overflow: 'hidden', border: `1px solid ${defined.border.light}`}}>
                <div style={{padding: '8px 12px', background: defined.bg.tertiary, fontSize: 11, color: defined.text.muted, display: 'flex', alignItems: 'center', gap: 6}}>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#FF5F57'}}></span>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E'}}></span>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#28C840'}}></span>
                  <span style={{marginLeft: 8}}>Pre-Run Check</span>
                </div>
                <svg width="100%" height="160" viewBox="0 0 240 160" style={{background: '#F5F5F5'}}>
                  {/* Modal card */}
                  <rect x="30" y="15" width="180" height="130" rx="8" fill="#FFF" stroke="#DDD"/>
                  <text x="120" y="38" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">Before you run...</text>
                  
                  {/* Stat cards */}
                  <rect x="42" y="50" width="50" height="35" rx="4" fill="#F5F5F5"/>
                  <text x="67" y="65" textAnchor="middle" fontSize="7" fill="#999">COST</text>
                  <text x="67" y="78" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">$847</text>
                  
                  <rect x="97" y="50" width="50" height="35" rx="4" fill="#F5F5F5"/>
                  <text x="122" y="65" textAnchor="middle" fontSize="7" fill="#999">TIME</text>
                  <text x="122" y="78" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">4.2h</text>
                  
                  <rect x="152" y="50" width="46" height="35" rx="4" fill="#FEF3C7"/>
                  <text x="175" y="65" textAnchor="middle" fontSize="7" fill="#92400E">SIMILAR</text>
                  <text x="175" y="78" textAnchor="middle" fontSize="10" fill="#D97706" fontWeight="600">2</text>
                  
                  {/* Warning */}
                  <rect x="42" y="92" width="156" height="22" rx="4" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="0.5"/>
                  <text x="52" y="106" fontSize="8" fill="#92400E">⚠ 2 similar experiments exist</text>
                  
                  {/* Button */}
                  <rect x="130" y="120" width="68" height="18" rx="4" fill="#333"/>
                  <text x="164" y="132" textAnchor="middle" fontSize="8" fill="#FFF">Run Anyway</text>
                </svg>
                <div style={{padding: 12}}>
                  <span style={{fontSize: 12, fontWeight: 500}}>Cost & duplicate check</span>
                  <p style={{fontSize: 11, color: defined.text.muted, margin: '4px 0 0 0'}}>Mandatory friction saves $15k/quarter</p>
                </div>
              </div>
              
              {/* Screen 3: Eval */}
              <div style={{background: defined.bg.primary, borderRadius: 12, overflow: 'hidden', border: `1px solid ${defined.border.light}`}}>
                <div style={{padding: '8px 12px', background: defined.bg.tertiary, fontSize: 11, color: defined.text.muted, display: 'flex', alignItems: 'center', gap: 6}}>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#FF5F57'}}></span>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#FEBC2E'}}></span>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: '#28C840'}}></span>
                  <span style={{marginLeft: 8}}>Eval Center</span>
                </div>
                <svg width="100%" height="160" viewBox="0 0 240 160" style={{background: '#FAFAFA'}}>
                  {/* Sidebar */}
                  <rect x="0" y="0" width="40" height="160" fill="#18181B"/>
                  <rect x="8" y="44" width="24" height="16" rx="3" fill={defined.accent.primary}/>
                  
                  {/* Table header */}
                  <rect x="48" y="15" width="184" height="22" fill="#F0F0F0"/>
                  <text x="75" y="29" fontSize="7" fill="#666">Model</text>
                  <text x="130" y="29" fontSize="7" fill="#666">Safety</text>
                  <text x="175" y="29" fontSize="7" fill="#666">Status</text>
                  
                  {/* Rows */}
                  <rect x="48" y="37" width="184" height="28" fill="#FFF" stroke="#EEE"/>
                  <text x="58" y="54" fontSize="8" fill="#333">claude-v2.1</text>
                  <rect x="115" y="47" width="40" height="6" rx="2" fill="#D1FAE5"/>
                  <rect x="115" y="47" width="36" height="6" rx="2" fill={defined.accent.success}/>
                  <text x="185" y="54" fontSize="8" fill={defined.accent.success}>✓ Pass</text>
                  
                  <rect x="48" y="65" width="184" height="28" fill="#FAFAFA" stroke="#EEE"/>
                  <text x="58" y="82" fontSize="8" fill="#333">claude-v2.0</text>
                  <rect x="115" y="75" width="40" height="6" rx="2" fill="#D1FAE5"/>
                  <rect x="115" y="75" width="34" height="6" rx="2" fill={defined.accent.success}/>
                  <text x="185" y="82" fontSize="8" fill={defined.accent.success}>✓ Pass</text>
                  
                  <rect x="48" y="93" width="184" height="28" fill="#FEF2F2" stroke="#FCA5A5"/>
                  <text x="58" y="110" fontSize="8" fill="#333">gpt-4-0125</text>
                  <rect x="115" y="103" width="40" height="6" rx="2" fill="#FEE2E2"/>
                  <rect x="115" y="103" width="28" height="6" rx="2" fill={defined.accent.danger}/>
                  <text x="185" y="110" fontSize="8" fill={defined.accent.danger}>✗ Fail</text>
                  
                  {/* Threshold line */}
                  <line x1="147" y1="42" x2="147" y2="121" stroke={defined.accent.danger} strokeWidth="1" strokeDasharray="2,2"/>
                  <text x="149" y="135" fontSize="6" fill={defined.accent.danger}>90%</text>
                </svg>
                <div style={{padding: 12}}>
                  <span style={{fontSize: 12, fontWeight: 500}}>Side-by-side comparison</span>
                  <p style={{fontSize: 11, color: defined.text.muted, margin: '4px 0 0 0'}}>Evals are first-class, not afterthought</p>
                </div>
              </div>
            </div>
          </section>

          {/* Project Context - Compact */}
          <section style={{padding: '48px'}}>
            <h2 style={styles.sectionTitle}>Project Details</h2>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginTop: 24}}>
              <div style={{padding: 20, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={styles.detailLabel}>Timeline</span>
                <p style={{fontSize: 15, fontWeight: 500, margin: '8px 0 0 0'}}>12 weeks</p>
              </div>
              <div style={{padding: 20, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={styles.detailLabel}>Team</span>
                <p style={{fontSize: 15, fontWeight: 500, margin: '8px 0 0 0'}}>Solo designer</p>
                <p style={{fontSize: 12, color: defined.text.muted, margin: '2px 0 0 0'}}>+ PM, 2 eng for feasibility</p>
              </div>
              <div style={{padding: 20, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={styles.detailLabel}>My Role</span>
                <p style={{fontSize: 15, fontWeight: 500, margin: '8px 0 0 0'}}>End-to-end</p>
                <p style={{fontSize: 12, color: defined.text.muted, margin: '2px 0 0 0'}}>Research → Strategy → UI</p>
              </div>
              <div style={{padding: 20, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={styles.detailLabel}>Outcome</span>
                <p style={{fontSize: 15, fontWeight: 500, margin: '8px 0 0 0'}}>MVP spec + designs</p>
                <p style={{fontSize: 12, color: defined.text.muted, margin: '2px 0 0 0'}}>Ready for eng handoff</p>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ============================================ */}
      {/* RESEARCH TAB */}
      {/* ============================================ */}
      {activeTab === 'research' && (
        <div style={styles.tabContent}>
          
          {/* Method */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Research Method</h2>
            <p style={styles.bodyText}>
              Mixed-methods research over 12 weeks. Triangulated findings across qualitative interviews, behavioral telemetry, and quantitative validation.
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32}}>
              {/* Phase 1 */}
              <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5}}>PHASE 1 · WEEKS 1-4</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 16px 0'}}>Discovery</h4>
                <ul style={{margin: 0, paddingLeft: 16, fontSize: 13, color: defined.text.secondary, lineHeight: 1.8}}>
                  <li>Analysis of <strong>200+ community posts</strong> (Reddit, HN, ML Twitter)</li>
                  <li>Papers With Code reproduction data review</li>
                  <li>Competitive teardown of 5 tools</li>
                </ul>
              </div>
              
              {/* Phase 2 */}
              <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8, border: `2px solid ${defined.accent.primary}`}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5}}>PHASE 2 · WEEKS 5-8</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 16px 0'}}>Generative Research</h4>
                <ul style={{margin: 0, paddingLeft: 16, fontSize: 13, color: defined.text.secondary, lineHeight: 1.8}}>
                  <li><strong>12 in-depth interviews</strong> (60-90 min each)</li>
                  <li>3 contextual observations (workflow shadowing)</li>
                  <li><strong>Telemetry partnership</strong> with 2 ML teams — instrumented workflows for 4 weeks</li>
                </ul>
              </div>
              
              {/* Phase 3 */}
              <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5}}>PHASE 3 · WEEKS 9-12</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 16px 0'}}>Validation</h4>
                <ul style={{margin: 0, paddingLeft: 16, fontSize: 13, color: defined.text.secondary, lineHeight: 1.8}}>
                  <li><strong>Survey of 47 ML practitioners</strong></li>
                  <li>Concept testing with 6 participants</li>
                  <li>Wireframe usability sessions</li>
                </ul>
              </div>
            </div>
            
            {/* Telemetry callout */}
            <div style={{marginTop: 32, padding: 20, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
              <span style={{fontSize: 12, fontWeight: 600}}>Why telemetry?</span>
              <p style={{fontSize: 14, color: defined.text.secondary, margin: '8px 0 0 0'}}>
                Interviews reveal what people <em>say</em> they do. Telemetry shows what they <em>actually</em> do. 
                We partnered with 2 ML teams to instrument their workflows — tracking time between runs, config similarity, reproduction attempts, and tool switching. 
                This is where our hard numbers come from.
              </p>
            </div>
            
            {/* Limitations note */}
            <div style={{marginTop: 16, fontSize: 13, color: defined.text.muted, fontStyle: 'italic'}}>
              <strong>Limitations:</strong> Telemetry from 2 teams (both ML infrastructure-focused). Survey skewed toward English-speaking practitioners. 
              Findings may not generalize to all ML contexts.
            </div>
          </section>

          {/* Participants */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Key Personas</h2>
            <p style={styles.bodyText}>
              Synthesized from 12 interviews, validated against 47 survey responses. These four represent distinct contexts and constraints:
            </p>
            
            <div style={styles.personaTabs}>
              {personas.map((p, i) => (
                <button 
                  key={p.id}
                  onClick={() => setActivePersona(i)}
                  style={{
                    ...styles.personaTab,
                    background: activePersona === i ? defined.text.primary : 'transparent',
                    color: activePersona === i ? defined.bg.primary : defined.text.secondary,
                  }}
                >
                  {p.name}
                </button>
              ))}
            </div>

            <div style={styles.personaCard}>
              <div style={styles.personaHeader}>
                <div style={styles.personaAvatar}>{personas[activePersona].photo}</div>
                <div>
                  <h3 style={styles.personaName}>{personas[activePersona].name}</h3>
                  <p style={styles.personaRole}>{personas[activePersona].role}</p>
                  <p style={styles.personaOrg}>{personas[activePersona].org}</p>
                </div>
              </div>

              <div style={styles.personaQuote}>
                "{personas[activePersona].quote}"
              </div>

              <div style={styles.personaDetails}>
                <div style={styles.personaDetailItem}>
                  <span style={styles.detailLabel}>Context</span>
                  <p style={styles.detailText}>{personas[activePersona].context}</p>
                </div>
                <div style={styles.personaDetailItem}>
                  <span style={styles.detailLabel}>Tools</span>
                  <p style={styles.detailText}>{personas[activePersona].tools}</p>
                </div>
                <div style={styles.personaDetailItem}>
                  <span style={styles.detailLabel}>Compute</span>
                  <p style={styles.detailText}>{personas[activePersona].compute}</p>
                </div>
              </div>

              <div style={styles.personaFrustrations}>
                <span style={styles.detailLabel}>Key Frustrations</span>
                <ul style={styles.frustrationList}>
                  {personas[activePersona].frustrations.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Journey Map */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Researcher Journey</h2>
            <p style={styles.bodyText}>
              We mapped the complete journey — not just where tools are used. This revealed where pain actually lives.
            </p>
            
            {/* Visual Journey Timeline */}
            <div style={{marginTop: 32, marginBottom: 32, padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
              <svg width="100%" height="140" viewBox="0 0 800 140">
                {/* Timeline base */}
                <line x1="50" y1="70" x2="750" y2="70" stroke={defined.border.medium} strokeWidth="3"/>
                
                {/* Phase markers */}
                {[
                  { x: 90, name: 'Discovery', pain: 'Low', size: 20 },
                  { x: 230, name: 'Reproduction', pain: 'Extreme', size: 45 },
                  { x: 400, name: 'Baseline', pain: 'Moderate', size: 28 },
                  { x: 550, name: 'Experimentation', pain: 'Low', size: 22 },
                  { x: 710, name: 'Evaluation', pain: 'Moderate', size: 32 },
                ].map((phase, i) => (
                  <g key={i}>
                    {/* Pain indicator circle - size = pain level */}
                    <circle 
                      cx={phase.x} 
                      cy="70" 
                      r={phase.size} 
                      fill={phase.pain === 'Extreme' ? defined.accent.danger : phase.pain === 'Moderate' ? defined.accent.warning : defined.bg.tertiary}
                      opacity={phase.pain === 'Extreme' ? 0.9 : phase.pain === 'Moderate' ? 0.7 : 0.5}
                    />
                    <circle cx={phase.x} cy="70" r="8" fill={defined.bg.primary} stroke={defined.text.primary} strokeWidth="2"/>
                    
                    {/* Phase name */}
                    <text x={phase.x} y="120" textAnchor="middle" fontSize="11" fill={defined.text.primary} fontWeight="500">{phase.name}</text>
                    
                    {/* Pain label */}
                    <text x={phase.x} y="30" textAnchor="middle" fontSize="9" fill={phase.pain === 'Extreme' ? defined.accent.danger : phase.pain === 'Moderate' ? defined.accent.warning : defined.text.muted}>
                      {phase.pain}
                    </text>
                  </g>
                ))}
                
                {/* The Gap callout */}
                <rect x="175" y="2" width="110" height="18" fill={defined.accent.danger} rx="9"/>
                <text x="230" y="14" textAnchor="middle" fontSize="9" fill="#FFF" fontWeight="600">← THE GAP</text>
              </svg>
              <div style={{display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8, fontSize: 11, color: defined.text.muted}}>
                <span>Circle size = pain level</span>
                <span>•</span>
                <span><span style={{color: defined.accent.danger}}>●</span> Extreme pain</span>
                <span><span style={{color: defined.accent.warning}}>●</span> Moderate</span>
                <span><span style={{color: defined.text.muted}}>●</span> Low</span>
              </div>
            </div>
            
            <div style={styles.journeyTabs}>
              {journeyPhases.map((phase, i) => (
                <button 
                  key={i}
                  onClick={() => setActivePhase(i)}
                  style={{
                    ...styles.journeyTab,
                    background: activePhase === i ? defined.text.primary : 'transparent',
                    color: activePhase === i ? defined.bg.primary : defined.text.primary,
                    borderColor: phase.gap ? defined.accent.danger : defined.border.medium,
                  }}
                >
                  {phase.name}
                </button>
              ))}
            </div>

            <div style={styles.journeyCard}>
              <div style={styles.journeyHeader}>
                <div>
                  <h3 style={styles.journeyTitle}>{journeyPhases[activePhase].name}</h3>
                  <p style={styles.journeyDesc}>{journeyPhases[activePhase].description}</p>
                </div>
                <div style={styles.journeyMeta}>
                  <div style={styles.journeyMetaItem}>
                    <span style={styles.metaLabel}>Days</span>
                    <span style={styles.metaValue}>{journeyPhases[activePhase].days}</span>
                  </div>
                  <div style={styles.journeyMetaItem}>
                    <span style={styles.metaLabel}>Pain</span>
                    <span style={{
                      ...styles.metaValue,
                      color: journeyPhases[activePhase].pain === 'Extreme' ? defined.accent.danger : 
                             journeyPhases[activePhase].pain === 'Moderate' ? defined.accent.warning : defined.text.secondary
                    }}>{journeyPhases[activePhase].pain}</span>
                  </div>
                  <div style={styles.journeyMetaItem}>
                    <span style={styles.metaLabel}>Tool Support</span>
                    <span style={{
                      ...styles.metaValue,
                      color: journeyPhases[activePhase].toolSupport === 'Almost none' ? defined.accent.danger : defined.text.secondary
                    }}>{journeyPhases[activePhase].toolSupport}</span>
                  </div>
                </div>
              </div>

              <div style={styles.journeyContent}>
                <div>
                  <span style={styles.detailLabel}>Activities</span>
                  <ul style={styles.activityList}>
                    {journeyPhases[activePhase].activities.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span style={styles.detailLabel}>Tools Used</span>
                  <p style={styles.detailText}>{journeyPhases[activePhase].tools}</p>
                </div>
              </div>

              {journeyPhases[activePhase].gap && (
                <div style={styles.gapIndicator}>
                  <span style={styles.gapLabel}>Gap identified</span>
                  <p style={styles.gapText}>{journeyPhases[activePhase].insight}</p>
                </div>
              )}
            </div>
          </section>

          {/* Pain Analysis */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Pain Analysis</h2>
            <p style={styles.bodyText}>
              When we mapped pain against tool support, a clear pattern emerged:
            </p>
            
            <div style={styles.painTable}>
              <div style={styles.painTableHeader}>
                <span>Phase</span>
                <span>Pain</span>
                <span>Tool Support</span>
                <span>Gap?</span>
              </div>
              {journeyPhases.map((phase, i) => (
                <div key={i} style={{
                  ...styles.painTableRow,
                  background: phase.gap ? defined.bg.primary : 'transparent',
                }}>
                  <span style={styles.painPhase}>{phase.name}</span>
                  <span style={{
                    color: phase.pain === 'Extreme' ? defined.accent.danger : 
                           phase.pain === 'Moderate' ? defined.accent.warning : defined.text.secondary,
                    fontWeight: phase.pain === 'Extreme' ? 600 : 400,
                  }}>{phase.pain}</span>
                  <span style={{
                    color: phase.toolSupport === 'Almost none' ? defined.accent.danger : defined.text.secondary,
                  }}>{phase.toolSupport}</span>
                  <span style={{
                    color: phase.gap ? defined.accent.danger : defined.text.muted,
                  }}>{phase.gap ? 'Yes' : '—'}</span>
                </div>
              ))}
            </div>

            <div style={styles.mismatchBox}>
              <h4 style={styles.mismatchTitle}>The Mismatch</h4>
              <p style={styles.mismatchText}>
                <strong>Reproduction</strong> — where researchers lose the most time — has almost no tool support.
                <strong> Experimentation</strong> — where tools are excellent — has relatively low pain.
                Current tools optimize for the phase that already works.
              </p>
            </div>
          </section>

          {/* Competitive */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Competitive Landscape</h2>
            <p style={styles.bodyText}>
              The space is crowded with well-funded products. A feature matrix reveals where everyone stops:
            </p>
            
            {/* Feature Matrix */}
            <div style={{marginTop: 24, marginBottom: 32, overflowX: 'auto'}}>
              <div style={{display: 'grid', gridTemplateColumns: '200px repeat(4, 100px)', gap: 0, minWidth: 600, fontSize: 13}}>
                {/* Header */}
                <div style={{padding: '12px 16px', background: defined.bg.tertiary, fontWeight: 600, borderBottom: `1px solid ${defined.border.light}`}}>Capability</div>
                <div style={{padding: '12px 16px', background: defined.bg.tertiary, fontWeight: 600, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`}}>W&B</div>
                <div style={{padding: '12px 16px', background: defined.bg.tertiary, fontWeight: 600, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`}}>MLflow</div>
                <div style={{padding: '12px 16px', background: defined.bg.tertiary, fontWeight: 600, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`}}>Neptune</div>
                <div style={{padding: '12px 16px', background: defined.accent.primary, color: '#FFF', fontWeight: 600, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`}}>Lattice</div>
                
                {/* Rows */}
                {[
                  { feature: 'Experiment logging', wb: '●', ml: '●', np: '●', us: '●' },
                  { feature: 'Dashboard & visualization', wb: '●', ml: '●', np: '●', us: '●' },
                  { feature: 'Team collaboration', wb: '●', ml: '◐', np: '●', us: '●' },
                  { feature: 'Model registry', wb: '●', ml: '●', np: '●', us: '●' },
                  { feature: 'Hyperparameter sweeps', wb: '●', ml: '◐', np: '●', us: '●' },
                  { feature: 'Experiment comparison', wb: '●', ml: '●', np: '●', us: '●' },
                  { feature: 'Pre-run cost estimation', wb: '○', ml: '○', np: '○', us: '●', highlight: true },
                  { feature: 'Duplicate detection', wb: '◐', ml: '○', np: '○', us: '●', highlight: true },
                  { feature: 'Paper → experiment linking', wb: '○', ml: '○', np: '○', us: '●', highlight: true },
                  { feature: 'Reproduction tracking', wb: '○', ml: '○', np: '○', us: '●', highlight: true },
                  { feature: 'Structured evaluations', wb: '◐', ml: '○', np: '◐', us: '●', highlight: true },
                  { feature: 'Experiment lineage graph', wb: '◐', ml: '◐', np: '◐', us: '●', highlight: true },
                ].map((row, i) => (
                  <React.Fragment key={i}>
                    <div style={{padding: '10px 16px', background: row.highlight ? 'rgba(99, 102, 241, 0.05)' : (i % 2 === 0 ? defined.bg.primary : defined.bg.secondary), borderBottom: `1px solid ${defined.border.light}`, fontWeight: row.highlight ? 500 : 400}}>{row.feature}</div>
                    <div style={{padding: '10px 16px', background: i % 2 === 0 ? defined.bg.primary : defined.bg.secondary, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`, color: row.wb === '●' ? defined.accent.success : row.wb === '◐' ? defined.accent.warning : defined.text.muted}}>{row.wb}</div>
                    <div style={{padding: '10px 16px', background: i % 2 === 0 ? defined.bg.primary : defined.bg.secondary, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`, color: row.ml === '●' ? defined.accent.success : row.ml === '◐' ? defined.accent.warning : defined.text.muted}}>{row.ml}</div>
                    <div style={{padding: '10px 16px', background: i % 2 === 0 ? defined.bg.primary : defined.bg.secondary, textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`, color: row.np === '●' ? defined.accent.success : row.np === '◐' ? defined.accent.warning : defined.text.muted}}>{row.np}</div>
                    <div style={{padding: '10px 16px', background: row.highlight ? 'rgba(99, 102, 241, 0.1)' : (i % 2 === 0 ? defined.bg.primary : defined.bg.secondary), textAlign: 'center', borderBottom: `1px solid ${defined.border.light}`, color: defined.accent.primary, fontWeight: 600}}>{row.us}</div>
                  </React.Fragment>
                ))}
              </div>
              <div style={{display: 'flex', gap: 16, marginTop: 12, fontSize: 12, color: defined.text.muted}}>
                <span><span style={{color: defined.accent.success}}>●</span> Full support</span>
                <span><span style={{color: defined.accent.warning}}>◐</span> Partial</span>
                <span><span style={{color: defined.text.muted}}>○</span> Not supported</span>
              </div>
            </div>

            {/* Positioning */}
            <div style={{marginBottom: 32}}>
              <span style={styles.detailLabel}>Positioning Map</span>
              <div style={{marginTop: 16, background: defined.bg.secondary, borderRadius: 8, padding: 32}}>
                <svg width="100%" height="300" viewBox="0 0 500 300">
                  {/* Axes */}
                  <line x1="50" y1="250" x2="450" y2="250" stroke={defined.border.medium} strokeWidth="1"/>
                  <line x1="50" y1="250" x2="50" y2="50" stroke={defined.border.medium} strokeWidth="1"/>
                  
                  {/* Labels */}
                  <text x="250" y="290" textAnchor="middle" fontSize="11" fill={defined.text.muted}>Individual Researcher → Team / Enterprise</text>
                  <text x="20" y="150" textAnchor="middle" fontSize="11" fill={defined.text.muted} transform="rotate(-90, 20, 150)">Logging → Knowledge Management</text>
                  
                  {/* Competitors */}
                  <circle cx="320" cy="180" r="30" fill="rgba(99, 102, 241, 0.1)" stroke={defined.border.medium} strokeWidth="1"/>
                  <text x="320" y="184" textAnchor="middle" fontSize="11" fill={defined.text.secondary}>W&B</text>
                  
                  <circle cx="180" cy="200" r="25" fill="rgba(99, 102, 241, 0.1)" stroke={defined.border.medium} strokeWidth="1"/>
                  <text x="180" y="204" textAnchor="middle" fontSize="11" fill={defined.text.secondary}>MLflow</text>
                  
                  <circle cx="380" cy="190" r="22" fill="rgba(99, 102, 241, 0.1)" stroke={defined.border.medium} strokeWidth="1"/>
                  <text x="380" y="194" textAnchor="middle" fontSize="11" fill={defined.text.secondary}>Neptune</text>
                  
                  <circle cx="120" cy="220" r="20" fill="rgba(99, 102, 241, 0.1)" stroke={defined.border.medium} strokeWidth="1"/>
                  <text x="120" y="224" textAnchor="middle" fontSize="10" fill={defined.text.secondary}>TensorBoard</text>
                  
                  {/* Lattice - differentiated position */}
                  <circle cx="300" cy="90" r="35" fill={defined.accent.primary} opacity="0.9"/>
                  <text x="300" y="94" textAnchor="middle" fontSize="12" fill="#FFF" fontWeight="600">Lattice</text>
                  
                  {/* Arrow showing opportunity */}
                  <path d="M 300 140 L 300 180" stroke={defined.accent.primary} strokeWidth="2" strokeDasharray="4,3" markerEnd="url(#arrowhead)"/>
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill={defined.accent.primary}/>
                    </marker>
                  </defs>
                  
                  {/* Annotation */}
                  <text x="340" y="130" fontSize="10" fill={defined.text.muted} fontStyle="italic">Unoccupied: team-scale</text>
                  <text x="340" y="142" fontSize="10" fill={defined.text.muted} fontStyle="italic">knowledge management</text>
                </svg>
              </div>
            </div>

            {/* Whitespace summary */}
            <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8, border: `2px solid ${defined.accent.primary}`}}>
              <h4 style={{fontSize: 15, fontWeight: 600, margin: '0 0 12px 0'}}>The Opportunity</h4>
              <p style={{fontSize: 14, color: defined.text.secondary, margin: 0}}>
                Competitors have converged on the same core: logging, dashboards, model registry. 
                Some have partial lineage features, but none make relationships the primary navigation paradigm. 
                <strong> The gap:</strong> reproduction as a first-class workflow, pre-run intelligence, and paper-to-experiment connectivity.
              </p>
            </div>
          </section>

          {/* Synthesis */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Synthesis</h2>
            
            <div style={styles.synthesisList}>
              <div style={styles.synthesisItem}>
                <span style={styles.synthesisNum}>1</span>
                <div>
                  <h4 style={styles.synthesisTitle}>What we heard</h4>
                  <ul style={styles.synthesisBullets}>
                    <li>"I spend more time reproducing than creating"</li>
                    <li>"Knowledge walks out when people leave"</li>
                    <li>"I can't find what others have tried"</li>
                    <li>"Research and production are different worlds"</li>
                  </ul>
                </div>
              </div>
              
              <div style={styles.synthesisItem}>
                <span style={styles.synthesisNum}>2</span>
                <div>
                  <h4 style={styles.synthesisTitle}>The pattern</h4>
                  <p style={styles.synthesisText}>
                    Every frustration traced back to <strong>disconnection</strong>: experiments disconnected 
                    from papers, from each other, from team knowledge, from production.
                  </p>
                </div>
              </div>
              
              <div style={styles.synthesisItem}>
                <span style={styles.synthesisNum}>3</span>
                <div>
                  <h4 style={styles.synthesisTitle}>The question</h4>
                  <p style={styles.synthesisText}>
                    Papers have citations. Code has Git. What if experiments had the same connective tissue?
                  </p>
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {/* ============================================ */}
      {/* PRODUCT TAB */}
      {/* ============================================ */}
      {activeTab === 'product' && (
        <div style={styles.tabContent}>
          
          {/* ============================================ */}
          {/* SECTION 1: RESEARCH → FEATURES */}
          {/* ============================================ */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>From Research to Features</h2>
            <p style={styles.bodyText}>
              We mapped every research insight to potential features, then prioritized based on pain severity and feasibility.
            </p>
            
            {/* Pain → Feature Mapping */}
            <div style={{marginTop: 32}}>
              <span style={styles.detailLabel}>Pain Point → Feature Mapping</span>
              <div style={{display: 'grid', gap: 16, marginTop: 16}}>
                {[
                  { pain: '"I can\'t find what others have tried"', severity: 'Critical', feature: 'Graph-based navigation', effort: 'High', priority: 'P0' },
                  { pain: '"We wasted $15k on duplicate runs"', severity: 'Critical', feature: 'Pre-run duplicate check', effort: 'Medium', priority: 'P0' },
                  { pain: '"Their eval and my eval are different"', severity: 'High', feature: 'Structured evaluation system', effort: 'High', priority: 'P0' },
                  { pain: '"I spend 3 weeks reproducing papers"', severity: 'Critical', feature: 'Paper import + repro tracking', effort: 'Medium', priority: 'P1' },
                  { pain: '"Knowledge walks out when people leave"', severity: 'High', feature: 'Experiment annotations', effort: 'Low', priority: 'P1' },
                  { pain: '"Research and prod are different worlds"', severity: 'Medium', feature: 'Deployment pipeline', effort: 'Very High', priority: 'P2' },
                ].map((item, i) => (
                  <div key={i} style={{display: 'grid', gridTemplateColumns: '1fr 80px 180px 80px 50px', gap: 16, padding: '12px 16px', background: i % 2 === 0 ? defined.bg.secondary : 'transparent', borderRadius: 4, alignItems: 'center'}}>
                    <span style={{fontSize: 14, color: defined.text.primary}}>"{item.pain.replace(/"/g, '')}"</span>
                    <span style={{fontSize: 12, color: item.severity === 'Critical' ? defined.accent.danger : item.severity === 'High' ? defined.accent.warning : defined.text.muted}}>{item.severity}</span>
                    <span style={{fontSize: 14, fontWeight: 500}}>{item.feature}</span>
                    <span style={{fontSize: 12, color: defined.text.muted}}>{item.effort}</span>
                    <span style={{fontSize: 12, fontWeight: 600, color: item.priority === 'P0' ? defined.accent.primary : item.priority === 'P1' ? defined.text.secondary : defined.text.muted}}>{item.priority}</span>
                  </div>
                ))}
              </div>
              <div style={{display: 'flex', gap: 24, marginTop: 12, fontSize: 11, color: defined.text.muted}}>
                <span>Severity: <span style={{color: defined.accent.danger}}>●</span> Critical <span style={{color: defined.accent.warning}}>●</span> High <span style={{color: defined.text.muted}}>●</span> Medium</span>
                <span>Priority: P0 = MVP, P1 = Fast-follow, P2 = Future</span>
              </div>
            </div>

            {/* Prioritization Matrix */}
            <div style={{marginTop: 48}}>
              <span style={styles.detailLabel}>Prioritization Matrix</span>
              <div style={{marginTop: 16, background: defined.bg.secondary, padding: 32, borderRadius: 8}}>
                <svg width="100%" height="400" viewBox="0 0 600 400">
                  {/* Axes */}
                  <line x1="80" y1="350" x2="580" y2="350" stroke={defined.border.medium} strokeWidth="2"/>
                  <line x1="80" y1="350" x2="80" y2="50" stroke={defined.border.medium} strokeWidth="2"/>
                  
                  {/* Labels */}
                  <text x="330" y="390" textAnchor="middle" fontSize="12" fill={defined.text.secondary}>Implementation Effort →</text>
                  <text x="30" y="200" textAnchor="middle" fontSize="12" fill={defined.text.secondary} transform="rotate(-90, 30, 200)">User Pain Severity →</text>
                  
                  {/* Quadrant labels - positioned in corners */}
                  <text x="100" y="70" textAnchor="start" fontSize="11" fill={defined.accent.success} fontWeight="600">QUICK WINS</text>
                  <text x="100" y="85" textAnchor="start" fontSize="10" fill={defined.text.muted}>High impact, low effort</text>
                  
                  <text x="560" y="70" textAnchor="end" fontSize="11" fill={defined.accent.primary} fontWeight="600">BIG BETS</text>
                  <text x="560" y="85" textAnchor="end" fontSize="10" fill={defined.text.muted}>High impact, high effort</text>
                  
                  <text x="100" y="330" textAnchor="start" fontSize="11" fill={defined.text.muted} fontWeight="600">FILL-INS</text>
                  <text x="100" y="345" textAnchor="start" fontSize="10" fill={defined.text.muted}>Low impact, low effort</text>
                  
                  <text x="560" y="330" textAnchor="end" fontSize="11" fill={defined.accent.danger} fontWeight="600">AVOID</text>
                  <text x="560" y="345" textAnchor="end" fontSize="10" fill={defined.text.muted}>Low impact, high effort</text>
                  
                  {/* Quadrant lines */}
                  <line x1="330" y1="50" x2="330" y2="350" stroke={defined.border.light} strokeWidth="1" strokeDasharray="4,4"/>
                  <line x1="80" y1="200" x2="580" y2="200" stroke={defined.border.light} strokeWidth="1" strokeDasharray="4,4"/>
                  
                  {/* Feature bubbles */}
                  {/* Pre-run check - high pain, low-medium effort */}
                  <circle cx="220" cy="120" r="30" fill={defined.accent.primary} opacity="0.2" stroke={defined.accent.primary} strokeWidth="2"/>
                  <text x="220" y="115" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Pre-run</text>
                  <text x="220" y="128" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Check</text>
                  <text x="220" y="145" textAnchor="middle" fontSize="9" fill={defined.accent.primary} fontWeight="600">P0</text>
                  
                  {/* Graph nav - high pain, high effort */}
                  <circle cx="420" cy="110" r="35" fill={defined.accent.primary} opacity="0.2" stroke={defined.accent.primary} strokeWidth="2"/>
                  <text x="420" y="105" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Graph</text>
                  <text x="420" y="118" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Navigation</text>
                  <text x="420" y="135" textAnchor="middle" fontSize="9" fill={defined.accent.primary} fontWeight="600">P0</text>
                  
                  {/* Eval system - high pain, high effort */}
                  <circle cx="520" cy="160" r="32" fill={defined.accent.primary} opacity="0.2" stroke={defined.accent.primary} strokeWidth="2"/>
                  <text x="520" y="155" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Eval</text>
                  <text x="520" y="168" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">System</text>
                  <text x="520" y="185" textAnchor="middle" fontSize="9" fill={defined.accent.primary} fontWeight="600">P0</text>
                  
                  {/* Annotations - medium pain, low effort */}
                  <circle cx="150" cy="160" r="24" fill={defined.accent.warning} opacity="0.2" stroke={defined.accent.warning} strokeWidth="2"/>
                  <text x="150" y="158" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Annotations</text>
                  <text x="150" y="175" textAnchor="middle" fontSize="9" fill={defined.accent.warning} fontWeight="600">P1</text>
                  
                  {/* Paper import - high pain, medium effort */}
                  <circle cx="280" cy="165" r="28" fill={defined.accent.warning} opacity="0.2" stroke={defined.accent.warning} strokeWidth="2"/>
                  <text x="280" y="160" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Paper</text>
                  <text x="280" y="173" textAnchor="middle" fontSize="10" fill={defined.text.primary} fontWeight="500">Import</text>
                  <text x="280" y="190" textAnchor="middle" fontSize="9" fill={defined.accent.warning} fontWeight="600">P1</text>
                  
                  {/* Deploy pipeline - medium pain, very high effort */}
                  <circle cx="480" cy="270" r="28" fill={defined.text.muted} opacity="0.2" stroke={defined.text.muted} strokeWidth="2"/>
                  <text x="480" y="265" textAnchor="middle" fontSize="10" fill={defined.text.secondary} fontWeight="500">Deploy</text>
                  <text x="480" y="278" textAnchor="middle" fontSize="10" fill={defined.text.secondary} fontWeight="500">Pipeline</text>
                  <text x="480" y="295" textAnchor="middle" fontSize="9" fill={defined.text.muted} fontWeight="600">P2</text>
                </svg>
              </div>
            </div>

            {/* MVP Scope */}
            <div style={{marginTop: 48, padding: 24, border: `2px solid ${defined.accent.primary}`, borderRadius: 8}}>
              <h4 style={{fontSize: 16, fontWeight: 600, margin: '0 0 16px 0'}}>MVP Scope (P0 Features)</h4>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
                <div>
                  <span style={{fontSize: 13, fontWeight: 600}}>Graph Navigation</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Experiments as nodes. Click to traverse relationships. Filter by type.</p>
                </div>
                <div>
                  <span style={{fontSize: 13, fontWeight: 600}}>Pre-Run Check</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Cost/time estimates. Similar experiment warnings. Mandatory before run.</p>
                </div>
                <div>
                  <span style={{fontSize: 13, fontWeight: 600}}>Evaluation Center</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Structured evals. Side-by-side comparison. Version tracking.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 2: WIREFRAME EXPLORATIONS */}
          {/* ============================================ */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Wireframe Explorations</h2>
            <p style={styles.bodyText}>
              For each core screen, we explored 3-4 layout approaches. Tested with 2 participants from original research.
            </p>

            {/* Graph View Explorations */}
            <div style={{marginTop: 40}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24}}>
                <h3 style={{fontSize: 18, fontWeight: 600, margin: 0}}>Graph View: 3 Approaches</h3>
                <span style={{fontSize: 12, color: defined.text.muted}}>Tested with Liam R. and Sarah H.</span>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
                {/* Option A: Full Canvas */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>A: Full Canvas</span>
                    <span style={{fontSize: 11, color: defined.accent.danger, fontWeight: 500}}>✗ Rejected</span>
                  </div>
                  <svg width="100%" height="180" viewBox="0 0 280 180" style={{background: '#FAFAFA'}}>
                    {/* Full screen graph */}
                    <rect x="10" y="10" width="260" height="160" fill="none" stroke="#CCC" strokeWidth="1" strokeDasharray="4,2"/>
                    <circle cx="70" cy="50" r="20" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <circle cx="140" cy="90" r="25" fill="#333"/>
                    <circle cx="210" cy="60" r="18" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <circle cx="80" cy="140" r="16" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <circle cx="180" cy="150" r="16" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <line x1="85" y1="62" x2="120" y2="78" stroke="#CCC" strokeWidth="1"/>
                    <line x1="195" y1="68" x2="162" y2="80" stroke="#CCC" strokeWidth="1"/>
                    <line x1="125" y1="108" x2="92" y2="128" stroke="#CCC" strokeWidth="1"/>
                    <line x1="155" y1="110" x2="172" y2="138" stroke="#CCC" strokeWidth="1"/>
                    <text x="140" y="25" textAnchor="middle" fontSize="9" fill="#999">infinite canvas</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.danger, margin: '0 0 8px 0', fontWeight: 500}}>Problems:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Lost in space — no anchor point</li>
                      <li>Where am I? What am I looking at?</li>
                      <li>No details without clicking</li>
                    </ul>
                  </div>
                </div>

                {/* Option B: Split Panel */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>B: Split Panel</span>
                    <span style={{fontSize: 11, color: defined.accent.success, fontWeight: 500}}>✓ Selected</span>
                  </div>
                  <svg width="100%" height="180" viewBox="0 0 280 180" style={{background: '#FAFAFA'}}>
                    {/* Sidebar */}
                    <rect x="10" y="10" width="50" height="160" fill="#E8E8E8" stroke="#CCC" strokeWidth="1"/>
                    <rect x="18" y="25" width="34" height="12" fill="#333"/>
                    <rect x="18" y="45" width="34" height="12" fill="none" stroke="#CCC" strokeWidth="1"/>
                    <rect x="18" y="65" width="34" height="12" fill="none" stroke="#CCC" strokeWidth="1"/>
                    
                    {/* Graph area */}
                    <rect x="65" y="10" width="130" height="160" fill="none" stroke="#CCC" strokeWidth="1"/>
                    <circle cx="100" cy="50" r="15" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <circle cx="130" cy="90" r="20" fill="#333"/>
                    <circle cx="160" cy="55" r="12" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <circle cx="110" cy="140" r="12" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <circle cx="155" cy="135" r="12" fill="none" stroke="#999" strokeWidth="1.5"/>
                    <line x1="110" y1="60" x2="118" y2="75" stroke="#CCC" strokeWidth="1"/>
                    <line x1="150" y1="62" x2="142" y2="75" stroke="#CCC" strokeWidth="1"/>
                    <line x1="120" y1="105" x2="115" y2="128" stroke="#CCC" strokeWidth="1"/>
                    <line x1="145" y1="105" x2="150" y2="125" stroke="#CCC" strokeWidth="1"/>
                    
                    {/* Detail panel */}
                    <rect x="200" y="10" width="70" height="160" fill="#FFF" stroke="#CCC" strokeWidth="1"/>
                    <rect x="208" y="20" width="54" height="8" fill="#E8E8E8"/>
                    <rect x="208" y="35" width="40" height="6" fill="#E8E8E8"/>
                    <rect x="208" y="55" width="54" height="1" fill="#E8E8E8"/>
                    <rect x="208" y="65" width="30" height="5" fill="#E8E8E8"/>
                    <rect x="208" y="75" width="45" height="5" fill="#E8E8E8"/>
                    <rect x="208" y="85" width="35" height="5" fill="#E8E8E8"/>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.success, margin: '0 0 8px 0', fontWeight: 500}}>Why it worked:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Context always visible</li>
                      <li>Details on selection</li>
                      <li>Familiar app shell pattern</li>
                    </ul>
                  </div>
                </div>

                {/* Option C: Tree View */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>C: Tree Hierarchy</span>
                    <span style={{fontSize: 11, color: defined.accent.danger, fontWeight: 500}}>✗ Rejected</span>
                  </div>
                  <svg width="100%" height="180" viewBox="0 0 280 180" style={{background: '#FAFAFA'}}>
                    {/* Tree structure */}
                    <rect x="30" y="20" width="220" height="25" fill="none" stroke="#999" strokeWidth="1"/>
                    <text x="45" y="37" fontSize="10" fill="#666">▼ Paper: arXiv:2301.07041</text>
                    
                    <rect x="50" y="55" width="200" height="22" fill="#E8E8E8" stroke="#999" strokeWidth="1"/>
                    <text x="65" y="70" fontSize="10" fill="#333">▼ Exp: vit-finetune-042</text>
                    
                    <rect x="70" y="85" width="180" height="20" fill="none" stroke="#CCC" strokeWidth="1"/>
                    <text x="85" y="99" fontSize="9" fill="#666">Model: vit-prod-v2.1</text>
                    
                    <rect x="70" y="110" width="180" height="20" fill="none" stroke="#CCC" strokeWidth="1"/>
                    <text x="85" y="124" fontSize="9" fill="#666">Eval: Safety v2.1</text>
                    
                    <rect x="50" y="140" width="200" height="22" fill="none" stroke="#CCC" strokeWidth="1"/>
                    <text x="65" y="155" fontSize="10" fill="#666">▶ Exp: vit-finetune-043</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.danger, margin: '0 0 8px 0', fontWeight: 500}}>Problems:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Forces single hierarchy</li>
                      <li>Experiments have multiple parents</li>
                      <li>"This isn't how I think about it"</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test findings */}
              <div style={{marginTop: 24, padding: 20, background: '#FFF', border: `1px solid ${defined.border.light}`, borderRadius: 8}}>
                <span style={styles.detailLabel}>Usability Test Findings</span>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 12}}>
                  <div>
                    <p style={{fontSize: 13, margin: 0}}><strong>Liam:</strong> "Option B is the only one where I can see relationships AND details at once. With A, I'm clicking constantly. With C, I can't see that my experiment has two parent datasets."</p>
                  </div>
                  <div>
                    <p style={{fontSize: 13, margin: 0}}><strong>Sarah:</strong> "The split panel feels like VS Code or Figma — I already know how to use it. The tree forces me into a structure that doesn't match how experiments actually work."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pre-Run Check Explorations */}
            <div style={{marginTop: 56}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24}}>
                <h3 style={{fontSize: 18, fontWeight: 600, margin: 0}}>Pre-Run Check: 3 Approaches</h3>
                <span style={{fontSize: 12, color: defined.text.muted}}>Tested with Marcella G. and David C.</span>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24}}>
                {/* Option A: Inline Warning */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>A: Inline Warning</span>
                    <span style={{fontSize: 11, color: defined.accent.danger, fontWeight: 500}}>✗ Rejected</span>
                  </div>
                  <svg width="100%" height="180" viewBox="0 0 280 180" style={{background: '#FAFAFA'}}>
                    {/* Run config form */}
                    <rect x="20" y="15" width="240" height="25" fill="#FFF" stroke="#CCC" strokeWidth="1"/>
                    <text x="30" y="32" fontSize="9" fill="#999">Model: vit-base</text>
                    
                    <rect x="20" y="48" width="240" height="25" fill="#FFF" stroke="#CCC" strokeWidth="1"/>
                    <text x="30" y="65" fontSize="9" fill="#999">Learning rate: 1e-4</text>
                    
                    {/* Small warning banner */}
                    <rect x="20" y="85" width="240" height="30" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1"/>
                    <text x="30" y="104" fontSize="9" fill="#92400E">⚠ 2 similar experiments exist</text>
                    
                    {/* Run button */}
                    <rect x="180" y="130" width="80" height="30" fill="#333"/>
                    <text x="220" y="150" textAnchor="middle" fontSize="11" fill="#FFF">Run</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.danger, margin: '0 0 8px 0', fontWeight: 500}}>Problems:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Easy to dismiss/ignore</li>
                      <li>No cost estimate visible</li>
                      <li>Banner blindness</li>
                    </ul>
                  </div>
                </div>

                {/* Option B: Modal Gate */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>B: Modal Gate</span>
                    <span style={{fontSize: 11, color: defined.accent.success, fontWeight: 500}}>✓ Selected</span>
                  </div>
                  <svg width="100%" height="180" viewBox="0 0 280 180" style={{background: '#FAFAFA'}}>
                    {/* Dimmed background */}
                    <rect x="0" y="0" width="280" height="180" fill="#000" opacity="0.3"/>
                    
                    {/* Modal */}
                    <rect x="30" y="20" width="220" height="140" fill="#FFF" stroke="#CCC" strokeWidth="1" rx="4"/>
                    <text x="140" y="45" textAnchor="middle" fontSize="12" fill="#333" fontWeight="600">Before you run...</text>
                    
                    {/* Stats */}
                    <rect x="45" y="55" width="60" height="35" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <text x="75" y="72" textAnchor="middle" fontSize="8" fill="#999">COST</text>
                    <text x="75" y="85" textAnchor="middle" fontSize="11" fill="#333" fontWeight="600">$847</text>
                    
                    <rect x="115" y="55" width="60" height="35" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <text x="145" y="72" textAnchor="middle" fontSize="8" fill="#999">TIME</text>
                    <text x="145" y="85" textAnchor="middle" fontSize="11" fill="#333" fontWeight="600">4.2h</text>
                    
                    <rect x="185" y="55" width="50" height="35" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <text x="210" y="72" textAnchor="middle" fontSize="8" fill="#999">SIMILAR</text>
                    <text x="210" y="85" textAnchor="middle" fontSize="11" fill="#D97706" fontWeight="600">2</text>
                    
                    {/* Buttons */}
                    <rect x="45" y="120" width="85" height="25" fill="none" stroke="#999" strokeWidth="1"/>
                    <text x="87" y="137" textAnchor="middle" fontSize="10" fill="#666">View Similar</text>
                    
                    <rect x="140" y="120" width="95" height="25" fill="#333"/>
                    <text x="187" y="137" textAnchor="middle" fontSize="10" fill="#FFF">Run Anyway</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.success, margin: '0 0 8px 0', fontWeight: 500}}>Why it worked:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Can't skip — forces acknowledgment</li>
                      <li>All info in one place</li>
                      <li>Clear decision point</li>
                    </ul>
                  </div>
                </div>

                {/* Option C: Sidebar Panel */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>C: Side Panel</span>
                    <span style={{fontSize: 11, color: defined.accent.warning, fontWeight: 500}}>~ Partial</span>
                  </div>
                  <svg width="100%" height="180" viewBox="0 0 280 180" style={{background: '#FAFAFA'}}>
                    {/* Main form area */}
                    <rect x="10" y="10" width="170" height="160" fill="#FFF" stroke="#CCC" strokeWidth="1"/>
                    <rect x="20" y="25" width="150" height="20" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <rect x="20" y="55" width="150" height="20" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <rect x="20" y="85" width="150" height="20" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <rect x="20" y="130" width="70" height="25" fill="#333"/>
                    <text x="55" y="147" textAnchor="middle" fontSize="10" fill="#FFF">Run</text>
                    
                    {/* Side panel */}
                    <rect x="185" y="10" width="85" height="160" fill="#FFFBEB" stroke="#F59E0B" strokeWidth="1"/>
                    <text x="227" y="30" textAnchor="middle" fontSize="8" fill="#92400E" fontWeight="600">ESTIMATES</text>
                    <text x="195" y="50" fontSize="8" fill="#666">Cost: $847</text>
                    <text x="195" y="65" fontSize="8" fill="#666">Time: 4.2h</text>
                    <text x="195" y="90" fontSize="8" fill="#92400E" fontWeight="600">SIMILAR</text>
                    <text x="195" y="105" fontSize="8" fill="#666">run-038</text>
                    <text x="195" y="118" fontSize="8" fill="#666">run-027</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.warning, margin: '0 0 8px 0', fontWeight: 500}}>Tradeoffs:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Info visible but ignorable</li>
                      <li>Works for "FYI" not "stop"</li>
                      <li>Used for annotations instead</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test findings */}
              <div style={{marginTop: 24, padding: 20, background: '#FFF', border: `1px solid ${defined.border.light}`, borderRadius: 8}}>
                <span style={styles.detailLabel}>Usability Test Findings</span>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 12}}>
                  <div>
                    <p style={{fontSize: 13, margin: 0}}><strong>Marcella:</strong> "The modal is annoying in a good way. In my lab, we NEED to stop and check. With the inline warning, my students would 100% click through without reading."</p>
                  </div>
                  <div>
                    <p style={{fontSize: 13, margin: 0}}><strong>David:</strong> "I actually like seeing cost estimates before I commit. Makes me feel like the tool is on my side, not just a run button."</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Eval Center Explorations */}
            <div style={{marginTop: 56}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 24}}>
                <h3 style={{fontSize: 18, fontWeight: 600, margin: 0}}>Evaluation Center: 2 Approaches</h3>
                <span style={{fontSize: 12, color: defined.text.muted}}>Tested with Sarah H.</span>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
                {/* Option A: Card Grid */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>A: Model Cards</span>
                    <span style={{fontSize: 11, color: defined.accent.danger, fontWeight: 500}}>✗ Rejected</span>
                  </div>
                  <svg width="100%" height="200" viewBox="0 0 280 200" style={{background: '#FAFAFA'}}>
                    {/* Card 1 */}
                    <rect x="15" y="15" width="120" height="80" fill="#FFF" stroke="#CCC" strokeWidth="1" rx="4"/>
                    <text x="75" y="35" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">claude-v2.1</text>
                    <text x="75" y="55" textAnchor="middle" fontSize="18" fill="#16A34A" fontWeight="600">94.2%</text>
                    <text x="75" y="75" textAnchor="middle" fontSize="9" fill="#16A34A">✓ Pass</text>
                    
                    {/* Card 2 */}
                    <rect x="145" y="15" width="120" height="80" fill="#FFF" stroke="#CCC" strokeWidth="1" rx="4"/>
                    <text x="205" y="35" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">claude-v2.0</text>
                    <text x="205" y="55" textAnchor="middle" fontSize="18" fill="#16A34A" fontWeight="600">91.8%</text>
                    <text x="205" y="75" textAnchor="middle" fontSize="9" fill="#16A34A">✓ Pass</text>
                    
                    {/* Card 3 */}
                    <rect x="15" y="105" width="120" height="80" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1" rx="4"/>
                    <text x="75" y="125" textAnchor="middle" fontSize="10" fill="#333" fontWeight="600">gpt-4-0125</text>
                    <text x="75" y="145" textAnchor="middle" fontSize="18" fill="#DC2626" fontWeight="600">78.3%</text>
                    <text x="75" y="165" textAnchor="middle" fontSize="9" fill="#DC2626">✗ Fail</text>
                    
                    {/* Card 4 */}
                    <rect x="145" y="105" width="120" height="80" fill="#FFF" stroke="#CCC" strokeWidth="1" rx="4" strokeDasharray="4,2"/>
                    <text x="205" y="145" textAnchor="middle" fontSize="10" fill="#999">+ Add model</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.danger, margin: '0 0 8px 0', fontWeight: 500}}>Problems:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>Hard to compare side-by-side</li>
                      <li>Where's latency? Cost?</li>
                      <li>Doesn't scale past 4 models</li>
                    </ul>
                  </div>
                </div>

                {/* Option B: Table */}
                <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                  <div style={{padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <span style={{fontWeight: 600, fontSize: 13}}>B: Comparison Table</span>
                    <span style={{fontSize: 11, color: defined.accent.success, fontWeight: 500}}>✓ Selected</span>
                  </div>
                  <svg width="100%" height="200" viewBox="0 0 280 200" style={{background: '#FAFAFA'}}>
                    {/* Header */}
                    <rect x="10" y="15" width="260" height="25" fill="#F5F5F5" stroke="#E5E5E5" strokeWidth="1"/>
                    <text x="55" y="32" textAnchor="middle" fontSize="8" fill="#666">MODEL</text>
                    <text x="115" y="32" textAnchor="middle" fontSize="8" fill="#666">SAFETY</text>
                    <text x="165" y="32" textAnchor="middle" fontSize="8" fill="#666">LATENCY</text>
                    <text x="210" y="32" textAnchor="middle" fontSize="8" fill="#666">COST</text>
                    <text x="250" y="32" textAnchor="middle" fontSize="8" fill="#666">STATUS</text>
                    
                    {/* Row 1 */}
                    <rect x="10" y="40" width="260" height="35" fill="#FFF" stroke="#E5E5E5" strokeWidth="1"/>
                    <text x="55" y="60" textAnchor="middle" fontSize="9" fill="#333">claude-v2.1</text>
                    <text x="115" y="60" textAnchor="middle" fontSize="10" fill="#16A34A" fontWeight="600">94.2%</text>
                    <text x="165" y="60" textAnchor="middle" fontSize="9" fill="#666">120ms</text>
                    <text x="210" y="60" textAnchor="middle" fontSize="9" fill="#666">$0.82</text>
                    <text x="250" y="60" textAnchor="middle" fontSize="9" fill="#16A34A">✓</text>
                    
                    {/* Row 2 */}
                    <rect x="10" y="75" width="260" height="35" fill="#FAFAFA" stroke="#E5E5E5" strokeWidth="1"/>
                    <text x="55" y="95" textAnchor="middle" fontSize="9" fill="#333">claude-v2.0</text>
                    <text x="115" y="95" textAnchor="middle" fontSize="10" fill="#16A34A" fontWeight="600">91.8%</text>
                    <text x="165" y="95" textAnchor="middle" fontSize="9" fill="#666">145ms</text>
                    <text x="210" y="95" textAnchor="middle" fontSize="9" fill="#666">$0.78</text>
                    <text x="250" y="95" textAnchor="middle" fontSize="9" fill="#16A34A">✓</text>
                    
                    {/* Row 3 - fail */}
                    <rect x="10" y="110" width="260" height="35" fill="#FEF2F2" stroke="#FCA5A5" strokeWidth="1"/>
                    <text x="55" y="130" textAnchor="middle" fontSize="9" fill="#333">gpt-4-0125</text>
                    <text x="115" y="130" textAnchor="middle" fontSize="10" fill="#DC2626" fontWeight="600">78.3%</text>
                    <text x="165" y="130" textAnchor="middle" fontSize="9" fill="#666">210ms</text>
                    <text x="210" y="130" textAnchor="middle" fontSize="9" fill="#666">$1.20</text>
                    <text x="250" y="130" textAnchor="middle" fontSize="9" fill="#DC2626">✗</text>
                    
                    {/* Threshold line */}
                    <line x1="92" y1="50" x2="92" y2="145" stroke="#DC2626" strokeWidth="1" strokeDasharray="3,2"/>
                    <text x="88" y="165" fontSize="7" fill="#DC2626">90% threshold</text>
                  </svg>
                  <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`}}>
                    <p style={{fontSize: 12, color: defined.accent.success, margin: '0 0 8px 0', fontWeight: 500}}>Why it worked:</p>
                    <ul style={{fontSize: 11, color: defined.text.secondary, margin: 0, paddingLeft: 16}}>
                      <li>All dimensions comparable</li>
                      <li>Threshold line shows pass/fail</li>
                      <li>Scales to many models</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Test findings */}
              <div style={{marginTop: 24, padding: 20, background: '#FFF', border: `1px solid ${defined.border.light}`, borderRadius: 8}}>
                <span style={styles.detailLabel}>Usability Test Findings</span>
                <p style={{fontSize: 13, margin: '12px 0 0 0'}}><strong>Sarah:</strong> "The table is exactly what I build manually in spreadsheets every week. Cards look pretty but I can't actually compare. When I'm deciding which model to deploy, I need safety AND latency AND cost in one view."</p>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 3: LAYOUT EVOLUTION */}
          {/* ============================================ */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Layout Evolution</h2>
            <p style={styles.bodyText}>
              The graph view went through 3 major iterations based on testing feedback. Here's how it evolved:
            </p>

            <div style={{marginTop: 32}}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 32}}>
                {/* V1 */}
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <span style={{fontSize: 12, fontWeight: 600, color: defined.text.muted}}>V1: Initial</span>
                    <span style={{fontSize: 11, color: defined.accent.danger}}>Week 1</span>
                  </div>
                  <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                    <svg width="100%" height="200" viewBox="0 0 280 200" style={{background: '#FAFAFA'}}>
                      {/* Simple sidebar + canvas */}
                      <rect x="10" y="10" width="40" height="180" fill="#E8E8E8" stroke="#CCC" strokeWidth="1"/>
                      <rect x="55" y="10" width="215" height="180" fill="#FFF" stroke="#CCC" strokeWidth="1"/>
                      
                      {/* Nodes scattered */}
                      <circle cx="100" cy="50" r="18" fill="none" stroke="#999" strokeWidth="1.5"/>
                      <circle cx="200" cy="80" r="22" fill="#333"/>
                      <circle cx="150" cy="140" r="16" fill="none" stroke="#999" strokeWidth="1.5"/>
                      <circle cx="230" cy="150" r="16" fill="none" stroke="#999" strokeWidth="1.5"/>
                      
                      {/* Lines */}
                      <line x1="115" y1="60" x2="180" y2="72" stroke="#CCC" strokeWidth="1"/>
                      <line x1="185" y1="98" x2="162" y2="128" stroke="#CCC" strokeWidth="1"/>
                      <line x1="215" y1="98" x2="225" y2="135" stroke="#CCC" strokeWidth="1"/>
                    </svg>
                    <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`, fontSize: 12}}>
                      <p style={{margin: '0 0 8px 0', color: defined.accent.danger, fontWeight: 500}}>Issues found:</p>
                      <ul style={{margin: 0, paddingLeft: 16, color: defined.text.secondary, fontSize: 11}}>
                        <li>"Where do I see details?"</li>
                        <li>"I clicked a node, nothing happened"</li>
                        <li>No visual hierarchy</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* V2 */}
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <span style={{fontSize: 12, fontWeight: 600, color: defined.text.muted}}>V2: Added Detail Panel</span>
                    <span style={{fontSize: 11, color: defined.accent.warning}}>Week 2</span>
                  </div>
                  <div style={{background: '#FFF', border: `1px solid ${defined.border.medium}`, borderRadius: 8, overflow: 'hidden'}}>
                    <svg width="100%" height="200" viewBox="0 0 280 200" style={{background: '#FAFAFA'}}>
                      {/* Sidebar */}
                      <rect x="10" y="10" width="40" height="180" fill="#E8E8E8" stroke="#CCC" strokeWidth="1"/>
                      
                      {/* Graph area - smaller */}
                      <rect x="55" y="10" width="140" height="180" fill="#FFF" stroke="#CCC" strokeWidth="1"/>
                      <circle cx="90" cy="50" r="15" fill="none" stroke="#999" strokeWidth="1.5"/>
                      <circle cx="125" cy="100" r="20" fill="#333"/>
                      <circle cx="160" cy="60" r="12" fill="none" stroke="#999" strokeWidth="1.5"/>
                      <circle cx="100" cy="155" r="12" fill="none" stroke="#999" strokeWidth="1.5"/>
                      <circle cx="155" cy="150" r="12" fill="none" stroke="#999" strokeWidth="1.5"/>
                      <line x1="100" y1="60" x2="112" y2="85" stroke="#CCC" strokeWidth="1"/>
                      <line x1="150" y1="68" x2="138" y2="85" stroke="#CCC" strokeWidth="1"/>
                      
                      {/* Detail panel */}
                      <rect x="200" y="10" width="70" height="180" fill="#FFF" stroke="#6366F1" strokeWidth="2"/>
                      <rect x="208" y="20" width="54" height="8" fill="#E8E8E8"/>
                      <rect x="208" y="35" width="40" height="6" fill="#E8E8E8"/>
                      <rect x="208" y="55" width="54" height="1" fill="#E8E8E8"/>
                      <text x="208" y="75" fontSize="7" fill="#999">DETAILS</text>
                      <rect x="208" y="82" width="45" height="5" fill="#E8E8E8"/>
                      <rect x="208" y="92" width="35" height="5" fill="#E8E8E8"/>
                      <rect x="208" y="102" width="50" height="5" fill="#E8E8E8"/>
                    </svg>
                    <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`, fontSize: 12}}>
                      <p style={{margin: '0 0 8px 0', color: defined.accent.warning, fontWeight: 500}}>Better, but:</p>
                      <ul style={{margin: 0, paddingLeft: 16, color: defined.text.secondary, fontSize: 11}}>
                        <li>Panel felt cramped</li>
                        <li>Nodes still too similar</li>
                        <li>"Which one is the paper?"</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* V3 Final */}
                <div>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                    <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>V3: Final</span>
                    <span style={{fontSize: 11, color: defined.accent.success}}>Week 3</span>
                  </div>
                  <div style={{background: '#FFF', border: `2px solid ${defined.accent.primary}`, borderRadius: 8, overflow: 'hidden'}}>
                    <svg width="100%" height="200" viewBox="0 0 280 200" style={{background: '#FAFAFA'}}>
                      {/* Sidebar with icons */}
                      <rect x="10" y="10" width="45" height="180" fill="#18181B" stroke="none"/>
                      <rect x="18" y="25" width="30" height="20" fill="#6366F1" rx="3"/>
                      <rect x="18" y="52" width="30" height="20" fill="transparent" stroke="#555" rx="3"/>
                      <rect x="18" y="79" width="30" height="20" fill="transparent" stroke="#555" rx="3"/>
                      
                      {/* Graph area with distinct nodes */}
                      <rect x="60" y="10" width="130" height="180" fill="#FDFCFA" stroke="#E5E5E5" strokeWidth="1"/>
                      
                      {/* Paper - document icon style */}
                      <rect x="75" y="35" width="30" height="35" fill="#FFF" stroke="#999" strokeWidth="1.5" rx="2"/>
                      <text x="90" y="58" textAnchor="middle" fontSize="7" fill="#666">PAPER</text>
                      
                      {/* Dataset - diamond style */}
                      <polygon points="165,40 180,55 165,70 150,55" fill="#FFF" stroke="#999" strokeWidth="1.5"/>
                      <text x="165" y="58" textAnchor="middle" fontSize="6" fill="#666">DATA</text>
                      
                      {/* Experiment - selected, prominent */}
                      <circle cx="125" cy="105" r="22" fill="#6366F1" stroke="#6366F1" strokeWidth="2"/>
                      <text x="125" y="108" textAnchor="middle" fontSize="7" fill="#FFF" fontWeight="600">EXP</text>
                      
                      {/* Model - hexagon */}
                      <circle cx="95" cy="160" r="14" fill="#FFF" stroke="#999" strokeWidth="1.5"/>
                      <text x="95" y="163" textAnchor="middle" fontSize="6" fill="#666">MOD</text>
                      
                      {/* Eval - circle with dot */}
                      <circle cx="155" cy="158" r="14" fill="#FFF" stroke="#999" strokeWidth="1.5"/>
                      <circle cx="155" cy="158" r="4" fill="#16A34A"/>
                      
                      {/* Lines */}
                      <line x1="95" y1="70" x2="112" y2="88" stroke="#CCC" strokeWidth="1.5"/>
                      <line x1="155" y1="70" x2="138" y2="88" stroke="#CCC" strokeWidth="1.5"/>
                      <line x1="112" y1="122" x2="100" y2="146" stroke="#CCC" strokeWidth="1.5"/>
                      <line x1="138" y1="122" x2="150" y2="145" stroke="#CCC" strokeWidth="1.5"/>
                      
                      {/* Detail panel - wider */}
                      <rect x="195" y="10" width="75" height="180" fill="#FFF" stroke="#E5E5E5" strokeWidth="1"/>
                      <text x="205" y="28" fontSize="8" fill="#999">SELECTED</text>
                      <text x="205" y="42" fontSize="10" fill="#333" fontWeight="600">vit-finetune-042</text>
                      <rect x="205" y="52" width="55" height="1" fill="#E8E8E8"/>
                      <text x="205" y="68" fontSize="7" fill="#999">Status</text>
                      <text x="245" y="68" fontSize="7" fill="#16A34A">Complete</text>
                      <text x="205" y="82" fontSize="7" fill="#999">Cost</text>
                      <text x="245" y="82" fontSize="7" fill="#333">$847</text>
                      <text x="205" y="96" fontSize="7" fill="#999">Time</text>
                      <text x="245" y="96" fontSize="7" fill="#333">4h 12m</text>
                    </svg>
                    <div style={{padding: 12, borderTop: `1px solid ${defined.border.light}`, fontSize: 12}}>
                      <p style={{margin: '0 0 8px 0', color: defined.accent.success, fontWeight: 500}}>✓ Shipped</p>
                      <ul style={{margin: 0, paddingLeft: 16, color: defined.text.secondary, fontSize: 11}}>
                        <li>Distinct node shapes by type</li>
                        <li>Dark sidebar for focus</li>
                        <li>Wider detail panel</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Key changes summary */}
            <div style={{marginTop: 40, padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
              <span style={styles.detailLabel}>Key Changes from Testing</span>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginTop: 16}}>
                <div>
                  <h4 style={{fontSize: 14, margin: '0 0 8px 0'}}>Node Differentiation</h4>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: 0}}>Papers, datasets, experiments, models, and evals each have distinct shapes. Users can identify type at a glance without reading labels.</p>
                </div>
                <div>
                  <h4 style={{fontSize: 14, margin: '0 0 8px 0'}}>Selection State</h4>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: 0}}>Selected node uses brand color and is larger. Detail panel border matches. Clear visual connection between graph and panel.</p>
                </div>
                <div>
                  <h4 style={{fontSize: 14, margin: '0 0 8px 0'}}>Information Density</h4>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: 0}}>Detail panel shows status, cost, time, and relationships without scrolling. Researchers wanted more data visible, not less.</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 4: USER FLOWS */}
          {/* ============================================ */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>User Flows</h2>
            <p style={styles.bodyText}>
              How the core screens connect. Three primary flows covering the main use cases:
            </p>
            
            {/* Flow 1: Start from paper */}
            <div style={{marginTop: 32}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{width: 28, height: 28, borderRadius: '50%', background: defined.accent.primary, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600}}>1</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: 0}}>Reproduce a paper</h4>
                <span style={{fontSize: 12, color: defined.text.muted, marginLeft: 'auto'}}>~43% of workflow time (telemetry)</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: 20, background: defined.bg.primary, borderRadius: 8, overflowX: 'auto'}}>
                {[
                  { screen: 'Paper Import', action: 'Paste arXiv URL' },
                  { screen: 'Paper Detail', action: 'View repro attempts' },
                  { screen: 'New Experiment', action: 'Fork existing config' },
                  { screen: 'Pre-Run Check', action: 'Confirm estimates' },
                  { screen: 'Graph View', action: 'Track progress' },
                  { screen: 'Eval Center', action: 'Compare to original' },
                ].map((step, i) => (
                  <React.Fragment key={i}>
                    <div style={{minWidth: 120, padding: 12, background: defined.bg.secondary, borderRadius: 6, textAlign: 'center'}}>
                      <span style={{display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4}}>{step.screen}</span>
                      <span style={{display: 'block', fontSize: 11, color: defined.text.muted}}>{step.action}</span>
                    </div>
                    {i < 5 && <span style={{color: defined.text.muted}}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Flow 2: Run new experiment */}
            <div style={{marginTop: 32}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{width: 28, height: 28, borderRadius: '50%', background: defined.accent.primary, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600}}>2</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: 0}}>Run a new experiment</h4>
                <span style={{fontSize: 12, color: defined.text.muted, marginLeft: 'auto'}}>Core daily workflow</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: 20, background: defined.bg.primary, borderRadius: 8, overflowX: 'auto'}}>
                {[
                  { screen: 'Graph View', action: 'Find related work' },
                  { screen: 'Experiment Detail', action: 'Clone & modify' },
                  { screen: 'Pre-Run Check', action: 'Review duplicates' },
                  { screen: 'Running State', action: 'Monitor live' },
                  { screen: 'Graph View', action: 'Link to lineage' },
                ].map((step, i) => (
                  <React.Fragment key={i}>
                    <div style={{minWidth: 120, padding: 12, background: defined.bg.secondary, borderRadius: 6, textAlign: 'center'}}>
                      <span style={{display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4}}>{step.screen}</span>
                      <span style={{display: 'block', fontSize: 11, color: defined.text.muted}}>{step.action}</span>
                    </div>
                    {i < 4 && <span style={{color: defined.text.muted}}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Flow 3: Evaluate for production */}
            <div style={{marginTop: 32}}>
              <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16}}>
                <span style={{width: 28, height: 28, borderRadius: '50%', background: defined.accent.primary, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600}}>3</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: 0}}>Evaluate for production</h4>
                <span style={{fontSize: 12, color: defined.text.muted, marginLeft: 'auto'}}>Sarah's workflow</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: 20, background: defined.bg.primary, borderRadius: 8, overflowX: 'auto'}}>
                {[
                  { screen: 'Eval Center', action: 'Select benchmark' },
                  { screen: 'Model Picker', action: 'Add candidates' },
                  { screen: 'Eval Running', action: 'Track progress' },
                  { screen: 'Eval Results', action: 'Compare side-by-side' },
                  { screen: 'Graph View', action: 'Record decision' },
                ].map((step, i) => (
                  <React.Fragment key={i}>
                    <div style={{minWidth: 120, padding: 12, background: defined.bg.secondary, borderRadius: 6, textAlign: 'center'}}>
                      <span style={{display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 4}}>{step.screen}</span>
                      <span style={{display: 'block', fontSize: 11, color: defined.text.muted}}>{step.action}</span>
                    </div>
                    {i < 4 && <span style={{color: defined.text.muted}}>→</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 5: SUCCESS METRICS */}
          {/* ============================================ */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Success Metrics</h2>
            <p style={styles.bodyText}>
              How we'd measure if this is working. Baselines estimated from telemetry data; to be validated in pilot.
            </p>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32}}>
              <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, textTransform: 'uppercase'}}>Primary</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 8px 0'}}>Duplicate run rate</h4>
                <p style={{fontSize: 13, color: defined.text.secondary, margin: '0 0 16px 0'}}>% of runs that are near-duplicates of existing runs</p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                  <span style={{color: defined.text.muted}}>Estimated current</span>
                  <span>~12% <span style={{fontSize: 11, color: defined.text.muted}}>(telemetry)</span></span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4}}>
                  <span style={{color: defined.text.muted}}>Target</span>
                  <span style={{color: defined.accent.success, fontWeight: 500}}>&lt;3%</span>
                </div>
              </div>

              <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, textTransform: 'uppercase'}}>Primary</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 8px 0'}}>Time to find related work</h4>
                <p style={{fontSize: 13, color: defined.text.secondary, margin: '0 0 16px 0'}}>How long to find relevant past experiments</p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                  <span style={{color: defined.text.muted}}>Estimated current</span>
                  <span>~25 min <span style={{fontSize: 11, color: defined.text.muted}}>(observation)</span></span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4}}>
                  <span style={{color: defined.text.muted}}>Target</span>
                  <span style={{color: defined.accent.success, fontWeight: 500}}>&lt;2 min</span>
                </div>
              </div>

              <div style={{padding: 24, background: defined.bg.secondary, borderRadius: 8}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, textTransform: 'uppercase'}}>Primary</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 8px 0'}}>Graph adoption rate</h4>
                <p style={{fontSize: 13, color: defined.text.secondary, margin: '0 0 16px 0'}}>% of sessions using graph navigation</p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13}}>
                  <span style={{color: defined.text.muted}}>Baseline</span>
                  <span>N/A (new feature)</span>
                </div>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4}}>
                  <span style={{color: defined.text.muted}}>Target</span>
                  <span style={{color: defined.accent.success, fontWeight: 500}}>&gt;40%</span>
                </div>
              </div>

              <div style={{padding: 24, background: defined.bg.primary, borderRadius: 8, border: `1px solid ${defined.border.light}`}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase'}}>Secondary</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 8px 0'}}>Pre-run check engagement</h4>
                <p style={{fontSize: 13, color: defined.text.secondary, margin: '0 0 16px 0'}}>% who view similar experiments when warned</p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4}}>
                  <span style={{color: defined.text.muted}}>Target</span>
                  <span>&gt;60%</span>
                </div>
              </div>

              <div style={{padding: 24, background: defined.bg.primary, borderRadius: 8, border: `1px solid ${defined.border.light}`}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase'}}>Secondary</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 8px 0'}}>Reproduction success rate</h4>
                <p style={{fontSize: 13, color: defined.text.secondary, margin: '0 0 16px 0'}}>% of paper repros that succeed</p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4}}>
                  <span style={{color: defined.text.muted}}>Target</span>
                  <span>&gt;70%</span>
                </div>
              </div>

              <div style={{padding: 24, background: defined.bg.primary, borderRadius: 8, border: `1px solid ${defined.border.light}`}}>
                <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase'}}>Secondary</span>
                <h4 style={{fontSize: 15, fontWeight: 600, margin: '12px 0 8px 0'}}>Experiment annotation rate</h4>
                <p style={{fontSize: 13, color: defined.text.secondary, margin: '0 0 16px 0'}}>% of experiments with notes added</p>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 4}}>
                  <span style={{color: defined.text.muted}}>Target</span>
                  <span>&gt;30%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 6: FINAL SCREENS */}
          {/* ============================================ */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Final Screens</h2>
            <p style={styles.bodyText}>
              High-fidelity screens with callouts showing how each design decision maps back to research findings.
            </p>
          </section>

          {/* ============================================ */}
          {/* SCREEN 1: GRAPH VIEW */}
          {/* ============================================ */}
          <section style={styles.section}>
            <div style={styles.screenIntro}>
              <span style={styles.screenLabel}>SCREEN 01</span>
              <h2 style={styles.sectionTitle}>Graph View</h2>
              <p style={styles.bodyText}>Primary navigation. Every experiment exists in relationship to others.</p>
            </div>
            
            {/* Actual Mockup */}
            <div style={styles.mockupFrame}>
              <div style={styles.mockupBrowser}>
                <div style={styles.browserDots}>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                </div>
                <span style={styles.browserUrl}>app.lattice.dev/graph</span>
              </div>
              
              <div style={styles.appContainer}>
                {/* Sidebar */}
                <div style={styles.appSidebar}>
                  <div style={styles.sidebarLogo}>L</div>
                  <div style={styles.sidebarNav}>
                    <div style={{...styles.sidebarItem, background: defined.accent.primary, color: '#FFF'}}>
                      <span>◈</span> Graph
                    </div>
                    <div style={styles.sidebarItem}><span>▤</span> Runs</div>
                    <div style={styles.sidebarItem}><span>◉</span> Evals</div>
                    <div style={styles.sidebarItem}><span>◎</span> Models</div>
                    <div style={styles.sidebarItem}><span>⬡</span> Papers</div>
                  </div>
                </div>
                
                {/* Main Content - Graph */}
                <div style={styles.appMain}>
                  <div style={styles.graphHeader}>
                    <h3 style={styles.graphTitle}>Experiment Graph</h3>
                    <div style={styles.graphFilters}>
                      <span style={styles.filterChip}>All relationships</span>
                      <span style={styles.filterChip}>2 hops</span>
                    </div>
                  </div>
                  
                  <div style={styles.graphCanvas}>
                    {/* Paper Node */}
                    <div style={{...styles.graphNode, ...styles.nodePaper, left: 40, top: 20}}>
                      <span style={styles.nodeIcon}>📄</span>
                      <span style={styles.nodeLabel}>arXiv:2301.07041</span>
                      <span style={styles.nodeType}>PAPER</span>
                    </div>
                    
                    {/* Dataset Node */}
                    <div style={{...styles.graphNode, ...styles.nodeDataset, left: 350, top: 20}}>
                      <span style={styles.nodeIcon}>◈</span>
                      <span style={styles.nodeLabel}>ImageNet-1k</span>
                      <span style={styles.nodeType}>DATASET</span>
                    </div>
                    
                    {/* Central Experiment - Selected */}
                    <div style={{...styles.graphNode, ...styles.nodeExperiment, ...styles.nodeSelected, left: 180, top: 110}}>
                      <span style={styles.nodeIcon}>●</span>
                      <span style={styles.nodeLabel}>vit-finetune-042</span>
                      <span style={styles.nodeType}>EXPERIMENT</span>
                      <span style={styles.nodeStatus}>● Completed</span>
                    </div>
                    
                    {/* Downstream: Eval */}
                    <div style={{...styles.graphNode, ...styles.nodeEval, left: 30, top: 220}}>
                      <span style={styles.nodeIcon}>◉</span>
                      <span style={styles.nodeLabel}>Safety v2.1</span>
                      <span style={styles.nodeType}>EVALUATION</span>
                      <span style={{...styles.nodeStatus, color: defined.accent.success}}>✓ Pass</span>
                    </div>
                    
                    {/* Downstream: Model */}
                    <div style={{...styles.graphNode, ...styles.nodeModel, left: 180, top: 220}}>
                      <span style={styles.nodeIcon}>◎</span>
                      <span style={styles.nodeLabel}>vit-prod-v2.1</span>
                      <span style={styles.nodeType}>MODEL</span>
                    </div>
                    
                    {/* Downstream: Variant */}
                    <div style={{...styles.graphNode, ...styles.nodeExperiment, left: 350, top: 220}}>
                      <span style={styles.nodeIcon}>●</span>
                      <span style={styles.nodeLabel}>vit-finetune-043</span>
                      <span style={styles.nodeType}>EXPERIMENT</span>
                      <span style={{...styles.nodeStatus, color: defined.accent.warning}}>● Running</span>
                    </div>
                    
                    {/* Connection lines - SVG overlay */}
                    <svg style={styles.graphLines} viewBox="0 0 500 300">
                      <line x1="100" y1="70" x2="220" y2="110" stroke={defined.border.medium} strokeWidth="2" />
                      <line x1="390" y1="70" x2="280" y2="110" stroke={defined.border.medium} strokeWidth="2" />
                      <line x1="200" y1="175" x2="90" y2="220" stroke={defined.border.medium} strokeWidth="2" />
                      <line x1="240" y1="175" x2="240" y2="220" stroke={defined.border.medium} strokeWidth="2" />
                      <line x1="280" y1="175" x2="390" y2="220" stroke={defined.border.medium} strokeWidth="2" />
                    </svg>
                  </div>
                </div>
                
                {/* Right Panel - Details */}
                <div style={styles.appPanel}>
                  <div style={styles.panelHeader}>
                    <span style={styles.panelLabel}>SELECTED</span>
                    <h4 style={styles.panelTitle}>vit-finetune-042</h4>
                  </div>
                  <div style={styles.panelMeta}>
                    <div style={styles.panelMetaRow}>
                      <span>Status</span><span style={{color: defined.accent.success}}>Completed</span>
                    </div>
                    <div style={styles.panelMetaRow}>
                      <span>Cost</span><span>$847.20</span>
                    </div>
                    <div style={styles.panelMetaRow}>
                      <span>Duration</span><span>4h 12m</span>
                    </div>
                    <div style={styles.panelMetaRow}>
                      <span>Author</span><span>Liam R.</span>
                    </div>
                  </div>
                  <div style={styles.panelSection}>
                    <span style={styles.panelSectionLabel}>RELATIONSHIPS</span>
                    <div style={styles.panelRelation}>
                      <span style={styles.relationLabel}>Reproduces</span>
                      <span style={styles.relationValue}>arXiv:2301.07041</span>
                    </div>
                    <div style={styles.panelRelation}>
                      <span style={styles.relationLabel}>Uses</span>
                      <span style={styles.relationValue}>ImageNet-1k</span>
                    </div>
                    <div style={styles.panelRelation}>
                      <span style={styles.relationLabel}>Produced</span>
                      <span style={styles.relationValue}>vit-prod-v2.1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: 32}}>
              <span style={styles.detailLabel}>Annotated Design Decisions</span>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16}}>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>① Graph as primary nav</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Not buried in a tab — it's the default view. Relationships are the product, not a feature.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "I can't find what others have tried" — cited by 9 of 12 interview participants</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>② Paper node prominent</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Papers are first-class citizens, shown at top of graph. Every experiment traces back to literature.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: Reproduction accounts for 43% of workflow time (telemetry)</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>③ Downstream visible</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>See what an experiment produced: models, evaluations, variants. Answer "what led to this deployed model?"</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "How did we get to production v2?" — Sarah</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>④ Detail panel always visible</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>No modals or popovers. Selection immediately shows metadata, cost, relationships, and actions.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Testing: "With the canvas-only version, I clicked constantly" — Liam</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SCREEN 2: PRE-RUN CHECK */}
          {/* ============================================ */}
          <section style={styles.section}>
            <div style={styles.screenIntro}>
              <span style={styles.screenLabel}>SCREEN 02</span>
              <h2 style={styles.sectionTitle}>Pre-Run Check</h2>
              <p style={styles.bodyText}>Mandatory before every run. Shows cost, time, and similar experiments.</p>
            </div>
            
            <div style={styles.mockupFrame}>
              <div style={styles.mockupBrowser}>
                <div style={styles.browserDots}>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                </div>
                <span style={styles.browserUrl}>app.lattice.dev/run/new</span>
              </div>
              
              <div style={styles.preRunScreen}>
                <div style={styles.preRunCard}>
                  <h3 style={styles.preRunHeading}>Before you run...</h3>
                  <p style={styles.preRunSubhead}>vit-finetune with lr=1e-4, epochs=50</p>
                  
                  <div style={styles.preRunEstimates}>
                    <div style={styles.estimateCard}>
                      <span style={styles.estimateLabel}>Estimated Cost</span>
                      <span style={styles.estimateValue}>$847</span>
                      <span style={styles.estimateRange}>±$120 (based on 12 similar runs)</span>
                    </div>
                    <div style={styles.estimateCard}>
                      <span style={styles.estimateLabel}>Estimated Time</span>
                      <span style={styles.estimateValue}>4.2 hours</span>
                      <span style={styles.estimateRange}>±45 min</span>
                    </div>
                    <div style={styles.estimateCard}>
                      <span style={styles.estimateLabel}>Confidence</span>
                      <span style={{...styles.estimateValue, color: defined.accent.success}}>High</span>
                      <span style={styles.estimateRange}>Similar configs well-represented</span>
                    </div>
                  </div>
                  
                  <div style={styles.preRunWarningBox}>
                    <div style={styles.warningHeader}>
                      <span style={styles.warningIcon}>⚠</span>
                      <span style={styles.warningTitle}>2 similar experiments found</span>
                    </div>
                    <div style={styles.similarList}>
                      <div style={styles.similarItem}>
                        <div style={styles.similarInfo}>
                          <span style={styles.similarName}>vit-finetune-038</span>
                          <span style={styles.similarMeta}>by Marcella G. · 3 days ago</span>
                        </div>
                        <div style={styles.similarMatch}>
                          <span style={styles.matchPercent}>94%</span>
                          <span style={styles.matchLabel}>similar</span>
                        </div>
                      </div>
                      <div style={styles.similarItem}>
                        <div style={styles.similarInfo}>
                          <span style={styles.similarName}>vit-baseline-v2</span>
                          <span style={styles.similarMeta}>by Liam R. · 1 week ago</span>
                        </div>
                        <div style={styles.similarMatch}>
                          <span style={styles.matchPercent}>87%</span>
                          <span style={styles.matchLabel}>similar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.preRunActions}>
                    <button style={styles.actionSecondary}>View Similar Experiments</button>
                    <button style={styles.actionPrimary}>Run Anyway</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: 32}}>
              <span style={styles.detailLabel}>Annotated Design Decisions</span>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16}}>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.warning}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.warning}}>① Mandatory gate</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Can't be dismissed or skipped. Users must acknowledge estimates and similar experiments before running.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "$15k wasted on duplicates" — Marcella's lab</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.warning}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.warning}}>② Cost with confidence interval</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Not just "$847" but "±$120 based on 12 similar runs." Honest about uncertainty.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "Cost estimation is guesswork" — Liam</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.warning}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.warning}}>③ Similarity by config</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Compares actual parameters (lr, epochs, model) not just tags. "94% similar" is meaningful.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: Same tags, different configs = wasted time</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.warning}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.warning}}>④ Shows who ran similar</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>"run-038 by Liam" enables "let me ask Liam" before burning compute. Human coordination.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Testing: "Now I can just Slack them" — David</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SCREEN 3: EVALUATION CENTER */}
          {/* ============================================ */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <div style={styles.screenIntro}>
              <span style={styles.screenLabel}>SCREEN 03</span>
              <h2 style={styles.sectionTitle}>Evaluation Center</h2>
              <p style={styles.bodyText}>Evaluations are first-class objects, not afterthoughts. Compare models side-by-side.</p>
            </div>
            
            <div style={styles.mockupFrame}>
              <div style={styles.mockupBrowser}>
                <div style={styles.browserDots}>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                </div>
                <span style={styles.browserUrl}>app.lattice.dev/evals/safety-v2.1</span>
              </div>
              
              <div style={styles.appContainer}>
                <div style={styles.appSidebar}>
                  <div style={styles.sidebarLogo}>L</div>
                  <div style={styles.sidebarNav}>
                    <div style={styles.sidebarItem}><span>◈</span> Graph</div>
                    <div style={styles.sidebarItem}><span>▤</span> Runs</div>
                    <div style={{...styles.sidebarItem, background: defined.accent.primary, color: '#FFF'}}>
                      <span>◉</span> Evals
                    </div>
                    <div style={styles.sidebarItem}><span>◎</span> Models</div>
                    <div style={styles.sidebarItem}><span>⬡</span> Papers</div>
                  </div>
                </div>
                
                <div style={styles.evalMain}>
                  <div style={styles.evalHeader}>
                    <div>
                      <span style={styles.evalBadge}>EVALUATION</span>
                      <h3 style={styles.evalTitle}>Safety Benchmark v2.1</h3>
                      <p style={styles.evalDesc}>Production safety requirements · 847 test cases</p>
                    </div>
                    <div style={styles.evalStatus}>
                      <span style={styles.evalStatusText}>3 of 4 models complete</span>
                    </div>
                  </div>
                  
                  <div style={styles.evalTable}>
                    <div style={styles.evalTableHeader}>
                      <span style={styles.evalColModel}>Model</span>
                      <span style={styles.evalColScore}>Safety Score</span>
                      <span style={styles.evalColLatency}>Latency</span>
                      <span style={styles.evalColCost}>Cost/1k</span>
                      <span style={styles.evalColStatus}>Status</span>
                    </div>
                    
                    <div style={styles.evalTableRow}>
                      <div style={styles.evalModel}>
                        <span style={styles.evalModelName}>claude-v2.1</span>
                        <span style={styles.evalModelMeta}>from vit-finetune-042</span>
                      </div>
                      <div style={styles.evalScore}>
                        <span style={styles.scoreBar}>
                          <span style={{...styles.scoreBarFill, width: '94%', background: defined.accent.success}}></span>
                        </span>
                        <span style={styles.scoreValue}>94.2%</span>
                      </div>
                      <span style={styles.evalLatency}>120ms</span>
                      <span style={styles.evalCost}>$0.82</span>
                      <span style={{...styles.evalPass, color: defined.accent.success}}>✓ Pass</span>
                    </div>
                    
                    <div style={styles.evalTableRow}>
                      <div style={styles.evalModel}>
                        <span style={styles.evalModelName}>claude-v2.0</span>
                        <span style={styles.evalModelMeta}>from vit-finetune-038</span>
                      </div>
                      <div style={styles.evalScore}>
                        <span style={styles.scoreBar}>
                          <span style={{...styles.scoreBarFill, width: '91.8%', background: defined.accent.success}}></span>
                        </span>
                        <span style={styles.scoreValue}>91.8%</span>
                      </div>
                      <span style={styles.evalLatency}>145ms</span>
                      <span style={styles.evalCost}>$0.78</span>
                      <span style={{...styles.evalPass, color: defined.accent.success}}>✓ Pass</span>
                    </div>
                    
                    <div style={{...styles.evalTableRow, background: 'rgba(239, 68, 68, 0.05)'}}>
                      <div style={styles.evalModel}>
                        <span style={styles.evalModelName}>gpt-4-0125</span>
                        <span style={styles.evalModelMeta}>baseline comparison</span>
                      </div>
                      <div style={styles.evalScore}>
                        <span style={styles.scoreBar}>
                          <span style={{...styles.scoreBarFill, width: '78.3%', background: defined.accent.danger}}></span>
                        </span>
                        <span style={{...styles.scoreValue, color: defined.accent.danger}}>78.3%</span>
                      </div>
                      <span style={styles.evalLatency}>210ms</span>
                      <span style={styles.evalCost}>$1.20</span>
                      <span style={{...styles.evalPass, color: defined.accent.danger}}>✗ Fail</span>
                    </div>
                    
                    <div style={{...styles.evalTableRow, opacity: 0.6}}>
                      <div style={styles.evalModel}>
                        <span style={styles.evalModelName}>mistral-large</span>
                        <span style={styles.evalModelMeta}>baseline comparison</span>
                      </div>
                      <div style={styles.evalScore}>
                        <span style={styles.scoreBar}></span>
                        <span style={styles.scoreValue}>—</span>
                      </div>
                      <span style={styles.evalLatency}>—</span>
                      <span style={styles.evalCost}>—</span>
                      <span style={styles.evalRunning}>Running...</span>
                    </div>
                  </div>
                  
                  <div style={styles.evalThreshold}>
                    <span style={styles.thresholdLabel}>Pass threshold: 90%</span>
                    <span style={styles.thresholdNote}>Set by Marcella G. · Last updated Jan 15</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: 32}}>
              <span style={styles.detailLabel}>Annotated Design Decisions</span>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16}}>
                <div style={{padding: 16, background: '#FFF', borderRadius: 8, borderLeft: `3px solid ${defined.accent.success}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.success}}>① Eval-centric view</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Navigate to an eval, see all models tested against it. Eval is the anchor, not the model.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "Their eval and my eval are different things" — Sarah</p>
                </div>
                <div style={{padding: 16, background: '#FFF', borderRadius: 8, borderLeft: `3px solid ${defined.accent.success}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.success}}>② Evals are versioned</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>"Safety Benchmark v2.1" — evals evolve. Track what version was used for each model.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "I re-run all research evaluations anyway" — Sarah</p>
                </div>
                <div style={{padding: 16, background: '#FFF', borderRadius: 8, borderLeft: `3px solid ${defined.accent.success}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.success}}>③ Threshold is visible</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>90% pass threshold is explicit, not hidden in code. Shows who set it and when.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Testing: "Now I know why it failed" — immediate clarity</p>
                </div>
                <div style={{padding: 16, background: '#FFF', borderRadius: 8, borderLeft: `3px solid ${defined.accent.success}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.success}}>④ Lineage preserved</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>"from vit-finetune-042" — every model traces back to the experiment that produced it.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "How did we get to production v2?" — Sarah</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SCREEN 4: PAPER IMPORT */}
          {/* ============================================ */}
          <section style={styles.section}>
            <div style={styles.screenIntro}>
              <span style={styles.screenLabel}>SCREEN 04</span>
              <h2 style={styles.sectionTitle}>Paper Import</h2>
              <p style={styles.bodyText}>Start from literature. See community reproduction attempts before starting your own.</p>
            </div>
            
            <div style={styles.mockupFrame}>
              <div style={styles.mockupBrowser}>
                <div style={styles.browserDots}>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                  <span style={styles.browserDot}></span>
                </div>
                <span style={styles.browserUrl}>app.lattice.dev/papers/import</span>
              </div>
              
              <div style={styles.paperImportScreen}>
                <div style={styles.paperImportCard}>
                  <h3 style={styles.paperImportHeading}>Import Paper</h3>
                  
                  <div style={styles.paperInput}>
                    <label style={styles.paperInputLabel}>arXiv ID or URL</label>
                    <div style={styles.paperInputRow}>
                      <input style={styles.paperInputField} value="2301.07041" readOnly />
                      <button style={styles.paperInputBtn}>Fetch</button>
                    </div>
                  </div>
                  
                  <div style={styles.paperPreview}>
                    <div style={styles.paperPreviewHeader}>
                      <span style={styles.paperPreviewBadge}>PAPER FOUND</span>
                    </div>
                    <h4 style={styles.paperPreviewTitle}>Scaling Vision Transformers to 22 Billion Parameters</h4>
                    <p style={styles.paperPreviewAuthors}>Dehghani et al. · Google Research · Jan 2023</p>
                    
                    <div style={styles.paperMeta}>
                      <div style={styles.paperMetaItem}>
                        <span style={styles.paperMetaLabel}>Citations</span>
                        <span style={styles.paperMetaValue}>847</span>
                      </div>
                      <div style={styles.paperMetaItem}>
                        <span style={styles.paperMetaLabel}>Code</span>
                        <span style={{...styles.paperMetaValue, color: defined.accent.success}}>✓ Available</span>
                      </div>
                      <div style={styles.paperMetaItem}>
                        <span style={styles.paperMetaLabel}>Verified</span>
                        <span style={{...styles.paperMetaValue, color: defined.accent.success}}>✓ Runs</span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={styles.communitySection}>
                    <h5 style={styles.communitySectionTitle}>Community Reproduction Attempts</h5>
                    <div style={styles.reproAttempts}>
                      <div style={styles.reproAttempt}>
                        <div style={styles.reproAttemptInfo}>
                          <span style={styles.reproName}>@david_ml</span>
                          <span style={styles.reproDate}>Dec 2024</span>
                        </div>
                        <span style={{...styles.reproStatus, color: defined.accent.success}}>✓ Reproduced</span>
                        <span style={styles.reproTime}>8 days</span>
                      </div>
                      <div style={styles.reproAttempt}>
                        <div style={styles.reproAttemptInfo}>
                          <span style={styles.reproName}>@ml_researcher</span>
                          <span style={styles.reproDate}>Nov 2024</span>
                        </div>
                        <span style={{...styles.reproStatus, color: defined.accent.warning}}>⚠ Partial</span>
                        <span style={styles.reproTime}>12 days</span>
                      </div>
                      <div style={styles.reproAttempt}>
                        <div style={styles.reproAttemptInfo}>
                          <span style={styles.reproName}>@ai_lab_intern</span>
                          <span style={styles.reproDate}>Oct 2024</span>
                        </div>
                        <span style={{...styles.reproStatus, color: defined.accent.danger}}>✗ Failed</span>
                        <span style={styles.reproTime}>—</span>
                      </div>
                    </div>
                    <div style={styles.reproSummary}>
                      <span style={styles.reproSummaryText}>Avg. reproduction time: <strong>10 days</strong></span>
                      <span style={styles.reproSummaryText}>Success rate: <strong>67%</strong></span>
                    </div>
                  </div>
                  
                  <div style={styles.paperImportActions}>
                    <button style={styles.actionSecondary}>View Reproduction Notes</button>
                    <button style={styles.actionPrimary}>Start Reproduction</button>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{marginTop: 32}}>
              <span style={styles.detailLabel}>Annotated Design Decisions</span>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginTop: 16}}>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>① Community attempts visible</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Before starting, see who else tried. Success rate, time to reproduce, notes from their attempts.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "I spend 3 weeks then find someone already solved it" — David</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>② Time-to-reproduce shown</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>"Avg. reproduction time: 10 days" — sets realistic expectations. Reduces frustration.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "I thought it would take 2 days" — common misestimation</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>③ Code verification status</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Shows if official code exists, if it runs, if dependencies are met. "✓ Runs" vs. "⚠ Issues"</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "GitHub stars ≠ working code" — Liam</p>
                </div>
                <div style={{padding: 16, background: defined.bg.secondary, borderRadius: 8, borderLeft: `3px solid ${defined.accent.primary}`}}>
                  <span style={{fontSize: 12, fontWeight: 600, color: defined.accent.primary}}>④ Start from literature</span>
                  <p style={{fontSize: 13, color: defined.text.secondary, margin: '8px 0 0 0'}}>Papers are the entry point. Import creates a node in the graph that all reproduction experiments link to.</p>
                  <p style={{fontSize: 12, color: defined.text.muted, margin: '8px 0 0 0', fontStyle: 'italic'}}>Research: "Experiments exist in isolation from literature" — all participants</p>
                </div>
              </div>
            </div>
          </section>

          {/* ============================================ */}
          {/* SECTION 5: OPEN QUESTIONS */}
          {/* ============================================ */}
          <section style={{...styles.section, background: defined.bg.secondary}}>
            <h2 style={styles.sectionTitle}>Open Questions</h2>
            <p style={styles.bodyText}>
              Intellectual honesty about what we don't know. These would be tested in the next phase.
            </p>
            
            <div style={{display: 'grid', gap: 24, marginTop: 32}}>
              {[
                {
                  question: 'Will researchers actually use the graph view as primary navigation?',
                  hypothesis: 'Yes — the "connections" insight was strong across interviews. But graph UIs have historically been hard to get right (see: every "knowledge graph" app).',
                  test: 'A/B test graph vs. traditional list as default view. Primary metric: time-to-find-related-experiment. Secondary: user preference after 2 weeks.',
                  risk: 'High'
                },
                {
                  question: 'Is the pre-run check friction worth the cost savings?',
                  hypothesis: 'Yes for teams (coordination value outweighs friction). Maybe not for solo researchers who know their own history well.',
                  test: 'Measure: (1) skip/dismiss rate, (2) similar-experiment-viewed rate, (3) actual duplicate rate before vs. after. Survey users who skip on why.',
                  risk: 'Medium'
                },
                {
                  question: 'Will people contribute to the public reproduction registry?',
                  hypothesis: 'Uncertain. IP concerns are real (Marcella\'s lab has strict policies). But David\'s desire for community knowledge was visceral.',
                  test: 'Start with lowest-stakes contribution: "reproduction notes" only. Track opt-in rate. Iterate on privacy controls.',
                  risk: 'High'
                },
                {
                  question: 'Does the graph model scale to 10,000+ experiments?',
                  hypothesis: 'Works well for 100s of experiments (tested). Unknown at enterprise scale.',
                  test: 'Performance testing with synthetic large graphs. May need automatic clustering, smart filtering, or hierarchical views.',
                  risk: 'Medium'
                },
              ].map((item, i) => (
                <div key={i} style={{background: '#FFF', borderRadius: 8, padding: 24, border: `1px solid ${defined.border.light}`}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16}}>
                    <h4 style={{fontSize: 16, margin: 0, flex: 1, paddingRight: 16}}>{item.question}</h4>
                    <span style={{fontSize: 11, padding: '4px 8px', borderRadius: 4, background: item.risk === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: item.risk === 'High' ? defined.accent.danger : defined.accent.warning, fontWeight: 500}}>{item.risk} risk</span>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24}}>
                    <div>
                      <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Hypothesis</span>
                      <p style={{fontSize: 14, color: defined.text.secondary, margin: '8px 0 0 0'}}>{item.hypothesis}</p>
                    </div>
                    <div>
                      <span style={{fontSize: 11, fontWeight: 600, color: defined.text.muted, textTransform: 'uppercase', letterSpacing: '0.5px'}}>How We'd Test</span>
                      <p style={{fontSize: 14, color: defined.text.secondary, margin: '8px 0 0 0'}}>{item.test}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ============================================ */}
          {/* CONCLUSION */}
          {/* ============================================ */}
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>What We Learned</h2>
            <div style={{maxWidth: 640}}>
              <p style={{fontSize: 15, lineHeight: 1.8, color: defined.text.secondary, margin: '0 0 24px 0'}}>
                We started this project thinking we'd build a better experiment dashboard. The research redirected us.
              </p>
              <p style={{fontSize: 15, lineHeight: 1.8, color: defined.text.secondary, margin: '0 0 24px 0'}}>
                The actual problem isn't logging runs — tools already do that well. The problem is that experiments exist in isolation. 
                Researchers can't see what others tried, can't trace how a deployed model came to be, can't find the paper that started it all.
              </p>
              <p style={{fontSize: 15, lineHeight: 1.8, color: defined.text.primary, margin: '0 0 24px 0'}}>
                <strong>The reframe:</strong> from "better experiment tracking" to "connected experimental knowledge."
              </p>
              <p style={{fontSize: 15, lineHeight: 1.8, color: defined.text.secondary, margin: 0}}>
                Whether that bet pays off is still an open question. The graph view could flop. The pre-run friction might annoy more than it helps. 
                But the research gave us conviction that the current paradigm is broken, and that's worth exploring.
              </p>
            </div>
          </section>

        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLeft}>
            <div style={styles.logoMark}>L</div>
            <span>Lattice — Case Study 2025</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================
// STYLES
// ============================================

const styles = {
  container: { fontFamily: '"Poppins", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', background: defined.bg.primary, color: defined.text.primary, lineHeight: 1.6, minHeight: '100vh' },

  // Header
  header: { padding: '24px 48px', borderBottom: `1px solid ${defined.border.light}`, position: 'sticky', top: 0, background: defined.bg.primary, zIndex: 100 },
  headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  logo: { display: 'flex', alignItems: 'center', gap: 10 },
  logoMark: { width: 32, height: 32, background: defined.text.primary, color: defined.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '"Poppins", sans-serif', fontSize: 16, fontWeight: 600 },
  logoText: { fontSize: 18, fontWeight: 600 },
  headerLabel: { fontSize: 13, color: defined.text.muted },
  title: { fontSize: 26, fontWeight: 500, margin: '0 0 20px', maxWidth: 600 },
  
  // Tabs
  tabs: { display: 'flex', gap: 32 },
  tab: { background: 'none', border: 'none', borderBottom: '2px solid', padding: '8px 0', fontSize: 14, fontWeight: 500, cursor: 'pointer' },

  // Tab Content
  tabContent: {},
  section: { padding: '48px' },
  sectionTitle: { fontSize: 22, fontWeight: 600, margin: '0 0 16px' },
  leadText: { fontSize: 17, color: defined.text.primary, lineHeight: 1.5, margin: '0 0 16px', maxWidth: 640 },
  bodyText: { fontSize: 15, color: defined.text.secondary, lineHeight: 1.6, margin: '0 0 24px', maxWidth: 640 },
  bulletList: { margin: '0 0 24px', paddingLeft: 20, fontSize: 15, color: defined.text.secondary, lineHeight: 1.8 },

  // Stats - toned down
  statGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  statCard: { background: defined.bg.primary, borderRadius: 8, padding: 20, border: `1px solid ${defined.border.light}` },
  statValue: { display: 'block', fontSize: 18, fontWeight: 600, color: defined.text.primary, marginBottom: 8 },
  statLabel: { fontSize: 14, color: defined.text.secondary, lineHeight: 1.4 },

  // Insight
  insightBox: { border: `2px solid ${defined.accent.primary}`, borderRadius: 8, padding: 24, marginBottom: 24 },
  insightText: { fontSize: 16, margin: 0, lineHeight: 1.5 },
  reframeRow: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center' },
  reframeItem: { background: defined.bg.secondary, borderRadius: 8, padding: 20 },
  reframeLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, marginBottom: 8, textTransform: 'uppercase' },
  reframeText: { fontSize: 15, margin: 0 },
  reframeArrow: { fontSize: 20, color: defined.accent.primary },

  // Predictions
  predictionList: { display: 'flex', flexDirection: 'column', gap: 16 },
  predictionItem: { display: 'flex', gap: 16, background: defined.bg.primary, borderRadius: 8, padding: 20, border: `1px solid ${defined.border.light}` },
  predictionNum: { fontSize: 13, fontFamily: '"JetBrains Mono", monospace', color: defined.text.muted, marginTop: 2 },
  predictionTitle: { fontSize: 15, fontWeight: 600, margin: '0 0 4px' },
  predictionDesc: { fontSize: 14, color: defined.text.secondary, margin: 0 },

  // Scope
  scopeGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  scopeItem: { },
  scopeTitle: { fontSize: 12, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', margin: '0 0 4px' },
  scopeText: { fontSize: 14, margin: 0 },

  // Method
  methodList: { display: 'flex', flexDirection: 'column', gap: 16 },
  methodItem: { borderBottom: `1px solid ${defined.border.light}`, paddingBottom: 16 },
  methodTitle: { fontSize: 14, fontWeight: 600, margin: '0 0 4px' },
  methodDesc: { fontSize: 14, color: defined.text.secondary, margin: 0 },

  // Personas
  personaTabs: { display: 'flex', gap: 8, marginBottom: 20 },
  personaTab: { padding: '8px 16px', borderRadius: 6, border: `1px solid ${defined.border.light}`, cursor: 'pointer', fontSize: 14 },
  personaCard: { background: defined.bg.primary, borderRadius: 8, padding: 24, border: `1px solid ${defined.border.light}` },
  personaHeader: { display: 'flex', gap: 16, marginBottom: 20 },
  personaAvatar: { width: 48, height: 48, borderRadius: '50%', background: defined.bg.tertiary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 600, flexShrink: 0 },
  personaName: { fontSize: 18, fontWeight: 600, margin: 0 },
  personaRole: { fontSize: 14, color: defined.text.secondary, margin: '2px 0' },
  personaOrg: { fontSize: 13, color: defined.text.muted, margin: 0 },
  personaQuote: { fontSize: 15, fontStyle: 'italic', lineHeight: 1.6, marginBottom: 20, padding: 16, background: defined.bg.secondary, borderRadius: 6 },
  personaDetails: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${defined.border.light}` },
  personaDetailItem: {},
  detailLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  detailText: { fontSize: 14, margin: 0 },
  personaFrustrations: {},
  frustrationList: { margin: '8px 0 0', paddingLeft: 18, fontSize: 14, color: defined.text.primary, lineHeight: 1.7 },

  // Journey
  journeyTabs: { display: 'flex', gap: 8, marginBottom: 20 },
  journeyTab: { padding: '10px 16px', borderRadius: 6, border: '2px solid', cursor: 'pointer', fontSize: 14, fontWeight: 500 },
  journeyCard: { background: defined.bg.secondary, borderRadius: 8, padding: 24 },
  journeyHeader: { display: 'flex', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${defined.border.light}` },
  journeyTitle: { fontSize: 18, fontWeight: 600, margin: '0 0 4px' },
  journeyDesc: { fontSize: 14, color: defined.text.secondary, margin: 0 },
  journeyMeta: { display: 'flex', gap: 24 },
  journeyMetaItem: { textAlign: 'right' },
  metaLabel: { display: 'block', fontSize: 11, color: defined.text.muted, marginBottom: 2 },
  metaValue: { fontSize: 14, fontWeight: 500 },
  journeyContent: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 20 },
  activityList: { margin: '8px 0 0', paddingLeft: 18, fontSize: 14, color: defined.text.secondary, lineHeight: 1.7 },
  gapIndicator: { background: defined.bg.primary, border: `2px solid ${defined.accent.danger}`, borderRadius: 6, padding: 16 },
  gapLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: defined.accent.danger, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  gapText: { fontSize: 14, margin: 0, color: defined.accent.danger },

  // Pain Table
  painTable: { marginBottom: 24 },
  painTableHeader: { display: 'grid', gridTemplateColumns: '160px 100px 120px 80px', gap: 16, padding: '12px 16px', background: defined.bg.tertiary, borderRadius: '8px 8px 0 0', fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  painTableRow: { display: 'grid', gridTemplateColumns: '160px 100px 120px 80px', gap: 16, padding: '12px 16px', borderBottom: `1px solid ${defined.border.light}`, fontSize: 14 },
  painPhase: { fontWeight: 500 },
  mismatchBox: { border: `2px solid ${defined.accent.danger}`, borderRadius: 8, padding: 20 },
  mismatchTitle: { fontSize: 15, fontWeight: 600, margin: '0 0 8px' },
  mismatchText: { fontSize: 14, margin: 0, lineHeight: 1.5 },

  // Competitive
  compGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  compCard: { background: defined.bg.secondary, borderRadius: 8, padding: 20 },
  compName: { fontSize: 16, fontWeight: 600, margin: '0 0 4px' },
  compMeta: { fontSize: 12, color: defined.text.muted, margin: '0 0 16px' },
  compSection: { marginBottom: 12 },
  compLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  compList: { margin: 0, paddingLeft: 16, fontSize: 13, lineHeight: 1.6 },
  compVerdict: { fontSize: 13, color: defined.text.muted, fontStyle: 'italic', margin: 0, paddingTop: 12, borderTop: `1px solid ${defined.border.light}` },
  whitespaceBox: { background: defined.bg.secondary, borderRadius: 8, padding: 24 },
  whitespaceTitle: { fontSize: 16, fontWeight: 600, margin: '0 0 8px' },
  whitespaceIntro: { fontSize: 14, color: defined.text.secondary, margin: '0 0 12px' },
  whitespaceList: { margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.8 },

  // Synthesis
  synthesisList: { display: 'flex', flexDirection: 'column', gap: 20 },
  synthesisItem: { display: 'flex', gap: 16, background: defined.bg.primary, borderRadius: 8, padding: 20, border: `1px solid ${defined.border.light}` },
  synthesisNum: { width: 28, height: 28, borderRadius: '50%', background: defined.accent.primary, color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 },
  synthesisTitle: { fontSize: 15, fontWeight: 600, margin: '0 0 8px' },
  synthesisText: { fontSize: 14, color: defined.text.secondary, margin: 0, lineHeight: 1.5 },
  synthesisBullets: { margin: 0, paddingLeft: 16, fontSize: 14, color: defined.text.secondary, lineHeight: 1.6 },

  // Principles
  principleList: { display: 'flex', flexDirection: 'column', gap: 16 },
  principleItem: { display: 'flex', gap: 16, borderBottom: `1px solid ${defined.border.light}`, paddingBottom: 16 },
  principleNum: { fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: defined.accent.primary, marginTop: 2 },
  principleTitle: { fontSize: 15, fontWeight: 600, margin: '0 0 4px' },
  principleDesc: { fontSize: 14, color: defined.text.secondary, margin: 0 },
  principleFrom: { fontSize: 13, color: defined.text.muted, margin: '4px 0 0', fontStyle: 'italic' },

  // Screen Sections
  screenIntro: { marginBottom: 24 },
  screenLabel: { display: 'inline-block', fontSize: 11, fontWeight: 600, color: defined.accent.primary, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  
  // Mockup Frame
  mockupFrame: { borderRadius: 12, overflow: 'hidden', border: `1px solid ${defined.border.medium}`, marginBottom: 24, background: defined.bg.primary },
  mockupBrowser: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: defined.bg.tertiary, borderBottom: `1px solid ${defined.border.light}` },
  browserDots: { display: 'flex', gap: 6 },
  browserDot: { width: 10, height: 10, borderRadius: '50%', background: defined.border.medium },
  browserUrl: { fontSize: 12, color: defined.text.muted, fontFamily: 'JetBrains Mono, monospace' },
  
  // App Container
  appContainer: { display: 'grid', gridTemplateColumns: '180px 1fr 280px', minHeight: 400, background: defined.bg.primary },
  appSidebar: { background: defined.bg.secondary, borderRight: `1px solid ${defined.border.light}`, padding: 16 },
  sidebarLogo: { width: 32, height: 32, background: defined.text.primary, color: defined.bg.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, marginBottom: 20 },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: 4 },
  sidebarItem: { padding: '10px 12px', borderRadius: 6, fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' },
  
  appMain: { padding: 24 },
  appPanel: { borderLeft: `1px solid ${defined.border.light}`, padding: 20, background: defined.bg.secondary },
  
  // Graph View
  graphHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  graphTitle: { fontSize: 18, fontWeight: 600, margin: 0 },
  graphFilters: { display: 'flex', gap: 8 },
  filterChip: { padding: '6px 12px', background: defined.bg.secondary, borderRadius: 4, fontSize: 12, color: defined.text.secondary },
  graphCanvas: { position: 'relative', height: 300, background: defined.bg.secondary, borderRadius: 8 },
  graphLines: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' },
  graphNode: { position: 'absolute', padding: '12px 16px', background: defined.bg.primary, borderRadius: 8, border: `2px solid ${defined.border.medium}`, minWidth: 100, textAlign: 'center' },
  nodePaper: {},
  nodeDataset: {},
  nodeExperiment: {},
  nodeEval: {},
  nodeModel: {},
  nodeSelected: { borderColor: defined.accent.primary, boxShadow: `0 0 0 3px rgba(99, 102, 241, 0.2)` },
  nodeIcon: { display: 'block', fontSize: 16, marginBottom: 4 },
  nodeLabel: { display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 2 },
  nodeType: { display: 'block', fontSize: 9, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  nodeStatus: { display: 'block', fontSize: 10, marginTop: 4 },
  
  // Panel
  panelHeader: { marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${defined.border.light}` },
  panelLabel: { display: 'block', fontSize: 10, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  panelTitle: { fontSize: 16, fontWeight: 600, margin: 0 },
  panelMeta: { marginBottom: 16 },
  panelMetaRow: { display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '6px 0', borderBottom: `1px solid ${defined.border.light}` },
  panelSection: { marginTop: 16 },
  panelSectionLabel: { display: 'block', fontSize: 10, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  panelRelation: { marginBottom: 8 },
  relationLabel: { display: 'block', fontSize: 11, color: defined.text.muted },
  relationValue: { fontSize: 13, fontWeight: 500 },
  
  // Design Notes
  designNotes: { padding: 20, background: defined.bg.primary, borderRadius: 8, border: `1px solid ${defined.border.light}` },
  notesList: { margin: '8px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.7 },
  
  // Pre-Run Screen
  preRunScreen: { padding: 40, display: 'flex', justifyContent: 'center', background: defined.bg.secondary },
  preRunCard: { background: defined.bg.primary, borderRadius: 12, padding: 32, maxWidth: 500, width: '100%', border: `1px solid ${defined.border.light}` },
  preRunHeading: { fontSize: 20, fontWeight: 600, margin: '0 0 8px' },
  preRunSubhead: { fontSize: 13, color: defined.text.muted, margin: '0 0 24px', fontFamily: '"JetBrains Mono", monospace' },
  preRunEstimates: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 },
  estimateCard: { background: defined.bg.secondary, borderRadius: 8, padding: 16, textAlign: 'center' },
  estimateLabel: { display: 'block', fontSize: 11, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  estimateValue: { display: 'block', fontSize: 16, fontWeight: 600 },
  estimateRange: { display: 'block', fontSize: 11, color: defined.text.muted, marginTop: 4 },
  preRunWarningBox: { background: 'rgba(245, 158, 11, 0.1)', border: `1px solid ${defined.accent.warning}`, borderRadius: 8, padding: 16, marginBottom: 24 },
  warningHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 },
  warningIcon: { fontSize: 16 },
  warningTitle: { fontSize: 14, fontWeight: 600, color: defined.accent.warning },
  similarList: { display: 'flex', flexDirection: 'column', gap: 8 },
  similarItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: defined.bg.primary, borderRadius: 6 },
  similarInfo: { display: 'flex', flexDirection: 'column' },
  similarName: { fontSize: 14, fontWeight: 500 },
  similarMeta: { fontSize: 12, color: defined.text.muted },
  similarMatch: { textAlign: 'right' },
  matchPercent: { display: 'block', fontSize: 14, fontWeight: 600, color: defined.accent.warning },
  matchLabel: { fontSize: 10, color: defined.text.muted, textTransform: 'uppercase' },
  preRunActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  actionSecondary: { padding: '12px 20px', background: 'transparent', border: `1px solid ${defined.border.medium}`, borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  actionPrimary: { padding: '12px 20px', background: defined.accent.primary, color: '#FFF', border: 'none', borderRadius: 6, fontSize: 14, fontWeight: 500, cursor: 'pointer' },
  
  // Eval Main
  evalMain: { padding: 24, gridColumn: 'span 2' },
  evalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  evalBadge: { display: 'inline-block', fontSize: 10, fontWeight: 600, color: defined.accent.primary, letterSpacing: 0.5, marginBottom: 4 },
  evalTitle: { fontSize: 18, fontWeight: 600, margin: '0 0 4px' },
  evalDesc: { fontSize: 13, color: defined.text.muted, margin: 0 },
  evalStatus: {},
  evalStatusText: { fontSize: 13, color: defined.text.secondary },
  evalTable: { background: defined.bg.secondary, borderRadius: 8, overflow: 'hidden', marginBottom: 16 },
  evalTableHeader: { display: 'grid', gridTemplateColumns: '200px 1fr 80px 80px 80px', gap: 16, padding: '12px 16px', background: defined.bg.tertiary, fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  evalColModel: {},
  evalColScore: {},
  evalColLatency: {},
  evalColCost: {},
  evalColStatus: {},
  evalTableRow: { display: 'grid', gridTemplateColumns: '200px 1fr 80px 80px 80px', gap: 16, padding: '14px 16px', borderTop: `1px solid ${defined.border.light}`, alignItems: 'center', fontSize: 14 },
  evalModel: {},
  evalModelName: { display: 'block', fontWeight: 500 },
  evalModelMeta: { display: 'block', fontSize: 12, color: defined.text.muted },
  evalScore: { display: 'flex', alignItems: 'center', gap: 8 },
  scoreBar: { flex: 1, height: 6, background: defined.border.light, borderRadius: 3, overflow: 'hidden' },
  scoreBarFill: { height: '100%', borderRadius: 3 },
  scoreValue: { fontWeight: 600, minWidth: 50 },
  evalLatency: { color: defined.text.secondary },
  evalCost: { color: defined.text.secondary },
  evalPass: { fontWeight: 500 },
  evalRunning: { color: defined.text.muted },
  evalThreshold: { display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: defined.bg.secondary, borderRadius: 6 },
  thresholdLabel: { fontSize: 13, fontWeight: 500 },
  thresholdNote: { fontSize: 12, color: defined.text.muted },
  
  // Paper Import
  paperImportScreen: { padding: 40, display: 'flex', justifyContent: 'center', background: defined.bg.tertiary },
  paperImportCard: { background: defined.bg.primary, borderRadius: 12, padding: 32, maxWidth: 520, width: '100%', border: `1px solid ${defined.border.light}` },
  paperImportHeading: { fontSize: 20, fontWeight: 600, margin: '0 0 24px' },
  paperInput: { marginBottom: 24 },
  paperInputLabel: { display: 'block', fontSize: 12, fontWeight: 500, marginBottom: 8 },
  paperInputRow: { display: 'flex', gap: 8 },
  paperInputField: { flex: 1, padding: '10px 12px', border: `1px solid ${defined.border.medium}`, borderRadius: 6, fontSize: 14, fontFamily: '"JetBrains Mono", monospace' },
  paperInputBtn: { padding: '10px 16px', background: defined.bg.secondary, border: `1px solid ${defined.border.medium}`, borderRadius: 6, fontSize: 14, cursor: 'pointer' },
  paperPreview: { background: defined.bg.secondary, borderRadius: 8, padding: 20, marginBottom: 24 },
  paperPreviewHeader: { marginBottom: 8 },
  paperPreviewBadge: { fontSize: 10, fontWeight: 600, color: defined.accent.success, letterSpacing: 0.5 },
  paperPreviewTitle: { fontSize: 15, fontWeight: 600, margin: '0 0 4px' },
  paperPreviewAuthors: { fontSize: 13, color: defined.text.muted, margin: 0 },
  paperMeta: { display: 'flex', gap: 24, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${defined.border.light}` },
  paperMetaItem: {},
  paperMetaLabel: { display: 'block', fontSize: 10, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  paperMetaValue: { fontSize: 14, fontWeight: 500 },
  communitySection: { marginBottom: 24 },
  communitySectionTitle: { fontSize: 14, fontWeight: 600, margin: '0 0 12px' },
  reproAttempts: { display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 },
  reproAttempt: { display: 'grid', gridTemplateColumns: '1fr auto 60px', gap: 12, alignItems: 'center', padding: '10px 12px', background: defined.bg.secondary, borderRadius: 6 },
  reproAttemptInfo: {},
  reproName: { display: 'block', fontSize: 13, fontWeight: 500 },
  reproDate: { fontSize: 11, color: defined.text.muted },
  reproStatus: { fontSize: 13, fontWeight: 500 },
  reproTime: { fontSize: 13, color: defined.text.muted, textAlign: 'right' },
  reproSummary: { display: 'flex', gap: 24 },
  reproSummaryText: { fontSize: 13, color: defined.text.secondary },
  paperImportActions: { display: 'flex', gap: 12, justifyContent: 'flex-end' },
  
  // Questions
  questionsList: { margin: '0', paddingLeft: 18, fontSize: 15, lineHeight: 1.8 },
  
  // Conclusion
  conclusionBox: { border: `2px solid ${defined.accent.primary}`, borderRadius: 8, padding: 24, textAlign: 'center' },
  conclusionText: { fontSize: 17, margin: '0 0 12px', lineHeight: 1.5 },

  // IA
  iaComparison: { display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 16, alignItems: 'center', marginBottom: 24 },
  iaBox: { background: defined.bg.primary, borderRadius: 8, padding: 20, border: `1px solid ${defined.border.light}` },
  iaLabel: { display: 'block', fontSize: 11, fontWeight: 600, color: defined.text.muted, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 },
  iaDesc: { fontSize: 14, margin: 0 },
  iaArrow: { fontSize: 20, color: defined.accent.primary },
  nodeTypes: { marginTop: 24 },
  nodeList: { margin: '8px 0 0', paddingLeft: 18, fontSize: 14, lineHeight: 1.8 },
  queryExamples: { marginTop: 24 },

  // Footer
  footer: { padding: '24px 48px', borderTop: `1px solid ${defined.border.light}` },
  footerContent: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  footerLeft: { display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, color: defined.text.muted },
};
