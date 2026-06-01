import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  ArrowRight,
  Calculator,
  Shield,
  CreditCard,
  Users,
  Globe,
  Check,
  Zap,
  Upload,
  Wallet,
  BookOpen,
  CalendarDays,
  Landmark,
  UserCheck,
  BadgeCheck,
  Layers,
  Activity,
  ShieldAlert,
  Receipt,
  Settings,
  Mail,
  RefreshCw,
  UserPlus,
  PlayCircle,
  Banknote,
  Star,
  ChevronRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Scroll-reveal wrapper
// ---------------------------------------------------------------------------
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const features = [
  {
    icon: <Calculator className="h-5 w-5" />,
    title: 'Multi-Country Payroll',
    desc: 'Automated salary calculation with Nigeria PAYE brackets, Ghana SSNIT/GRA, pension (RSA), NHF, and NSITF built in.',
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: 'Employee Management',
    desc: 'Onboard employees one by one or bulk-import via CSV. Track departments, cadres, and employment history.',
  },
  {
    icon: <Wallet className="h-5 w-5" />,
    title: 'Wallet & Disbursements',
    desc: 'Deposit via card, bank transfer, or USSD. Virtual accounts per company. One-click salary disbursement.',
  },
  {
    icon: <BookOpen className="h-5 w-5" />,
    title: 'Double-Entry Ledger',
    desc: 'Every transaction recorded with debits and credits. Real-time reconciliation and anomaly detection.',
  },
  {
    icon: <CalendarDays className="h-5 w-5" />,
    title: 'Leave Management',
    desc: 'Configurable leave types, self-service requests, manager approvals, and automatic balance tracking.',
  },
  {
    icon: <Landmark className="h-5 w-5" />,
    title: 'Loan Management',
    desc: 'Issue employee loans with automatic payroll deductions. Track balances, schedules, and repayments.',
  },
  {
    icon: <UserCheck className="h-5 w-5" />,
    title: 'Employee Self-Service',
    desc: 'Employees view payslips, update bank details, request leave, and track loan balances from their portal.',
  },
  {
    icon: <BadgeCheck className="h-5 w-5" />,
    title: 'Bank & BVN Verification',
    desc: 'Verify employee bank accounts and BVN before disbursement. Prevent errors and fraud at the source.',
  },
  {
    icon: <Layers className="h-5 w-5" />,
    title: 'Multi-Cadre Structures',
    desc: 'Define salary grades with custom earning components, deduction rules, and allowance structures per cadre.',
  },
  {
    icon: <Activity className="h-5 w-5" />,
    title: 'Reconciliation & Anomaly Detection',
    desc: 'Automated financial reconciliation surfaces discrepancies instantly so nothing slips through.',
  },
  {
    icon: <ShieldAlert className="h-5 w-5" />,
    title: 'Velocity Controls',
    desc: 'Circuit breaker and velocity limits on payments protect against runaway disbursements and duplicate runs.',
  },
  {
    icon: <Receipt className="h-5 w-5" />,
    title: 'Billing Plans',
    desc: 'Free, Growth, and Enterprise tiers. Usage-based billing with transparent pricing and no hidden fees.',
  },
  {
    icon: <Settings className="h-5 w-5" />,
    title: 'Platform Settings',
    desc: 'Manage payment provider keys, SMTP credentials, and integrations with encrypted credential storage.',
  },
  {
    icon: <Mail className="h-5 w-5" />,
    title: 'Email Notifications',
    desc: 'Automated welcome emails, verification links, payslip delivery, and leave approval notifications.',
  },
  {
    icon: <RefreshCw className="h-5 w-5" />,
    title: 'Background Processing',
    desc: 'Async job queue for bulk emails, payroll runs, reconciliation, and report generation. No UI blocking.',
  },
];

