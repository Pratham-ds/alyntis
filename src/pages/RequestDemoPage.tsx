import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import SEO from '@/components/ui/SEO';
import Reveal from '@/components/ui/Reveal';
import { supabase } from '@/lib/supabase';

const programOptions = [
  'Robotics',
  'Electronics',
  'IoT & Smart Systems',
  'AI Foundations',
  'Drone Technology',
  'All Programs',
];

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function RequestDemoPage() {
  const [form, setForm] = useState({
    school_name: '',
    city: '',
    board: '',
    contact_person: '',
    designation: '',
    phone: '',
    email: '',
    num_students: '',
    classes: '',
    interested_programs: '',
    preferred_date: '',
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
      const { error } = await supabase.from('school_demo_requests').insert({
        school_name: form.school_name,
        city: form.city || null,
        board: form.board || null,
        contact_person: form.contact_person,
        designation: form.designation || null,
        phone: form.phone || null,
        email: form.email,
        num_students: form.num_students || null,
        classes: form.classes || null,
        interested_programs: form.interested_programs || null,
        preferred_date: form.preferred_date || null,
        message: form.message || null,
      });

      if (error) throw error;

      setStatus('success');
      setForm({
        school_name: '', city: '', board: '', contact_person: '', designation: '',
        phone: '', email: '', num_students: '', classes: '', interested_programs: '',
        preferred_date: '', message: '',
      });
    } catch (err) {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again or contact us directly.');
    }
  };

  return (
    <>
      <SEO
        title="Request a Demo — Alyntis | Bring the Maker Mindset to Your School"
        description="Request a school demonstration of the Alyntis platform. See how your students can go from consumers to makers with hands-on technology projects."
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-navy-950 pt-20 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 bg-grid-dark" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-teal-500/10 blur-[120px]" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <p className="mb-4 text-sm font-bold uppercase tracking-widest text-teal-400">
              School Demo Request
            </p>
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              REQUEST A
              <br />
              <span className="text-gradient">SCHOOL DEMO.</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-gray-300">
              See how Alyntis can bring the maker mindset to your school. Tell us about your school
              and we'll arrange a demonstration.
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
                <h2 className="mt-6 text-2xl font-bold text-navy-900">Demo Request Received</h2>
                <p className="mt-3 text-gray-600">
                  Thank you for your interest in Alyntis. We'll review your request and contact you
                  shortly to arrange a demonstration.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => setStatus('idle')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-navy-200 px-6 py-3 text-sm font-semibold text-navy-900 transition-colors hover:border-teal-500 hover:text-teal-600"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            </Reveal>
          ) : (
            <Reveal>
              <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg sm:p-8">
                <h2 className="text-xl font-bold text-navy-900">School Demo Request Form</h2>
                <p className="mt-1 text-sm text-gray-500">Fields marked with * are required.</p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <FormField label="School Name" name="school_name" value={form.school_name} onChange={handleChange} required />
                  <FormField label="City" name="city" value={form.city} onChange={handleChange} />
                  <FormField label="Board" name="board" value={form.board} onChange={handleChange} placeholder="e.g. CBSE, ICSE, State Board" />
                  <FormField label="Contact Person" name="contact_person" value={form.contact_person} onChange={handleChange} required />
                  <FormField label="Designation" name="designation" value={form.designation} onChange={handleChange} placeholder="e.g. Principal, Coordinator" />
                  <FormField label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} />
                  <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
                  <FormField label="Number of Students" name="num_students" value={form.num_students} onChange={handleChange} placeholder="e.g. 500" />
                  <FormField label="Classes" name="classes" value={form.classes} onChange={handleChange} placeholder="e.g. Class 6-10" />

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-navy-900">
                      Interested Programs
                    </label>
                    <select
                      name="interested_programs"
                      value={form.interested_programs}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="">Select a program</option>
                      {programOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <FormField label="Preferred Demo Date" name="preferred_date" type="date" value={form.preferred_date} onChange={handleChange} />

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-navy-900">Message</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                      placeholder="Tell us about your school's goals and any specific questions..."
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
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Request Demo
                      </>
                    )}
                  </button>
                </div>
              </form>
            </Reveal>
          )}
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
  placeholder = '',
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-navy-900 outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
      />
    </div>
  );
}
