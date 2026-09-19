'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  Package,
  ExternalLink,
  Search,
  CheckCircle,
  AlertCircle,
  Layers,
  Sparkles,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
  Link2,
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  displayOrder: number;
  _count?: {
    products: number;
  };
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number>(0);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error('Failed to load categories', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setImage('');
    setDisplayOrder(categories.length);
    setError(null);
    setUploadError(null);
    setShowUrlInput(false);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setImage(cat.image || '');
    setDisplayOrder(cat.displayOrder || 0);
    setError(null);
    setUploadError(null);
    setShowUrlInput(!!(cat.image && (cat.image.startsWith('http://') || cat.image.startsWith('https://'))));
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(generatedSlug);
    }
  };

  // Client-side image compression and processing
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataResult = e.target?.result as string;
        if (!dataResult) return resolve('');

        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1200;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const optimized = canvas.toDataURL('image/jpeg', 0.88);
            resolve(optimized);
          } else {
            resolve(dataResult);
          }
        };
        img.onerror = () => resolve(dataResult);
        img.src = dataResult;
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingImage(true);
    setUploadError(null);

    try {
      const optimizedDataUrl = await processImageFile(file);
      if (optimizedDataUrl) {
        setImage(optimizedDataUrl);
      }
    } catch (err) {
      console.error('Category image processing error:', err);
      setUploadError('Could not process image file. Please try a different image.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDropImage = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.files || !e.dataTransfer.files[0]) return;
    const file = e.dataTransfer.files[0];
    if (!file.type.startsWith('image/')) {
      setUploadError('Please drop a valid image file (JPG, PNG, WebP).');
      return;
    }
    setUploadingImage(true);
    setUploadError(null);

    try {
      const optimizedDataUrl = await processImageFile(file);
      if (optimizedDataUrl) {
        setImage(optimizedDataUrl);
      }
    } catch (err) {
      setUploadError('Could not process dropped image file.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        id: editingCategory ? editingCategory.id : undefined,
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || null,
        image: image.trim() || null,
        displayOrder: Number(displayOrder) || 0,
      };

      const res = await fetch('/api/admin/categories', {
        method: editingCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMsg(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setIsModalOpen(false);
        fetchCategories();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        setError(data.error || 'Failed to save category.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    if (cat._count && cat._count.products > 0) {
      alert(`Cannot delete "${cat.name}" because it currently has ${cat._count.products} product(s) attached. Please move or delete the products first.`);
      return;
    }

    if (!confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/categories?id=${cat.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg(`Category "${cat.name}" deleted.`);
        fetchCategories();
        setTimeout(() => setSuccessMsg(null), 4000);
      } else {
        alert(data.error || 'Failed to delete category.');
      }
    } catch (e) {
      alert('An error occurred while deleting.');
    }
  };

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalProducts = categories.reduce((sum, c) => sum + (c._count?.products || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight flex items-center gap-2.5">
            <FolderTree className="w-6 h-6 text-tech-accent" />
            <span>Category Management</span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Organize catalog classifications, upload cover artwork, and configure storefront sections
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 rounded-xl bg-tech-accent text-tech-bg font-bold text-xs font-mono hover:bg-tech-accent/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-tech-accent/15"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Success Banner */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-mono text-emerald-400 flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-tech-card border border-tech-border space-y-1">
          <span className="text-xs font-mono text-slate-400">Total Categories</span>
          <div className="text-2xl font-bold font-mono text-white">{categories.length}</div>
        </div>
        <div className="p-4 rounded-xl bg-tech-card border border-tech-border space-y-1">
          <span className="text-xs font-mono text-slate-400">Total Products Categorized</span>
          <div className="text-2xl font-bold font-mono text-tech-accent">{totalProducts}</div>
        </div>
        <div className="p-4 rounded-xl bg-tech-card border border-tech-border space-y-1">
          <span className="text-xs font-mono text-slate-400">Cover Artwork Support</span>
          <div className="text-2xl font-bold font-mono text-emerald-400">Active (Upload & URL)</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
        <input
          type="text"
          placeholder="Search categories by name, slug, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-tech-card border border-tech-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white font-mono placeholder:text-slate-500 focus:outline-none focus:border-tech-accent"
        />
      </div>

      {/* Categories Table */}
      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5 w-16">Image</th>
                <th className="p-3.5">Category Name</th>
                <th className="p-3.5">Slug (URL)</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 text-center">Products</th>
                <th className="p-3.5 text-center">Order</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    {searchQuery ? 'No categories matching search query.' : 'No categories found. Click "Add New Category" above.'}
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-tech-bg/50 transition-colors">
                    <td className="p-3.5">
                      <div className="w-12 h-12 rounded-xl bg-tech-bg border border-tech-border overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                        ) : (
                          <Layers className="w-5 h-5 text-slate-500" />
                        )}
                      </div>
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      <span>{cat.name}</span>
                    </td>
                    <td className="p-3.5 text-tech-accent font-semibold">
                      /{cat.slug}
                    </td>
                    <td className="p-3.5 text-slate-400 max-w-xs truncate">
                      {cat.description || <span className="text-slate-600 italic">No description</span>}
                    </td>
                    <td className="p-3.5 text-center">
                      <Link
                        href={`/admin/products`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-tech-bg border border-tech-border text-slate-200 hover:border-tech-accent/60 transition-colors"
                      >
                        <Package className="w-3 h-3 text-tech-accent" />
                        <span className="font-bold">{cat._count?.products || 0}</span>
                      </Link>
                    </td>
                    <td className="p-3.5 text-center text-slate-400">
                      #{cat.displayOrder}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg bg-tech-bg hover:bg-tech-card text-slate-300 hover:text-white border border-tech-border transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg bg-tech-bg hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-tech-border transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE / EDIT CATEGORY MODAL WITH IMAGE UPLOAD */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-tech-card border border-tech-border rounded-2xl p-6 text-slate-100 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-tech-border pb-3">
              <h3 className="font-bold text-white text-base font-sans flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-tech-accent" />
                <span>{editingCategory ? 'Edit Category' : 'Create New Category'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded hover:bg-tech-bg text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs font-mono text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Category Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Keychains, Figures, Lamps, Decor"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  URL Slug <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="e.g. keychains"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                  Storefront URL: /shop?category={slug || '...'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of items in this category"
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
              </div>

              {/* CATEGORY IMAGE UPLOAD SECTION */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-mono text-slate-300">
                    Category Cover Image
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className="text-[11px] font-mono text-tech-accent hover:underline flex items-center gap-1"
                  >
                    <Link2 className="w-3 h-3" />
                    <span>{showUrlInput ? 'Switch to Upload' : 'Use Direct URL'}</span>
                  </button>
                </div>

                {/* Direct Image File Upload Box */}
                {!showUrlInput ? (
                  <div className="space-y-3">
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={handleDropImage}
                      className="border-2 border-dashed border-tech-border hover:border-tech-accent/60 bg-tech-bg/60 rounded-xl p-4 text-center transition-colors relative cursor-pointer group"
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/webp, image/gif"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                      />
                      <div className="flex flex-col items-center justify-center gap-2">
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-6 h-6 text-tech-accent animate-spin" />
                            <span className="text-xs font-mono text-slate-300">
                              Optimizing & uploading image...
                            </span>
                          </>
                        ) : (
                          <>
                            <div className="w-10 h-10 rounded-full bg-tech-card border border-tech-border flex items-center justify-center group-hover:scale-105 transition-transform">
                              <Upload className="w-5 h-5 text-tech-accent" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white font-sans">
                                Click to upload or drag & drop cover image
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                PNG, JPG, WebP (auto-optimized for web)
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {uploadError && (
                      <p className="text-[11px] font-mono text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{uploadError}</span>
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://... or /images/..."
                      className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>
                )}

                {/* Image Live Preview */}
                {image && (
                  <div className="relative mt-2 p-2 rounded-xl bg-tech-bg border border-tech-border flex items-center gap-3">
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-tech-border bg-black/40 shrink-0">
                      <img src={image} alt="Category preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-mono text-slate-200 block truncate font-semibold">
                        Image Attached
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Ready for storefront
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="p-1.5 rounded-lg bg-tech-card hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 border border-tech-border transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Display Sort Order
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value) || 0)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3.5 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                />
                <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                  Lower numbers appear first in shop filters.
                </span>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-tech-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-tech-bg hover:bg-tech-border text-slate-300 text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="px-4 py-2 rounded-lg bg-tech-accent text-tech-bg font-bold text-xs font-mono hover:bg-tech-accent/90 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-md shadow-tech-accent/10"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{saving ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
