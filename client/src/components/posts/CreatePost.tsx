import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postAPI } from "../../api/post.api";
import { uploadAPI } from "../../api/upload.api";
import TextEditor from "../../components/editor/TextEditor";
import Spinner from "../../components/ui/Spinner";
import { useCategories } from "../../hooks/useCategories";

type CreatePostForm = {
  title: string;
  content: string;
  post_picture: string;
  post_picture_id?: string;
  category: string;
  tags: string[];
  status: "draft" | "published";
  imageFile?: File;
};

export default function CreatePost() {
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();

  const [form, setForm] = useState<CreatePostForm>({
    title: "",
    content: "",
    post_picture: "",
    category: "",
    tags: [],
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addTag = () => {
    if (!tagInput.trim()) return;

    if (form.tags.length >= 5) return;

    const tag = tagInput.trim().toLowerCase();

    if (!form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }

    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm({
      ...form,
      tags: form.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) return;

    if (form.tags.length < 3 || form.tags.length > 5) return;

    setSubmitting(true);

    try {
      let post_picture = null;
      let post_picture_id = null;

      if (form.imageFile) {
        const res = await uploadAPI.uploadPostImage(form.imageFile);
        post_picture = res.data.url;
        post_picture_id = res.data.public_id;
      }

      await postAPI.createPost({
        title: form.title,
        content: form.content,
        category: form.category,
        tags: form.tags,
        status: form.status,
        post_picture,
        post_picture_id,
      });

      navigate("/me");
    } finally {
      setSubmitting(false);
    }
  };

  if (categoriesLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-bg text-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="card p-6 sm:p-10">
          <h1 className="text-3xl font-bold mb-8">Create Post</h1>

          {/* Editor */}
          <div className="mb-6">
            <TextEditor form={form} setForm={setForm} />
          </div>

          {/* Category */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-secondary">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full h-12 rounded-2xl bg-surface border border-border px-4 text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block mb-2 text-sm text-secondary">
              Tags (3–5 required)
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-surface border border-border text-sm flex items-center gap-2"
                >
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-red-400"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add tag"
                maxLength={20}
                className="flex-1 h-12 px-4 rounded-2xl bg-surface border border-border text-primary focus:outline-none focus:ring-2 focus:ring-accent/40"
              />

              <button
                onClick={addTag}
                className="px-5 h-12 rounded-2xl bg-accent text-black font-semibold"
              >
                Add
              </button>
            </div>

            <p className="mt-2 text-xs text-muted">{form.tags.length}/5 tags</p>
          </div>

          {/* Status */}
          <div className="mb-8 flex items-center justify-between p-4 rounded-2xl bg-surface border border-border">
            <span className="text-sm text-secondary">Status</span>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as any,
                })
              }
              className="h-10 px-3 rounded-xl bg-bg border border-border text-primary"
            >
              <option value="draft">Draft</option>
              <option value="published">Publish</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 h-12 rounded-2xl border border-border text-secondary hover:bg-surface transition"
            >
              Cancel
            </button>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 h-12 rounded-2xl bg-accent text-black font-semibold hover:bg-accent-hover transition disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : form.status === "draft"
                  ? "Save draft"
                  : "Publish"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
