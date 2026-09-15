import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Crown, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SectionHeading } from '../components/ui/SectionHeading';

const tiers = [
  {
    name: 'Free',
    icon: Zap,
    price: '$0',
    period: '/month',
    description: 'Everything you need for your first career read.',
    features: ['Career match', '1 resume analysis / month', 'ATS score overview', 'Community support'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Sparkles,
    price: '$9.99',
    period: '/month',
    description: 'For job seekers moving faster and applying smarter.',
    features: ['Unlimited resume analysis', 'Deep ATS report', 'Fit score on every job', 'Career roadmap', 'Priority support', 'Export PDF reports'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: '',
    description: 'For teams hiring at scale with advanced needs.',
    features: ['All Pro features', 'API access', 'Team analytics dashboard', 'Dedicated success manager', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Us',
    popular: false,
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes — cancel whenever you like. Your access continues until the end of the billing period.' },
  { q: 'Do you offer student discounts?', a: 'Students with a valid .edu email get 50% off Pro. Email support with your student ID to claim it.' },
  { q: 'Is my data secure?', a: 'Your data is encrypted in transit and at rest. We never share or sell your resume data. See the Privacy Policy for details.' },
  { q: 'What payment methods do you accept?', a: 'All major credit cards, PayPal, and UPI (India). Enterprise customers can pay by invoice.' },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-14">
      <SectionHeading title="Pricing That Grows With You" subtitle="Start free — upgrade only when you need more. No hidden fees." />

      {/* Tiers */}
      <section className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const Icon = tier.icon;
          return (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className={`relative flex h-full flex-col ${tier.popular ? 'border-accent/30 shadow-lift ring-1 ring-accent/10' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge tone="info" icon={<Sparkles size={10} />}>Most Popular</Badge>
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.popular ? 'bg-accent-soft text-accent-strong' : 'bg-accent/10 text-accent-strong'}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-ink">{tier.name}</h3>
                </div>

                <div className="mb-2">
                  <span className={`font-display text-4xl font-bold ${tier.popular ? 'gradient-text' : 'text-ink'}`}>{tier.price}</span>
                  <span className="text-sm text-ink-sec">{tier.period}</span>
                </div>
                <p className="mb-5 text-sm text-ink-sec">{tier.description}</p>

                <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={16} className={tier.popular ? 'text-accent-strong' : 'text-accent-strong'} />
                      <span className="text-ink">{f}</span>
                    </li>
                  ))}
                </ul>

                <Link to={tier.name === 'Enterprise' ? '/about' : '/login'} className="block w-full">
                  <Button className="w-full" variant={tier.popular ? 'primary' : 'secondary'}>{tier.cta}</Button>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* FAQ */}
      <section>
        <SectionHeading title="Frequently Asked Questions" subtitle="The answers most people look for — in plain words." />
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <Card key={faq.q} className="cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="flex items-center justify-between">
                <p className="font-semibold text-ink">{faq.q}</p>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} className="text-ink-sec" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 overflow-hidden text-sm text-ink-sec">
                    {faq.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Card className="mx-auto max-w-2xl bg-accent/5 ring-1 ring-accent/10">
          <h3 className="font-display text-2xl font-semibold text-ink">Start free, find your path</h3>
          <p className="mt-2 text-ink-sec">Upload your resume and see where you stand today.</p>
          <Link to="/login" className="mt-5 inline-block"><Button>Start Free</Button></Link>
        </Card>
      </section>
    </div>
  );
}
