'use client';

import React, { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, Eye, EyeOff, Upload, Check, X, Sparkles } from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [material, setMaterial] = useState('PLA+');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);

  // Image Upload State
  const [images, setImages] = useState<string[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
        if (data.categories && data.categories.length > 0) {
          setCategories(data.categories);
        }
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setPrice('');
    setCompareAtPrice('');
    setCategoryId(categories[0]?.id || '');
    setShortDescription('');
    setFullDescription('');
    setMaterial('PLA+');
    setStockQuantity('20');
    setIsFeatured(false);
    setIsNew(true);
    setPersonalizationEnabled(false);
    setImages(['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80']);
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setPrice(p.price.toString());
    setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : '');
    setCategoryId(p.categoryId);
    setShortDescription(p.shortDescription || '');
    setFullDescription(p.fullDescription || '');
    setMaterial(p.material || 'PLA+');
    setStockQuantity(p.stockQuantity.toString());
    setIsFeatured(p.isFeatured);
    setIsNew(p.isNew);
    setPersonalizationEnabled(p.personalizationEnabled);

    let parsedImages = [];
    try {
      parsedImages = JSON.parse(p.images);
    } catch (e) {
      parsedImages = [p.images];
    }
    setImages(parsedImages);
    setModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.url) {
        setImages((prev) => [...prev, data.url]);
      }
    } catch (err) {
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      id: editingProduct?.id,
      name,
      price,
      compareAtPrice: compareAtPrice || null,
      categoryId: categoryId || categories[0]?.id || 'cuid-1',
      shortDescription,
      fullDescription,
      material,
      stockQuantity,
      isFeatured,
      isNew,
      personalizationEnabled,
      images,
      colors: ['Arctic White', 'Matte Black', 'Electric Blue', 'Silk Gold'],
      sizes: ['Standard'],
    };

    const method = editingProduct ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/products', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setModalOpen(false);
      fetchProducts();
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        fetchProducts();
      }
    } catch (e) {
      console.error('Failed to delete product', e);
    }
  };

  const togglePublishStatus = async (p: any) => {
    const res = await fetch('/api/admin/products', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: p.id, isPublished: !p.isPublished }),
    });
    if (res.ok) fetchProducts();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Product Management
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Add, edit pricing, stock levels, variants, and 3D personalization settings
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-tech-accent text-tech-bg font-bold text-xs font-mono rounded-lg hover:bg-tech-accent/90 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Material</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Personalise</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {products.map((p) => {
                let imgList = [];
                try {
                  imgList = JSON.parse(p.images);
                } catch (e) {
                  imgList = [p.images];
                }
                const primary = imgList[0] || '';

                return (
                  <tr key={p.id} className="hover:bg-tech-bg/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={primary} alt="" className="w-10 h-10 object-cover rounded bg-tech-bg" />
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-sans">{p.slug}</span>
                      </div>
                    </td>
                    <td className="p-3.5">{p.category?.name || 'Category'}</td>
                    <td className="p-3.5 font-bold text-tech-accent">₹{p.price}</td>
                    <td className="p-3.5">{p.material}</td>
                    <td className="p-3.5 font-bold">{p.stockQuantity}</td>
                    <td className="p-3.5">
                      {p.personalizationEnabled ? (
                        <span className="text-emerald-400 font-bold">ON</span>
                      ) : (
                        <span className="text-slate-500">OFF</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <button
                        onClick={() => togglePublishStatus(p)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          p.isPublished
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {p.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{p.isPublished ? 'Published' : 'Hidden'}</span>
                      </button>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 rounded hover:bg-tech-bg text-slate-400 hover:text-white"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 rounded hover:bg-tech-bg text-slate-400 hover:text-rose-400"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-tech-card border border-tech-border rounded-2xl p-6 text-slate-100 space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-tech-border pb-3">
              <h3 className="font-bold text-white text-base">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Compare Price (₹)</label>
                  <input
                    type="number"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Material</label>
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => setMaterial(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(e.target.value)}
                    className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Short Description</label>
                <input
                  type="text"
                  required
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={fullDescription}
                  onChange={(e) => setFullDescription(e.target.value)}
                  className="w-full bg-tech-bg border border-tech-border rounded-lg px-3 py-2 text-xs text-white resize-none"
                />
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-6 pt-2 font-mono text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={personalizationEnabled}
                    onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                    className="rounded bg-tech-bg border-tech-border text-tech-accent"
                  />
                  <span>Enable 3D Text Personalisation</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="rounded bg-tech-bg border-tech-border text-tech-accent"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isNew}
                    onChange={(e) => setIsNew(e.target.checked)}
                    className="rounded bg-tech-bg border-tech-border text-tech-accent"
                  />
                  <span>Mark as New</span>
                </label>
              </div>

              {/* Image Upload UI */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-mono text-slate-300">Product Images</label>
                <div className="flex flex-wrap gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border border-tech-border group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  <label className="w-20 h-20 rounded-lg border-2 border-dashed border-tech-border hover:border-tech-accent flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-white transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-mono mt-1">Upload</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-tech-accent text-tech-bg font-bold font-mono text-xs rounded-xl hover:bg-tech-accent/90 transition-all"
              >
                {editingProduct ? 'Save Changes' : 'Publish Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
