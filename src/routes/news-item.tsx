import { Container, PageHeader } from "@/components/site/Chrome";
import { Link } from "@/lib/spa-router";
import { useEffect, useState } from "react";
import { postText, postBody, safeCover } from "@/admin/posts";
import { getNewsById, isManagedNews, type NewsItem as NewsData } from "@/lib/news-service";
import { useI18n } from "@/lib/i18n";
import { ArrowLeft, Calendar, Tag, Share2 } from "lucide-react";

export default function NewsItem() {
  const { lang } = useI18n();
  const id = new URLSearchParams(location.search).get("id") || "";
  const [article,setArticle]=useState<NewsData|null>(null);
  const [loading,setLoading]=useState(true),[error,setError]=useState('');
  useEffect(()=>{const item=getNewsById(id)||null;setArticle(item);setLoading(false);},[id]);

  const title = article
    ? postText(article.title,article.titleKm,lang)
    : (lang === "km" ? "រកមិនឃើញអត្ថបទ" : "Article not found");

  const excerpt = article
    ? postText(article.excerpt,article.excerptKm,lang)
    : "";

  const content = article
    ? postBody(article.content||article.excerpt,article.contentKm,lang)
    : "";

  return (
    <>
      <PageHeader
        eyebrow={lang === "km" ? "ព័ត៌មានភូគព្ភសាស្ត្រ" : "Geoscience News"}
        title={title}
      />
      <Container>
        <div className="mx-auto max-w-4xl py-4">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition mb-6"
          >
            <ArrowLeft size={16} />
            <span>{lang === "km" ? "ត្រឡប់ទៅកាន់ព័ត៌មានទាំងអស់" : "Back to all news"}</span>
          </Link>

          {loading?<p role="status">Loading article…</p>:error?<p role="alert" className="rounded bg-red-50 p-4 text-red-800">{error}</p>:!article ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center">
              <h2 className="text-xl font-bold text-slate-800">
                {lang === "km" ? "រកមិនឃើញអត្ថបទព័ត៌មាននេះទេ" : "Story Not Found"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                {lang === "km"
                  ? "អត្ថបទនេះប្រហែលជាត្រូវបានលុប ឬផ្លាស់ប្តូរទីតាំង។"
                  : "This article may have been removed or unpublished."}
              </p>
              <Link
                to="/news"
                className="mt-6 inline-block rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white"
              >
                {lang === "km" ? "មើលព័ត៌មានផ្សេងទៀត" : "Browse other stories"}
              </Link>
            </div>
          ) : (
            <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 md:p-10 shadow-sm">
              {/* Meta bar */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pb-6 border-b border-slate-100">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-emerald-800">
                  <Tag size={12} /> {article.tag}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} /> {article.date}
                </span>
                <span className="text-slate-300">|</span>
                <span>{isManagedNews(article.id)?"GeoCam Society Media":"DEMO · Demonstration story"}</span>
              </div>

              {/* Main Title */}
              <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl leading-tight">
                {title}
              </h1>

              {/* Cover Photo */}
              {safeCover(article.image) && (
                <div className="mt-8 overflow-hidden rounded-xl bg-slate-100 border border-slate-200">
                  <img
                    src={safeCover(article.image)}
                    alt={title}
                    className="max-h-[500px] w-full object-cover"
                  />
                </div>
              )}

              {/* Summary / Excerpt Callout */}
              {excerpt && (
                <div className="mt-8 rounded-xl border-l-4 border-emerald-600 bg-emerald-50/60 p-5 text-base font-medium leading-relaxed text-slate-800">
                  {excerpt}
                </div>
              )}

              {/* Full Content Body */}
              <div className="geocam-article-body mt-8 space-y-4 whitespace-pre-line text-lg leading-relaxed text-slate-700 font-normal" dangerouslySetInnerHTML={{__html:content}}/>
            </article>
          )}
        </div>
      </Container>
    </>
  );
}
