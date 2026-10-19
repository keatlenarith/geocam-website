import { createFileRoute } from "@/lib/spa-router";
import { useState, type FormEvent } from "react";
import { Container, PageHeader, meta } from "@/components/site/Chrome";
import { useI18n } from "@/lib/i18n";
import { Mail, Phone, ExternalLink, UserRound } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => meta("Contact", "Contact GeoCam's professional technical coordinator."),
  component: Contact,
});

const profilePlaceholder = '/images/profile-placeholder.svg';
function Contact() {
  const { t, lang } = useI18n();
  const km = lang === 'km';
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({name:"",email:"",message:""});
  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent(`GeoCam website inquiry — ${form.name}`);
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:keatlenarith@gmail.com?subject=${subject}&body=${body}`;
    setSent(true);
  };
  return (
    <>
      <PageHeader eyebrow={t('contact')} title={t('contact')} sub={km ? 'ទំនាក់ទំនង និងព័ត៌មានអ្នកសម្របសម្រួលបច្ចេកទេស' : 'Professional contact and technical coordination'} />
      <Container>
        <section className="mx-auto mb-12 max-w-5xl overflow-hidden rounded-3xl border border-border bg-card shadow-xl" aria-label={km ? 'ប្រវត្តិរូបទំនាក់ទំនង' : 'Professional contact profile'}>
          <div className="grid md:grid-cols-[minmax(240px,0.8fr)_1.4fr]">
            <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-slate-900 p-8">
              <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full border border-emerald-300/20" />
              <div className="absolute -bottom-24 -right-12 h-64 w-64 rounded-full border border-emerald-300/20" />
              <img data-cms-id="professional-profile-photo" src={profilePlaceholder} alt="Profile photograph placeholder for Mr. KEAT LENARITH — click to replace in Visual Edit mode" className="relative z-10 h-64 w-64 rounded-2xl border-4 border-white/20 bg-slate-800 object-cover shadow-2xl md:h-72 md:w-60" />
              <span className="absolute bottom-4 left-4 right-4 z-20 rounded-lg bg-slate-950/70 px-3 py-2 text-center text-xs font-medium text-white backdrop-blur-sm">{km ? 'រូបភាពគំរូ — អាចប្តូរបានក្នុង Visual Edit' : 'Photo placeholder · Replace in Visual Edit'}</span>
            </div>
            <div className="flex flex-col justify-center space-y-5 p-7 md:p-10">
              <div><span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-800">{km ? 'ទំនាក់ទំនងវិជ្ជាជីវៈ' : 'PROFESSIONAL CONTACT'}</span><h2 data-cms-id="professional-contact-name" className="mt-4 font-serif text-3xl font-bold text-foreground md:text-4xl">Mr. KEAT LENARITH</h2><p data-cms-id="professional-contact-role" className="mt-3 text-lg font-semibold text-primary">{km ? 'អនុប្រធានការិយាល័យកសាងផែនទី និងគ្រប់គ្រងទិន្នន័យភូគព្ភសាស្ត្រ' : 'Vice-Chief of Mapping and Geological Database Management Bureau'}</p><p data-cms-id="professional-contact-specialty" className="mt-2 text-sm text-muted-foreground">{km ? 'អ្នកសម្របសម្រួលថ្នាក់ជាតិគម្រោង AKCF និងអ្នកភូគព្ភវិទ្យាជាន់ខ្ពស់' : 'National Coordinator of AKCF Project and Senior Geologist'}</p></div>
              <div className="h-px bg-border" />
              <div className="space-y-1 text-sm leading-6 text-muted-foreground"><p>{km ? 'នាយកដ្ឋានភូគព្ភសាស្ត្រ និងរ៉ែ (DGM)' : 'Department of Geology and Minerals (DGM)'}</p><p>{km ? 'អគ្គនាយកដ្ឋានធនធានរ៉ែ (GDMR)' : 'General Department of Mineral Resources (GDMR)'}</p><a className="inline-flex items-center gap-1 font-medium text-primary hover:underline" href="https://www.mme.gov.kh/" target="_blank" rel="noopener noreferrer">{km ? 'ក្រសួងរ៉ែ និងថាមពល (MME)' : 'Ministry of Mines and Energy (MME)'} <ExternalLink size={13} /></a></div>
              <div className="flex flex-wrap gap-3"><a className="btn btn-primary inline-flex items-center gap-2" href="mailto:keatlenarith@gmail.com"><Mail size={17} /> {km ? 'ផ្ញើអ៊ីមែល' : 'Email contact'}</a><a className="btn inline-flex items-center gap-2 border border-border" href="tel:+85598989825"><Phone size={17} /> (+855) 98 98 98 25</a></div>
              <p className="text-xs text-muted-foreground">{km ? 'ព័ត៌មាននេះជាទំនាក់ទំនងវិជ្ជាជីវៈ មិនមែនជាសេវាផ្លូវការរបស់ក្រសួងទេ។' : 'Professional contact information; this is not an official Ministry service channel.'}</p>
            </div>
          </div>
        </section>
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="card-surface space-y-4 p-7"><div className="flex items-center gap-2"><UserRound size={19} /><h3 className="font-semibold">{km ? 'ព័ត៌មានទំនាក់ទំនង' : 'Contact details'}</h3></div><p><strong>Email:</strong> <a className="text-primary hover:underline" href="mailto:keatlenarith@gmail.com">keatlenarith@gmail.com</a></p><p><strong>{km ? 'ទូរស័ព្ទ' : 'Mobile'}:</strong> <a className="text-primary hover:underline" href="tel:+85598989825">(+855) 98 98 98 25</a></p></div>
          <form className="card-surface space-y-4 p-7" onSubmit={sendEmail}><p className="text-xs text-muted-foreground">{km ? 'បំពេញទម្រង់ដើម្បីបើកកម្មវិធីអ៊ីមែលរបស់អ្នក។ សូមចុច Send នៅក្នុងកម្មវិធីអ៊ីមែលដើម្បីផ្ញើសារ។' : 'Complete the form to open your email application. Press Send in your email application to deliver the message.'}</p><div><label htmlFor="cn" className="text-sm font-medium">{km ? 'ឈ្មោះ' : 'Name'}</label><input id="cn" required className="field mt-1" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div><div><label htmlFor="ce" className="text-sm font-medium">{km ? 'អ៊ីមែល' : 'Email'}</label><input id="ce" type="email" required className="field mt-1" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div><div><label htmlFor="cm" className="text-sm font-medium">{km ? 'សារ' : 'Message'}</label><textarea id="cm" required rows={4} className="field mt-1" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} /></div><button className="btn btn-primary">{t('send')}</button>{sent && <p role="status" className="text-sm font-semibold text-primary">{km ? 'កម្មវិធីអ៊ីមែលបានបើក (បើមាន)។ សូមចុច Send ដើម្បីផ្ញើសារ។' : 'Email application requested. Please press Send there to deliver your message.'}</p>}</form>
        </div>
      </Container>
    </>
  );
}
