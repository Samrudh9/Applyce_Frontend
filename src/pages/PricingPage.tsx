import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, Crown, Sparkles, Zap } from 'lucide-react';
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
    description: 'Perfect for getting started with career exploration.',
    features: ['Basic career match', '1 resume analysis / month', 'Community support', 'Score overview'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Sparkles,
    price: '$9.99',
    period: '/month',
    description: 'For serious job seekers who want the competitive edge.',
    features: ['Unlimited analysis', 'Deep ATS report', 'Job fit scoring', 'Career roadmap', 'Priority support', 'Export PDF reports'],
    cta: 'Upgrade to Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: 'Custom',
    period: '',
    description: 'For teams and organizations with advanced needs.',
    features: ['All Pro features', 'API access', 'Team analytics dashboard', 'Dedicated success manager', 'Custom integrations', 'SLA guarantee'],
    cta: 'Contact Us',
    popular: false,
  },
];

const faqs = [
  { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked. Your access continues until the end of the billing period.' },
  { q: 'Do you offer student discounts?', a: 'Absolutely! Students with a valid .edu email get 50% off Pro. Contact support with your student ID to claim.' },
  { q: 'Is my data secure?', a: 'Your data is encrypted at rest and in transit. We never share your resume data with third parties. See our Privacy Policy for details.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit cards, PayPal, and UPI (India). Enterprise customers can pay via invoice.' },
];

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="space-y-14">
      <SectionHeading title="Simple, Transparent Pricing" subtitle="Start free and scale as your career ambitions grow. No hidden fees." />

      {/* Tiers */}
      <section className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier, i) => {
          const Icon = tier.icon;
          return (
            <motion.div key={tier.name} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card glow={tier.popular} className={`relative flex h-full flex-col ${tier.popular ? 'border-purple/30 shadow-lg shadow-purple/10' : ''}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge tone="violet" icon={<Sparkles size={10} />}>Most Popular</Badge>
                  </div>
                )}

                <div className="mb-4 flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${tier.popular ? 'bg-violet/15 text-violet' : 'bg-cyan/10 text-cyan'}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-xl font-bold">{tier.name}</h3>
                </div>

                <div className="mb-2">
                  <span className={`font-display text-4xl font-bold ${tier.popular ? 'gradient-text' : 'text-mint-dark'}`}>{tier.price}</span>
                  <span className="text-sm text-muted">{tier.period}</span>
                </div>
                <p className="mb-5 text-sm text-muted">{tier.description}</p>

                <ul className="mb-6 flex-1 space-y-2.5 text-sm">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <Check size={16} className={tier.popular ? 'text-violet' : 'text-cyan'} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <Button className="w-full" variant={tier.popular ? 'primary' : 'secondary'}>{tier.cta}</Button>
              </Card>
            </motion.div>
          );
        })}
      </section>

      {/* FAQ */}
      <section>
        <SectionHeading title="Frequently Asked Questions" subtitle="Everything you need to know about our plans." />
        <div className="mx-auto mt-8 max-w-3xl space-y-3">
          {faqs.map((faq, i) => (
            <Card key={faq.q} className="cursor-pointer" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="flex items-center justify-between">
                <p className="font-semibold">{faq.q}</p>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} className="text-muted" />
                </motion.div>
              </div>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-3 overflow-hidden text-sm text-muted">
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
        <Card glow className="mx-auto max-w-2xl">
          <h3 className="font-display text-2xl font-semibold">Ready to accelerate your career?</h3>
          <p className="mt-2 text-muted">Join thousands of professionals using Applyce to land their dream jobs.</p>
          <Button className="mt-5">Start Free Today</Button>
        </Card>
      </section>
    </div>
  );
}
