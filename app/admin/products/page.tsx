'use client';

import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  Check,
  X,
  Sparkles,
  GripVertical,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Palette,
  Video,
  Play,
  Link2,
} from 'lucide-react';
import { STANDARD_FILAMENT_COLORS, getFilamentColorStyle, parseProductColors, ColorOption } from '@/lib/colors';
import { normalizeImageUrl, parseImageList } from '@/lib/images';
import { parseProductVideo } from '@/lib/video';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  // Drag & Drop Reorder State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderSavedToast, setOrderSavedToast] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [price, setPrice] = useState('');
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [shippingFee, setShippingFee] = useState('0');
  const [categoryId, setCategoryId] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [material, setMaterial] = useState('PLA+');
  const [stockQuantity, setStockQuantity] = useState('20');
  const [stockStatus, setStockStatus] = useState('IN_STOCK');
  const [dimensions, setDimensions] = useState('');
  const [weight, setWeight] = useState('');
  const [tags, setTags] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [personalizationEnabled, setPersonalizationEnabled] = useState(false);
  const [selectedColors, setSelectedColors] = useState<(string | ColorOption)[]>([]);
  const [customColorInput, setCustomColorInput] = useState('');
  const [customColorImage, setCustomColorImage] = useState('');
  const [customColorLinkInput, setCustomColorLinkInput] = useState('');
  const [uploadingColorImage, setUploadingColorImage] = useState(false);

  // Image & Video State
  const [images, setImages] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [formError, setFormError] = useState('');

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

  // Save reordered array to server
  const saveNewOrder = async (reorderedProducts: any[]) => {
    setSavingOrder(true);
    try {
      const orderedIds = reorderedProducts.map((p) => p.id);
      const res = await fetch('/api/admin/products/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });
      if (res.ok) {
        setOrderSavedToast(true);
        setTimeout(() => setOrderSavedToast(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save product order:', e);
    } finally {
      setSavingOrder(false);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = (dropIndex: number) => {
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const updated = [...products];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(dropIndex, 0, movedItem);

    setProducts(updated);
    setDraggedIndex(null);
    setDragOverIndex(null);
    saveNewOrder(updated);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= products.length) return;

    const updated = [...products];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    setProducts(updated);
    saveNewOrder(updated);
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setPrice('');
    setCompareAtPrice('');
    setShippingFee('0');
    setCategoryId(categories[0]?.id || '');
    setShortDescription('');
    setFullDescription('');
    setMaterial('PLA / PLA+');
    setStockQuantity('20');
    setStockStatus('IN_STOCK');
    setDimensions('');
    setWeight('');
    setTags('');
    setIsFeatured(false);
    setIsNew(true);
    setIsPublished(true);
    setPersonalizationEnabled(false);
    setSelectedColors(['Matte Black', 'Pure White', 'Stealth Grey', 'Silk Gold']);
    setCustomColorInput('');
    setCustomColorImage('');
    setCustomColorLinkInput('');
    setImages(['https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80']);
    setImageUrlInput('');
    setVideoUrl('');
    setUploadError('');
    setFormError('');
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setName(p.name);
    setSlug(p.slug || '');
    setPrice(p.price.toString());
    setCompareAtPrice(p.compareAtPrice ? p.compareAtPrice.toString() : '');
    setShippingFee(p.shippingFee !== undefined && p.shippingFee !== null ? p.shippingFee.toString() : '0');
    setCategoryId(p.categoryId);
    setShortDescription(p.shortDescription || '');
    setFullDescription(p.fullDescription || '');
    setMaterial(p.material || 'PLA / PLA+');
    setStockQuantity(p.stockQuantity?.toString() || '20');
    setStockStatus(p.stockStatus || 'IN_STOCK');
    setDimensions(p.dimensions || '');
    setWeight(p.weight || '');
    setTags(typeof p.tags === 'string' ? p.tags : '');
    setIsFeatured(!!p.isFeatured);
    setIsNew(!!p.isNew);
    setIsPublished(p.isPublished !== undefined ? !!p.isPublished : true);
    setPersonalizationEnabled(!!p.personalizationEnabled);

    const parsedColors = parseProductColors(p.colors);
    setSelectedColors(parsedColors);
    setCustomColorInput('');
    setCustomColorImage('');
    setCustomColorLinkInput('');

    const parsedImages = parseImageList(p.images);
    setImages(parsedImages);
    setImageUrlInput('');
    setVideoUrl(p.videoUrl || '');
    setUploadError('');
    setFormError('');
    setModalOpen(true);
  };

  const handleAddCustomColor = () => {
    const trimmed = customColorInput.trim();
    if (!trimmed) return;
    const exists = selectedColors.some(
      (c) => (typeof c === 'string' ? c : c.name).toLowerCase() === trimmed.toLowerCase()
    );

    let finalImg = customColorImage;
    if (!finalImg && customColorLinkInput.trim()) {
      finalImg = normalizeImageUrl(customColorLinkInput.trim());
    }

    if (!exists) {
      if (finalImg) {
        setSelectedColors([...selectedColors, { name: trimmed, image: finalImg }]);
      } else {
        setSelectedColors([...selectedColors, trimmed]);
      }
    }
    setCustomColorInput('');
    setCustomColorImage('');
    setCustomColorLinkInput('');
  };

  const handleColorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingColorImage(true);
    try {
      const optimized = await processImageFile(file);
      if (optimized) {
        setCustomColorImage(optimized);
      }
    } catch (err) {
      console.error('Color image upload error:', err);
    } finally {
      setUploadingColorImage(false);
      if (e.target) e.target.value = '';
    }
  };

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
    setUploadError('');

    try {
      const optimizedDataUrl = await processImageFile(file);
      if (optimizedDataUrl) {
        setImages((prev) => [...prev, optimizedDataUrl]);
      }
    } catch (err) {
      console.error('Image processing error:', err);
      setUploadError('Could not process image file.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    const normalized = normalizeImageUrl(trimmed);
    setImages((prev) => [...prev, normalized]);
    setImageUrlInput('');
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setFormError('');

    try {
      const selectedCatId = categoryId || categories[0]?.id;
      if (!selectedCatId) {
        setFormError('Please select or create a category first.');
        setSavingProduct(false);
        return;
      }

      if (!name.trim()) {
        setFormError('Product Name is required.');
        setSavingProduct(false);
        return;
      }

      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice < 0) {
        setFormError('Please enter a valid selling price.');
        setSavingProduct(false);
        return;
      }

      const payload = {
        id: editingProduct?.id,
        name: name.trim(),
        slug: slug.trim() || undefined,
        price: parsedPrice,
        compareAtPrice: compareAtPrice ? parseFloat(compareAtPrice) : null,
        shippingFee: parseFloat(shippingFee) || 0,
        categoryId: selectedCatId,
        shortDescription: shortDescription.trim() || name.trim(),
        fullDescription: fullDescription.trim() || shortDescription.trim() || name.trim(),
        material,
        stockQuantity: parseInt(stockQuantity) || 0,
        stockStatus,
        dimensions: dimensions.trim() || null,
        weight: weight.trim() || null,
        tags: tags.trim() || null,
        isFeatured,
        isNew,
        isPublished,
        personalizationEnabled,
        colors: selectedColors,
        images,
        videoUrl: videoUrl.trim() || null,
      };

      const method = editingProduct ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setModalOpen(false);
        fetchProducts();
      } else {
        setFormError(data.error || 'Failed to save product. Please check your inputs.');
      }
    } catch (err: any) {
      setFormError(err.message || 'An unexpected error occurred while saving.');
    } finally {
      setSavingProduct(false);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-tech-border pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white font-sans tracking-tight">
            Product Management & Ordering
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Drag & drop or move rows to choose which product appears 1st, 2nd, 3rd on the store
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savingOrder && (
            <span className="text-xs font-mono text-amber-400 flex items-center gap-1.5 animate-pulse bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-500/30">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Saving Order...</span>
            </span>
          )}

          {orderSavedToast && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              <Check className="w-3.5 h-3.5" />
              <span>Order Updated Live!</span>
            </span>
          )}

          <button
            onClick={openAddModal}
            className="px-4 py-2.5 bg-tech-accent text-tech-bg font-bold text-xs font-mono rounded-lg hover:bg-tech-accent/90 transition-all flex items-center gap-2 shadow-lg shadow-tech-accent/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Reorder Guide Bar */}
      <div className="bg-tech-card/60 border border-tech-border/80 px-4 py-2.5 rounded-xl flex items-center justify-between text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-tech-accent" />
          <span>💡 <strong>Drag & Move:</strong> Hold the grip handle to drag rows up or down, or click the ▲ / ▼ buttons.</span>
        </div>
        <span className="hidden sm:inline text-[11px] text-tech-accent">Live Auto-Sync Enabled</span>
      </div>

      {/* Products Table with Drag and Drop */}
      <div className="bg-tech-card rounded-2xl border border-tech-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-tech-bg border-b border-tech-border text-slate-400">
              <tr>
                <th className="p-3.5 w-16 text-center">Rank</th>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Colors</th>
                <th className="p-3.5">Shipping</th>
                <th className="p-3.5">Material</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Personalise</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tech-border">
              {products.map((p, index) => {
                const imgList = parseImageList(p.images);
                const primary = imgList[0] || '';
                const isDragging = draggedIndex === index;
                const isDragOver = dragOverIndex === index && draggedIndex !== index;

                // Parse Colors for table preview
                const pColors = parseProductColors(p.colors);

                return (
                  <tr
                    key={p.id}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={() => handleDrop(index)}
                    className={`transition-colors ${
                      isDragging ? 'opacity-40 bg-tech-bg/90' : ''
                    } ${
                      isDragOver ? 'border-y-2 border-tech-accent bg-tech-accent/10' : 'hover:bg-tech-bg/50'
                    }`}
                  >
                    {/* Rank & Drag Grip Controls */}
                    <td className="p-3.5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div
                          className="cursor-grab active:cursor-grabbing p-1 text-slate-500 hover:text-tech-accent transition-colors"
                          title="Drag to reorder"
                        >
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          index === 0
                            ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                            : index === 1
                            ? 'bg-slate-300/20 text-slate-200 border border-slate-300/40'
                            : index === 2
                            ? 'bg-amber-700/20 text-amber-500 border border-amber-700/40'
                            : 'bg-tech-bg text-slate-400 border border-tech-border'
                        }`}>
                          {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`}
                        </span>
                        
                        {/* Quick Up/Down Move Buttons */}
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveItem(index, 'up')}
                            disabled={index === 0}
                            className="p-0.5 hover:bg-tech-card rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveItem(index, 'down')}
                            disabled={index === products.length - 1}
                            className="p-0.5 hover:bg-tech-card rounded text-slate-400 hover:text-white disabled:opacity-20 transition-colors"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5 flex items-center gap-3">
                      <img src={primary} alt="" className="w-10 h-10 object-cover rounded bg-tech-bg shrink-0 border border-tech-border" />
                      <div className="overflow-hidden">
                        <span className="font-bold text-white block truncate">{p.name}</span>
                        <span className="text-[10px] text-slate-500 font-sans">{p.slug}</span>
                      </div>
                    </td>
                    <td className="p-3.5">{p.category?.name || 'Category'}</td>
                    <td className="p-3.5 font-bold text-tech-accent">₹{p.price}</td>
                    <td className="p-3.5">
                      {pColors.length === 0 ? (
                        <span className="text-slate-500">None</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          {pColors.slice(0, 4).map((c, ci) => {
                            const style = getFilamentColorStyle(c);
                            return c.image ? (
                              <img
                                key={ci}
                                src={c.image}
                                title={c.name}
                                alt={c.name}
                                className="w-3.5 h-3.5 rounded-full object-cover border border-tech-accent shrink-0 shadow-sm"
                              />
                            ) : (
                              <span
                                key={ci}
                                title={c.name}
                                className="w-3 h-3 rounded-full border border-slate-700 shrink-0"
                                style={{ background: style.background, borderColor: style.border }}
                              />
                            );
                          })}
                          {pColors.length > 4 && (
                            <span className="text-[10px] text-slate-400">+{pColors.length - 4}</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5">
                      {p.shippingFee && p.shippingFee > 0 ? (
                        <span className="text-amber-300 font-bold">₹{p.shippingFee}</span>
                      ) : (
                        <span className="text-slate-500">Zone / Default</span>
                      )}
                    </td>
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

            <form onSubmit={handleSaveProduct} className="space-y-5 max-h-[75vh] overflow-y-auto pr-1">
              
              {/* Section 1: Basic Information */}
              <div className="space-y-3 bg-tech-bg/50 p-4 rounded-xl border border-tech-border">
                <h4 className="text-xs font-mono font-bold text-tech-accent uppercase tracking-wider">
                  1. Basic Information & Pricing
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Hexagon Geometric Lamp"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">URL Slug (Auto or Custom)</label>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="e.g. hexagon-geometric-lamp"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Category *</label>
                    <select
                      required
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-sans"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-tech-card text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 299"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Compare Price (₹)</label>
                    <input
                      type="number"
                      value={compareAtPrice}
                      onChange={(e) => setCompareAtPrice(e.target.value)}
                      placeholder="e.g. 499"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Shipping Fee (₹)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={shippingFee}
                      onChange={(e) => setShippingFee(e.target.value)}
                      placeholder="0 = Default / Zone"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                    <span className="text-[10px] text-slate-500 font-mono">0 for store/zone rate</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Material, Specs & Inventory */}
              <div className="space-y-3 bg-tech-bg/50 p-4 rounded-xl border border-tech-border">
                <h4 className="text-xs font-mono font-bold text-tech-accent uppercase tracking-wider">
                  2. Material & Inventory Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Material</label>
                    <select
                      value={material}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-sans"
                    >
                      <option value="PLA / PLA+">PLA / PLA+ (High Speed FDM)</option>
                      <option value="PETG">PETG (Heat & Water Resistant)</option>
                      <option value="TPU (Flexible)">TPU (Flexible Rubber)</option>
                      <option value="ABS">ABS (High Impact & Heat)</option>
                      <option value="ASA">ASA (UV & Weather Resistant)</option>
                      <option value="Nylon (PA)">Nylon (PA - High Strength)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      placeholder="e.g. 25"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Stock Status</label>
                    <select
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value)}
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                    >
                      <option value="IN_STOCK">In Stock (Available)</option>
                      <option value="LOW_STOCK">Low Stock Alert</option>
                      <option value="OUT_OF_STOCK">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Dimensions</label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={(e) => setDimensions(e.target.value)}
                      placeholder="e.g. 75 x 30 x 4 mm"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Weight</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 25 grams"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-tech-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      placeholder="e.g. keychain, custom, gifts"
                      className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Color Palette Panel */}
              <div className="space-y-3 bg-tech-bg/50 p-4 rounded-xl border border-tech-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-tech-border/80 pb-2.5">
                  <div>
                    <h4 className="text-xs font-mono font-bold text-tech-accent uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-tech-accent" />
                      <span>3. Available Filament Color Options</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Choose which filament colors customers can select when buying this product.
                    </p>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 text-[11px] font-mono">
                    <button
                      type="button"
                      onClick={() => {
                        const common = ['Matte Black', 'Pure White', 'Stealth Grey', 'Silk Gold', 'Fire Red', 'Royal Blue'];
                        const existingNames = selectedColors.map((c) => (typeof c === 'string' ? c : c.name));
                        const additions = common.filter((c) => !existingNames.includes(c));
                        setSelectedColors([...selectedColors, ...additions]);
                      }}
                      className="px-2 py-1 bg-tech-card hover:bg-tech-card/80 border border-tech-border text-slate-300 rounded text-[10px] transition-colors"
                    >
                      + Common
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedColors(STANDARD_FILAMENT_COLORS.map((c) => c.name))}
                      className="px-2 py-1 bg-tech-card hover:bg-tech-card/80 border border-tech-border text-tech-accent rounded text-[10px] transition-colors"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedColors([])}
                      className="px-2 py-1 bg-tech-card hover:bg-rose-500/20 border border-tech-border text-rose-400 rounded text-[10px] transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Standard Filament Swatches Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 pt-1 max-h-52 overflow-y-auto pr-1">
                  {STANDARD_FILAMENT_COLORS.map((color) => {
                    const isSelected = selectedColors.some(
                      (c) => (typeof c === 'string' ? c : c.name).toLowerCase() === color.name.toLowerCase()
                    );
                    return (
                      <button
                        key={color.name}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedColors(
                              selectedColors.filter(
                                (c) => (typeof c === 'string' ? c : c.name).toLowerCase() !== color.name.toLowerCase()
                              )
                            );
                          } else {
                            setSelectedColors([...selectedColors, color.name]);
                          }
                        }}
                        className={`px-2.5 py-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          isSelected
                            ? 'bg-tech-accent/15 border-tech-accent text-white shadow-sm ring-1 ring-tech-accent/50 font-semibold'
                            : 'bg-tech-card border-tech-border text-slate-400 hover:border-slate-500 hover:text-slate-200'
                        }`}
                      >
                        <span
                          className="w-4 h-4 rounded-full border border-slate-700 shrink-0 shadow-sm flex items-center justify-center"
                          style={{ background: color.hex, borderColor: color.border }}
                        >
                          {isSelected && (
                            <Check className={`w-2.5 h-2.5 ${color.isDark ? 'text-white' : 'text-black'}`} />
                          )}
                        </span>
                        <span className="text-[11px] font-mono truncate">{color.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Color Input with Swatch Image Upload & Link */}
                <div className="pt-3 border-t border-tech-border/60 space-y-2.5">
                  <div className="text-[11px] font-mono text-slate-300 font-semibold flex items-center justify-between">
                    <span>+ Add Custom Color (Upload Swatch Photo or Paste Link):</span>
                    {customColorImage && (
                      <span className="text-[10px] text-tech-accent flex items-center gap-1 font-mono">
                        ✓ Image Swatch Attached
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* Row 1: Color Name & Add Button */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Color name (e.g. Silk Rose Gold, Marble PLA)..."
                        value={customColorInput}
                        onChange={(e) => setCustomColorInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddCustomColor();
                          }
                        }}
                        className="flex-1 bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                      />

                      <button
                        type="button"
                        onClick={handleAddCustomColor}
                        className="px-4 py-2 bg-tech-accent text-tech-bg hover:bg-tech-accent/90 rounded-lg text-xs font-mono font-bold transition-all shrink-0 shadow shadow-tech-accent/20 flex items-center gap-1.5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Color</span>
                      </button>
                    </div>

                    {/* Row 2: Swatch Attachment (Upload Photo OR Paste Image Link) */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2 bg-tech-bg rounded-lg border border-tech-border/60">
                      {customColorImage ? (
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-tech-accent shrink-0 shadow-sm">
                              <img src={customColorImage} alt="" className="w-full h-full object-cover" />
                            </div>
                            <span className="text-[11px] font-mono text-tech-accent font-medium">
                              ✓ Swatch image attached
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setCustomColorImage('');
                              setCustomColorLinkInput('');
                            }}
                            className="px-2.5 py-1 bg-tech-card hover:bg-rose-500/20 text-rose-400 border border-tech-border hover:border-rose-500/40 rounded text-[10px] font-mono transition-all flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Remove Swatch</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* File Upload Button */}
                          <label className="px-3 py-1.5 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent text-slate-300 hover:text-white cursor-pointer flex items-center gap-1.5 text-[11px] font-mono transition-all shrink-0">
                            <Upload className="w-3.5 h-3.5 text-tech-accent" />
                            <span>{uploadingColorImage ? 'Uploading...' : 'Upload Photo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleColorImageUpload}
                              disabled={uploadingColorImage}
                              className="hidden"
                            />
                          </label>

                          <span className="text-[10px] font-mono text-slate-500 hidden sm:inline text-center">or</span>

                          {/* Paste Image Link */}
                          <div className="flex-1 flex items-center gap-1.5">
                            <div className="relative flex-1">
                              <input
                                type="url"
                                placeholder="Paste swatch image link (https://... or Google Drive)"
                                value={customColorLinkInput}
                                onChange={(e) => setCustomColorLinkInput(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (customColorLinkInput.trim()) {
                                      setCustomColorImage(normalizeImageUrl(customColorLinkInput.trim()));
                                    }
                                  }
                                }}
                                className="w-full bg-tech-card border border-tech-border rounded-lg pl-7 pr-2 py-1.5 text-[11px] text-white focus:outline-none focus:border-tech-accent font-mono"
                              />
                              <Link2 className="w-3 h-3 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                            </div>

                            {customColorLinkInput.trim() && (
                              <button
                                type="button"
                                onClick={() => {
                                  if (customColorLinkInput.trim()) {
                                    setCustomColorImage(normalizeImageUrl(customColorLinkInput.trim()));
                                  }
                                }}
                                className="px-2.5 py-1.5 bg-tech-card border border-tech-border hover:border-tech-accent text-tech-accent rounded-lg text-[10px] font-mono font-bold transition-all shrink-0"
                              >
                                Attach
                              </button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Colors Chips Preview */}
                {selectedColors.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[10px] font-mono text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Active for Product ({selectedColors.length} colors):</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedColors.map((col, cIdx) => {
                        const colName = typeof col === 'string' ? col : col.name;
                        const colImg = typeof col === 'object' ? col.image : undefined;
                        const style = getFilamentColorStyle(col);
                        return (
                          <span
                            key={cIdx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-tech-card border border-tech-accent/40 text-white text-[11px] font-mono shadow-sm"
                          >
                            {colImg ? (
                              <img
                                src={colImg}
                                alt={colName}
                                className="w-3.5 h-3.5 rounded-full object-cover border border-tech-accent shadow-sm"
                              />
                            ) : (
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-slate-700 shrink-0"
                                style={{ background: style.background, borderColor: style.border }}
                              />
                            )}
                            <span>{colName}</span>
                            {colImg && (
                              <span className="text-[9px] text-tech-accent bg-tech-accent/15 px-1 py-0.2 rounded font-sans font-bold">
                                IMG
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedColors(selectedColors.filter((_, i) => i !== cIdx))}
                              className="hover:text-rose-400 text-slate-400 ml-0.5"
                              title="Remove"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 4: Descriptions */}
              <div className="space-y-3 bg-tech-bg/50 p-4 rounded-xl border border-tech-border">
                <h4 className="text-xs font-mono font-bold text-tech-accent uppercase tracking-wider">
                  4. Product Descriptions
                </h4>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Short Description *</label>
                  <input
                    type="text"
                    required
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Brief 1-sentence product summary"
                    className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Full Detailed Description</label>
                  <textarea
                    rows={3}
                    value={fullDescription}
                    onChange={(e) => setFullDescription(e.target.value)}
                    placeholder="Provide full technical specs, care instructions, and manufacturing details"
                    className="w-full bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white resize-none focus:outline-none focus:border-tech-accent"
                  />
                </div>
              </div>

              {/* Section 5: Feature Toggles */}
              <div className="p-4 bg-tech-bg/50 rounded-xl border border-tech-border space-y-3">
                <h4 className="text-xs font-mono font-bold text-tech-accent uppercase tracking-wider">
                  5. Visibility & Feature Options
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded bg-tech-bg border-tech-border text-tech-accent"
                    />
                    <span>Store Published</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent">
                    <input
                      type="checkbox"
                      checked={personalizationEnabled}
                      onChange={(e) => setPersonalizationEnabled(e.target.checked)}
                      className="rounded bg-tech-bg border-tech-border text-tech-accent"
                    />
                    <span>3D Customizer</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded bg-tech-bg border-tech-border text-tech-accent"
                    />
                    <span>Featured Hero</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg bg-tech-card border border-tech-border hover:border-tech-accent">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="rounded bg-tech-bg border-tech-border text-tech-accent"
                    />
                    <span>New Badge</span>
                  </label>
                </div>
              </div>

              {/* Section 6: Image Upload & Management UI */}
              <div className="space-y-3 bg-tech-bg/50 p-4 rounded-xl border border-tech-border">
                <h4 className="text-xs font-mono font-bold text-tech-accent uppercase tracking-wider">
                  6. Product Photos & Media
                </h4>

                {uploadError && (
                  <p className="text-[11px] font-mono text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/30">
                    {uploadError}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-tech-border group shadow-md bg-tech-bg">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        title="Remove Image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* File Upload Button */}
                  <label className="w-20 h-20 rounded-xl border-2 border-dashed border-tech-border hover:border-tech-accent flex flex-col items-center justify-center cursor-pointer text-slate-400 hover:text-white transition-all bg-tech-bg/50 group">
                    <Upload className="w-5 h-5 group-hover:scale-110 transition-transform text-tech-accent" />
                    <span className="text-[10px] font-mono mt-1 font-bold">
                      {uploadingImage ? 'Uploading...' : 'Upload'}
                    </span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} className="hidden" />
                  </label>
                </div>

                {/* Paste Image URL Fallback */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-tech-card border border-tech-border hover:border-tech-accent text-slate-200 hover:text-white rounded-lg text-xs font-mono font-bold transition-all"
                  >
                    Add URL
                  </button>
                </div>

                {/* Section 6.1: Product Video (YouTube / Shorts / Google Drive / MP4) */}
                <div className="pt-3 mt-2 border-t border-tech-border/70 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-tech-accent" />
                      <span>Product Action Video (Optional)</span>
                    </label>
                    {videoUrl && (
                      <span className="text-[10px] text-tech-accent font-mono flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-tech-accent" />
                        Video Attached
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    Paste a YouTube link, YouTube Shorts, Google Drive video link, or direct MP4 URL. Customers can swipe to this video in the product gallery to see functionality & 3D finish.
                  </p>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      placeholder="https://www.youtube.com/shorts/... or Google Drive / MP4 link"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="flex-1 bg-tech-card border border-tech-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-tech-accent font-mono"
                    />
                    {videoUrl && (
                      <button
                        type="button"
                        onClick={() => setVideoUrl('')}
                        className="px-3 py-2 bg-tech-card border border-tech-border hover:bg-rose-500/20 hover:border-rose-500/40 text-rose-400 rounded-lg text-xs font-mono transition-all"
                        title="Remove Video"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {videoUrl && parseProductVideo(videoUrl) && (
                    <div className="p-2.5 bg-tech-bg rounded-lg border border-tech-border/80 flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2 text-tech-accent">
                        <Play className="w-4 h-4 fill-tech-accent shrink-0" />
                        <span className="truncate text-[11px] text-slate-200">
                          Format: {parseProductVideo(videoUrl)?.type.toUpperCase()} Video
                        </span>
                      </div>
                      <a
                        href={videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-tech-accent hover:underline shrink-0"
                      >
                        Test Link ↗
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {formError && (
                <div className="p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-mono flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={savingProduct}
                className="w-full py-3.5 bg-tech-accent text-tech-bg font-extrabold font-mono text-sm rounded-xl hover:bg-tech-accent/90 transition-all shadow-xl shadow-tech-accent/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {savingProduct ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? 'Save & Update All Product Details' : 'Publish Product to Store'}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
