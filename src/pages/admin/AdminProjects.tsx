import { useEffect, useState } from 'react';
import { Plus, Edit3, Trash2, FolderGit2, FileText, Video, X, Save, Loader2, ChevronRight, Upload, ExternalLink, HelpCircle } from 'lucide-react';
import PlatformNav from '@/components/layout/PlatformNav';
import SEO from '@/components/ui/SEO';
import LoadingState from '@/components/ui/LoadingState';
import EmptyState from '@/components/ui/EmptyState';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import type { Course, Project, ProjectResource, Quiz, QuizQuestion } from '@/types';

const adminLinks = [
  { label: 'Dashboard', to: '/admin' }, { label: 'Courses', to: '/admin/courses' },
  { label: 'Projects', to: '/admin/projects' }, { label: 'Users', to: '/admin/users' },
  { label: 'Testimonials', to: '/admin/testimonials' }, { label: 'Notifications', to: '/admin/notifications' },
];
const defaultImage = 'https://images.pexels.com/photos/7868836/pexels-photo-7868836.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';
const BUCKET = 'alyntis-resources';
const MAX_PDF_SIZE = 20 * 1024 * 1024;
function slugify(text: string) { return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

export default function AdminProjects() {
  const { profile } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [resources, setResources] = useState<ProjectResource[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [form, setForm] = useState({ title:'', description:'', course_id:'', class_level:'Class 8', difficulty:'Intermediate' as Project['difficulty'], estimated_time:'4-6 hours', technology:'Robotics', what_you_build:'', what_you_learn:'', components:'', build_steps:'', testing:'', troubleshooting:'', take_it_further:'', status:'published' as Project['status'], image_url:defaultImage });
  const [resourceForm, setResourceForm] = useState({ title:'', resource_type:'pdf' as 'pdf'|'video', url:'', description:'', file:null as File|null });
  const [quizForm, setQuizForm] = useState({ title:'', description:'', pass_score:70 });
  const [questionForm, setQuestionForm] = useState({ question:'', option_a:'', option_b:'', option_c:'', option_d:'', correct_answer:'a' as 'a'|'b'|'c'|'d' });

  const loadProjects = async () => { const { data } = await supabase.from('projects').select('*').order('created_at',{ascending:false}); setProjects((data as Project[])||[]); setLoading(false); };
  const loadCourses = async () => { const { data } = await supabase.from('courses').select('*').order('title'); setCourses((data as Course[])||[]); };
  const loadDetails = async (project: Project) => {
    setSelectedProject(project); setDetailLoading(true);
    const [r,q] = await Promise.all([
      supabase.from('project_resources').select('*').eq('project_id',project.id).order('sort_order'),
      supabase.from('quizzes').select('*').eq('project_id',project.id),
    ]);
    setResources((r.data as ProjectResource[])||[]); setQuizzes((q.data as Quiz[])||[]);
    if (q.data?.length) { setActiveQuizId(q.data[0].id); const {data:qs}=await supabase.from('quiz_questions').select('*').eq('quiz_id',q.data[0].id).order('sort_order'); setQuestions((qs as QuizQuestion[])||[]); } else { setActiveQuizId(null); setQuestions([]); }
    setDetailLoading(false);
  };
  useEffect(()=>{loadProjects();loadCourses();},[]);

  const resetProject = () => setForm({ title:'',description:'',course_id:'',class_level:'Class 8',difficulty:'Intermediate',estimated_time:'4-6 hours',technology:'Robotics',what_you_build:'',what_you_learn:'',components:'',build_steps:'',testing:'',troubleshooting:'',take_it_further:'',status:'published',image_url:defaultImage });
  const editProject = (p:Project) => { setEditing(p); setForm({title:p.title,description:p.description||'',course_id:p.course_id||'',class_level:p.class_level||'Class 8',difficulty:p.difficulty||'Intermediate',estimated_time:p.estimated_time||'',technology:p.technology||'',what_you_build:p.what_you_build||'',what_you_learn:p.what_you_learn||'',components:p.components||'',build_steps:p.build_steps||'',testing:p.testing||'',troubleshooting:p.troubleshooting||'',take_it_further:p.take_it_further||'',status:p.status,image_url:p.image_url||defaultImage}); setShowProjectForm(true); };
  const saveProject = async (e:React.FormEvent) => { e.preventDefault(); setSaving(true); const payload={...form,slug:slugify(form.title),description:form.description||null,course_id:form.course_id||null}; const result=editing?await supabase.from('projects').update({...payload,updated_at:new Date().toISOString()}).eq('id',editing.id):await supabase.from('projects').insert({...payload,created_by:profile?.id}); setSaving(false); if(result.error){alert(result.error.message);return;} setShowProjectForm(false);setEditing(null);resetProject();loadProjects(); };
  const deleteProject = async(id:string)=>{if(!confirm('Delete this project and its resources?'))return; await supabase.from('projects').delete().eq('id',id); if(selectedProject?.id===id)setSelectedProject(null);loadProjects();};

  const addResource = async(e:React.FormEvent)=>{
    e.preventDefault(); if(!selectedProject)return;
    if(resourceForm.resource_type==='pdf'){
      const file=resourceForm.file; if(!file){alert('Please choose a PDF file.');return;}
      if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf')){alert('Only PDF files are allowed.');return;}
      if(file.size>MAX_PDF_SIZE){alert('PDF must be 20 MB or smaller.');return;}
      setUploading(true);
      const path=`resources/projects/${selectedProject.id}/${crypto.randomUUID()}.pdf`;
      const upload=await supabase.storage.from(BUCKET).upload(path,file,{contentType:'application/pdf',upsert:false});
      if(upload.error){setUploading(false);alert(`Upload failed: ${upload.error.message}`);return;}
      const insert=await supabase.from('project_resources').insert({project_id:selectedProject.id,title:resourceForm.title,resource_type:'pdf',url:null,description:resourceForm.description||null,file_path:path,file_name:file.name,file_size:file.size,mime_type:'application/pdf',created_by:profile?.id}).select().single();
      setUploading(false); if(insert.error){await supabase.storage.from(BUCKET).remove([path]);alert(insert.error.message);return;}
    } else {
      if(!resourceForm.url){alert('Please enter the video URL.');return;}
      const insert=await supabase.from('project_resources').insert({project_id:selectedProject.id,title:resourceForm.title,resource_type:'video',url:resourceForm.url,description:resourceForm.description||null,created_by:profile?.id});
      if(insert.error){alert(insert.error.message);return;}
    }
    setShowResourceForm(false);setResourceForm({title:'',resource_type:'pdf',url:'',description:'',file:null});loadDetails(selectedProject);
  };
  const deleteResource = async(r:ProjectResource)=>{if(!confirm(`Delete ${r.title}?`))return; if(r.file_path)await supabase.storage.from(BUCKET).remove([r.file_path]); await supabase.from('project_resources').delete().eq('id',r.id); if(selectedProject)loadDetails(selectedProject);};
  const saveQuiz = async(e:React.FormEvent)=>{e.preventDefault();if(!selectedProject)return;const r=await supabase.from('quizzes').insert({project_id:selectedProject.id,...quizForm});if(r.error)alert(r.error.message);else{setShowQuizForm(false);setQuizForm({title:'',description:'',pass_score:70});loadDetails(selectedProject);}};
  const saveQuestion = async(e:React.FormEvent)=>{e.preventDefault();if(!activeQuizId)return;const r=await supabase.from('quiz_questions').insert({quiz_id:activeQuizId,...questionForm});if(r.error)alert(r.error.message);else{setShowQuestionForm(false);setQuestionForm({question:'',option_a:'',option_b:'',option_c:'',option_d:'',correct_answer:'a'});if(selectedProject)loadDetails(selectedProject);}};
  const signedUrl = async(r:ProjectResource)=>{if(r.file_path){const {data,error}=await supabase.storage.from(BUCKET).createSignedUrl(r.file_path,3600);if(error){alert(error.message);return null;}return data.signedUrl;}return r.url;};

  return <><SEO title="Manage Projects — Alyntis Admin" description="Manage projects, resources and quizzes"/><PlatformNav links={adminLinks}/><main className="min-h-screen bg-navy-950 pt-20"><div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="flex items-center justify-between"><div><h1 className="text-2xl font-bold text-white">Manage Projects</h1><p className="mt-1 text-sm text-gray-400">Create projects and upload PDF resources directly to Alyntis.</p></div><button onClick={()=>{setEditing(null);resetProject();setShowProjectForm(true)}} className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 px-5 py-3 text-sm font-semibold text-white"><Plus className="h-4 w-4"/>Add Project</button></header>
    {loading?<LoadingState/>:projects.length===0?<div className="mt-8"><EmptyState icon={<FolderGit2 className="h-12 w-12"/>} title="No projects yet" message="Create your first project." action={<button onClick={()=>setShowProjectForm(true)} className="rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-white">Add Project</button>}/></div>:<div className="mt-8 grid gap-6 lg:grid-cols-3"><div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">{projects.map(p=><article key={p.id} className={`rounded-2xl border ${selectedProject?.id===p.id?'border-teal-500/50':'border-white/10'} bg-white/5 overflow-hidden`}><div className="h-28 overflow-hidden">{p.image_url&&<img src={p.image_url} alt="" className="h-full w-full object-cover"/>}</div><div className="p-4"><h3 className="font-bold text-white">{p.title}</h3><p className="mt-1 text-xs text-gray-400 line-clamp-2">{p.description}</p><div className="mt-3 flex gap-2"><button onClick={()=>loadDetails(p)} className="inline-flex items-center gap-1 rounded-lg bg-teal-500/20 px-3 py-1.5 text-xs font-semibold text-teal-400">Manage <ChevronRight className="h-3 w-3"/></button><button onClick={()=>editProject(p)} className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white"><Edit3 className="inline h-3 w-3 mr-1"/>Edit</button><button onClick={()=>deleteProject(p.id)} className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-400"><Trash2 className="h-3 w-3"/></button></div></div></article>)}</div>
    <aside className="sticky top-24 rounded-2xl border border-white/10 bg-white/5 p-5 h-fit">{!selectedProject?<p className="py-10 text-center text-sm text-gray-500">Select a project to manage resources.</p>:detailLoading?<LoadingState/>:<><h2 className="font-bold text-white">{selectedProject.title}</h2><p className="mt-1 text-xs text-gray-400">Resources</p><div className="mt-3 space-y-2">{resources.length===0?<p className="text-xs text-gray-500">No resources yet.</p>:resources.map(r=><div key={r.id} className="flex items-center gap-2 rounded-lg border border-white/10 p-2"><FileText className="h-4 w-4 text-red-400"/><span className="flex-1 truncate text-xs text-white">{r.title}</span>{r.file_path&&<span className="text-[10px] text-teal-400">Uploaded</span>}<button onClick={()=>deleteResource(r)} className="text-red-400"><Trash2 className="h-3.5 w-3.5"/></button></div>)}</div><button onClick={()=>setShowResourceForm(true)} className="mt-3 inline-flex items-center gap-1 rounded-lg bg-teal-500/20 px-3 py-2 text-xs font-semibold text-teal-400"><Upload className="h-3 w-3"/>Add Resource</button><div className="mt-6 border-t border-white/10 pt-4"><div className="flex items-center justify-between"><h3 className="font-bold text-white">Quizzes</h3><button onClick={()=>setShowQuizForm(true)} className="text-xs text-teal-400">+ Add</button></div>{quizzes.map(q=><div key={q.id} className="mt-2 rounded-lg border border-white/10 p-3"><div className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-teal-400"/><span className="text-xs text-white">{q.title}</span></div><button onClick={()=>{setActiveQuizId(q.id);setShowQuestionForm(true)}} className="mt-2 text-xs text-teal-400">+ Add Question</button>{questions.filter(x=>x.quiz_id===q.id).map(x=><p key={x.id} className="mt-1 text-xs text-gray-400">• {x.question}</p>)}</div>)}</div></>}</aside></div>}
  </div></main>

  {showProjectForm&&<Modal title={editing?'Edit Project':'New Project'} close={()=>setShowProjectForm(false)}><form onSubmit={saveProject} className="space-y-3"><FormField label="Title *" value={form.title} onChange={v=>setForm({...form,title:v})} required/><TextAreaField label="Description" value={form.description} onChange={v=>setForm({...form,description:v})}/><div className="grid grid-cols-2 gap-3"><FormField label="Class" value={form.class_level} onChange={v=>setForm({...form,class_level:v})}/><FormField label="Technology" value={form.technology} onChange={v=>setForm({...form,technology:v})}/></div><TextAreaField label="What are you building?" value={form.what_you_build} onChange={v=>setForm({...form,what_you_build:v})}/><TextAreaField label="What will you learn?" value={form.what_you_learn} onChange={v=>setForm({...form,what_you_learn:v})}/><TextAreaField label="Components" value={form.components} onChange={v=>setForm({...form,components:v})}/><TextAreaField label="Build steps" value={form.build_steps} onChange={v=>setForm({...form,build_steps:v})}/><div className="flex justify-end"><button disabled={saving} className="rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white">{saving?'Saving…':'Save Project'}</button></div></form></Modal>}
  {showResourceForm&&selectedProject&&<Modal title="Add Resource" close={()=>!uploading&&setShowResourceForm(false)}><form onSubmit={addResource} className="space-y-4"><FormField label="Title *" value={resourceForm.title} onChange={v=>setResourceForm({...resourceForm,title:v})} required/><select value={resourceForm.resource_type} onChange={e=>setResourceForm({...resourceForm,resource_type:e.target.value as 'pdf'|'video',file:null,url:''})} className="w-full rounded-xl border border-white/10 bg-navy-950 p-3 text-sm text-white"><option value="pdf">PDF Document</option><option value="video">Video</option></select>{resourceForm.resource_type==='pdf'?<label className="block rounded-xl border border-dashed border-teal-500/40 bg-teal-500/5 p-5 text-center cursor-pointer"><Upload className="mx-auto h-6 w-6 text-teal-400"/><p className="mt-2 text-sm text-white">Choose PDF</p><p className="text-xs text-gray-500">PDF only, max 20 MB</p><input type="file" accept="application/pdf,.pdf" className="hidden" onChange={e=>setResourceForm({...resourceForm,file:e.target.files?.[0]||null})}/>{resourceForm.file&&<p className="mt-2 text-xs text-teal-400">{resourceForm.file.name}</p>}</label>:<FormField label="Video URL *" value={resourceForm.url} onChange={v=>setResourceForm({...resourceForm,url:v})} required/>}<TextAreaField label="Description" value={resourceForm.description} onChange={v=>setResourceForm({...resourceForm,description:v})}/><button disabled={uploading} className="w-full rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 py-3 text-sm font-semibold text-white">{uploading?'Uploading PDF…':'Add Resource'}</button></form></Modal>}
  {showQuizForm&&selectedProject&&<Modal title="Add Quiz" close={()=>setShowQuizForm(false)}><form onSubmit={saveQuiz} className="space-y-3"><FormField label="Title *" value={quizForm.title} onChange={v=>setQuizForm({...quizForm,title:v})} required/><TextAreaField label="Description" value={quizForm.description} onChange={v=>setQuizForm({...quizForm,description:v})}/><input type="number" min="0" max="100" value={quizForm.pass_score} onChange={e=>setQuizForm({...quizForm,pass_score:Number(e.target.value)})} className="w-full rounded-xl bg-navy-950 p-3 text-white"/><button className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white">Add Quiz</button></form></Modal>}
  {showQuestionForm&&activeQuizId&&<Modal title="Add Question" close={()=>setShowQuestionForm(false)}><form onSubmit={saveQuestion} className="space-y-3"><TextAreaField label="Question *" value={questionForm.question} onChange={v=>setQuestionForm({...questionForm,question:v})}/>{(['a','b','c','d'] as const).map(k=><FormField key={k} label={`Option ${k.toUpperCase()} *`} value={questionForm[`option_${k}`]} onChange={v=>setQuestionForm({...questionForm,[`option_${k}`]:v})} required/>)}<select value={questionForm.correct_answer} onChange={e=>setQuestionForm({...questionForm,correct_answer:e.target.value as 'a'|'b'|'c'|'d'})} className="w-full rounded-xl bg-navy-950 p-3 text-white"><option value="a">A</option><option value="b">B</option><option value="c">C</option><option value="d">D</option></select><button className="w-full rounded-xl bg-teal-500 py-3 text-sm font-semibold text-white">Add Question</button></form></Modal>}
  </>;
}
function Modal({title,close,children}:{title:string;close:()=>void;children:React.ReactNode}){return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/80 p-4 backdrop-blur-sm"><div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/10 bg-navy-900 p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-bold text-white">{title}</h2><button onClick={close} className="text-gray-400"><X className="h-5 w-5"/></button></div><div className="mt-5">{children}</div></div></div>}
function FormField({label,value,onChange,required}:{label:string;value:string;onChange:(v:string)=>void;required?:boolean}){return <div><label className="mb-1.5 block text-sm font-semibold text-gray-300">{label}</label><input value={value} onChange={e=>onChange(e.target.value)} required={required} className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500"/></div>}
function TextAreaField({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <div><label className="mb-1.5 block text-sm font-semibold text-gray-300">{label}</label><textarea value={value} onChange={e=>onChange(e.target.value)} rows={3} className="w-full rounded-xl border border-white/10 bg-navy-950/50 px-4 py-3 text-sm text-white outline-none focus:border-teal-500"/></div>}
