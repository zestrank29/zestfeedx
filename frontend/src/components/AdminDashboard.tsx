"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FilePlus2,
  Users,
  Activity,
  ExternalLink,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Send,
  Sparkles,
  X,
  RefreshCw,
} from "lucide-react";

interface AdminArticle {
  id: number;
  title: string;
  slug: string;
  category: string;
  language: "en" | "hi";
  published_at: string;
  author_name: string;
  source_name: string;
  image_url: string;
  summary: string;
  content: string;
}

interface SubmissionRecord {
  submission_id: string;
  submission_type: "editorial" | "guest";
  status: "pending" | "published" | "rejected";
  submitted_at: string;
  published_at?: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  language: "en" | "hi";
  image_url: string;
  source_name: string;
  source_url: string;
  tags: string;
  author_name: string;
  author_bio: string;
  author_email?: string;
}

const CATEGORIES = [
  { value: "india", label: "India / National" },
  { value: "health", label: "Health & Medicine" },
  { value: "markets", label: "Markets & Business" },
  { value: "tech", label: "Tech & AI" },
  { value: "world", label: "World & Diaspora" },
  { value: "sports", label: "Sports" },
  { value: "cricket", label: "Cricket" },
  { value: "entertainment", label: "Entertainment" },
  { value: "festivals", label: "Festivals & Culture" },
  { value: "explainers", label: "Explainers" },
  { value: "politics", label: "Politics" },
  { value: "ramayana", label: "Ramayana" },
];

