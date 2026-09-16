import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

const interestOptions = [
  'School Partnership',
  'Alyntis Platform',
  'Student Programs',
  'Technology Partnership',
  'Other',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    organization: '',
    designation: '',
    city: '',
    interest: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const { error } = await supabase.from('inquiries').insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        organization: form.organization || null,
        designation: form.designation || null,
        city: form.city || null,
        interest: form.interest || null,
        message: form.message || null,
      });

      if (error) throw error;

      setStatus('success');
      setForm({
        name: '', email: '', phone: '', organization: '', designation: '', city: '', interest: '', message: '',
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or email us directly.');
    }
  };

  return (
    <>
      <SEO
        title="Contact — Alyntis | Let's Build Together"
        description="Get in touch with Alyntis. Whether you're a student, parent, teacher, school or technology partner — there's a place for you in the Alyntis mission."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              Contact Alyntis
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              LET'S BUILD TOGETHER.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              Whether you're a student, parent, teacher, school or technology partner — there's a
              place for you in the Alyntis mission. Tell us how you'd like to be part of it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form */}
      <section className="relative overflow-hidden bg-gray-50 py-16 lg:py-24">
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {status === 'success' ? (
            <Reveal>
              <div className="rounded-2xl border border-teal-200 bg-white p-10 text-center shadow-lg">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-teal-50">
                  <CheckCircle2 className="h-8 w-8 text-teal-600" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-navy-900">Inquiry Sent</h2>
                <p className="mt-3 text-gray-600">
                  Thank you for reaching out. We'll get back to you as soon as possible.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setStatus('idle')} variant="outline">
                    Send Another Inquiry
                  </Button>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="text-xl font-bold text-navy-900">Send an Inquiry</h2>
                <p className="mt-1 text-sm text-gray-500">Fields marked with * are required.</p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <FormField label="Name" name="name" value={form.name} onChange={handleChange} required />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  <FormField label="Phone" name="phone" value={form.phone} onChange={handleChange} />
                  <FormField label="Organization / School" name="organization" value={form.organization} onChange={handleChange} />
                  <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} />
                  <FormField label="City" name="city" value={form.city} onChange={handleChange} />

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-navy-900">
                      I'm interested in <span className="text-teal-600">*</span>
                    </label>
                    <select
                      name="interest"
                      value={form.interest}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="">Select an option</option>
                      {interestOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-navy-900">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      placeholder="Tell us how you'd like to be part of the Alyntis mission..."
                    />
                  </div>
                </div>

                {status === 'error' && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    <AlertCircle className="h-5 w-5 flex-shrink-0" />
                    {errorMessage}
                  </div>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-500/25 transition-all hover:shadow-xl hover:shadow-teal-500/30 disabled:opacity-50 sm:w-auto"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Reveal>
          )}

          {/* School demo CTA */}
          <Reveal delay={200}>
            <div className="mt-8 rounded-2xl border border-teal-100 bg-teal-50/50 p-6 text-center">
              <p className="text-sm text-navy-700">
                Looking for a school demonstration?
              </p>
              <div className="mt-3">
                <Button to="/request-demo" size="md">
                  Request a School Demo
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-navy-900">
        {label} {required && <span className="text-teal-600">*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />
    </div>
  );
}
