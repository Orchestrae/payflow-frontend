import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calculator,
  Shield,
  CreditCard,
  FileText,
  Users,
  Globe,
  Check,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: <Calculator className="h-6 w-6" />,
    title: 'Payroll Automation',
    description: 'Calculate gross pay, deductions, and net pay for every employee automatically. Support for earning components, bonuses, and adjustments.',
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Tax Compliance',
    description: 'Nigeria Tax Act 2025 PAYE brackets built-in. Pension (RSA), NHF, NSITF computed automatically. Always up to date.',
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: 'Multi-Provider Payments',
    description: 'Disburse salaries via Paystack, Korapay, or VFD Bank. Switch providers or use fallbacks — no vendor lock-in.',
  },
  {
    icon: <FileText className="h-6 w-6" />,
    title: 'Payslips & Reports',
    description: 'Generate PDF payslips, PAYE returns for TaxProMax, pension schedules for PFA remittance, and bank transfer files.',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Employee Self-Service',
    description: 'Employees view payslips, update bank details, and track leave balances. Operators create payroll, approvers sign off.',
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: 'Multi-Currency',
    description: 'Full compliance for Nigeria (PAYE, RSA, NHF) and Ghana (GRA, SSNIT, Tier 2). More countries coming soon.',
  },
];

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'forever',
    employees: '5 employees',
    payrollRuns: '2 runs/month',
    description: 'For startups testing the waters',
    features: ['Payroll calculation', 'PAYE tax compliance', 'PDF payslips', 'Email notifications'],
    cta: 'Start Free',
    highlighted: false,
  },
  {
    name: 'Starter',
    price: '15,000',
    period: '/month',
    employees: '50 employees',
    payrollRuns: 'Unlimited',
    description: 'For growing businesses',
    features: ['Everything in Free', 'All statutory deductions', 'CSV reports & bank schedule', 'CSV employee import', 'Leave management', 'Loan tracking'],
    cta: 'Get Started',
    highlighted: true,
  },
  {
    name: 'Pro',
    price: '50,000',
    period: '/month',
    employees: 'Unlimited',
    payrollRuns: 'Unlimited',
    description: 'For established companies',
    features: ['Everything in Starter', 'Multi-currency (NGN + GHS)', 'Priority support', 'API access', 'Custom integrations', 'Dedicated account manager'],
    cta: 'Contact Sales',
    highlighted: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap');`}</style>

      {/* ═══════ NAVIGATION ═══════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 backdrop-blur-xl bg-[#0C1220]/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#22BC66] flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight" style={{ fontFamily: 'Outfit' }}>PayFlow</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
              Sign in
            </Link>
            <Link to="/register" className="text-sm font-semibold bg-[#22BC66] hover:bg-[#1da757] text-white px-5 py-2 rounded-lg transition-all hover:shadow-lg hover:shadow-emerald-500/25">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden bg-[#0C1220] pt-32 pb-24">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(rgba(34,188,102,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,188,102,0.3) 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
        }} />
        {/* Radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-[#22BC66]/[0.07] rounded-full blur-[120px]" />

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-xs font-medium mb-8 animate-[fadeInUp_0.6s_ease-out]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Nigeria Tax Act 2025 compliant
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white leading-[1.08] tracking-tight mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s_both]"
            style={{ fontFamily: 'Outfit' }}
          >
            Payroll that runs
            <br />
            <span className="text-[#22BC66]">itself.</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeInUp_0.6s_ease-out_0.2s_both]" style={{ fontFamily: 'DM Sans' }}>
            Automate salary calculation, statutory deductions, tax filing, and bulk disbursement for Nigerian and Ghanaian businesses. Compliant. Accurate. Effortless.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease-out_0.3s_both]">
            <Link
              to="/register"
              className="group inline-flex items-center gap-2.5 bg-[#22BC66] hover:bg-[#1da757] text-white font-semibold px-8 py-3.5 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              Start Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium px-6 py-3.5 rounded-xl border border-slate-700 hover:border-slate-500 transition-all text-base"
            >
              Sign in to dashboard
            </Link>
          </div>

          {/* Trust bar */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-slate-500 animate-[fadeInUp_0.6s_ease-out_0.5s_both]" style={{ fontFamily: 'DM Sans' }}>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> PAYE 2026 brackets</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Pension & NHF</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Paystack & Korapay</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> PDF payslips</span>
            <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> Ghana SSNIT</span>
          </div>
        </div>

        {/* CSS Animations */}
        <style>{`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(24px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section className="py-24 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#22BC66] uppercase tracking-wider mb-3" style={{ fontFamily: 'DM Sans' }}>Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Everything you need to run payroll
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group bg-white rounded-2xl border border-slate-200/80 p-7 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center text-[#22BC66] mb-5 group-hover:bg-[#22BC66] group-hover:text-white transition-colors duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2" style={{ fontFamily: 'Outfit' }}>{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed" style={{ fontFamily: 'DM Sans' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-[#22BC66] uppercase tracking-wider mb-3" style={{ fontFamily: 'DM Sans' }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit' }}>
              Simple, transparent pricing
            </h2>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto" style={{ fontFamily: 'DM Sans' }}>
              Start free. Upgrade when you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 ${
                  plan.highlighted
                    ? 'bg-[#0C1220] text-white shadow-2xl shadow-emerald-500/10 ring-2 ring-[#22BC66]/50 scale-[1.02]'
                    : 'bg-white border border-slate-200 hover:border-emerald-200 hover:shadow-lg'
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#22BC66] text-white text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}

                <h3 className="text-lg font-bold mb-1" style={{ fontFamily: 'Outfit' }}>{plan.name}</h3>
                <p className={`text-xs mb-5 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`} style={{ fontFamily: 'DM Sans' }}>
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xs" style={{ fontFamily: 'DM Sans' }}>NGN</span>
                  <span className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'Outfit' }}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`}>{plan.period}</span>
                </div>

                <div className={`flex gap-4 text-xs mb-6 ${plan.highlighted ? 'text-slate-400' : 'text-slate-500'}`} style={{ fontFamily: 'DM Sans' }}>
                  <span>{plan.employees}</span>
                  <span className="text-slate-600">|</span>
                  <span>{plan.payrollRuns}</span>
                </div>

                <Link
                  to="/register"
                  className={`block text-center font-semibold py-3 rounded-xl text-sm transition-all ${
                    plan.highlighted
                      ? 'bg-[#22BC66] hover:bg-[#1da757] text-white hover:shadow-lg hover:shadow-emerald-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900'
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-6 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm" style={{ fontFamily: 'DM Sans' }}>
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-[#22BC66]' : 'text-emerald-500'}`} />
                      <span className={plan.highlighted ? 'text-slate-300' : 'text-slate-600'}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA ═══════ */}
      <section className="py-20 bg-[#0C1220]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'Outfit' }}>
            Ready to automate your payroll?
          </h2>
          <p className="text-slate-400 mb-8 text-lg" style={{ fontFamily: 'DM Sans' }}>
            Join businesses across Nigeria and Ghana running payroll effortlessly.
          </p>
          <Link
            to="/register"
            className="group inline-flex items-center gap-2.5 bg-[#22BC66] hover:bg-[#1da757] text-white font-semibold px-8 py-4 rounded-xl text-base transition-all hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
          >
            Start Free — No credit card required
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="bg-[#080E1A] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[#22BC66] flex items-center justify-center">
                <Zap className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-bold text-slate-400" style={{ fontFamily: 'Outfit' }}>PayFlow</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500" style={{ fontFamily: 'DM Sans' }}>
              <Link to="/login" className="hover:text-slate-300 transition-colors">Login</Link>
              <Link to="/register" className="hover:text-slate-300 transition-colors">Register</Link>
              <a href="https://github.com/Orchestrae/payflow-backend" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">GitHub</a>
            </div>
            <p className="text-xs text-slate-600" style={{ fontFamily: 'DM Sans' }}>
              &copy; {new Date().getFullYear()} PayFlow. Automated payroll for Africa.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