const steps = [
  {
    icon: <UserPlus className="h-6 w-6" />,
    title: 'Sign Up',
    desc: 'Create your company account in under a minute.',
  },
  {
    icon: <Upload className="h-6 w-6" />,
    title: 'Add Employees',
    desc: 'Import your team via CSV or add them manually.',
  },
  {
    icon: <PlayCircle className="h-6 w-6" />,
    title: 'Run Payroll',
    desc: 'Calculate salaries, taxes, and deductions automatically.',
  },
  {
    icon: <Banknote className="h-6 w-6" />,
    title: 'Pay Instantly',
    desc: 'Disburse to all employees in one click.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    employees: 'Up to 5 employees',
    payrollRuns: '2 runs / month',
    description: 'Perfect for startups testing the waters.',
    features: [
      'Payroll calculation',
      'PAYE tax compliance',
      'PDF payslips',
      'Email notifications',
      'Employee self-service',
    ],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '15,000',
    period: '/mo',
    employees: 'Up to 50 employees',
    payrollRuns: 'Unlimited runs',
    description: 'For growing businesses ready to scale.',
    features: [
      'Everything in Free',
      'All statutory deductions',
      'CSV bulk import & export',
      'Leave management',
      'Loan tracking & deductions',
      'Wallet & virtual accounts',
      'Bank/BVN verification',
      'Multi-cadre salary structures',
    ],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '50,000',
    period: '/mo',
    employees: 'Unlimited employees',
    payrollRuns: 'Unlimited runs',
    description: 'For established companies that need everything.',
    features: [
      'Everything in Growth',
      'Multi-country (NGN + GHS)',
      'Double-entry ledger',
      'Reconciliation & anomaly detection',
      'Velocity controls & circuit breaker',
      'Priority support',
      'API access',
      'Dedicated account manager',
    ],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

const testimonials = [
  {
    name: 'Adaeze Okonkwo',
    role: 'HR Director, Verdant Technologies',
    quote:
      'PayFlow cut our payroll processing from three days to thirty minutes. The multi-country tax engine means we stopped worrying about compliance entirely.',
    rating: 5,
  },
  {
    name: 'Kwame Mensah',
    role: 'CFO, Accra Digital Labs',
    quote:
      'The double-entry ledger and real-time reconciliation give me complete confidence in our numbers. I can see exactly where every cedi goes.',
    rating: 5,
  },
  {
    name: 'Funke Adeyemi',
    role: 'Founder, LagosPay',
    quote:
      'We imported 120 employees via CSV on day one and ran payroll that same afternoon. The onboarding experience is unmatched.',
    rating: 5,
  },
];

const footerLinks = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'How It Works', href: '#how-it-works' },
  ],
  Company: [
    { label: 'About', href: '#' },
    { label: 'Blog', href: '#' },
    { label: 'Careers', href: '#' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
  Support: [
    { label: 'Help Center', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Status', href: '#' },
  ],
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  // SEO meta tags
  useEffect(() => {
    document.title = 'PayFlow | Payroll Automation for African Businesses';
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.name = name;
        document.head.appendChild(el);
      }
      el.content = content;
    };
    setMeta(
      'description',
      'Automate salary calculation, multi-country tax compliance, and instant disbursement for Nigerian and Ghanaian businesses. Start free.',
    );
    setMeta('keywords', 'payroll, africa, nigeria, ghana, PAYE, SSNIT, salary, automation');
  }, []);

  // Navbar background on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Smooth scroll for anchor links
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white antialiased">
      {/* ================================================================
          NAVIGATION
      ================================================================ */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-xl shadow-lg shadow-black/10'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" aria-label="PayFlow home">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">PayFlow</span>
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <button onClick={() => scrollTo('features')} className="hover:text-white transition-colors">
              Features
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="hover:text-white transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-white transition-colors">
              Pricing
            </button>
            <button onClick={() => scrollTo('testimonials')} className="hover:text-white transition-colors">
              Testimonials
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2"
            >
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-indigo-500/25"
            >
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ================================================================
          HERO
      ================================================================ */}
      <section className="relative overflow-hidden bg-slate-900 pt-28 pb-28 sm:pt-36 sm:pb-36">
        {/* Animated gradient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-indigo-700/20 blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-[100px] animate-pulse [animation-delay:2s]" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.25) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.25) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
            }}
          />
        </div>

        <div className="relative mx-auto max-w-5xl px-5 sm:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 mb-8"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Trusted by businesses across Africa
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6"
          >
            Payroll that runs{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              itself.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-lg sm:text-xl text-slate-400 leading-relaxed mb-10"
          >
            Automate salary calculation, multi-country tax compliance, and instant
            disbursement for Nigerian and Ghanaian businesses. Compliant. Accurate.
            Effortless.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button
              onClick={() => scrollTo('how-it-works')}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-base"
            >
              See Demo
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500"
          >
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Nigeria PAYE
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Ghana SSNIT
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Pension & NHF
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> Bank verification
            </span>
            <span className="flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5 text-emerald-500" /> PDF payslips
            </span>
          </motion.div>
        </div>
      </section>

      {/* ================================================================
          TRUSTED BY / LOGOS
      ================================================================ */}
      <section className="bg-white py-14 border-b border-slate-100">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal>
            <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
              Trusted by forward-thinking companies
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
              {['TechCo', 'FinServ', 'GreenPay', 'Nextera', 'BlueStar'].map((name) => (
                <div
                  key={name}
                  className="flex h-10 items-center rounded-lg bg-slate-100 px-6 text-sm font-bold text-slate-400 tracking-wide select-none"
                >
                  {name}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          FEATURES GRID
      ================================================================ */}
      <section id="features" className="bg-slate-50 py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
              Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Everything you need to run payroll
            </h2>
            <p className="mt-4 mx-auto max-w-xl text-slate-500">
              From tax compliance to real-time reconciliation, PayFlow handles every aspect of payroll so you can focus on growing your business.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="group h-full bg-white rounded-2xl border border-slate-200/80 p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 hover:-translate-y-1">
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                    {f.icon}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-1.5">{f.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
      ================================================================ */}
      <section id="how-it-works" className="bg-white py-24 scroll-mt-16">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
              How It Works
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Up and running in four steps
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.1}>
                <div className="relative text-center">
                  {/* Connector line (hidden on first item and mobile) */}
                  {i > 0 && (
                    <div className="hidden lg:block absolute top-7 -left-4 w-8 border-t-2 border-dashed border-slate-200" />
                  )}
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                    {s.icon}
                  </div>
                  <span className="inline-block mb-2 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-full px-3 py-0.5">
                    Step {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-500">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          PRICING
      ================================================================ */}
      <section id="pricing" className="bg-slate-50 py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
              Pricing
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-slate-500 max-w-lg mx-auto">
              Start free. Upgrade when you grow. No hidden fees, ever.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, idx) => (
              <Reveal key={plan.name} delay={idx * 0.1}>
                <div
                  className={`relative flex flex-col rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 h-full ${
                    plan.highlighted
                      ? 'bg-slate-900 text-white shadow-2xl shadow-indigo-500/10 ring-2 ring-indigo-500/50 scale-[1.02]'
                      : 'bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-lg'
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-4 py-1 text-xs font-semibold text-white">
                      Most Popular
                    </div>
                  )}

                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p
                    className={`text-xs mb-5 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    {plan.description}
                  </p>

                  <div className="flex items-baseline gap-1 mb-1">
                    <span className="text-xs">NGN</span>
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span
                      className={`text-sm ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}
                    >
                      {plan.period}
                    </span>
                  </div>

                  <div
                    className={`flex gap-4 text-xs mb-6 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}
                  >
                    <span>{plan.employees}</span>
                    <span className="text-slate-600">|</span>
                    <span>{plan.payrollRuns}</span>
                  </div>

                  <Link
                    to="/register"
                    className={`block text-center font-semibold py-3 rounded-xl text-sm transition-all ${
                      plan.highlighted
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg hover:shadow-indigo-500/30'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                    }`}
                  >
                    {plan.cta}
                  </Link>

                  <ul className="mt-6 space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={`h-4 w-4 mt-0.5 shrink-0 ${
                            plan.highlighted ? 'text-indigo-400' : 'text-emerald-500'
                          }`}
                        />
                        <span className={plan.highlighted ? 'text-slate-300' : 'text-slate-600'}>
                          {f}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          TESTIMONIALS
      ================================================================ */}
      <section id="testimonials" className="bg-white py-24 scroll-mt-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <Reveal className="text-center mb-16">
            <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-3">
              Testimonials
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Loved by payroll teams
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, idx) => (
              <Reveal key={t.name} delay={idx * 0.1}>
                <div className="rounded-2xl border border-slate-200 bg-white p-7 hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, si) => (
                      <Star
                        key={si}
                        className="h-4 w-4 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    {/* Avatar placeholder */}
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                      {t.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                      <p className="text-xs text-slate-500">{t.role}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          CTA
      ================================================================ */}
      <section className="relative overflow-hidden bg-slate-900 py-24">
        {/* Gradient accent */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[400px] w-[700px] rounded-full bg-indigo-600/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl px-5 sm:px-8 text-center">
          <Reveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5 tracking-tight">
              Ready to automate your payroll?
            </h2>
            <p className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              Join businesses across Nigeria and Ghana that run payroll effortlessly with PayFlow. Start free — no credit card required.
            </p>
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-10">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-14">
            {/* Brand column */}
            <div className="col-span-2 md:col-span-1">
              <Link to="/" className="flex items-center gap-2.5 mb-4" aria-label="PayFlow home">
                <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">PayFlow</span>
              </Link>
              <p className="text-sm text-slate-500 leading-relaxed">
                Automated payroll for African businesses. Compliant, accurate, effortless.
              </p>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="text-sm font-semibold text-slate-300 mb-4">{heading}</h4>
                <ul className="space-y-2.5">
                  {links.map((l) => (
                    <li key={l.label}>
                      <a
                        href={l.href}
                        className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {l.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-600">
              &copy; {new Date().getFullYear()} PayFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-slate-500">
              <Link to="/login" className="hover:text-slate-300 transition-colors">
                Login
              </Link>
              <Link to="/register" className="hover:text-slate-300 transition-colors">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
