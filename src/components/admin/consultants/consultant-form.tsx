'use client';

import { useState } from 'react';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';
import { Field, FieldLabel, FieldContent } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ButtonPrimary } from '@/components/ui/button-primary';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { X, Check } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Consultant = {
  _id: Id<'consultants'>;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  includes: string[];
  technologies: string[];
  illustration?: string;
  status: 'active' | 'inactive';
  order: number;
  createdAt: number;
  updatedAt: number;
};

type ConsultantFormProps = {
  consultant?: Consultant;
  onSuccess: () => void;
  onCancel: () => void;
};

const TAILWIND_COLORS = [
  { name: 'fuchsia', value: 'fuchsia', class: 'bg-fuchsia-500' },
  { name: 'emerald', value: 'emerald', class: 'bg-emerald-500' },
  { name: 'cyan', value: 'cyan', class: 'bg-cyan-500' },
  { name: 'amber', value: 'amber', class: 'bg-amber-500' },
  { name: 'blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'red', value: 'red', class: 'bg-red-500' },
  { name: 'orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'green', value: 'green', class: 'bg-green-500' },
  { name: 'teal', value: 'teal', class: 'bg-teal-500' },
  { name: 'sky', value: 'sky', class: 'bg-sky-500' },
  { name: 'violet', value: 'violet', class: 'bg-violet-500' },
  { name: 'rose', value: 'rose', class: 'bg-rose-500' }
];

export function ConsultantForm({
  consultant,
  onSuccess,
  onCancel
}: ConsultantFormProps) {
  const createConsultant = useMutation(api.consultants.createConsultant);
  const updateConsultant = useMutation(api.consultants.updateConsultant);

  const [formData, setFormData] = useState({
    title: consultant?.title || '',
    subtitle: consultant?.subtitle || '',
    description: consultant?.description || '',
    color: consultant?.color || 'fuchsia',
    includes: consultant?.includes || ([] as string[]),
    technologies: consultant?.technologies || ([] as string[]),
    illustration: consultant?.illustration || '',
    status: consultant?.status || ('active' as 'active' | 'inactive'),
    order: consultant?.order || 0
  });

  const [includeInput, setIncludeInput] = useState('');
  const [techInput, setTechInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);

  const handleAddInclude = () => {
    if (includeInput.trim()) {
      setFormData({
        ...formData,
        includes: [...formData.includes, includeInput.trim()]
      });
      setIncludeInput('');
    }
  };

  const handleRemoveInclude = (index: number) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index)
    });
  };

  const handleAddTechnology = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const handleRemoveTechnology = (index: number) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (consultant) {
        // Update existing consultant
        await updateConsultant({
          consultantId: consultant._id,
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          color: formData.color,
          includes: formData.includes,
          technologies: formData.technologies,
          illustration: formData.illustration || undefined,
          status: formData.status,
          order: formData.order
        });
      } else {
        // Create new consultant
        await createConsultant({
          title: formData.title,
          subtitle: formData.subtitle,
          description: formData.description,
          color: formData.color,
          includes: formData.includes,
          technologies: formData.technologies,
          illustration: formData.illustration || undefined,
          status: formData.status,
          order: formData.order
        });
      }
      onSuccess();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to save consultant'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedColor = TAILWIND_COLORS.find((c) => c.value === formData.color);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <Field>
        <FieldLabel>Title *</FieldLabel>
        <FieldContent>
          <Input
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="e.g., Web Development Consultation"
            required
          />
        </FieldContent>
      </Field>

      {/* Subtitle */}
      <Field>
        <FieldLabel>Subtitle *</FieldLabel>
        <FieldContent>
          <Input
            value={formData.subtitle}
            onChange={(e) =>
              setFormData({ ...formData, subtitle: e.target.value })
            }
            placeholder="e.g., Build your online presence"
            required
          />
        </FieldContent>
      </Field>

      {/* Description */}
      <Field>
        <FieldLabel>Description *</FieldLabel>
        <FieldContent>
          <Textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Detailed description of the consultancy service..."
            rows={4}
            required
          />
        </FieldContent>
      </Field>

      {/* Color Picker */}
      <Field>
        <FieldLabel>Color *</FieldLabel>
        <FieldContent>
          <Popover open={colorPickerOpen} onOpenChange={setColorPickerOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-start"
              >
                <div className="flex items-center gap-2">
                  <div className={cn('size-4 rounded', selectedColor?.class)} />
                  <span className="capitalize">{formData.color}</span>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="grid grid-cols-5 gap-2">
                {TAILWIND_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, color: color.value });
                      setColorPickerOpen(false);
                    }}
                    className={cn(
                      'size-10 rounded-md border-2 transition-all hover:scale-110',
                      color.class,
                      formData.color === color.value
                        ? 'border-foreground ring-2 ring-offset-2'
                        : 'border-transparent'
                    )}
                    title={color.name}
                  >
                    {formData.color === color.value && (
                      <Check className="size-4 text-white m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </FieldContent>
      </Field>

      {/* Includes */}
      <Field>
        <FieldLabel>Includes</FieldLabel>
        <FieldContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInclude();
                  }
                }}
                placeholder="Add an include item..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddInclude}
              >
                Add
              </Button>
            </div>
            {formData.includes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.includes.map((item, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {item}
                    <button
                      type="button"
                      onClick={() => handleRemoveInclude(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </FieldContent>
      </Field>

      {/* Technologies */}
      <Field>
        <FieldLabel>Technologies</FieldLabel>
        <FieldContent>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTechnology();
                  }
                }}
                placeholder="Add a technology..."
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTechnology}
              >
                Add
              </Button>
            </div>
            {formData.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.technologies.map((tech, index) => (
                  <Badge key={index} variant="outline" className="gap-1">
                    {tech}
                    <button
                      type="button"
                      onClick={() => handleRemoveTechnology(index)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </FieldContent>
      </Field>

      {/* Illustration URL */}
      <Field>
        <FieldLabel>Illustration URL (Optional)</FieldLabel>
        <FieldContent>
          <Input
            type="url"
            value={formData.illustration}
            onChange={(e) =>
              setFormData({ ...formData, illustration: e.target.value })
            }
            placeholder="https://example.com/illustration.svg"
          />
        </FieldContent>
      </Field>

      {/* Status */}
      <Field>
        <FieldLabel>Status *</FieldLabel>
        <FieldContent>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as 'active' | 'inactive'
              })
            }
            className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </FieldContent>
      </Field>

      {/* Order */}
      <Field>
        <FieldLabel>Order *</FieldLabel>
        <FieldContent>
          <Input
            type="number"
            value={formData.order}
            onChange={(e) =>
              setFormData({ ...formData, order: parseInt(e.target.value) || 0 })
            }
            placeholder="0"
            min="0"
            required
          />
          <p className="text-xs text-muted-foreground mt-1">
            Lower numbers appear first in the list
          </p>
        </FieldContent>
      </Field>

      {/* Actions */}
      <div className="flex items-center justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <ButtonPrimary type="submit" variant="solid" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : consultant
            ? 'Update Consultant'
            : 'Create Consultant'}
        </ButtonPrimary>
      </div>
    </form>
  );
}
