import { useEffect, useState } from 'react';
import {
  Button,
  Field,
  Input,
  NativeSelect,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import axiosInstance from '../api/axiosInstance';

const PROPERTY_TYPES = ['Apartment', 'House', 'Studio'];

const emptyForm = {
  title: '',
  description: '',
  price: '',
  city: '',
  country: '',
  type: '',
  imageUrls: '',
};

export default function PropertyForm({ property, onSuccess, onCancel }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  const isEdit = Boolean(property);

  useEffect(() => {
    if (property) {
      setForm({
        title: property.title ?? '',
        description: property.description ?? '',
        price: String(property.price ?? ''),
        city: property.city ?? '',
        country: property.country ?? '',
        type: property.type ?? '',
        imageUrls: property.imageUrls?.join(', ') ?? '',
      });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
    setApiError('');
  }, [property]);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (!form.city.trim()) newErrors.city = 'City is required';
    if (!form.country.trim()) newErrors.country = 'Country is required';

    if (!form.price) {
      newErrors.price = 'Price is required';
    } else if (Number.isNaN(Number(form.price)) || Number(form.price) < 0) {
      newErrors.price = 'Enter a valid price';
    }

    if (!form.type) newErrors.type = 'Type is required';

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      city: form.city.trim(),
      country: form.country.trim(),
      type: form.type,
      imageUrls: form.imageUrls
        .split(',')
        .map((url) => url.trim())
        .filter(Boolean),
    };

    try {
      if (isEdit) {
        await axiosInstance.put(`/api/properties/${property._id}`, payload);
      } else {
        await axiosInstance.post('/api/properties', payload);
      }
      onSuccess();
    } catch (err) {
      setApiError(err.response?.data?.message || 'Failed to save property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack gap={4} align="stretch">
        {apiError && (
          <Field.Root invalid>
            <Field.ErrorText>{apiError}</Field.ErrorText>
          </Field.Root>
        )}

        <Field.Root invalid={!!errors.title}>
          <Field.Label>Title</Field.Label>
          <Input value={form.title} onChange={updateField('title')} />
          {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.description}>
          <Field.Label>Description</Field.Label>
          <Textarea
            rows={4}
            value={form.description}
            onChange={updateField('description')}
          />
          {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.price}>
          <Field.Label>Price</Field.Label>
          <Input type="number" min="0" value={form.price} onChange={updateField('price')} />
          {errors.price && <Field.ErrorText>{errors.price}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.city}>
          <Field.Label>City</Field.Label>
          <Input value={form.city} onChange={updateField('city')} />
          {errors.city && <Field.ErrorText>{errors.city}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.country}>
          <Field.Label>Country</Field.Label>
          <Input value={form.country} onChange={updateField('country')} />
          {errors.country && <Field.ErrorText>{errors.country}</Field.ErrorText>}
        </Field.Root>

        <Field.Root invalid={!!errors.type}>
          <Field.Label>Type</Field.Label>
          <NativeSelect.Root>
            <NativeSelect.Field value={form.type} onChange={updateField('type')}>
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </NativeSelect.Field>
            <NativeSelect.Indicator />
          </NativeSelect.Root>
          {errors.type && <Field.ErrorText>{errors.type}</Field.ErrorText>}
        </Field.Root>

        <Field.Root>
          <Field.Label>Image URLs</Field.Label>
          <Input
            placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
            value={form.imageUrls}
            onChange={updateField('imageUrls')}
          />
          <Field.HelperText>Comma-separated image URLs</Field.HelperText>
        </Field.Root>

        <VStack gap={2}>
          <Button type="submit" loading={loading} colorPalette="blue" width="100%">
            {isEdit ? 'Save changes' : 'Create listing'}
          </Button>
          {onCancel && (
            <Button type="button" variant="outline" width="100%" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </VStack>
      </VStack>
    </form>
  );
}