export default function AdminDashboard({
  defaultSection = "posts",
}: {
  defaultSection?: "posts" | "new" | "queue";
}) {
  const [section, setSection] = useState<"posts" | "new" | "queue">(defaultSection);

  // Posts state
  const [articles, setArticles] = useState<AdminArticle[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [enCount, setEnCount] = useState(0);
  const [hiCount, setHiCount] = useState(0);
  const [availableCats, setAvailableCats] = useState<string[]>([]);
  const [langFilter, setLangFilter] = useState<"all" | "en" | "hi">("all");
  const [catFilter, setCatFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Edit modal state
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // New Post / Guest Post state
  const [submissionType, setSubmissionType] = useState<"editorial" | "guest">("editorial");
  const [newLang, setNewLang] = useState<"en" | "hi">("en");
  const [newCat, setNewCat] = useState("india");
  const [newTitle, setNewTitle] = useState("");
  const [newSummary, setNewSummary] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceUrl, setNewSourceUrl] = useState("");
  const [newAuthorName, setNewAuthorName] = useState("ZestFeedX Editorial Desk");
  const [newAuthorBio, setNewAuthorBio] = useState("");
  const [newAuthorEmail, setNewAuthorEmail] = useState("");
  const [publishNow, setPublishNow] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Guest Queue state
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([]);
  const [queueCounts, setQueueCounts] = useState({ total: 0, pending: 0, published: 0, rejected: 0 });

  // Global toast/banner
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string; url?: string } | null>(null);

  const loadArticles = useCallback(async () => {
    setLoadingPosts(true);
    try {
      const params = new URLSearchParams({
        lang: langFilter,
        category: catFilter,
        search: searchTerm,
      });
      const res = await fetch(`/api/admin/articles?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.articles || []);
        setTotalCount(data.total || 0);
        setEnCount(data.en_count || 0);
        setHiCount(data.hi_count || 0);
        setAvailableCats(data.categories || []);
      }
    } catch {
      // Ignore
    } finally {
      setLoadingPosts(false);
    }
  }, [langFilter, catFilter, searchTerm]);

  const loadQueue = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/submissions");
      if (res.ok) {
        const data = await res.json();
        setSubmissions(data.submissions || []);
        setQueueCounts(data.counts || { total: 0, pending: 0, published: 0, rejected: 0 });
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  useEffect(() => {
    loadQueue();
  }, [loadQueue]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === articles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(articles.map((a) => a.id));
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (ids.length === 0) return;
    const msg =
      ids.length === 1
        ? "Delete this article permanently from your website?"
        : `Delete ${ids.length} selected articles permanently from your website?`;
    if (!window.confirm(msg)) return;

    try {
      const res = await fetch("/api/admin/articles", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice({ type: "success", text: `Deleted ${data.deleted_count} article(s).` });
        setSelectedIds((prev) => prev.filter((id) => !ids.includes(id)));
        loadArticles();
      } else {
        setNotice({ type: "error", text: data.error || "Delete failed." });
      }
    } catch (err: any) {
      setNotice({ type: "error", text: err.message || "Delete failed." });
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    setSavingEdit(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArticle),
      });
      if (res.ok) {
        setNotice({ type: "success", text: "Article updated successfully." });
        setEditingArticle(null);
        loadArticles();
      } else {
        const data = await res.json();
        setNotice({ type: "error", text: data.error || "Update failed." });
      }
    } catch (err: any) {
      setNotice({ type: "error", text: err.message || "Update failed." });
    } finally {
      setSavingEdit(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch("/api/admin/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submission_type: submissionType,
          language: newLang,
          category: newCat,
          title: newTitle,
          summary: newSummary,
          content: newContent,
          image_url: newImageUrl,
          source_name: newSourceName,
          source_url: newSourceUrl,
          author_name: newAuthorName,
          author_bio: newAuthorBio,
          author_email: newAuthorEmail,
          publish_immediately: publishNow,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setNotice({
          type: "success",
          text: publishNow ? "News published live!" : "Submitted to Guest Post review queue.",
          url: publishNow ? data.article_url : undefined,
        });
        setNewTitle("");
        setNewSummary("");
        setNewContent("");
        setNewImageUrl("");
        setNewSourceName("");
        setNewSourceUrl("");
        loadArticles();
        loadQueue();
      } else {
        setNotice({ type: "error", text: data.error || "Failed to publish." });
      }
    } catch (err: any) {
      setNotice({ type: "error", text: err.message || "Network error." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleQueueAction = async (submission_id: string, action: "approve" | "reject") => {
    const res = await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id, action }),
    });
    if (res.ok) {
      setNotice({
        type: "success",
        text: action === "approve" ? "Guest post approved & published!" : "Guest post rejected.",
      });
      loadQueue();
      loadArticles();
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F0F0F1] dark:bg-[#080C16] text-[#1D2327] dark:text-[#F1F5F9]">
      {/* WordPress-style Left Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-[#1D2327] text-[#F0F0F1] flex flex-col justify-between">
        <div>
          <div className="px-5 py-4 border-b border-white/10 flex items-center gap-2.5">
            <LayoutDashboard className="w-5 h-5 text-[#FF5A1F]" />
            <div>
              <div className="font-bold text-sm tracking-tight">ZestFeedX Admin</div>
              <div className="text-[11px] text-slate-400">Newsroom CMS</div>
            </div>
          </div>

          <nav className="p-3 space-y-1 text-sm">
            <button
              type="button"
              onClick={() => setSection("posts")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition-colors ${
                section === "posts" ? "bg-[#FF5A1F] text-white" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" /> All Posts
              </span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-black/25">{totalCount}</span>
            </button>

            <button
              type="button"
              onClick={() => setSection("new")}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium transition-colors ${
                section === "new" ? "bg-[#FF5A1F] text-white" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <FilePlus2 className="w-4 h-4" /> Add New Post
            </button>

            <button
              type="button"
              onClick={() => setSection("queue")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md font-medium transition-colors ${
                section === "queue" ? "bg-[#FF5A1F] text-white" : "text-slate-300 hover:bg-white/10"
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Users className="w-4 h-4" /> Guest Posts
              </span>
              {queueCounts.pending > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-amber-500 text-black font-bold">
                  {queueCounts.pending}
                </span>
              )}
            </button>

            <Link
              href="/admin/publishing-status/"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-md font-medium text-slate-300 hover:bg-white/10 transition-colors"
            >
              <Activity className="w-4 h-4" /> Cron &amp; Status
            </Link>
          </nav>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2 text-xs">
          <Link href="/" className="flex items-center justify-between text-slate-300 hover:text-white">
            <span>English Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <Link href="/hi/" className="flex items-center justify-between text-slate-300 hover:text-white">
            <span>Hindi Site (/hi/)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-1 p-5 sm:p-8 max-w-6xl">
        {/* Global Notice */}
        {notice && (
          <div
            className={`mb-6 p-3.5 rounded-lg border flex items-center justify-between gap-4 text-sm ${
              notice.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{notice.text}</span>
              {notice.url && (
                <Link href={notice.url} className="font-bold underline ml-2">
                  View Post →
                </Link>
              )}
            </div>
            <button type="button" onClick={() => setNotice(null)} className="opacity-70 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {section === "posts" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Posts Manager</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Manage, edit, or delete any news article on your website. ({enCount} English • {hiCount} Hindi)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={loadArticles}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0F172A] text-xs font-semibold hover:border-[#FF5A1F]"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
                <button
                  type="button"
                  onClick={() => setSection("new")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md bg-[#FF5A1F] hover:bg-[#e04a12] text-white text-xs font-bold"
                >
                  <FilePlus2 className="w-3.5 h-3.5" /> Add New
                </button>
              </div>
            </div>

            {/* Filter & Bulk Action Bar */}
            <div className="bg-white dark:bg-[#0F172A] p-4 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(["all", "en", "hi"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLangFilter(l)}
                    className={`px-3 py-1.5 rounded text-xs font-bold ${
                      langFilter === l
                        ? "bg-[#1D2327] dark:bg-white text-white dark:text-[#1D2327]"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {l === "all" ? `All (${totalCount})` : l === "en" ? `English (${enCount})` : `Hindi (${hiCount})`}
                  </button>
                ))}

                <select
                  value={catFilter}
                  onChange={(e) => setCatFilter(e.target.value)}
                  className="px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#080C16] text-xs font-semibold capitalize"
                >
                  <option value="all">All Categories</option>
                  {availableCats.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                {selectedIds.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedIds)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete Selected ({selectedIds.length})
                  </button>
                )}

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts..."
                    className="pl-8 pr-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#080C16] text-xs w-48 focus:outline-none focus:border-[#FF5A1F]"
                  />
                </div>
              </div>
            </div>

            {/* WordPress-style Posts Table */}
            <div className="bg-white dark:bg-[#0F172A] rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0B1020] text-slate-600 dark:text-slate-300">
                    <th className="p-3 w-8">
                      <input
                        type="checkbox"
                        checked={articles.length > 0 && selectedIds.length === articles.length}
                        onChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-3">Title &amp; Actions</th>
                    <th className="p-3">Author / Source</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Lang</th>
                    <th className="p-3">Published</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {loadingPosts ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        Loading articles...
                      </td>
                    </tr>
                  ) : articles.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No articles match your filters.
                      </td>
                    </tr>
                  ) : (
                    articles.map((art) => (
                      <tr key={art.id} className="hover:bg-slate-50 dark:hover:bg-white/5">
                        <td className="p-3 align-top">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(art.id)}
                            onChange={() => toggleSelect(art.id)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-start gap-3">
                            {art.image_url && (
                              <img
                                src={art.image_url}
                                alt=""
                                className="w-14 h-10 object-cover rounded border border-slate-200 dark:border-slate-700 shrink-0"
                              />
                            )}
                            <div>
                              <div className="font-bold text-sm leading-snug line-clamp-1">{art.title}</div>
                              <div className="flex items-center gap-3 mt-1 text-[11px]">
                                <button
                                  type="button"
                                  onClick={() => setEditingArticle(art)}
                                  className="text-blue-600 dark:text-blue-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                  <Edit3 className="w-3 h-3" /> Edit
                                </button>
                                <Link
                                  href={`/article/${art.slug}/`}
                                  target="_blank"
                                  className="text-slate-600 dark:text-slate-400 hover:underline inline-flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" /> View
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => handleDelete([art.id])}
                                  className="text-red-600 dark:text-red-400 hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" /> Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 align-top">
                          <div className="font-medium">{art.author_name}</div>
                          {art.source_name && <div className="text-[11px] text-slate-500">{art.source_name}</div>}
                        </td>
                        <td className="p-3 align-top">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 capitalize font-semibold">
                            {art.category}
                          </span>
                        </td>
                        <td className="p-3 align-top">
                          <span
                            className={`px-2 py-0.5 rounded font-bold uppercase ${
                              art.language === "hi"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300"
                                : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300"
                            }`}
                          >
                            {art.language}
                          </span>
                        </td>
                        <td className="p-3 align-top text-slate-500 whitespace-nowrap">
                          {art.published_at ? new Date(art.published_at).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {section === "new" && (
          <form
            onSubmit={handleCreatePost}
            className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5"
          >
            <div>
              <h1 className="text-2xl font-bold">Add New Post / Guest Post</h1>
              <p className="text-xs text-slate-500">Publish directly to your website or queue a guest submission for review.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionType("editorial");
                    setNewAuthorName("ZestFeedX Editorial Desk");
                    setPublishNow(true);
                  }}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold ${
                    submissionType === "editorial" ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]" : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 inline mr-1" /> My News Dispatch
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmissionType("guest");
                    setNewAuthorName("");
                    setPublishNow(false);
                  }}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold ${
                    submissionType === "guest" ? "border-[#FF5A1F] bg-[#FF5A1F]/10 text-[#FF5A1F]" : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 inline mr-1" /> Guest Post
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewLang("en")}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold ${
                    newLang === "en" ? "bg-[#1D2327] dark:bg-white text-white dark:text-[#1D2327]" : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 inline mr-1" /> English
                </button>
                <button
                  type="button"
                  onClick={() => setNewLang("hi")}
                  className={`py-2.5 px-3 rounded-lg border text-xs font-bold ${
                    newLang === "hi" ? "bg-[#1D2327] dark:bg-white text-white dark:text-[#1D2327]" : "border-slate-300 dark:border-slate-700"
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 inline mr-1" /> हिंदी (Hindi)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold mb-1">Headline *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Category *</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Summary / Deck *</label>
              <textarea
                required
                rows={2}
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Article Content (Markdown) *</label>
              <textarea
                required
                rows={8}
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm font-mono"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Author Name *</label>
                <input
                  type="text"
                  required
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Featured Image URL</label>
                <input
                  type="url"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Source Name (optional)</label>
                <input
                  type="text"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-200 dark:border-slate-800">
              <label className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input type="checkbox" checked={publishNow} onChange={(e) => setPublishNow(e.target.checked)} className="accent-[#FF5A1F]" />
                <span>Publish immediately to live site</span>
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FF5A1F] hover:bg-[#e04a12] text-white text-sm font-bold disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {submitting ? "Saving..." : publishNow ? "Publish Live" : "Save to Review Queue"}
              </button>
            </div>
          </form>
        )}

        {section === "queue" && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Guest Post Review Queue</h1>
            {submissions.length === 0 ? (
              <div className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-sm text-slate-500">
                No guest post submissions yet.
              </div>
            ) : (
              submissions.map((item) => (
                <div
                  key={item.submission_id}
                  className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-bold uppercase mb-1">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                        {item.language} • {item.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800">{item.status}</span>
                    </div>
                    <h3 className="font-bold text-base">{item.title}</h3>
                    <p className="text-xs text-slate-500">By {item.author_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.status === "pending" && (
                      <>
                        <button
                          type="button"
                          onClick={() => handleQueueAction(item.submission_id, "approve")}
                          className="px-3 py-1.5 rounded bg-emerald-600 text-white text-xs font-bold inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQueueAction(item.submission_id, "reject")}
                          className="px-3 py-1.5 rounded bg-red-600 text-white text-xs font-bold inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </>
                    )}
                    {item.status === "published" && (
                      <Link href={`/article/${item.slug}/`} className="px-3 py-1.5 rounded border text-xs font-bold">
                        View Live
                      </Link>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveEdit}
            className="bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h2 className="font-bold text-lg">Edit Article #{editingArticle.id}</h2>
              <button type="button" onClick={() => setEditingArticle(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Headline</label>
              <input
                type="text"
                required
                value={editingArticle.title}
                onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold mb-1">Category</label>
                <select
                  value={editingArticle.category}
                  onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1">Language</label>
                <select
                  value={editingArticle.language}
                  onChange={(e) => setEditingArticle({ ...editingArticle, language: e.target.value as "en" | "hi" })}
                  className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
                >
                  <option value="en">English (en)</option>
                  <option value="hi">Hindi (hi)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Featured Image URL</label>
              <input
                type="text"
                value={editingArticle.image_url}
                onChange={(e) => setEditingArticle({ ...editingArticle, image_url: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Summary</label>
              <textarea
                rows={2}
                value={editingArticle.summary}
                onChange={(e) => setEditingArticle({ ...editingArticle, summary: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">Content (Markdown)</label>
              <textarea
                rows={7}
                value={editingArticle.content}
                onChange={(e) => setEditingArticle({ ...editingArticle, content: e.target.value })}
                className="w-full px-3 py-2 rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#080C16] text-sm font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
              <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 rounded border text-xs font-bold">
                Cancel
              </button>
              <button
                type="submit"
                disabled={savingEdit}
                className="px-5 py-2 rounded bg-[#FF5A1F] text-white text-xs font-bold disabled:opacity-50"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
