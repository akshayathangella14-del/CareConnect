import { useState } from 'react';
import { useListCategoriesQuery, useCreateCategoryMutation } from '@/features/categories';
import { Card, Button, DataTable, EmptyState, Badge, Modal, Input, Alert } from '@/components';
import { LayoutGrid, Plus } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { data: categories = [], isLoading, isFetching } = useListCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '', description: '' });

  const handleCreate = async () => {
    try {
      // Generate slug from name if not provided
      const slug = formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      await createCategory({ ...formData, slug }).unwrap();
      setIsModalOpen(false);
      setFormData({ name: '', slug: '', description: '' });
    } catch (err) {
      console.error('Failed to create category:', err);
    }
  };

  const columns = [
    {
      header: 'Category Name',
      key: 'name',
      render: (cat) => <div style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>{cat.name}</div>,
    },
    {
      header: 'Description',
      key: 'description',
      render: (cat) => <div style={{ color: 'var(--color-text-secondary)' }}>{cat.description || '-'}</div>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (cat) => <Badge variant={cat.isActive ? 'success' : 'neutral'}>{cat.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-h2)', marginBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <LayoutGrid size={28} color="var(--color-error)" /> Service Categories
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage the global taxonomy of services offered on the platform.</p>
        </div>
        <Button leftIcon={<Plus size={16}/>} onClick={() => setIsModalOpen(true)}>Add Category</Button>
      </div>

      {isLoading ? (
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>Loading categories...</div>
      ) : categories.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid size={28} />}
          title="No categories configured"
          description="Add your first service category to get started."
        />
      ) : (
        <div style={{ opacity: isFetching ? 0.6 : 1, transition: 'opacity var(--transition-fast)' }}>
          <Card>
            <DataTable
              columns={columns}
              data={categories}
              keyField="_id"
            />
          </Card>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Category"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} loading={isCreating}>Create Category</Button>
          </>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <Input
            label="Category Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="e.g., Plumbing, Electrical"
          />
          <Input
            label="Slug (URL-friendly identifier)"
            value={formData.slug}
            onChange={(e) => setFormData({...formData, slug: e.target.value})}
            placeholder="e.g., plumbing (auto-generated if empty)"
            helperText="Leave empty to auto-generate from name"
          />
          <Input
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Brief description of this category"
          />
        </div>
      </Modal>
    </div>
  );
}
