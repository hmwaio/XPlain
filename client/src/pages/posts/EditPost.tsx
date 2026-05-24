import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { postAPI } from "../../api/post.api";
import { uploadAPI } from "../../api/upload.api";
import TextEditor from "../../components/editor/TextEditor";
import Spinner from "../../components/ui/Spinner";
import { useCategories } from "../../hooks/useCategories";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { categories, loading: categoriesLoading } = useCategories();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<any>({
    title: "",
    content: "",
    post_picture: "",
    post_picture_id: "",
    category: "",
    tags: [],
    status: "draft",
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postAPI.getPost(Number(id));
        const post = res.data.post;

        setForm({
          title: post.title,
          content: post.content,
          post_picture: post.post_picture,
          post_picture_id: post.post_picture_id,
          category: post.category,
          tags: post.tags.map((t: any) => t.name),
          status: post.status,
        });
      } catch (error) {
        alert("Failed to load post");
        navigate("/me");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const addTag = () => {
    if (!tagInput.trim()) return;
    if (form.tags.length >= 5) return alert("Maximum 5 tags allowed");

    const tag = tagInput.trim().toLowerCase();
    if (!form.tags.includes(tag)) {
      setForm({ ...form, tags: [...form.tags, tag] });
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    setForm({ ...form, tags: form.tags.filter((t: string) => t !== tag) });
  };

  const handleUpdate = async () => {
    if (!form.title.trim()) return alert("Title required");
    if (!form.content.trim()) return alert("Content required");
    if (form.tags.length < 3) return alert("Minimum 3 tags required");

    setSubmitting(true);

    try {
      let post_picture = form.post_picture;
      let post_picture_id = form.post_picture_id;

      if (form.imageFile) {
        const uploadRes = await uploadAPI.uploadPostImage(form.imageFile);
        post_picture = uploadRes.data.url;
        post_picture_id = uploadRes.data.public_id;
      }

      await postAPI.updatePost(Number(id), {
        title: form.title,
        content: form.content,
        category: form.category,
        tags: form.tags,
        status: form.status,
        post_picture,
        post_picture_id,
      });

      alert("Post updated!");
      navigate("/me");
    } catch (error: any) {
      alert(error.response?.data?.error || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || categoriesLoading) return <Spinner />;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Edit Post</h1>
          <p className="text-muted-foreground mt-1">
            Update your content before publishing
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card border border-border shadow-lg rounded-2xl p-8 space-y-8">
          {/* Editor */}
          <div className="rounded-xl overflow-hidden border border-border">
            <TextEditor form={form} setForm={setForm} />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              Tags
            </label>

            <div className="flex flex-wrap gap-2 mb-3">
              {form.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1 rounded-full bg-muted text-sm"
                >
                  <span className="text-primary">#</span>
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-muted-foreground hover:text-red-500 transition"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTag()}
                placeholder="Add a tag..."
                className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                onClick={addTag}
                className="px-6 py-3 rounded-xl primary-btn text-primary-foreground hover:opacity-90 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block mb-2 text-sm font-medium text-muted-foreground">
              Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value,
                })
              }
              className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="draft">Save as Draft</option>
              <option value="published">Publish</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-border text-foreground hover:bg-muted transition"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={submitting}
              className="flex-1 py-3 rounded-xl primary-btn text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition"
            >
              {submitting ? "Updating..." : "Update Post"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
